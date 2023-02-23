import React, { Fragment } from "react";

import {
  SymbolRowLayout,
  Symbol,
  DayRange,
  Week52,
  Volume,
  MarketCap,
} from "./symbol-row.styles";

const SymbolRow = ({ symbolData }) => {
  const {
    symbol,
    name,
    priceDayRange,
    price52WeekRange,
    averageVolume,
    marketCap,
    isValid,
  } = symbolData;

  return (
    <SymbolRowLayout>
      {isValid ? (
        <Fragment>
          <Symbol>
            <b>
              {symbol} - {name}
            </b>
          </Symbol>
          <DayRange>
            <b>Day</b>: {priceDayRange}
          </DayRange>
          <Week52>
            <b>52wk</b>: {price52WeekRange}
          </Week52>
          <Volume>
            <b>Vol</b>: {averageVolume}
          </Volume>
          <MarketCap>
            <b>Cap</b>: {marketCap}
          </MarketCap>
        </Fragment>
      ) : (
        <Symbol>
          <b>{symbol} - Not found</b>
        </Symbol>
      )}
    </SymbolRowLayout>
  );
};

export default SymbolRow;
