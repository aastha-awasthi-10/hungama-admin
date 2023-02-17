import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router,Route,Link,Switch } from "react-router-dom";

const Ten = React.lazy(() => import('./Ten'));
const Twenty = React.lazy(() => import('./Twenty'));
const Odi = React.lazy(() => import('./Odi'));
const Test = React.lazy(() => import('./Test'));

const PointsRoute = (props) => {
  

  return (
    <Router>
          <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <Link to={'/'} className="navbar-brand">Point System</Link>
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
              <ul className="navbar-nav mr-auto">
              <li className="nav-item">
                  <Link to={'points-t10'} className="nav-link">T10</Link>
                </li>
                <li className="nav-item">
                  <Link to={'/points-t20'} className="nav-link">T20</Link>
                </li>
                <li className="nav-item">
                  <Link to={'/points-odi'} className="nav-link">ODI</Link>
                </li>
                <li className="nav-item">
                  <Link to={'/points-test'} className="nav-link">Test</Link>
                </li>
              </ul>
            </div>
          </nav> <br/> <br/>
          <Switch>
              <Route exact path='/points-t10' component={ Ten } />
              <Route exact path='/points-t20' component={ Twenty } />
              <Route exact path='/points-odi' component={ Odi } />
              <Route exact path='/points-test' component={ Test } />
          </Switch>
      </Router>
  );
};

export default PointsRoute;
