import { ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
    uri: "https://openapi.radiofrance.fr/v1/graphql?x-token=2aa7b40f-e6b7-4f5b-9947-23f27278ad36",
    cache: new InMemoryCache(),
});

export default client;