import React, { useState } from 'react';
import { Card, CardBody,Collapse, Button } from 'reactstrap';
import _ from "lodash";
import "react-datepicker/dist/react-datepicker.css";

import T10Batting from "./Forms/T10/T10Batting";
import T10Bowling from "./Forms/T10/T10Bowling";
import T10Feilding from "./Forms/T10/T10Feilding";
import T10Other from "./Forms/T10/T10Other";
import T10Economy from "./Forms/T10/T10Economy";
import T10Strike from "./Forms/T10/T10Strike";


const Ten = (props) => {
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
              <T10Batting/>
            </CardBody>
          </Card>
        </Collapse>
        <br></br>
        <Button color="primary" className="pointbtn" onClick={toggleBowl} style={{ marginBottom: '1rem' }}>Bowling</Button>
        <Collapse isOpen={isBowlOpen}>
          <Card>
            <CardBody>
            <T10Bowling/>
            </CardBody>
          </Card>
        </Collapse>
        <br></br>
        <Button color="primary" className="pointbtn" onClick={toggleFielding} style={{ marginBottom: '1rem' }}>Feilding</Button>
        <Collapse isOpen={isFieldingOpen}>
          <Card>
            <CardBody>
              <T10Feilding/>
            </CardBody>
          </Card>
        </Collapse>
        <br></br>
        <Button color="primary" className="pointbtn" onClick={toggleOther} style={{ marginBottom: '1rem' }}>Other</Button>
        <Collapse isOpen={isOthergOpen}>
          <Card>
            <CardBody>
              <T10Other/>
            </CardBody>
          </Card>
        </Collapse>
        <br></br>
        <Button color="primary" className="pointbtn" onClick={toggleEconomy} style={{ marginBottom: '1rem' }}>Economy Rate ( Min 1 Over )</Button>
        <Collapse isOpen={isEconomyOpen}>
          <Card>
            <CardBody>
              <T10Economy/>
            </CardBody>
          </Card>
        </Collapse>
        <br></br>
        <Button color="primary" className="pointbtn" onClick={toggleStrike} style={{ marginBottom: '1rem' }}>Strike Rate (Except Bowlers) (Min 5 Balls) </Button>
        <Collapse isOpen={isStrikeOpen}>
          <Card>
            <CardBody>
              <T10Strike/>
            </CardBody>
          </Card>
        </Collapse>
      </div>
    </div >
  );
};

export default Ten;
