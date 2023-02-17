import React, { useState, useEffect } from 'react';
import Helper from './../../constants/helper';
import apiUrl from './../../constants/apiPath';
import {Button, Modal, ModalHeader, ModalBody, ModalFooter, Label, FormGroup, Row, Col} from 'reactstrap';
import {useAlert} from 'react-alert';
import useSession from 'react-session-hook';
import Swal from "sweetalert2";
import {ErrorMessage, useForm} from "react-hook-form";

const ChangePassword = (props) => {

  const {register, handleSubmit, errors, watch, setError} = useForm();
  const password = watch("password");
  const confirm_password = watch("confirm_password");
  const session = useSession();
  const token = session.token;
  const alert = useAlert();
  const [modal, setModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [item, setItem] = useState({});

  const onSubmit = async data => {
    if(password !== confirm_password) {
      setError("confirm_password", "notMatch", "Password should match confirm password."); return ;
    }
    setLoading(true);  
    let postJson = { new_password: data.password, user_type: 'admin' };
    let path = apiUrl.change_Password;
    const fr = await Helper.put(postJson, path, token);
    const res = await fr.response.json();
    if (fr.status === 200) {
      if (res.success) {
        alert.success(res.msg);
        setModal(false);      
      } else {
        alert.error(res.msg)
      }
    } else {
      alert.error(res.error);
    }
    setLoading(false);
  }; 

  return (
    <div className={"inline-btn"}>
      <Button className="btn circle_btn btn-sm mr-1" type="button" title="Status" onClick={(e) => { setModal(true);}}>P</Button>
      <Modal isOpen={modal} toggle={e => {setModal(false)}} className={"custom-modal"}>
        <ModalHeader toggle={e => {setModal(false)}}>Change Status</ModalHeader>
        <form id="depositform" onSubmit={handleSubmit(onSubmit)}>
          <ModalBody>
            <Row>
              <Col md={4}>
                <FormGroup>
                  <Label className="btn-value">New Password</Label>
                </FormGroup>
              </Col>
              <Col md={8}>
                <FormGroup>
                  <input type="password" name={"password"} className="form-control"  id={"current_balance"} placeholder={"New Password"} ref={register({required: 'New Password is required'})}/>
                  <ErrorMessage errors={errors} name="password">
                    {({ message }) => <p className={"text-danger"}>{message}</p>}
                  </ErrorMessage>
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md={4}>
                <FormGroup>
                  <Label className="btn-value">Confirm Password</Label>
                </FormGroup>
              </Col>
              <Col md={8}>
                <FormGroup>
                  <input type="password" name="confirm_password" maxLength="10" className="form-control" placeholder="Confirm Password" ref={register({required: 'Confirm Password is required'})}/>
                  <ErrorMessage errors={errors} name="confirm_password">
                    {({ message }) => <p className={"text-danger"}>{message}</p>}
                  </ErrorMessage>
                </FormGroup>
              </Col>
            </Row>
          </ModalBody>
          <ModalFooter>
            <button type="button" className="btn dark_btn" data-dismiss="modal" onClick={(e) => { setModal(false); }}>Close</button>
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

export default ChangePassword;
