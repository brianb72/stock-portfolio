import styled from "styled-components";

export const AuthenticationContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  justify-content: space-between;
  margin: 2rem auto;

  @media (min-width: 50rem) {
    flex-direction: row;
    width: 900px;
  }
`;
