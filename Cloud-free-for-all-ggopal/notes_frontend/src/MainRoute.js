import React from "react";
import { Route, Switch } from "react-router-dom";

import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import EditNote from "./components/EditNote";
import AddNote from "./components/AddNote";

const MainRoute = () => (
  <div>
    <Switch>
      <Route exact path="/" component={Home} />
      <Route exact path="/home" component={Home} />
      <Route exact path="/login" component={Login} />
      <Route exact path="/register" component={Register} />
      <Route exact path="/edit" component={EditNote} />
      <Route exact path="/add" component={AddNote} />
    </Switch>
  </div>
);

export default MainRoute;
