import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";

import "./App.css";
import Main from "./components/Main";
import { Context } from "./AppContext/context";
function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <Context>
        <Main />
        <ReactQueryDevtools initialIsOpen={false} />
      </Context>
    </QueryClientProvider>
  );
}

export default App;
