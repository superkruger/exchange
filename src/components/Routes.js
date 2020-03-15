import React from "react";
import { Route, Switch } from "react-router-dom";
import Settings from "./Settings";
import Home from "./Home";
import MarketOrderBook from "./market/MarketOrderBook";
import MarketTrades from './market/MarketTrades'
import BuyOrders from './buy/BuyOrders'
import NewBuyOrder from './buy/NewBuyOrder'
import SellOrders from './sell/SellOrders'
import NewSellOrder from './sell/NewSellOrder'
import PortfolioOrders from './portfolio/PortfolioOrders'
import PortfolioTrades from './portfolio/PortfolioTrades'
import FundsBalance from './funds/FundsBalance'

export default function Routes() {
  return (
  	<Switch>
      <Route path="/" exact component={Home} />
      <Route path="/settings" component={Settings} />
      <Route path="/market-orderbook" component={MarketOrderBook} />
      <Route path="/market-trades" component={MarketTrades} />
      <Route path="/buy-orders" component={BuyOrders} />
      <Route path="/buy-neworder" component={NewBuyOrder} />
      <Route path="/sell-orders" component={SellOrders} />
      <Route path="/sell-neworder" component={NewSellOrder}/>
      <Route path="/portfolio-orders" component={PortfolioOrders} />
      <Route path="/portfolio-trades" component={PortfolioTrades} />
      <Route path="/funds-balance" component={FundsBalance} />
    </Switch>
  );
}