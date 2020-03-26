import ApolloClient from "apollo-boost";

const client = new ApolloClient({
  // uri: "https://movieql.now.sh/"
  uri: "http://localhost:4000",
  resolvers: {
    Movie: {
      isLiked: () => false
    },
    Mutation: {
      // likeMovie: (_, { id }, { cache }) => {
        toggleLikeMovie: (_, { id, isLiked }, { cache }) => {
        cache.writeData({
          id: `Movie:${id}`,
          data: {
            // isLiked: true,
            // medium_cover_image: "lalalalal"
            isLiked: !isLiked
          }
        });
      }
    }
  }
});

export default client;