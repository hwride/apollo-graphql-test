import "./App.css";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import { DisplayLocations } from "./DisplayLocations.tsx";

const client = new ApolloClient({
  uri: "https://flyby-router-demo.herokuapp.com/",
  cache: new InMemoryCache(),
});

function App() {
  return (
    <div>
      <DisplayLocations />
    </div>
  );
}

function AppWithProviders() {
  return (
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  );
}

export default AppWithProviders;
