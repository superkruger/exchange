import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "./Home";
import Market from './market/Market'
import Buy from './buy/Buy'
import Sell from './sell/Sell'
import Portfolio from './portfolio/Portfolio'
import Funds from './funds/Funds'

export default function Routes() {
  return (
  	<Switch>
      <Route path="/" exact component={Home} />
      <Route path="/market" component={Market} />
      <Route path="/buy" component={Buy} />
      <Route path="/sell" component={Sell} />
      <Route path="/portfolio" component={Portfolio} />
      <Route path="/funds" component={Funds} />
    </Switch>
  );
}