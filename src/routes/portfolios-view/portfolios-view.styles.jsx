import styled from "styled-components";

export const PortfoliosViewLayout = styled.div`
  width: 100%;
  height: calc(100vh - 2.5rem);
  display: grid;
  grid-template-areas:
    "header"
    "portfolios"
    "symbols";
  grid-template-rows: auto 8rem 1fr;
  gap: 1rem;
  @media (min-width: 50rem) {
    grid-template-areas:
      "header header"
      "portfolios symbols";
    grid-template-rows: auto 1fr;
    grid-template-columns: 2fr 3fr;
  }
`;

export const HeaderArea = styled.div`
  grid-area: header;
  width: 100%;
  border: 1px solid black;
  border-radius: 15px;
  text-align: center;
  font-size: 1.5rem;
  margin-top: 1rem;
`;

export const PortfolioContainer = styled.div`
  grid-area: portfolios;
  display: grid;
  grid-template-rows: auto auto 1fr;
  overflow-y: hidden;
  background-color: whitesmoke;
  border-bottom-left-radius: 15px;
  border-bottom-right-radius: 15px;
`;

export const SymbolsContainer = styled.div`
  grid-area: symbols;
  overflow-y: scroll;
`;

export const MessageContainer = styled.div`
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const Message = styled.div`
  background-color: whitesmoke;
  padding: 1rem;
`;
