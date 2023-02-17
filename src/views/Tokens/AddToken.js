import React, { useState, useEffect } from 'react';
import { ErrorMessage, useForm } from 'react-hook-form';
import Helper from '../../constants/helper';
import { useHistory } from "react-router-dom";
import apiUrl from '../../constants/apiPath';
import { Button, Card, CardBody, CardHeader, CardTitle, CardFooter, FormGroup, Label, Col, Row } from 'reactstrap';
import _ from 'lodash';
import { useAlert } from 'react-alert';
import useSession from 'react-session-hook';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const AddToken = (props) => {
  const session = useSession();
  let history = useHistory();
  const alert = useAlert();
  const { register, handleSubmit, errors, watch } = useForm();

  const [token] = useState(session.token);
  const [loading, setLoading] = useState(false);
  const [tokenPic, setTokenPic] = useState('');
  const [preview, setTokenPicPreview] = useState('');

  const onSubmit = async data => {
    setLoading(true);
    let formData = new FormData();
    let postJson = { token_name: data.token_name.trim(), token_address: data.token_address.trim(), transaction_fee: data.transaction_fee, minimum_withdraw_limit: data.minimum_withdraw_limit,token_type:data.token_type };
    formData.append('data', JSON.stringify(postJson));
    formData.append('token_icon', tokenPic);
    let path = apiUrl.add_token;
    const fr = await Helper.formPost(formData, path, token);
    const res = await fr.response.json();
    if (fr.status === 200) {
      if (res.success) {
        setLoading(false);
        props.history.push('/tokens');
        alert.success(res.msg);
      } else {
        alert.error(res.msg);
        setLoading(false);
      }
    } else {

      alert.error(res.error);
      setLoading(false);
    }
  };

  const onImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setTokenPicPreview(URL.createObjectURL(event.target.files[0]));
      setTokenPic(event.target.files[0]);
    }
  }

  useEffect(() => {
  }, []);

  return (
    <React.Fragment>
      <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
        <Card>
          <CardHeader>
            <CardTitle className="text-info"><h4>Add Token</h4></CardTitle>
          </CardHeader>
          <CardBody>
            <Row>
              <Col md={6}>
                <FormGroup>
                  <Label className={'col-md-2 pull-left mt-2'}>Token Name</Label>
                  <input type="text"  minLength={"3"} maxLength={"50"} name="token_name" placeholder="Token Name" autoComplete="off"
                    className="form-control col-md-8" ref={register({ required: 'Required' })} />
                  {errors.token_name && <p className="text-danger marginmessage">Token name is required</p>}
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label className={'col-md-2 pull-left mt-2'}>Token Address</Label>
                  <input type="text"  minLength={"30"} maxLength={"100"} name="token_address" placeholder="Token Address" autoComplete="off"
                    className="form-control col-md-8" ref={register({ required: 'Required' })} />
                  {errors.token_address && <p className="text-danger marginmessage">Token address is required</p>}
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label className={'col-md-2 pull-left mt-2'}>Transaction Fee</Label>
                  <input type="text" minLength={"1"} maxLength={"8"} name="transaction_fee" id={"transaction_fee"} className="form-control col-md-8" autoComplete="off" placeholder="Transaction Fee"
                    ref={register({ required: 'Transaction Fee Required' })} />
                  <ErrorMessage errors={errors} name="transaction_fee">
                    {({ message }) => <p className={"text-danger"}>{message}</p>}
                  </ErrorMessage>
                </FormGroup>
              </Col>
              
              <Col md={6}>
                <FormGroup>
                  <Label className={'col-md-2 pull-left mt-2'}>Withdraw Limit</Label>
                  <input type="text" minLength={"1"} maxLength={"50"} name="minimum_withdraw_limit" id={"minimum_withdraw_limit"} className="form-control col-md-8" autoComplete="off" placeholder="Minimum Withdraw Limit"
                    ref={register({ required: 'Minimum Withdraw Limit Required' })} />
                  <ErrorMessage errors={errors} name="minimum_withdraw_limit">
                    {({ message }) => <p className={"text-danger"}>{message}</p>}
                  </ErrorMessage>
                </FormGroup>
              </Col>

              <Col md={6}>
                <FormGroup>
                  <Label className={'col-md-2 pull-left mt-2'}>Token Icon</Label>
                  <input type="file" onChange={onImageChange} name="token_image" className="form-control  col-md-8" autoComplete="off" placeholder="Pic" />
                  <ErrorMessage errors={errors} name="token_image">
                    {({ message }) => <p className={"text-danger"}>{message}</p>}
                  </ErrorMessage>
                  <img id="target" className={'mt-3 rounded'} height={200} src={preview} />
                </FormGroup>
              </Col>

              <Col md={6}>
                <FormGroup>
                  <Label className={'col-md-3 pull-left mt-2'}>Token Type</Label>
                  <select name={'token_type'} className={"form-control col-md-6"} ref={register({ required: 'Required' })} >
                    <option value={''}>-- Token Type --</option>
                    <option value={'testnet'}>Test Net</option>
                    <option value={'mainnet'}>Main Net</option>
                  </select>
                  {errors.token_type && <p className="text-danger marginmessage">Token type is required</p>}
                </FormGroup>
              </Col>

            </Row>
          </CardBody>
          <CardFooter>
            <Button onClick={() => history.goBack()} className="dark_btn"><i className="fa fa-arrow-left" aria-hidden="true"></i> Back  </Button>
            <Button className={'ml-2'} type="submit" color="primary">Submit {loading === true ? <i className="fa fa-spinner fa-pulse fa-fw ml-1"></i> : <i className="fa fa-arrow-circle-right fa-lg" aria-hidden="true"></i>}</Button>
          </CardFooter>
        </Card>
      </form>
    </React.Fragment>
  );
}

export default AddToken;
