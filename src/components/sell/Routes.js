import React from "react";
import { Route, Switch, useRouteMatch } from "react-router-dom";
import Orders from "./Orders";
import NewOrder from './NewOrder'

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
		  	<Route path={`${path}/neworder`}>
	          <NewOrder />
	        </Route>
		</Switch>
	);
}