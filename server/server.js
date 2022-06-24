const express = require('express');
const path = require('path');
const db = require('./config/connection');
const { authMiddleware } = require("./utils/auth");

const app = express();
const PORT = process.env.PORT || 3001;

//APOLLO AND GRAPHQL
const { ApolloServer } = require("apollo-server-express");
const { typeDefs, resolvers } = require("./schemas");

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware
});


app.use(express.urlencoded({ extended: true }));
app.use(express.json());


// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/build")));
}
//REDIRECT IF PAGE NOT VALID PAGE
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build/index.html"));
});

const startApolloServer = async (typeDefs, resolvers) => {
  await server.start();
  server.applyMiddleware({ app });

  //app.use(routes);

  db.once("open", () => {
    app.listen(PORT, () => {
      console.log("API server running on port ${PORT}!");
      //Test Location for GraphQL
      console.log("Use GraphQL at http://localhost:${PORT}${server.graphqlPath}");
    });
  });
};

startApolloServer(typeDefs, resolvers);