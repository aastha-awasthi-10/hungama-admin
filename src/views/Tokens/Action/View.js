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
  const [preview, setPreview] = useState('');
  const [dob, setDob] = useState(new Date());
  // console.log(!_.isEmpty(props.item.image)?props.userImage + props.item.image:props.userImage + "userDefault.png");
  useEffect(() => {
    setItem(props.item);
    setPreview(props.item.token_image);
    
  }, [props.item]);

  return (
    <div className={"inline-btn"}>
      <Button className="btn circle_btn btn-sm mr-1" type="button" title="View Details" onClick={(e) => { setModal(true); }}><i className="fa fa-eye" /></Button>
      <Modal isOpen={modal} toggle={e => { setModal(false) }} className={"custom-modal modal-xl"}>
        <ModalHeader toggle={e => { setModal(false) }}>View</ModalHeader>
        <ModalBody>
          <Row>
            <Col md={6}>
              <FormGroup>
                <Label><strong>Token Name</strong></Label>
                <div>{item.token_name}</div>
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label><strong>Token Address</strong></Label>
                <div>{item.token_address}</div>
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label><strong>transaction fee</strong></Label>
                <div>{item.transaction_fee}</div>
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label><strong>minimum withdraw limit</strong></Label>
                <div>{item.minimum_withdraw_limit}</div>
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label><strong>Status</strong></Label>
                <div>{_.upperFirst(!_.isEmpty(item.status) ? item.status : 'active')}</div>
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label><strong>Create Date</strong></Label>
                <div>{moment(item.createdAt).format('LL')}</div>
              </FormGroup>
            </Col>
            {item.modified !== "" && <Col md={6}>
              <FormGroup>
                <Label><strong>Modified Date</strong></Label>
                <div>{moment(item.updatedAt).format('LL')}</div>
              </FormGroup>
            </Col>}
            <Col md={6}>
              <FormGroup>
                <Label><strong>Token Image</strong></Label>
                <div><img src={preview} width={100} /></div>
              </FormGroup>
            </Col>
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
