import React, { useState, useEffect } from 'react';
import Helper from '../../../constants/helper';
import apiUrl from '../../../constants/apiPath';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Label, FormGroup, Col, Row } from 'reactstrap';
import useSession from 'react-session-hook';
import Swal from "sweetalert2";
import _ from "lodash";
import moment from "moment";
import { useAlert } from 'react-alert';

const View = (props) => {

  const session = useSession();
  const alert = useAlert();
  const [token] = useState(session.token);
  const [modal, setModal] = useState(false);
  const [item, setItem] = useState({});
  const [ID, setID] = useState('');
  const [bank_verified, setbankverified] = useState('');
  const [error, setError] = useState(false);
  const [reason, setReason] = useState('');
  const [is_reject, setIs_reject] = useState(false);
  const updateBankStatus = async (bankStatus) => {
    let postJson = { id: ID, bank_verified: bankStatus, reason };
    let path = apiUrl.update_bank_status;
    const fr = await Helper.post(postJson, path, token);
    const res = await fr.response.json();
    if (fr.status === 200) {
      if (res.success) {
        props.refreshData();
        alert.success(res.msg);
        setModal(false);
        setIs_reject(false)
      } else {
        alert.error(res.msg);
      }
    } else {
      alert.error(res.error);
    }
  }

  useEffect(() => {
    if (!_.isEmpty(props.item)) {
      setItem(props.item);
      setID(props.item);
      renderSwitch(props.item.bank_verified);
    }
  }, [props]);

  const renderSwitch = async (val) => {
    if (val == 0)
      setbankverified('Not Uploaded');
    else if (val == 1)
      setbankverified('In Review');
    else if (val == 2)
      setbankverified('Cancel By Admin');
    else if (val == 3)
      setbankverified('Approved');
  };



  return (
    <div className={"inline-btn"}>
      <Button className="btn circle_btn btn-sm mr-1" type="button" title="Bank Detail" onClick={(e) => { setModal(true); }}><i className="fa fa-bank" /></Button>
      <Modal isOpen={modal} toggle={e => { setModal(false) }} className={"custom-modal"}>
        <ModalHeader toggle={e => { setModal(false) }}>Bank Details</ModalHeader>
        <ModalBody>
          <Row>
            <Col md={6}>
              <FormGroup>
                <Label><strong>User name</strong></Label>
                <div>{item.first_name + ' ' + item.last_name || ''}</div>
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label><strong>Account No</strong></Label>
                <div>{item.account_no || ''}</div>
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label><strong>Ifsc Code</strong></Label>
                <div>{item.ifsc_code || ''}</div>
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label><strong>Bank Name</strong></Label>
                <div>{item.bank_name || ''}</div>
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label><strong>branch</strong></Label>
                <div>{item.branch || ''}</div>
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label><strong>Status</strong></Label>
                <div>{bank_verified || 'Not Uploaded Yet'}</div>
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label><strong>Bank Statement</strong></Label>
                <div><img src={item.bank_statement? props.bank_img + item.bank_statement : props.bank_img + 'no_image.jpg'} height="100" width="200" /></div>
              </FormGroup>
            </Col>
            {item.bank_verified == 2 && item?.bank_decline_reason?.length > 0 && (<Col md={6}>
              <FormGroup>
                <Label><strong>Decline Reason Of Bank Details</strong></Label>
                <div>{item?.bank_decline_reason || ''}</div>
              </FormGroup>
            </Col>)}
          </Row>
        </ModalBody>
        <ModalFooter>
          {(bank_verified != 'Approved' && bank_verified != 'Cancel By Admin') && <button type="button" className="btn btn-success pull-right" data-dismiss="modal" onClick={(e) => { updateBankStatus(1) }}>Approve</button>}
          {(bank_verified != 'Approved' && bank_verified != 'Cancel By Admin') && <button type="button" className="btn btn-danger pull-right" data-dismiss="modal" onClick={(e) => { setIs_reject(true) }}>Decline</button>}
          <button type="button" className="btn dark_btn" data-dismiss="modal" onClick={(e) => { setModal(false); }}>Close</button>
        </ModalFooter>
      </Modal>
      {is_reject && (<Modal isOpen={is_reject} toggle={e => { setIs_reject(false) }} className={"custom-modal"}>
        <ModalHeader toggle={e => { setIs_reject(false) }}>Decline Bank Request</ModalHeader>
        <ModalBody>
          <Row>
            <Col>
              <FormGroup>
                <Label><strong>Decline Reason</strong></Label>
                <div><input className="form-control" type={"text"} onChange={(e) => {
                  setReason(e.target.value)
                }} /></div>
                {error && reason.length == 0 && <p className="text-danger marginmessage">Decline Reason is required.</p>}
                {error && reason.length > 0 && reason.length < 15 && <p className="text-danger marginmessage">Decline Reason is minimum 15 characters required.</p>}
              </FormGroup>
            </Col>
          </Row>
        </ModalBody>
        <ModalFooter>
          <button type="button" className="btn btn-success" data-dismiss="modal" onClick={(e) => { if (reason != '') { updateBankStatus(0) } else { setError(true) } }}>Submit</button>
          <button type="button" className="btn btn-danger" data-dismiss="modal" onClick={(e) => { setIs_reject(false); }}>Close</button>
        </ModalFooter>
      </Modal>)}
    </div>
  );
}

export default View;
