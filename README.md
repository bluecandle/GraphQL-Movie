# GraphQL-Movie
Course from nomad-coder

2020-03-26
### Local State part One

local state는?

![https://s3-us-west-2.amazonaws.com/secure.notion-static.com/1be4feeb-8094-4e53-a4b4-a84f22df879d/Untitled.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/1be4feeb-8094-4e53-a4b4-a84f22df879d/Untitled.png)

    // 백엔드에서 resolver 사용하듯 클라에서도 사용 가능하다!
    const client = new ApolloClient({
      // uri: "https://movieql.now.sh/"
      uri: "http://localhost:4000",
      resolvers: {
        Movie: {
          isLiked: () => false // <- 이게 client 에서 추가되는 Local state (원래 서버에서 받지 않는 데이터)
        }
      }
    });
    
    //@client
    const GET_MOVIES = gql `
      {
        movies {
          id
          medium_cover_image
          isLiked @client <- isLiked 라는 값이 클라에 의해 추가되었다는(resolve) 것을 알려주는 장치. (클라이언트에서 심은 데이터)
        }
      }
    `;

### Local State part Two

    Mutation: {
          likeMovie: (_, { id }, { cache }) => { // cache 가 들어가있는 자리는 context 가 들어가는 자리.
            cache.writeData({
              id: `Movie:${id}`, // apollo cache 안에서 <type> : <id> 이런식으로 cache 에 저장하고 있기 때문에!
              data: {
                isLiked: true,
                medium_cover_image: "lalalalal"
              }
            });
          }
        }
    
    // client 에서도 Mutation 을 사용 가능하다 (백엔드에서 사용하는 것처럼)
    
    // 그리고 쿼리 안에서도 Client 안에서 발생한 쿼리임을 알려줘아함! (이 요청을 backend 에 보내면 안된다는 의미!)
    const LIKE_MOVIE = gql`
      mutation likeMovie($id: Int!) {
        likeMovie(id: $id) @client
      }
    `;
    
    // useMutation 함수 사용예시
    const [likeMovie] = useMutation(LIKE_MOVIE, {
        variables: { id: parseInt(id) }
      });

즉, 서버로부터 데이터를 한 번 전송받은 이후, 더 전송받을 데이터가 필요 없는 경우에는 apollo cache 를 활용하여 상태 변환을 추적하도록 할 수도 있다는 것!

### Connecting Detail and Home

![https://s3-us-west-2.amazonaws.com/secure.notion-static.com/2281a39d-e75a-493f-93f7-11583a937246/Untitled.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/2281a39d-e75a-493f-93f7-11583a937246/Untitled.png)

캐시 내의 같은 데이터 객체의 내용을 변경시키더라도, 다른 페이지 (여기서는 Home, Detail) 에 있는 데이터간 연결고리가 필요하다! (안그러면 apollo는 같은 데이터인지 모름!)

![https://s3-us-west-2.amazonaws.com/secure.notion-static.com/bf0d6077-222f-45d6-993a-f38b92ab8f65/Untitled.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/bf0d6077-222f-45d6-993a-f38b92ab8f65/Untitled.png)

같은 id 값은 갖도록 해주면 된다!

    // Detail.js
    const GET_MOVIE = gql `
      query getMovie($id: Int!) {
        movie(id: $id) {
          id  <- id 값 추가!
          title
          medium_cover_image
          language
          rating
          description_intro
          isLiked @client
        }
        suggestions(id: $id) {
          id
          medium_cover_image
        }
      }
    `;

⇒ 이렇게 하면, redux 를 사용하지 않고도... 결국 apollo cache 를 통해 중앙 관리가 가능해진다!