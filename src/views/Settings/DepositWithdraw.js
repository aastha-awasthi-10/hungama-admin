import React, {useContext, useEffect, useState} from 'react';
import Helper from '../../constants/helper';
import apiUrl from '../../constants/apiPath';
import {Button, Col, FormGroup, Label, Modal, ModalBody, ModalFooter, ModalHeader, Row} from 'reactstrap';
import {useAlert} from 'react-alert';
import useSession from 'react-session-hook';
import {ErrorMessage, useForm} from "react-hook-form";
import _ from "lodash";
import { GlobalStateContext } from "../../hooks/GlobalStateContext";

const DepositWithdraw = (props) => {

  const [globalState] = useContext(GlobalStateContext);
  const {register, handleSubmit, errors} = useForm();
  const session = useSession();
  const token = session.token;
  const alert = useAlert();
  const [modal, setModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [transaction, setTransaction] = useState("");
  const [label, setLabel] = useState("");

  const onAmountChange = (e) => {

    let current_balance = parseFloat(globalState.balance);
    let amount = parseFloat(e.target.value);
    if(!_.isNaN(amount)) {
      if(transaction === 'deposit') {

        document.getElementById("post_transaction_amount").value = current_balance + amount;
      } else if(transaction === 'withdraw') {
        document.getElementById("post_transaction_amount").value = current_balance - amount;
      }
    } else {
      document.getElementById("post_transaction_amount").value = current_balance;
    }
  };
  const onSubmit = async data => {

    setLoading(true);
    let postJson = { user_type: session.profile.user_type, user_id: session.profile.id, amount: parseFloat(data.amount), transaction_type: transaction, remarks: data.remarks };
    let path = apiUrl.admin_deposit_withdraw;
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

  useEffect(() => {

    setTransaction(props.transaction);
    setLabel(props.label);
  }, [props.item, props.transaction, props.label]);

  return (
    <div className={"inline-btn"}>
      <Button className="btn circle_btn mr-1" type="button" title="Status" onClick={(e) => { setModal(true);}}>{label}</Button>
      <Modal isOpen={modal} toggle={e => {setModal(false)}} className={"custom-modal"}>
        <ModalHeader toggle={e => {setModal(false)}}>{_.upperFirst(props.transaction)}</ModalHeader>
        <form id="depositform" onSubmit={handleSubmit(onSubmit)}>
          <ModalBody>
              <Row>
                <Col md={4}>
                  <FormGroup>
                    <Label className="btn-value">{session.profile.username}</Label>
                  </FormGroup>
                </Col>
                <Col md={4}>
                  <FormGroup>
                    <input type="text" className="form-control"  id={"current_balance"} disabled value={globalState.balance}/>
                  </FormGroup>
                </Col>
                <Col md={4}>
                  <FormGroup>
                    <input type="text" id="post_transaction_amount" className="form-control" placeholder="Total Amount" disabled />
                  </FormGroup>
                </Col>
                <Col md={4}>
                  <FormGroup>
                    <Label className="btn-value">Amount</Label>
                  </FormGroup>
                </Col>
                <Col md={8}>
                  <FormGroup>
                    <input type="number" name="amount" maxLength="10" className="form-control" placeholder="Amount" ref={register({required: 'Amount is required'})} onChange={onAmountChange}/>
                    <ErrorMessage errors={errors} name="amount">
                      {({ message }) => <p className={"text-danger"}>{message}</p>}
                    </ErrorMessage>
                  </FormGroup>
                </Col>
                <Col md={4}>
                  <FormGroup>
                    <Label className="btn-value">Remark</Label>
                  </FormGroup>
                </Col>
                <Col md={8}>
                  <FormGroup>
                    <input type={"text"} className="form-control" name="remarks" ref={register}/>
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
              &nbsp; Submit</button>
          </ModalFooter>
        </form>
      </Modal>
    </div>
  );
};

export default DepositWithdraw;
