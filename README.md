# GraphQL-Movie
Course from nomad-coder

# 2020-03-25
# GraphQL로 영화 API 만들기

![https://s3-us-west-2.amazonaws.com/secure.notion-static.com/fb93c984-093b-4218-8e9b-a13afac428fc/Untitled.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/fb93c984-093b-4218-8e9b-a13afac428fc/Untitled.png)

graphQL API 를 consume 하기에 Apollo 가 가장 좋은 방법인거같다?!

### reset-css

그냥 구글에 쳐서 나오는거 복붙하는거!

Yesterday 

### Apollo Client

![https://s3-us-west-2.amazonaws.com/secure.notion-static.com/3eced09a-24a9-48cb-b924-8b544cffc291/Untitled.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/3eced09a-24a9-48cb-b924-8b544cffc291/Untitled.png)

axios 를 이용하여 post 니 뭐니 하는 그런 과정을 다 apollo 를 통해 해결할 수 있다!

![https://s3-us-west-2.amazonaws.com/secure.notion-static.com/23e15571-7166-4e83-bbc2-a8f22c412bed/Untitled.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/23e15571-7166-4e83-bbc2-a8f22c412bed/Untitled.png)

apollo-boost 를 활용하여 apollo client 를 만들 때, 설정에 하나만 넣으면 된다!

만약 각각 다른 uri 를 사용하려고 한다면, 각각 다른 client 를 만들면 된다는거겠지!

![https://s3-us-west-2.amazonaws.com/secure.notion-static.com/4939713d-2a17-4acf-bb9d-7f785599b803/Untitled.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/4939713d-2a17-4acf-bb9d-7f785599b803/Untitled.png)

    import {ApolloProvider} from "@apollo/react-hooks";
    import client from "./apollo";
    // 이런식으로 ApolloProvider 를 활용하여 전체 앱을 감싸줘야 한다.
    ReactDOM.render(
        <ApolloProvider client={client}>
        <App/>
    </ApolloProvider>, document.getElementById("root"));

### GET_MOVIES Query

apollo-boost 패키지에서 제공하는 기능을 활용!

    import { gql } from "apollo-boost";
    // 이런식으로!
    const GET_MOVIES = gql`
      {
        movies {
          id
          medium_cover_image
        }
      }
    `;

그리고

    import { useQuery } from "@apollo/react-hooks";
    //~~
    const { loading, data } = useQuery(GET_MOVIES);
    //const { loading, error, data } = useQuery(GET_MOVIES); // 이렇게 하면 error 를 잡을 수도 있음!
    // 이런식으로 활용도 가능함! (정확히는 react-hooks 의 개념이 들어갔음을 인지해야함.)
    

    {/* 이 코드가 loading 상태인 경우 Loading 화면을 보여주게 하는 코드! */}
          {loading && <Loading>Loading...</Loading>}

### GET_MOVIE Query

참고할만한 코드!

![https://s3-us-west-2.amazonaws.com/secure.notion-static.com/2118b68f-c257-4ce0-b85a-69ad0e45824c/Untitled.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/2118b68f-c257-4ce0-b85a-69ad0e45824c/Untitled.png)

    // 위 사진에 대한 부가설명
    {/* 이런식으로 && 를 여러개 붙이면, 앞에 적힌 두 조건이 true 인 경우 마지막(세번째) 코드를 실행하라는 의미이다 */}
          {!loading &&
            data.movies &&
            data.movies.map(m => <Movie key={m.id} id={m.id} />)}

apollo-boost, apollo-hooks 를 사용했을 때, 일반적으로 axios 를 사용해서 해야만 했을 작업들을 다 하지 않고, 알아서 다 해준다는 점이 정말 편한듯!

결국, 거의 UI 작업 하듯 하기만 하면 된다!

    useParams (react-router-dom 에 들어있는 기능)
    // 아래 코드를 사용하면 url 을 구성하는 부분 중에서 ~~.com/:id/~~ 이런 형태일 때, id 라는 param 으로 지정되어 있는 값을 획득할 수 있다.
      const { id } = useParams();
    // 즉, localhost:3000/13123 이라고 할 때, (:id 로 route 에 지정되어 있음) 13123 이라는 값을 얻을 수 있다는 의미.

argument 가 담긴 요청을 보낼 때 사용하는 방식

    const GET_MOVIE = gql`
      query getMovie($id: Int!) { <- 여기는 apollo 를 위한 부분 (이 쿼리는 Integer argument 를 하나 필요로 하는데, 서버에 보내는 요청 안에서 $id 라는 이름으로 사용하겠다.
        movie(id: $id) { <- 여기서부터 서버에 전달되는 부분
          id
          title
          medium_cover_image
          description_intro
        }
      }
    `;
    
    // 그리고 useQuery 에서 사용할 때는 이런 모습
    const { loading, data } = useQuery(GET_MOVIE, {
        variables: { id }
      });
    
    // 비교 ( argument 가 필요하지 않은 요청을 보낼 때 사용하는 방식 )
    const GET_MOVIES = gql`
      {
        movies {
          id
          medium_cover_image
        }
      }
    `;

### Apollo Cache and Styles

![https://s3-us-west-2.amazonaws.com/secure.notion-static.com/0a9744cf-590a-46d8-b842-677b51550d06/Untitled.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/0a9744cf-590a-46d8-b842-677b51550d06/Untitled.png)

오호... 캐싱을 react-apollo 에서 이미 구현해놓고, 자동으로 지원해준다! 클라이언트 입장에서 이걸 구현하려면 redux 를 통해 직접 해줘야하는데... 그게 되어있다는 의미!

### Data & Apollo Dev Tools

    // 무조건 지금 loading 중인지 확인하는 구문이 필요하다! loading 이 끝나지 않았으면 data 라는 객체 자체가 undefined 일 것이기 때문에.
    <Title>{loading ? "Loading..." : data.movie.title}</Title>
            {!loading && data.movie && (
              <>
                <Subtitle>
                  {data.movie.language} · {data.movie.rating}
                </Subtitle>
                <Description>{data.movie.description_intro}</Description>
              </>
            )}

    //styled-component 의 활용
    <Poster
            bg={data && data.movie ? data.movie.medium_cover_image : ""}
          ></Poster>
    // 여기서 배경이미지를 prop 으로 전달하고
    
    const Title = styled.h1`
      font-size: 65px;
      margin-bottom: 15px;
      background-image: url(${props => props.bg});  <- 이런 식으로, bg prop 으로 넘어온 값을 사용할 수 있다.
      background-size: cover;
      background-position: center center;
    `;

apollo dev tools 라는 크롬 익스탠션을 설치해서 크롬에서 개발자 도구로 사용할 수 있다. ( 캐시 확인 등으로 사용가능.)

(redux 보다 개발자 도구 자체는 퀄이 좀 떨어진다!)

### Suggestions & Optional Chaining

![https://s3-us-west-2.amazonaws.com/secure.notion-static.com/6965ee80-6ad5-49c6-93b6-a18e5a0e2f71/Untitled.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/6965ee80-6ad5-49c6-93b6-a18e5a0e2f71/Untitled.png)

optional chaining javascript

    // 예시
    <Poster bg={data?.movie?.medium_cover_image}></Poster>
    // => data 객체가 존재하냐? 존재한다면 그 안에 movie 라는 객체도 존재하냐? 존재한다면 그 안에 medium_cover_image 라는 값이 존재하냐?

# 2020-03-26
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