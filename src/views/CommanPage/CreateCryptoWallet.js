import React, { useState, useEffect } from 'react';
import Helper from '../../constants/helper';
import apiUrl from '../../constants/apiPath';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Label, FormGroup, Row, Col } from 'reactstrap';
import { useAlert } from 'react-alert';
import useSession from 'react-session-hook';
import Swal from "sweetalert2";
import { ErrorMessage, useForm } from "react-hook-form";
import { Link } from "react-router-dom";


const CreateCryptoWallet = (props) => {

  const { register, handleSubmit, errors, watch, setError } = useForm();
  const password = watch("password");
  const confirm_password = watch("confirm_password");
  const session = useSession();
  const token = session.token;
  const alert = useAlert();
  const [modal, setModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const CreateWallet = async (data) => {
    if (password !== confirm_password) {
      setError("confirm_password", "notMatch", "Password should match confirm password."); return;
    }
    setLoading(true);
    let id = props.item;
    let postJson = { user_wallet_password: password,user_id:id};
    let path = apiUrl.create_crypto_wallet;
    const fr = await Helper.post(postJson, path, token);
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

  useEffect(() => {
    // setItem(props.item);
  }, []);

  return (
    <div className={"inline-btn"}>
      <div className="ml-auto">
        <Link  onClick={(e) => { setModal(true); }} className="btn btn-primary">
          <i className="fa fa-plus mr-1"></i>
          Create Crypto Wallet
        </Link>
      </div>

      <Modal isOpen={modal} toggle={e => { setModal(false) }} className={"custom-modal"}>
        <ModalHeader toggle={e => { setModal(false) }}>Create Crypto Wallet</ModalHeader>
        <form id="depositform">
          <ModalBody>
            <Row>
              <Col md={4}>
                <FormGroup>
                  <Label className="btn-value">Password</Label>
                </FormGroup>
              </Col>
              <Col md={8}>
                <FormGroup>
                  <input type="password" name={"password"} className="form-control" id={"password"} placeholder={"New Password"}
                    ref={register({
                      required: 'Password is required',
                      validate: (value) => {
                        if (value == '') { return true }
                        // var paswd = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,30}$/;
                        var paswd = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,16}$/;
                        if (value.match(paswd)) {
                          return true;
                        } else {
                          return 'Password must have minimum 8 character with 1 lowercase 1 uppercase 1 digit and 1 special character.';
                        }
                      }
                    })}
                  />
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
                  <input type="password" name="confirm_password" maxLength="10" className="form-control" placeholder="Confirm Password"
                    ref={register({
                      validate: (value) => value === watch('password') || "Passwords don't match."
                    })} />
                  <ErrorMessage errors={errors} name="confirm_password">
                    {({ message }) => <p className={"text-danger"}>{message}</p>}
                  </ErrorMessage>
                </FormGroup>
              </Col>
            </Row>
          </ModalBody>
          <ModalFooter>
            <button type="button" className="btn dark_btn" data-dismiss="modal" onClick={(e) => { setModal(false); }}>Close</button>
            <button type="button" className="btn btn-success" onClick={(e)=>{CreateWallet(e)}} >
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

export default CreateCryptoWallet;
