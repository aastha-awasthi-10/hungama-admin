import React, { useState, useEffect } from 'react';
import Helper from '../../../constants/helper';
import apiUrl from '../../../constants/apiPath';
import { useHistory } from "react-router-dom";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Label, FormGroup, Row, Col } from 'reactstrap';
import { useAlert } from 'react-alert';
import useSession from 'react-session-hook';
import Swal from "sweetalert2";
import { ErrorMessage, useForm } from "react-hook-form";

const BotInput = (props) => {

  const { register, handleSubmit, errors, watch, setError } = useForm();
  const password = watch("password");
  const confirm_password = watch("confirm_password");
  const session = useSession();
  let history = useHistory();
  const token = session.token;
  const alert = useAlert();
  const [modal, setModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit = async data => {
    setLoading(true);
    let postJson = { bot_count: data.bot_count };
    let path = apiUrl.add_bot_users;
    const fr = await Helper.post(postJson, path, token);
    const res = await fr.response.json();
    if (fr.status === 200) {
      if (res.success) {
        setLoading(false);
        alert.success(res.msg);
        setModal(false);
        props.refreshData();
      } else {
        alert.error(res.msg)
      }
    } else {
      alert.error(res.error);
    }
    setLoading(false);
  };

  const maxLengthCheck = (object) => {
    if (object.target.value.length > object.target.maxLength) {
      object.target.value = object.target.value.slice(0, object.target.maxLength)
    }
  }

  return (
    <div className={"inline-btn"}>
      <Button className="btn btn-warning btn-sm mr-1" type="button" title="No Of Bots" onClick={(e) => { setModal(true); }}>Add Bot Users</Button>
      <Modal isOpen={modal} toggle={e => { setModal(false) }} className={"custom-modal"}>
        <ModalHeader toggle={e => { setModal(false) }}>No of Bots</ModalHeader>
        <form id="depositform" onSubmit={handleSubmit(onSubmit)}>
          <ModalBody>
            <Row>
              <Col md={4}>
                <FormGroup>
                  <Label className="btn-value">Bot Count</Label>
                </FormGroup>
              </Col>
              <Col md={8}>
                <FormGroup>
                  <input type="number" onInput={maxLengthCheck} maxLength={"4"} name={"bot_count"} className="form-control" id={"current_balance"} placeholder={"Bot Count"}
                    ref={register({
                      required: 'Bot Count is required',
                    })}
                  />
                  <ErrorMessage errors={errors} name="password">
                    {({ message }) => <p className={"text-danger"}>{message}</p>}
                  </ErrorMessage>
                </FormGroup>
              </Col>
            </Row>
          </ModalBody>
          <ModalFooter>
            <button type="button" className="btn btn-danger" data-dismiss="modal" onClick={(e) => { setModal(false); }}>Close</button>
            <button type="submit" className="btn btn-success" data-dismiss="modal">
              {
                loading ? <i className="fa fa fa-refresh fa-spin"></i> : null
              }
              &nbsp;Submit</button>
          </ModalFooter>
        </form>
      </Modal>
    </div>
  );
}

export default BotInput;
