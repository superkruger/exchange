import React from "react";
import { Route, Switch, useRouteMatch } from "react-router-dom";
import OrderBook from "./OrderBook";
import Trades from './Trades'

export default function Routes() {
	let { path, url } = useRouteMatch();
	return (
		<Switch>
			<Route exact path={path}>
          		<OrderBook />
        	</Route>
	        <Route path={`${path}/orderbook`}>
	          <OrderBook />
	        </Route>
		  	<Route path={`${path}/trades`}>
	          <Trades />
	        </Route>
		</Switch>
	);
}