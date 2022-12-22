import {ApolloClient, ApolloProvider, gql, InMemoryCache} from '@apollo/client'
import '../styles/globals.css'
import React from "react";
import AudioPlayer from "./audioplayer";

export default function App({Component, pageProps}) {

    let client = new ApolloClient({
        uri: 'https://openapi.radiofrance.fr/v1/graphql?x-token=2aa7b40f-e6b7-4f5b-9947-23f27278ad36',
        cache: new InMemoryCache()
    });


    return (
                <ApolloProvider client={client}>
                    <Component {...pageProps} />
                    <AudioPlayer/>
            </ApolloProvider>
        )
    }
