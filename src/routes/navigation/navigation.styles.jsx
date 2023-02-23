import styled from "styled-components";
import { Link } from "react-router-dom";

export const NavigationContainer = styled.div`
  height: 2.5rem;
  width: 100%;
  display: flex;
  justify-content: space-between;
  background-color: lightgray;
  align-items: center;
`;

export const LogoContainer = styled(Link)`
  /* height: 100%;
  padding: 25px; */
  width: 5rem;
  text-align: center;
`;

export const NavLinks = styled.div`
  width: 80%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

export const NavLink = styled(Link)`
  padding: 0 0.6rem;
  cursor: pointer;
  @media (min-width: 45rem) {
    padding: 0px 2.5rem;
  }
`;
