
import React, { useState, useEffect } from 'react';
import { ErrorMessage, useForm } from 'react-hook-form';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// import { i18n } from 'element-react'
// import locale from 'element-react/src/locale/lang/en'
// import { DateRangePicker } from 'element-react';
// import 'element-theme-default';

import Helper from '../../constants/helper';
import { useHistory } from "react-router-dom";
import apiUrl from '../../constants/apiPath';
import {Button, Modal, ModalHeader, ModalBody, ModalFooter,Table} from 'reactstrap';
import _ from 'lodash';
import { useAlert } from 'react-alert';
import useSession from 'react-session-hook';
import { useParams } from "react-router";
import moment from "moment";
// i18n.use(locale);

const ViewContest = (props) => {
  console.log("props", props)
  const session = useSession();
  let history = useHistory();
  const [modal, setModal] = useState(false);
  const alert = useAlert();
  const [token] = useState(session.token);
  const [loading, setLoading] = useState(false);
  const [id, setId] = useState('');
  const [winning_amount, setWinningAmount] = useState(props.item.winning_amount);
  const [users_limit, setUserLimit] = useState(props.item.users_limit);
  const [contest_type, setContestType] = useState(props.item.contest_type);
  const [entry_fee, setEntryFee] = useState(props.item.entry_fee);
  const [auto_create, setAutoCreate] = useState(props.item.auto_create==true?'Yes':'No');
  const [join_multiple_team, setJoinMultipleTeam] = useState(props.item.join_multiple_team==true?'Yes':'No');
  const [confirm_winning, setConfirmWinning] = useState(props.item.confirm_winning==true?'Yes':'No');
  const [price_breakup, setPriceBreakup] = useState(props.item.price_breakup);
  
  useEffect(() => {


    
  }, [props.item]);
  
  return (
      <div className={"inline-btn"}>
      <Button className="btn circle_btn btn-sm mr-1" type="button" title="View Details" onClick={(e) => { setModal(true);}}>View</Button>
      <Modal isOpen={modal} toggle={e => {setModal(false)}} className="custom-modal modal-lg">
        <ModalHeader toggle={e => {setModal(false)}}>Contest Detail</ModalHeader>
        <ModalBody>
          <Table hover bordered responsive className="mt-3 text-center">
            <tr>
                <td>Winning Amount (INR) : </td>
                <td>{winning_amount}</td>
            </tr>
            <tr>
                <td>Contest Size : </td>
                <td>{users_limit}</td>
            </tr>
            <tr>
                <td>Contest Type :  </td>
                <td>{contest_type}</td>
            </tr>
            <tr>
                <td>Entry Fee (INR) : </td>
                <td>{entry_fee}</td>
            </tr>
            <tr>
                <td>Auto Create : </td>
                <td>{auto_create}</td>
            </tr>
            <tr>
                <td>Join with multiple teams : </td>
                <td>{join_multiple_team}</td>
            </tr>
            <tr>
                <td>Confirmed winning : </td>
                <td>{confirm_winning}</td>
            </tr>
          </Table>

            <Table>
              <thead>
                  <tr>
                      <th>Name</th>
                      <th>Start</th>
                      <th>End</th>
                      <th>Percentage</th>
                      <th>Price</th>
                  </tr>
              </thead>
              <tbody>
              {price_breakup.map((cItem, key) => {
                return (
                  <tr key={key}>
                    <td>Rank {cItem.start_rank == cItem.end_rank ? cItem.start_rank : cItem.start_rank+ ' - ' +cItem.end_rank }</td>
                    <td>{cItem.start_rank}</td>
                    <td>{cItem.end_rank}</td>
                    <td>{cItem.each_percentage}</td>
                    <td>{cItem.each_price}</td>
                  </tr>
                )
              })}
              </tbody>
            </Table>

          </ModalBody>
        <ModalFooter>
          <button type="button" className="btn dark_btn" data-dismiss="modal" onClick={(e) => { setModal(false); }}>Close</button>
        </ModalFooter>
      </Modal>
    </div>   
     
  );
}

export default ViewContest;