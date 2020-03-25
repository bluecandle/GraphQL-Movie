import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import {ApolloProvider} from "@apollo/react-hooks";
import client from "./apollo";

ReactDOM.render(
  // 이런식으로 ApolloProvider 를 활용하여 전체 앱을 감싸줘야 한다.
    <ApolloProvider client={client}>
    <App/>
</ApolloProvider>, document.getElementById("root"));