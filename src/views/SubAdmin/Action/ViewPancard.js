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

  const updateBankStatus = async (panStatus) => {
    let postJson = { id: ID, pan_verified: panStatus };
    let path = apiUrl.update_pan_status;
    const fr = await Helper.post(postJson, path, token);
    const res = await fr.response.json();
    if (fr.status === 200) {
      if (res.success) {
        props.refreshData();
        alert.success(res.msg);
        setModal(false);
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
        <ModalHeader toggle={e => { setModal(false) }}>View</ModalHeader>
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
                <div><img src={props.pan_img + item.pan_image || ''} height="100" width="200" /></div>
              </FormGroup>
            </Col>
          </Row>
        </ModalBody>
        <ModalFooter>
          {(pan_verified != 'Approved' && pan_verified != 'Cancel By Admin')   && <button type="button" className="btn btn-success pull-right" data-dismiss="modal" onClick={(e) => { updateBankStatus(1) }}>Approve</button>}
          {(pan_verified != 'Approved' && pan_verified != 'Cancel By Admin') && <button type="button" className="btn btn-danger pull-right" data-dismiss="modal" onClick={(e) => { updateBankStatus(0) }}>Decline</button>}
          <button type="button" className="btn dark_btn" data-dismiss="modal" onClick={(e) => { setModal(false); }}>Close</button>
        </ModalFooter>
      </Modal>
    </div>
  );
}

export default View;
