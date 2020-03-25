import React from "react";
import { useParams } from "react-router-dom";
import { gql } from "apollo-boost";
import { useQuery } from "@apollo/react-hooks";
import styled from "styled-components";

const GET_MOVIE = gql`
  query getMovie($id: Int!) {
    movie(id: $id) {
      id
      title
      medium_cover_image
      description_intro
      language
      rating
    }
    suggestions(id: $id) {
      id
      medium_cover_image
    }
  }
`;

const Container = styled.div`
  height: 100vh;
  background-image: linear-gradient(-45deg, #d754ab, #fd723a);
  width: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;
  color: white;
`;

const Column = styled.div`
  margin-left: 10px;
  width: 50%;
`;

const Title = styled.h1`
  font-size: 65px;
  margin-bottom: 15px;
  background-image: url(${props => props.bg});
  background-size: cover;
  background-position: center center;
`;

const Subtitle = styled.h4`
  font-size: 35px;
  margin-bottom: 10px;
`;

const Description = styled.p`
  font-size: 28px;
`;

const Poster = styled.div`
  width: 25%;
  height: 60%;
  background-color: transparent;
`;


export default () => {
// 아래 코드를 사용하면 url 을 구성하는 부분 중에서 ~~.com/:id/~~ 이런 형태일 때, id 라는 param 으로 지정되어 있는 값을 획득할 수 있다.
  const { id } = useParams();
  const { loading, data } = useQuery(GET_MOVIE, {
    variables: { id }
  });
//   if (loading) {
//     return "loading";
//   }
//   if (data && data.movie) {
//     return data.movie.title;
//   }
return (
    <Container>
      <Column>
        {/* <Title>Name</Title>
        <Subtitle>English · 4.5</Subtitle>
        <Description>lorem ipsum lalalla </Description> */}
        <Title>{loading ? "Loading..." : data.movie.title}</Title>
        {/* {!loading && data.movie && (
          <>
            <Subtitle>
              {data.movie.language} · {data.movie.rating}
            </Subtitle>
            <Description>{data.movie.description_intro}</Description>
          </>
        )} */}
        <Subtitle>
          {data?.movie?.language} · {data?.movie?.rating}
        </Subtitle>
        <Description>{data?.movie?.description_intro}</Description>
      </Column>
      {/* <Poster
        bg={data && data.movie ? data.movie.medium_cover_image : ""} */}
      {/* ></Poster> */}
      <Poster bg={data?.movie?.medium_cover_image}></Poster>
    </Container>
  );
};