import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import Helper from '../../constants/helper';
import apiUrl from '../../constants/apiPath';
import moment from "moment";
import Pagination from "react-js-pagination";
import { Card, Button, CardBody, CardHeader, Col, Row, Table, Form, Input, FormGroup } from 'reactstrap';
import _ from "lodash";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Loaders from '../CommanPage/Loader'
// import Excelreport from '../Reports/excelreport';
import useSession from "react-session-hook";
import { useAlert } from "react-alert";
import ExtendDate from "./Action/ExtendDate";

import EditNews from '../News/EditNews';
import UpComing from './UpComing';
import Live from './Live';
import Result from './Result';
const ScheduleContest = (props) => {

  const [tab, setTab] = useState('upcoming');
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
              <nav className="navbar navbar-expand-lg navbar-light bg-light">                
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                  <ul className="navbar-nav mr-auto">
                    <li className="nav-item">
                        <Link to='#' name="upcoming" onClick={handleTabChange} 
                        className={tab=='upcoming' ? 'nav-link '+tab : 'nav-link'}>UpComing</Link>
                    </li>
                    <li className="nav-item">
                      <Link to='#' name="live" onClick={handleTabChange} className={tab=='live' ? 'nav-link '+tab : 'nav-link'}>Live</Link>
                    </li>
                    <li className="nav-item">
                      <Link to='#' name="result" onClick={handleTabChange} className={tab=='result' ? 'nav-link '+tab : 'nav-link'}>Result
                      </Link>
                    </li>
                  </ul>
                </div>
              </nav> <br/>
              {tab === 'upcoming' ? (
                <UpComing/>
              ) : null}
              {tab === 'live' ? (
                <Live/>
              ) : null}
              {tab === 'result' ? (
                <Result/>
              ) : null}
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div >
  );
};

export default ScheduleContest;