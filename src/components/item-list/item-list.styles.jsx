import styled from "styled-components";

export const ItemContainer = styled.div`
  display: flex;
  flex: auto auto 1fr;
  height: 100%;
  flex-direction: column;
`;

export const ItemTitle = styled.div`
  width: 100%;
  text-align: center;
  background-color: #a3a3a3;
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
`;

export const InputRow = styled.div`
  width: 100%;
  text-align: center;
  margin: 1rem 0;
`;

export const InputField = styled.input`
  width: 50%;
  margin: 0 1rem;
`;

export const InputButton = styled.button`
  width: 3rem;
  margin: 0 0.5rem;
`;

export const ItemsList = styled.div`
  overflow-y: scroll;
`;

export const ItemRow = styled.div`
  width: 90%;
  padding: 0.25rem;
  text-align: center;
  /* border: 1px solid black; */
  margin: 0.25rem auto;
  border-radius: 15px;
`;

export const ItemRowMarked = styled(ItemRow)`
  background-color: #ccc;
`;

export const ConfirmButton = styled.button`
  width: 6rem;
  margin: 0 0.5rem;
`;
