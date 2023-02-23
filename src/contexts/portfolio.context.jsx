import { UserContext } from "./user.context";
import { createContext, useContext, useState, useEffect } from "react";

import {
  getAllPortfoliosForUser as fb_getAllPortfoliosForUser,
  addSymbolsToPortfolio as fb_addSymbolsToPortfolio,
  removeSymbolsFromPortfolio as fb_removeSymbolsFromPortfolio,
  deletePortfolios as fb_deletePortfolios,
} from "../utils/firebase/firebase.utils";

export const PortfolioContext = createContext({
  portfolios: [],
});

export const PortfolioProvider = ({ children }) => {
  const { currentUser } = useContext(UserContext); // Object: userAuth object from firebase
  const [userPortfolios, setUserPortfolios] = useState(null); // Object.<string, string[]: user portfolios document from firebase
  const [selectedPortfolioName, setSelectedPortfolioName] = useState(null); // string: name of portfolio selected, or null
  const [symbolsInSelectedPortfolio, setSymbolsInSelectedPortfolio] =
    useState(null); // string[]: symbols in portfolio, or null

  // Change selected items if user auth changes
  useEffect(() => {
    if (currentUser) {
      firebaseFetchUserPortfolios();
    } else {
      setUserPortfolios(null);
    }
    setSelectedPortfolioName(null);
    setSymbolsInSelectedPortfolio(null);
  }, [currentUser]);

  /**
   * Adds a new portfolio to the userPortfolios state object. Call this after successfully adding to firebase.
   * @param {string} portfolioName Name of the portfolio to add
   */
  const localAddNewPortfolioToState = (portfolioName) => {
    setUserPortfolios({ ...userPortfolios, [portfolioName]: [] });
  };

  /**
   * Removes all portfolios from userPortfolios that have names found in portfoliosToRemoveSet
   * @param {Set(string)} portfoliosToRemoveSet Name of the portfolio to remove
   */
  const localRemovePortfoliosFromState = (portfoliosToRemoveSet) => {
    const filteredPortfolios = Object.entries(userPortfolios).reduce(
      (output, portfolio) => {
        if (!portfoliosToRemoveSet.has(portfolio[0])) {
          output.push(portfolio);
        }
        return output;
      },
      []
    );
    setUserPortfolios(Object.fromEntries(filteredPortfolios));
  };

  /**
   * Adds all of the symbols in symbolNames to portfolioName in userPortfolios
   * @param {string} portfolioName
   * @param {string[]} symbolNames
   */
  const localAddSymbolsToPortfolio = (portfolioName, symbolNames) => {
    const filteredPortfolios = Object.entries(userPortfolios).reduce(
      (output, portfolio) => {
        if (portfolio[0] === portfolioName) {
          portfolio[1] = [...portfolio[1], ...symbolNames];
          setSymbolsInSelectedPortfolio(portfolio[1]);
        }
        output.push(portfolio);
        return output;
      },
      []
    );
    setUserPortfolios(Object.fromEntries(filteredPortfolios));
  };

  /**
   * Removes all of the symbols in symbolsToRemoveSet from portfolioName in userPortfolios
   * @param {string} portfolioName
   * @param {Set(string)} symbolsToRemoveSet
   */
  const localRemoveSymbolsFromPortfolio = (
    portfolioName,
    symbolsToRemoveSet
  ) => {
    console.log(userPortfolios);
    const filteredPortfolios = Object.entries(userPortfolios).reduce(
      (output, portfolio) => {
        if (portfolio[0] === portfolioName) {
          const newSymbols = portfolio[1].filter((item) => {
            return !symbolsToRemoveSet.has(item);
          });
          output.push([portfolio[0], newSymbols]);
          setSymbolsInSelectedPortfolio(newSymbols);
        } else {
          output.push(portfolio);
        }
        return output;
      },
      []
    );
    setUserPortfolios(Object.fromEntries(filteredPortfolios));
  };

  /**
   * Fetches all portfolios for the current user and local resets selected portfolio / symbols
   * @returns
   */
  const firebaseFetchUserPortfolios = async () => {
    try {
      setUserPortfolios(await fb_getAllPortfoliosForUser(currentUser));
      setSelectedPortfolioName(null);
      setSymbolsInSelectedPortfolio(null);
    } catch (error) {
      console.log("fetchUserPortfoliosFromFirebase error: ", error);
      setUserPortfolios(null);
      setSelectedPortfolioName(null);
      setSymbolsInSelectedPortfolio(null);
      return;
    }
  };

  /**
   *
   * @param {string} portfolioName Name of portfolio to add
   * @returns
   */
  const addNewPortfolio = async (portfolioName) => {
    if (portfolioName in userPortfolios) {
      alert(`Portfolio "${portfolioName}" already exists.`);
      return;
    }

    try {
      await fb_addSymbolsToPortfolio(currentUser, portfolioName, []);
      localAddNewPortfolioToState(portfolioName);
      setSelectedPortfolioName(portfolioName);
      setSymbolsInSelectedPortfolio(null);
    } catch (error) {
      alert("Error while adding portfolio: ", error);
      setSelectedPortfolioName(null);
      setSymbolsInSelectedPortfolio(null);
    }
  };

  /**
   *
   * @param {string[]} portfolioNames List of portfolio names to delete
   */
  const deleteExistingPortfolios = async (portfolioNames) => {
    try {
      await fb_deletePortfolios(currentUser, [...portfolioNames]);
      localRemovePortfoliosFromState(portfolioNames);
    } catch (error) {
      alert("Error while removing portfolios: ", error);
    }
    setSelectedPortfolioName(null);
    setSymbolsInSelectedPortfolio(null);
  };

  /**
   *
   * @param {string} portfolioName Name of portfolio to add to
   * @param {string[]} symbols List of symbols to add to portfolio
   */
  const addSymbolsToPortfolio = async (portfolioName, symbols) => {
    if (portfolioName === null) {
      alert("No portfolio selected!");
      return;
    }
    try {
      await fb_addSymbolsToPortfolio(currentUser, portfolioName, symbols);
      localAddSymbolsToPortfolio(portfolioName, symbols);
      console.log("Symbols added successfully.");
    } catch (error) {
      console.log("Error adding Symbols: ", error);
    }
  };

  /**
   *
   * @param {string} portfolioName Name of portfolio to remove from
   * @param {string[]} symbols List of symbols to remove from portfolio
   * @returns
   */
  const removeSymbolsFromPortfolio = async (portfolioName, symbols) => {
    if (portfolioName === null) {
      alert("No portfolio selected!");
      return;
    }
    try {
      await fb_removeSymbolsFromPortfolio(currentUser, portfolioName, symbols);
      localRemoveSymbolsFromPortfolio(portfolioName, symbols);
      console.log("Symbols removed successfully.");
    } catch (error) {
      console.log("Error removing Symbols: ", error);
    }
  };

  /**
   *
   * @param {string|null} portfolioName Name of portfolio to select, or null
   * @returns
   */
  const changeSelectedPortfolio = (portfolioName) => {
    if (portfolioName === null) {
      setSelectedPortfolioName(null);
      setSymbolsInSelectedPortfolio(null);
      return;
    }
    if (!(portfolioName in userPortfolios)) {
      alert(`Tried to select portfolio that does not exist ${portfolioName}`);
      return;
    }
    setSelectedPortfolioName(portfolioName);
    setSymbolsInSelectedPortfolio(userPortfolios[portfolioName]);
  };

  const value = {
    userPortfolios, // Object.<string, string[]: user portfolios document from firebase
    currentUser, // Object: userAuth object from firebase

    /* Add and Remove */
    addNewPortfolio,
    deleteExistingPortfolios,
    addSymbolsToPortfolio,
    removeSymbolsFromPortfolio,

    /* Selecting */
    selectedPortfolioName,
    changeSelectedPortfolio,
    symbolsInSelectedPortfolio,
  };

  return (
    <PortfolioContext.Provider value={value}>
      {children}
    </PortfolioContext.Provider>
  );
};
