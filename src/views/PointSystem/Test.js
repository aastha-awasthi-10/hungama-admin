import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router,Link,Switch } from "react-router-dom";
import Helper from '../../constants/helper';
import apiUrl from '../../constants/apiPath';
import Pagination from "react-js-pagination";
import { Card, CardBody, CardHeader,Collapse,CardTitle, Button, Col, Row, Table, Form, Input, FormGroup } from 'reactstrap';
import _ from "lodash";
import "react-datepicker/dist/react-datepicker.css";

import TestBatting from "./Forms/Test/TestBatting";
import TestBowling from "./Forms/Test/TestBowling";
import TestFeilding from "./Forms/Test/TestFeilding";
import TestOther from "./Forms/Test/TestOther";
import TestEconomy from "./Forms/Test/TestEconomy";
import TestStrike from "./Forms/Test/TestStrike";


const Test = (props) => {
  const [isBatOpen, setIsBat] = useState(true);
  const toggleBat = () => {
    setIsBat(!isBatOpen)
    setIsBowl(isBowlOpen?!isBowlOpen:isBowlOpen)
    setIsFielding(isFieldingOpen?!isFieldingOpen:isFieldingOpen)
    setIsOtherg(isOthergOpen?!isOthergOpen:isOthergOpen)
    setIsEconomy(isEconomyOpen?!isEconomyOpen:isEconomyOpen)
    setIsStrike(isStrikeOpen?!isStrikeOpen:isStrikeOpen)
  };

  const [isBowlOpen, setIsBowl] = useState(false);
  const toggleBowl = () => {
    setIsBowl(!isBowlOpen)
    setIsBat(isBatOpen?!isBatOpen:isBatOpen)
    setIsFielding(isFieldingOpen?!isFieldingOpen:isFieldingOpen)
    setIsOtherg(isOthergOpen?!isOthergOpen:isOthergOpen)
    setIsEconomy(isEconomyOpen?!isEconomyOpen:isEconomyOpen)
    setIsStrike(isStrikeOpen?!isStrikeOpen:isStrikeOpen)

  };

  const [isFieldingOpen, setIsFielding] = useState(false);
  const toggleFielding = () => {
    setIsFielding(!isFieldingOpen)
    setIsBowl(isBowlOpen?!isBowlOpen:isBowlOpen)
    setIsBat(isBatOpen?!isBatOpen:isBatOpen)
    setIsOtherg(isOthergOpen?!isOthergOpen:isOthergOpen)
    setIsEconomy(isEconomyOpen?!isEconomyOpen:isEconomyOpen)
    setIsStrike(isStrikeOpen?!isStrikeOpen:isStrikeOpen)

  };

  const [isOthergOpen, setIsOtherg] = useState(false);
  const toggleOther = () => {
    setIsOtherg(!isOthergOpen)
    setIsBat(isBatOpen?!isBatOpen:isBatOpen)
    setIsBowl(isBowlOpen?!isBowlOpen:isBowlOpen)
    setIsFielding(isFieldingOpen?!isFieldingOpen:isFieldingOpen)
    setIsEconomy(isEconomyOpen?!isEconomyOpen:isEconomyOpen)
    setIsStrike(isStrikeOpen?!isStrikeOpen:isStrikeOpen)
  };

  const [isEconomyOpen, setIsEconomy] = useState(false);  
  const [isStrikeOpen, setIsStrike] = useState(false);

  return (
    <div className="animated fadeIn loader-outer">
      <div>
      <Button color="primary" className="pointbtn" onClick={toggleBat} style={{ marginBottom: '1rem' }}>Batting</Button>
        <Collapse isOpen={isBatOpen}>
          <Card>
            <CardBody>
              <TestBatting/>
            </CardBody>
          </Card>
        </Collapse>
        <br></br>
        <Button color="primary" className="pointbtn" onClick={toggleBowl} style={{ marginBottom: '1rem' }}>Bowling</Button>
        <Collapse isOpen={isBowlOpen}>
          <Card>
            <CardBody>
            <TestBowling/>
            </CardBody>
          </Card>
        </Collapse>
        <br></br>
        <Button color="primary" className="pointbtn" onClick={toggleFielding} style={{ marginBottom: '1rem' }}>Feilding</Button>
        <Collapse isOpen={isFieldingOpen}>
          <Card>
            <CardBody>
              <TestFeilding/>
            </CardBody>
          </Card>
        </Collapse>
        <br></br>
        <Button color="primary" className="pointbtn" onClick={toggleOther} style={{ marginBottom: '1rem' }}>Other</Button>
        <Collapse isOpen={isOthergOpen}>
          <Card>
            <CardBody>
              <TestOther/>
            </CardBody>
          </Card>
        </Collapse>
      </div>
    </div >
  );
};

export default Test;