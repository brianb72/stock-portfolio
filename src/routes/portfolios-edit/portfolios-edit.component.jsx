import React, { useContext, Fragment, useEffect } from "react";
import {
  PortfoliosEditLayout,
  HeaderArea,
  PortfolioContainer,
  SymbolContainer,
} from "./portfolios-edit.styles";

import ItemList from "../../components/item-list/item-list.component";
import Spinner from "../../components/spinner/spinner.component";
import {
  PortfolioContext,
  currentUser,
} from "../../contexts/portfolio.context";
import { useNavigate, useLocation } from "react-router-dom";
const PortfoliosEdit = () => {
  const {
    userPortfolios,
    currentUser,
    selectedPortfolioName,
    changeSelectedPortfolio,
    symbolsInSelectedPortfolio,
    addNewPortfolio,
    deleteExistingPortfolios,
    addSymbolsToPortfolio,
    removeSymbolsFromPortfolio,
  } = useContext(PortfolioContext);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    changeSelectedPortfolio(null);
  }, [location]);

  useEffect(() => {
    if (!currentUser) {
      navigate("/auth");
    }
  }, [currentUser]);

  // Called when a portfolio name is clicked
  const selectedPortfolioHandler = (name) => {
    if (name in userPortfolios) {
      changeSelectedPortfolio(name);
    } else {
      changeSelectedPortfolio(null);
    }
  };

  // Called when a symbol in a portfolio is clicked
  const selectedSymbolHandler = (symbolName) => {};

  // Called when the Add button on the portfolio list is pressed, contents of input box are passed as name
  const addPortfolioHandler = (name) => {
    if (!currentUser) {
      alert("Must login to update portfolios.");
      return;
    }

    if (name in userPortfolios) {
      alert("Portfolio name already exists!");
      return;
    }

    addNewPortfolio(name);
  };

  // Called when the Add button on the symbol list is pressed, contents of input box are passed as name
  const addSymbolHandler = (symbolName) => {
    if (!currentUser) {
      alert("Must login to update portfolios.");
      return;
    }

    // A portfolio must be selected to add a symbol
    if (selectedPortfolioName === null) {
      alert("No portfolio selected!");
      return;
    }

    addSymbolsToPortfolio(selectedPortfolioName, [symbolName]);
  };

  const deletePortfoliosHandler = (portfoliosToDeleteSet) => {
    if (!currentUser) {
      alert("Must login to update portfolios.");
      return;
    }

    deleteExistingPortfolios(portfoliosToDeleteSet);
  };

  const deleteSymbolsHandler = (symbolsToDeleteSet) => {
    if (!currentUser) {
      alert("Must login to update portfolios.");
      return;
    }
    if (selectedPortfolioName === null) {
      alert("No portfolio selected!");
      return;
    }

    removeSymbolsFromPortfolio(selectedPortfolioName, symbolsToDeleteSet);
  };

  return (
    <PortfoliosEditLayout>
      <HeaderArea>Portfolio Editor</HeaderArea>
      {userPortfolios ? (
        <Fragment>
          <PortfolioContainer>
            <ItemList
              title="List of Portfolios"
              items={Object.keys(userPortfolios)}
              itemAddHandler={addPortfolioHandler}
              itemDeleteHandler={deletePortfoliosHandler}
              itemSelectedHandler={selectedPortfolioHandler}
              isRowSelectable={true}
            />
          </PortfolioContainer>
          <SymbolContainer>
            {
              <ItemList
                title={
                  selectedPortfolioName
                    ? selectedPortfolioName
                    : "No portfolio selected"
                }
                items={symbolsInSelectedPortfolio}
                itemAddHandler={addSymbolHandler}
                itemDeleteHandler={deleteSymbolsHandler}
                itemSelectedHandler={selectedSymbolHandler}
              />
            }
          </SymbolContainer>
        </Fragment>
      ) : (
        <Fragment>
          <p>Loading...</p>
          <Spinner />
        </Fragment>
      )}
    </PortfoliosEditLayout>
  );
};

export default PortfoliosEdit;
