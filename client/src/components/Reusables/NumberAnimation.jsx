import React from "react";
import { useSpring, animated } from "react-spring";

function NumberAnimation({ n }) {
  const { number } = useSpring({
    from: { number: 0 },
    number: n,
    delay: 500,
    config: { mass: 1, tension: 20, friction: 5 },
  });
  return (
    <animated.div style={{ display: "inline" }}>
      {number.to((n) => n.toFixed(0))}
    </animated.div>
  );
}

export default NumberAnimation;
