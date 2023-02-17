import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router,Link,Switch } from "react-router-dom";
import Helper from '../../constants/helper';
import apiUrl from '../../constants/apiPath';
import Pagination from "react-js-pagination";
import { Card, CardBody, CardHeader,Collapse,CardTitle, Button, Col, Row, Table, Form, Input, FormGroup } from 'reactstrap';
import _ from "lodash";
import "react-datepicker/dist/react-datepicker.css";

import OdiBatting from "./Forms/Odi/OdiBatting";
import OdiBowling from "./Forms/Odi/OdiBowling";
import OdiFeilding from "./Forms/Odi/OdiFeilding";
import OdiOther from "./Forms/Odi/OdiOther";
import OdiEconomy from "./Forms/Odi/OdiEconomy";
import OdiStrike from "./Forms/Odi/OdiStrike";


const Odi = (props) => {
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
  const toggleEconomy = () => {
    setIsEconomy(!isEconomyOpen)
    setIsBat(isBatOpen?!isBatOpen:isBatOpen)
    setIsBowl(isBowlOpen?!isBowlOpen:isBowlOpen)
    setIsOtherg(isOthergOpen?!isOthergOpen:isOthergOpen)
    setIsFielding(isFieldingOpen?!isFieldingOpen:isFieldingOpen)
    setIsStrike(isStrikeOpen?!isStrikeOpen:isStrikeOpen)
  };

  const [isStrikeOpen, setIsStrike] = useState(false);
  const toggleStrike = () => {
    setIsStrike(!isStrikeOpen)
    setIsEconomy(isEconomyOpen?!isEconomyOpen:isEconomyOpen)
    setIsBat(isBatOpen?!isBatOpen:isBatOpen)
    setIsBowl(isBowlOpen?!isBowlOpen:isBowlOpen)
    setIsOtherg(isOthergOpen?!isOthergOpen:isOthergOpen)
    setIsFielding(isFieldingOpen?!isFieldingOpen:isFieldingOpen)
  };

  return (
    <div className="animated fadeIn loader-outer">
      <div>
      <Button color="primary" className="pointbtn" onClick={toggleBat} style={{ marginBottom: '1rem' }}>Batting</Button>
        <Collapse isOpen={isBatOpen}>
          <Card>
            <CardBody>
              <OdiBatting/>
            </CardBody>
          </Card>
        </Collapse>
        <br></br>
        <Button color="primary" className="pointbtn" onClick={toggleBowl} style={{ marginBottom: '1rem' }}>Bowling</Button>
        <Collapse isOpen={isBowlOpen}>
          <Card>
            <CardBody>
            <OdiBowling/>
            </CardBody>
          </Card>
        </Collapse>
        <br></br>
        <Button color="primary" className="pointbtn" onClick={toggleFielding} style={{ marginBottom: '1rem' }}>Feilding</Button>
        <Collapse isOpen={isFieldingOpen}>
          <Card>
            <CardBody>
              <OdiFeilding/>
            </CardBody>
          </Card>
        </Collapse>
        <br></br>
        <Button color="primary" className="pointbtn" onClick={toggleOther} style={{ marginBottom: '1rem' }}>Other</Button>
        <Collapse isOpen={isOthergOpen}>
          <Card>
            <CardBody>
              <OdiOther/>
            </CardBody>
          </Card>
        </Collapse>
        <br></br>
        <Button color="primary" className="pointbtn" onClick={toggleEconomy} style={{ marginBottom: '1rem' }}>Economy Rate ( Min 5 Overs To Be Bowled )</Button>
        <Collapse isOpen={isEconomyOpen}>
          <Card>
            <CardBody>
              <OdiEconomy/>
            </CardBody>
          </Card>
        </Collapse>
        <br></br>
        <Button color="primary" className="pointbtn" onClick={toggleStrike} style={{ marginBottom: '1rem' }}>
											          STRIKE RATE (EXCEPT BOWLER) (Min 20 Balls To Be Played) </Button>
        <Collapse isOpen={isStrikeOpen}>
          <Card>
            <CardBody>
              <OdiStrike/>
            </CardBody>
          </Card>
        </Collapse>
      </div>
    </div >
  );
};

export default Odi;