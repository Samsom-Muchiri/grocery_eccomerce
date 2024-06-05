import json
from channels.generic.websocket import AsyncWebsocketConsumer

class OrderStatusConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_group_name = 'order_status'

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        order_id = text_data_json['order_id']

        from .models import Order
        try:
            order = Order.objects.get(id=order_id)
            status = order.status
        except Order.DoesNotExist:
            status = 'not found'

        # Send status back to WebSocket
        await self.send(text_data=json.dumps({
            'status': status
        }))

    async def order_status_update(self, event):
        await self.send(text_data=json.dumps({
            'order_id': event['order_id'],
            'status': event['status']
        }))
