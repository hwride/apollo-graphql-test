import ApolloClientPackage from "@apollo/client";

const { ApolloClient, InMemoryCache, ApolloProvider, gql } =
  ApolloClientPackage;

main();

async function main() {
  const client = new ApolloClient({
    uri: "https://flyby-router-demo.herokuapp.com/",
    cache: new InMemoryCache(),
  });

  const result = await client.query({
    query: gql`
      query GetLocations {
        locations {
          id
          name
          description
          photo
        }
      }
    `,
  });
  console.log(JSON.stringify(result, null, 2));
}
