import React, { useState, useContext, Fragment, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { PortfolioContext } from "../../contexts/portfolio.context";

import {
  PortfoliosViewLayout,
  HeaderArea,
  PortfolioContainer,
  SymbolsContainer,
  Message,
  MessageContainer,
} from "./portfolios-view.styles";

import SymbolRow from "../../components/symbol-row/symbol-row.component";
import ItemList from "../../components/item-list/item-list.component";
import Spinner from "../../components/spinner/spinner.component";

const fetchWithTimeout = (url, ms, { signal, ...options } = {}) => {
  const controller = new AbortController();
  const promise = fetch(url, { signal: controller.signal, ...options });
  if (signal) signal.addEventListener("abort", () => controller.abort());
  const timeout = setTimeout(() => controller.abort(), ms);
  return promise.finally(() => clearTimeout(timeout));
};

const PortfoliosView = (props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userPortfolios, currentUser } = useContext(PortfolioContext);
  const [symbolData, setSymbolData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Clear selected symbols if we navigate away
  useEffect(() => {
    setSymbolData(null);
  }, [location]);

  // Redirect to auth if not logged in and no sample data
  useEffect(() => {
    if (!props.sampleData && !currentUser) {
      navigate("/auth");
    }
  }, [currentUser]);

  // Load data for the selected portfolio
  const selectedPortfolioHandler = (portfolioName) => {
    if (props.sampleData) {
      if (!(portfolioName in props.sampleData)) {
        alert(`${portfolioName} not found in portfolios!`);
        return;
      }
    } else {
      if (!(portfolioName in userPortfolios)) {
        alert(`${portfolioName} not found in portfolios!`);
        return;
      }
    }

    const symbolList = props.sampleData
      ? props.sampleData[portfolioName].toString()
      : userPortfolios[portfolioName].toString();
    const urlString = `https://query1.finance.yahoo.com/v7/finance/quote?lang=en-US&region=US&corsDomain=finance.yahoo.com&symbols=${symbolList}`;
    const fullFetchString = `https://api.allorigins.win/get?url=${encodeURIComponent(
      urlString
    )}`;

    setIsLoading(true);

    fetchWithTimeout(fullFetchString, 10000, {
      cache: "no-store",
    })
      .then((response) => response.json())
      .then((data) => {
        setIsLoading(false);
        const contents = JSON.parse(data.contents);
        setSymbolData(
          contents.quoteResponse.result.map((item) => {
            return {
              symbol: item.symbol,
              name: item.shortName,
              priceDayRange: item.regularMarketDayRange,
              price52WeekRange: item.fiftyTwoWeekRange,
              averageVolume: item.averageDailyVolume3Month,
              marketCap: item.marketCap,
              isValid: item.quoteType !== "NONE",
            };
          })
        );
      })
      .catch((error) => {
        const msg =
          error.name === "AbortError"
            ? `Timed out while fetching from yahoo finance`
            : `Error while fetching from yahoo finance: ${error}`;
        alert(msg);
        console.log(msg);
        setIsLoading(false);
        setSymbolData(null);
      });
  };

  return (
    <PortfoliosViewLayout>
      {props.sampleData ? (
        <HeaderArea>Sample Portfolios</HeaderArea>
      ) : (
        <HeaderArea>Portfolios</HeaderArea>
      )}

      {userPortfolios || props.sampleData ? (
        <Fragment>
          <PortfolioContainer>
            <ItemList
              title="List of Portfolios"
              items={
                props.sampleData
                  ? Object.keys(props.sampleData)
                  : Object.keys(userPortfolios)
              }
              itemSelectedHandler={selectedPortfolioHandler}
              isRowSelectable={true}
            />
          </PortfolioContainer>
          <SymbolsContainer>
            {!isLoading ? (
              symbolData && symbolData.length > 0 ? (
                symbolData.map((item) => (
                  <SymbolRow key={item.symbol} symbolData={item} />
                ))
              ) : (
                <MessageContainer>
                  <Message>Select a Portfolio</Message>
                </MessageContainer>
              )
            ) : (
              <Spinner />
            )}
          </SymbolsContainer>
        </Fragment>
      ) : (
        <Fragment>
          <p>Loading portfolios</p>
          <Spinner />
        </Fragment>
      )}
    </PortfoliosViewLayout>
  );
};

export default PortfoliosView;
