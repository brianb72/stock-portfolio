import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./routes/home/home.component";
import Navigation from "./routes/navigation/navigation.component";
import PortfoliosView from "./routes/portfolios-view/portfolios-view.component";
import PortfoliosEdit from "./routes/portfolios-edit/portfolios-edit.component";
import Authentication from "./routes/authentication/authentication.component";

import { SAMPLE_PORTFOLIOS } from "./static-data";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigation />}>
        <Route index element={<Home />} />
        <Route
          path="sample"
          element={<PortfoliosView sampleData={SAMPLE_PORTFOLIOS} />}
        />
        <Route path="view" element={<PortfoliosView />} />
        <Route path="edit" element={<PortfoliosEdit />} />
        <Route path="auth" element={<Authentication />} />
      </Route>
    </Routes>
  );
};

export default App;
