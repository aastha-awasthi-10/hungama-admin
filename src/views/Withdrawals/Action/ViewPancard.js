import React, { useState, useEffect } from 'react';
import Helper from '../../../constants/helper';
import apiUrl from '../../../constants/apiPath';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Label, FormGroup, Col, Row } from 'reactstrap';
import { useAlert } from 'react-alert';
import useSession from 'react-session-hook';
import Swal from "sweetalert2";
import _ from "lodash";
import moment from "moment";

const View = (props) => {

  const session = useSession();
  const alert = useAlert();
  const [token] = useState(session.token);
  const [modal, setModal] = useState(false);
  const [item, setItem] = useState({});
  const [ID, setID] = useState('');
  const [pan_verified, setPanverified] = useState('');
  const [error, setError] = useState(false);
  const [reason, setReason] = useState('');
  const [is_reject, setIs_reject] = useState(false);
  const [pan_image, setPanImage] = useState('');
  const updateBankStatus = async (panStatus) => {
    let postJson = { id: ID, pan_verified: panStatus ,reason};
    let path = apiUrl.update_pan_status;
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
      setPanImage(props.pan_img);
      console.log("item",props.item)
      setID(props.item);
      renderSwitch(props.item.pan_verified);
    }
  }, [props]);

  const renderSwitch = async (val) => {
    if (val == 0)
      setPanverified('Not Uploaded');
    else if (val == 1)
      setPanverified('In Review');
    else if (val == 2)
      setPanverified('Cancel By Admin');
    else if (val == 3)
      setPanverified('Approved');
  };

  return (
    <div className={"inline-btn"}>
     <Button className="btn circle_btn btn-sm mr-1" type="button" title="Pan Card Status" onClick={(e) => { setModal(true); }}><i className="fa fa-id-card" /></Button>
      <Modal isOpen={modal} toggle={e => { setModal(false) }} className={"custom-modal"}>
        <ModalHeader toggle={e => { setModal(false) }}>Pan Card Details</ModalHeader>
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
                <Label><strong>Pan Name</strong></Label>
                <div>{item.pan_name || ''}</div>
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label><strong>Pan Number</strong></Label>
                <div>{item.pan_number || ''}</div>
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label><strong>Status</strong></Label>
                <div>{pan_verified || 'Not Uploaded Yet'}</div>
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label><strong>Pan Image</strong></Label>
                
                <div><img src={item.pan_image? props.pan_img + item.pan_image : props.pan_img + 'no_image.jpg'} height="100" width="200" /></div>
              </FormGroup>
            </Col>
            {item.pan_verified == 2 && item?.pan_decline_reason?.length > 0 && (<Col md={6}>
              <FormGroup>
                <Label><strong>Decline Reason Of Pan Details</strong></Label>
                <div>{item?.pan_decline_reason || ''}</div>
              </FormGroup>
            </Col>)}
          </Row>
        </ModalBody>
        <ModalFooter>
          {(pan_verified != 'Approved' && pan_verified != 'Cancel By Admin')   && <button type="button" className="btn btn-success pull-right" data-dismiss="modal" onClick={(e) => { updateBankStatus(1) }}>Approve</button>}
          {(pan_verified != 'Approved' && pan_verified != 'Cancel By Admin') && <button type="button" className="btn btn-danger pull-right" data-dismiss="modal" onClick={(e) => { setIs_reject(true) }}>Decline</button>}
          <button type="button" className="btn dark_btn" data-dismiss="modal" onClick={(e) => { setModal(false); }}>Close</button>
        </ModalFooter>
      </Modal>
      {is_reject && (<Modal isOpen={is_reject} toggle={e => { setIs_reject(false) }} className={"custom-modal"}>
        <ModalHeader toggle={e => { setIs_reject(false) }}>Decline Pan Card Request</ModalHeader>
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
