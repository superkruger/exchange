import React from "react";
import { Route, Switch, useRouteMatch } from "react-router-dom";
import Orders from "./Orders";
import Trades from './Trades'

export default function Routes() {
	let { path, url } = useRouteMatch();
	return (
		<Switch>
			<Route exact path={path}>
          		<Orders />
        	</Route>
	        <Route path={`${path}/orders`}>
	          <Orders />
	        </Route>
		  	<Route path={`${path}/trades`}>
	          <Trades />
	        </Route>
		</Switch>
	);
}