import React, { useState } from 'react';
import { Card, CardBody,Collapse,CardHeader, CardTitle, Button} from 'reactstrap';
import "react-datepicker/dist/react-datepicker.css";

import T20Batting from "./Forms/T20/T20Batting";
import T20Bowling from "./Forms/T20/T20Bowling";
import T20Feilding from "./Forms/T20/T20Feilding";
import T20Other from "./Forms/T20/T20Other";
import T20Economy from "./Forms/T20/T20Economy";
import T20Strike from "./Forms/T20/T20Strike";


const Twenty = (props) => {
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
              <T20Batting/>
            </CardBody>
          </Card>
        </Collapse>
        <br></br>
        <Button color="primary" className="pointbtn" onClick={toggleBowl} style={{ marginBottom: '1rem' }}>Bowling</Button>
        <Collapse isOpen={isBowlOpen}>
          <Card>
            <CardBody>
            <T20Bowling/>
            </CardBody>
          </Card>
        </Collapse>
        <br></br>
        <Button color="primary" className="pointbtn" onClick={toggleFielding} style={{ marginBottom: '1rem' }}>Feilding</Button>
        <Collapse isOpen={isFieldingOpen}>
          <Card>
            <CardBody>
              <T20Feilding/>
            </CardBody>
          </Card>
        </Collapse>
        <br></br>
        <Button color="primary" className="pointbtn" onClick={toggleOther} style={{ marginBottom: '1rem' }}>Other</Button>
        <Collapse isOpen={isOthergOpen}>
          <Card>
            <CardBody>
              <T20Other/>
            </CardBody>
          </Card>
        </Collapse>
        <br></br>
        <Button color="primary" className="pointbtn" onClick={toggleEconomy} style={{ marginBottom: '1rem' }}>Economy Rate ( Min 2 Overs To be Bowled )</Button>
        <Collapse isOpen={isEconomyOpen}>
          <Card>
            <CardBody>
              <T20Economy/>
            </CardBody>
          </Card>
        </Collapse>
        <br></br>
        <Button color="primary" className="pointbtn" onClick={toggleStrike} style={{ marginBottom: '1rem' }}>Strike Rate (Except Bowler) (Min 10 Balls To Be Played) </Button>
        <Collapse isOpen={isStrikeOpen}>
          <Card>
            <CardBody>
              <T20Strike/>
            </CardBody>
          </Card>
        </Collapse>
      </div>
    </div >
  );
};

export default Twenty;
