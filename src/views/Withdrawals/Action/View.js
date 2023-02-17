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
  const [modal, setModal] = useState(false);
  const [item, setItem] = useState({});
  const [fullname, setFullname] = useState({});

  useEffect(() => {
    setItem(props.item);
    setFullname(props.item.user_id.first_name + ' ' + props.item.user_id.last_name);
  }, [props]);
  return (
    <div className={"inline-btn"}>
      <Button className="btn circle_btn btn-sm mr-1" type="button" title="Status" onClick={(e) => { setModal(true); }}><i className="fa fa-eye" /></Button>
      <Modal isOpen={modal} toggle={e => { setModal(false) }} className={"custom-modal modal-lg"}>
        <ModalHeader toggle={e => { setModal(false) }}>Account Details</ModalHeader>
        <ModalBody>
          <Row>
            <Col md={6}>
              <FormGroup>
                <Label><strong>Transaction Id</strong></Label>
                <div>{item.id}</div>
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label><strong>Full Name</strong></Label>
                <div>{fullname}</div>
              </FormGroup>
            </Col>

            <Col md={6}>
              <FormGroup>
                <Label><strong>Transaction Amount</strong></Label>
                <div>{item.debit}</div>
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label><strong>Transaction Type</strong></Label>
                <div>{item.type}</div>
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label><strong>Create Date</strong></Label>
                <div>{moment(item.created).format('LL')}</div>
              </FormGroup>
            </Col>
            {item.modified !== "" && <Col md={6}>
              <FormGroup>
                <Label><strong>Modified Date</strong></Label>
                <div>{moment(item.modified).format('LL')}</div>
              </FormGroup>
            </Col>}
          </Row>
        </ModalBody>
        <ModalFooter>
          <button type="button" className="btn dark_btn" data-dismiss="modal" onClick={(e) => { setModal(false); }}>Close</button>
        </ModalFooter>
      </Modal>
    </div>
  );
}

export default View;
