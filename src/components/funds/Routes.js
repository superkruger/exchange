import React from "react";
import { Route, Switch, useRouteMatch } from "react-router-dom";
import Balance from "./Balance";

export default function Routes() {
	let { path, url } = useRouteMatch();
	return (
		<Switch>
			<Route exact path={path}>
          		<Balance />
        	</Route>
	        <Route path={`${path}/balance`}>
	          <Balance />
	        </Route>
		</Switch>
	);
}