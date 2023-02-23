import React, { Fragment, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  ItemTitle,
  InputRow,
  InputField,
  InputButton,
  ItemsList,
  ItemRow,
  ItemRowMarked,
  ConfirmButton,
} from "./item-list.styles";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";

const ItemList = ({
  title,
  items,
  itemAddHandler,
  itemDeleteHandler,
  itemSelectedHandler,
  isRowSelectable = false,
}) => {
  const location = useLocation();
  const [inputValue, setInputValue] = useState("");
  const [deleteMode, setDeleteMode] = useState(false);
  const [deleteSet, setDeleteSet] = useState(new Set());
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    setSelectedItem(null);
  }, [location]);

  const confirmModalOptions = {
    title: "Confirm Delete",
    message: "Do you want to delete the marked items?",
    buttons: [
      {
        label: "Yes",
        onClick: () => itemDeleteHandler(deleteSet),
      },
      {
        label: "No",
        onClick: () => {
          return;
        },
      },
    ],
    closeOnEscape: true,
    closeOnClickOutside: true,
    keyCodeForClose: [8, 32],
    willUnmount: () => {},
    afterClose: () => {
      setDeleteSet(new Set());
      setInputValue("");
      setDeleteMode(false);
    },
    onClickOutside: () => {},
    onKeypress: () => {},
    onKeypressEscape: () => {},
    overlayClassName: "overlay-custom-class-name",
  };

  const inputHandleChange = (event) => {
    setInputValue(event.target.value);
  };

  const addClickHandler = (event) => {
    if (inputValue.length === 0) {
      return;
    }
    itemAddHandler(inputValue);
    setSelectedItem(inputValue);
    setInputValue("");
  };

  const deleteClickHandler = (event) => {
    if (items.length === 0) {
      return;
    }
    setDeleteMode(true);
    setSelectedItem(null);
  };

  const confirmClickHandler = (event) => {
    confirmAlert(confirmModalOptions);
  };

  const toggleDeleteHandler = (symbol) => {
    if (deleteSet.has(symbol)) {
      deleteSet.delete(symbol);
      setDeleteSet(new Set(deleteSet));
    } else {
      deleteSet.add(symbol);
      setDeleteSet(new Set(deleteSet));
    }
  };

  const showItemRow = ({item}) => {
    const TargetItemRow =
      isRowSelectable && item === selectedItem ? ItemRowMarked : ItemRow;
    return (
      <TargetItemRow
        key={item}
        onClick={() => {
          if (isRowSelectable) {
            setSelectedItem(item);
          }
          itemSelectedHandler(item);
        }}
      >
        {item}
      </TargetItemRow>
    );
  };

  return (
    <Fragment>
      {title ? <ItemTitle>{title}</ItemTitle> : null}
      {itemAddHandler && itemDeleteHandler ? (
        <InputRow>
          <InputField
            onChange={inputHandleChange}
            value={inputValue}
          ></InputField>

          {deleteMode ? (
            <ConfirmButton onClick={confirmClickHandler}>Confirm</ConfirmButton>
          ) : (
            <Fragment>
              <InputButton onClick={addClickHandler}>Add</InputButton>
              <InputButton onClick={deleteClickHandler}>Del</InputButton>
            </Fragment>
          )}
        </InputRow>
      ) : (
        <Fragment></Fragment>
      )}

      <ItemsList>
        <div>
          {items ? (
            items.map((item) =>
              deleteMode ? (
                deleteSet.has(item) ? (
                  <ItemRowMarked
                    key={item}
                    onClick={() => toggleDeleteHandler(item)}
                  >
                    {item}
                  </ItemRowMarked>
                ) : (
                  <ItemRow key={item} onClick={() => toggleDeleteHandler(item)}>
                    {item}
                  </ItemRow>
                )
              ) : (
                showItemRow({item})
            )
            )
          ) : (
            <ItemRow>No Items</ItemRow>
          )}
        </div>
      </ItemsList>
    </Fragment>
  );
};

export default ItemList;
