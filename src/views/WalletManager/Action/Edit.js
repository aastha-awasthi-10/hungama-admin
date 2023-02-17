import React, { useState, useEffect } from 'react';
import Helper from '../../../constants/helper';
import apiUrl from '../../../constants/apiPath';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Label, FormGroup, Col, Row } from 'reactstrap';
import { ErrorMessage, useForm } from 'react-hook-form';

import useSession from 'react-session-hook';
import { useAlert } from 'react-alert';
import _ from "lodash";
import moment from "moment";
import Swal from "sweetalert2";

const Edit = (props) => {

    const session = useSession();
    const token = session.token;
    const alert = useAlert();
    const { register, handleSubmit, errors, watch } = useForm();

    const [modal, setModal] = useState(false);
    const [item, setItem] = useState({});
    const [fullname, setFullname] = useState({});
    const [WalletType, setType] = useState('');

    const updateWallet = async (data) => {

        if(!item.identity_verified){
            let SwalConfig = Helper.SwalConfig(`KYC not verified for this user, are you still want to continue?`);
            const result = await Swal.fire(SwalConfig);
            if(!result.value){
                return;
            }
        }
        
        let postJson = { id: item.id, amount: data.amount, WalletType: WalletType, updateType: data.type };
        console.log(postJson);
        let path = apiUrl.update_wallet;
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
    };

    useEffect(() => {
        setItem(props.item);
        setType(props.type);
        setFullname(props.item.full_name);
    }, [props]);
    return (
        <div className={"inline-btn"}>
            <span className={"btn btn-success pull-right cursor-pointer"} onClick={(e) => { setModal(true); }}>Edit</span>
            <Modal isOpen={modal} toggle={e => { setModal(false) }} className={"custom-modal "}>
                <ModalHeader toggle={e => { setModal(false) }}>Update Wallet</ModalHeader>
                <form className="mt-5" onSubmit={handleSubmit(updateWallet)}>
                    <ModalBody>
                        <Row>
                            <Col md={6}>
                                <FormGroup>
                                    <Label><strong>Full Name</strong></Label>
                                    <div>{fullname}</div>
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <Label><strong>Mobile</strong></Label>
                                    <div>{item.phone}</div>
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <Label><strong>User Amount</strong></Label>
                                    <div> {(WalletType == 'Free Cash') ? item.free_cash?.toFixed(2) : (WalletType == 'Deposit') ? item.deposit_amount?.toFixed(2) : (WalletType == 'Bonus') ? item.bonus?.toFixed(2) : item.winngs_amount?.toFixed(2)}</div>
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <Label><strong>Wallet Type</strong></Label>
                                    <div>{WalletType} Amount</div>
                                </FormGroup>
                            </Col>
                        </Row>
                        <FormGroup>
                    {/* <input type="number" name="amount" maxLength={"3"} min={"0"} steps={"0.01"} max={"99999999"} placeholder="Amount" autoComplete="off" className="form-control" ref={register({ required: 'Required' })} /> */}

                    <input type="number" name="amount" maxLength={"5"} min={"0"} step={"0.01"} max={"99999999"} placeholder="Amount" autoComplete="off" className="form-control" ref={register({ required: 'Required' })} />
                            {errors.amount && <p className="text-danger marginmessage">Amount is required</p>}
                        </FormGroup>
                        <FormGroup className={'mb-0'}>
                            <select type="select" name="type" className="form-control" defaultValue={item.status} ref={register({ required: 'Required' })}>
                                <option value="add">Add</option>
                                <option value="deduct">Deduct</option>
                            </select >
                            {errors.type && <p className="text-danger marginmessage">Type is required</p>}
                        </FormGroup>
                    </ModalBody>
                    <ModalFooter>
                        <button className={'btn btn-success ml-2'} type="submit" color="primary">Update <i className="fa fa-arrow-circle-up fa-lg" aria-hidden="true"></i></button>
                        <button type="button" className="btn dark_btn" data-dismiss="modal" onClick={(e) => { setModal(false); }}>Close</button>
                    </ModalFooter>
                </form>
            </Modal>
        </div >
    );
}

export default Edit;
