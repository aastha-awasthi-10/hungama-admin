import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router,Redirect,Route,Link,Switch } from "react-router-dom";
import Helper from '../../constants/helper';
import apiUrl from '../../constants/apiPath';
import Pagination from "react-js-pagination";
import { Card, CardBody, CardHeader, Col, Row, Table, Form, Input, FormGroup } from 'reactstrap';
import _ from "lodash";
import "react-datepicker/dist/react-datepicker.css";
import Loaders from '../CommanPage/Loader'
import useSession from "react-session-hook";
import { useAlert } from "react-alert";
import { MDBDataTableV5 } from 'mdbreact';

const Ten = React.lazy(() => import('./Ten'));
const Twenty = React.lazy(() => import('./Twenty'));
const Odi = React.lazy(() => import('./Odi'));
const Test = React.lazy(() => import('./Test'));
const PointsRoute = React.lazy(() => import('./PointsRoute'));

const PointSystem = (props) => {
  
  const [tab, setTab] = useState('t10');
  const [visible, setVisibale] = useState(false);
  
  const handleTabChange = (e) => {
    setTab(e.target.name);
  }

  return (
    <div className="animated fadeIn loader-outer">
      <Loaders className="overlay-loader" visible={visible} />
      <Row>
        <Col>
          <Card>
            <CardBody>
              {/* <PointsRoute/> */}
              <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <Link to='#' className="navbar-brand">Point System</Link>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                  <ul className="navbar-nav mr-auto">
                  <li className="nav-item">
                      <Link to='#' name="t10" onClick={handleTabChange} 
                      className={tab=='t10' ? 'nav-link '+tab : 'nav-link'}
                      
                      >T10</Link>
                    </li>
                    <li className="nav-item">
                      <Link to='#' name="t20" onClick={handleTabChange} className={tab=='t20' ? 'nav-link '+tab : 'nav-link'}>T20</Link>
                    </li>
                    <li className="nav-item">
                      <Link to='#' name="odi" onClick={handleTabChange} className={tab=='odi' ? 'nav-link '+tab : 'nav-link'}>ODI</Link>
                    </li>
                    <li className="nav-item">
                      <Link to='#' name="test" onClick={handleTabChange} className={tab=='test' ? 'nav-link '+tab : 'nav-link'}>Test</Link>
                    </li>
                  </ul>
                </div>
              </nav> <br/>
              {tab === 't10' ? (
                <Ten/>
              ) : null}
              {tab === 't20' ? (
                <Twenty/>
              ) : null}
              {tab === 'odi' ? (
                <Odi/>
              ) : null}
              {tab === 'test' ? (
                <Test/>
              ) : null}
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div >
  );
};

export default PointSystem;
