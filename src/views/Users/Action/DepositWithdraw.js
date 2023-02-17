import React, {useEffect, useState} from 'react';
import Helper from '../../../constants/helper';
import apiUrl from '../../../constants/apiPath';
import {Button, Col, FormGroup, Label, Modal, ModalBody, ModalFooter, ModalHeader, Row} from 'reactstrap';
import {useAlert} from 'react-alert';
import useSession from 'react-session-hook';
import {ErrorMessage, useForm} from "react-hook-form";
import _ from "lodash";

const DepositWithdraw = (props) => {

  const {register, handleSubmit, errors} = useForm();
  const session = useSession();
  const token = session.token;
  const alert = useAlert();
  const [modal, setModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [item, setItem] = useState({});
  const [transaction, setTransaction] = useState("");
  const [label, setLabel] = useState("");

  const onAmountChange = (e) => {

    let current_balance = parseFloat(item.balance);
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
    let postJson = { user_type: session.profile.user_type, requester_user_type: 'client', user_id: item.id, amount: parseFloat(data.amount), transaction_type: transaction, remarks: data.remarks };
    let path = '';
    if(transaction === 'deposit') {
      path = apiUrl.balance_deposit;
    } else if(transaction === 'withdraw') {
      path = apiUrl.balance_withdraw;
    }
    const fr = await Helper.put(postJson, path, token);
    setLoading(false);
    const res = await fr.response.json();
    if (fr.status === 200) {
      if (res.success) {
        alert.success(res.msg);
        props.refreshData();
        setModal(false);
        setLoading(false);
      } else {
        alert.error(res.msg)
      }
    } else {
      alert.error(res.error);
    }
  };

  useEffect(() => {
      setItem(props.item);
    setTransaction(props.transaction);
    setLabel(props.label);
  }, [props.item, props.transaction, props.label]);

  return (
    <div className={"inline-btn"}>
      <Button className="btn circle_btn btn-sm mr-1" type="button" title="Status" onClick={(e) => { setModal(true);}}>{label}</Button>
      <Modal isOpen={modal} toggle={e => {setModal(false)}} className={"custom-modal"}>
        <ModalHeader toggle={e => {setModal(false)}}>{_.upperFirst(props.transaction)}</ModalHeader>
        <form id="depositform" onSubmit={handleSubmit(onSubmit)}>
          <ModalBody>
              <Row>
                <Col md={4}>
                  <FormGroup>
                    <Label className="btn-value">{item.name}</Label>
                  </FormGroup>
                </Col>
                <Col md={4}>
                  <FormGroup>
                    <input type="text" className="form-control"  id={"current_balance"} disabled value={item.balance}/>
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
