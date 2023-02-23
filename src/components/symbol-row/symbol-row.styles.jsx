import styled from "styled-components";

export const SymbolRowLayout = styled.div`
  background-color: whitesmoke;
  border-radius: 10px;
  padding: 0.5rem;
  display: grid;
  grid-template-areas:
    "symbol symbol"
    "cap vol"
    "range week52";
  margin: 0.5rem 0;
`;

export const Symbol = styled.div`
  grid-area: symbol;
`;

export const DayRange = styled.div`
  grid-area: range;
`;

export const Week52 = styled.div`
  grid-area: week52;
`;
export const Volume = styled.div`
  grid-area: vol;
`;
export const MarketCap = styled.div`
  grid-area: cap;
`;
