import React, { useState, useEffect } from 'react';
import { ErrorMessage, useForm } from 'react-hook-form';
import Helper from '../../constants/helper';
import { useHistory } from "react-router-dom";
import apiUrl from '../../constants/apiPath';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Button, Card, CardBody, CardHeader, CardTitle, CardFooter, FormGroup, Label, Col, Row } from 'reactstrap';
import _ from 'lodash';
import { useAlert } from 'react-alert';
import useSession from 'react-session-hook';
import { useParams } from "react-router";
import moment from "moment";

const EditQuiz = (props) => {
  const session = useSession();
  let history = useHistory();
  const alert = useAlert();
  const { register, handleSubmit, errors, watch } = useForm();
  const [token] = useState(session.token);
  const [loading, setLoading] = useState(false);
  const [id, setId] = useState('');
  const [CouponStatus, setCouponStatus] = useState('');
  const [CouponData, setCouponData] = useState({});
  const [startdate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [type, setType] = useState('');
  const [coupon_type, setCouponType] = useState('');

  const onSubmit = async data => {
    setLoading(true);
    
    // let newStartDate = moment(startdate).startOf('day').format('LLLL');
    // let newEndDate  = moment(endDate).endOf('day').format('LLLL');

    let postJson = {
      id: id,
      coupon_code: data.coupon_code.trim(),
      type: data.type,
      coupon_type: data.coupon_type,
      flat_discount: data.flat_discount,
      min_add_amount: data.min_add_amount,
      min_discount: data.min_discount,
      max_discount: data.max_discount,
      cashback_percent: data.cashback_percent,
      usage_limit: data.usage_limit,
      limit_per_user: data.limit_per_user,
      description: data.description,
      start_date: startdate,
      end_date: endDate,
      status: data.status
    };
    let path = apiUrl.update_coupon;
    const fr = await Helper.put(postJson, path, token);
    const res = await fr.response.json();
    if (fr.status === 200) {
      if (res.success) {
        setLoading(false);
        props.history.push('/coupons');
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

  const maxLengthCheck = (object) => {
    if (object.target.value.length > object.target.maxLength) {
        object.target.value = object.target.value.slice(0, object.target.maxLength)
      }
    }
  const getData = async () => {
    const user_Id = session.profile.id;
    let path = apiUrl.get_coupon + '/' + `${props.match.params.id}`;
    const fr = await Helper.get(path, token);
    const res = await fr.response.json();
    if (fr.status === 200) {
      if (res.success) {
        setId(res.results.id);
        setCouponData(res.results);
        setEndDate(res.results.end_date);
        setStartDate(res.results.start_date);
        setCouponStatus(res.results.status);
        setType(res.results.type);
        setCouponType(res.results.coupon_type);
      } else {
        console.log(res.msg);
      }
    } else {
      console.log(res.msg);
    }
  };

  const handleStartDate = (date) => {
    setEndDate('');
    let newDate = date ? date : new Date();
    setStartDate(newDate);
  };
  const handleEndDate = (date) => {
    let newDate = date ? date : '';
    setEndDate(newDate);
  };

  const handleChange = async (e) => {
    if(e.target.name === 'type') {
      setType(e.target.value);
    }
  }

  useEffect(() => {
    getData();
  }, []);

  return (
    <React.Fragment>
      <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
        <Card>
          <CardHeader>
            <CardTitle className="text-info"><h4>Edit Coupon</h4></CardTitle>
          </CardHeader>
          <CardBody>
            <Row>
              <Col md={6}>
                <FormGroup>
                  <Label className={'col-md-3 pull-left mt-2'}>Coupon Code</Label>
                  <input type="text" name="coupon_code" placeholder="Coupon Code" autoComplete="off"
                    className="form-control col-md-6" defaultValue={CouponData.coupon_code} ref={register({ required: 'Required', pattern: /^\S*$/ })} />
                  {errors.coupon_code && <p className="text-danger marginmessage">Enter valid coupon code</p>}
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label className={'col-md-3 pull-left mt-2'}>Coupon Discount Type</Label>
                  <select onChange={handleChange} name={'type'} value={type} className={"form-control col-md-6"} ref={register({ required: 'Required' })} >
                    <option value={''}>-- Select Coupon Discount Type --</option>
                    <option value={'flat'}>Flat</option>
                    <option value={'percentage'}>Percentage</option>
                  </select>
                  {errors.type && <p className="text-danger marginmessage">Type is required</p>}
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label className={'col-md-3 pull-left mt-2'}>Coupon Type</Label>
                  <select onChange={handleChange} name={'coupon_type'} value={coupon_type} className={"form-control col-md-6"} ref={register({ required: 'Required' })} >
                    <option value={''}>-- Select Coupon Type --</option>
                    <option value={'bonus'}>Bonus</option>
                    <option value={'free_cash'}>Free Cash</option>
                  </select>
                  {errors.coupon_type && <p className="text-danger marginmessage">Coupon Type is required</p>}
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label className={'col-md-3 pull-left mt-2'}>Minimum Add Amount(INR)</Label>
                  <input type="number" name="min_add_amount" maxLength={"3"} min={"0"} onInput={maxLengthCheck} placeholder="Minimum Add Amount" autoComplete="off"
                    className="form-control col-md-6" defaultValue={CouponData.min_add_amount} ref={register({ required: 'Required', min: 0, maxLength: 7 })} />
                  {errors.min_add_amount && <p className="text-danger marginmessage">Minimum Add Amount is required</p>}
                </FormGroup>
              </Col>
              {type == 'percentage'?
              <>
              <Col md={6}>
                <FormGroup>
                  <Label className={'col-md-3 pull-left mt-2'}>Minimum Discount Amount(INR)</Label>
                  <input type="number" name="min_discount" maxLength={"3"} min={"1"} onInput={maxLengthCheck} placeholder="Minimum Discount Amount" autoComplete="off"
                    className="form-control col-md-6" defaultValue={CouponData.min_discount} ref={register({ required: 'Required', min: 0, maxLength: 7 })} />
                  {errors.min_discount && <p className="text-danger marginmessage">Minimum Discount Amount is required</p>}
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label className={'col-md-3 pull-left mt-2'}>Maximum Discount Amount (INR)</Label>
                  <input type="number" name="max_discount" maxLength={"3"} min={"1"} onInput={maxLengthCheck} placeholder="Maximum Discount Amount" autoComplete="off"
                    className="form-control col-md-6" defaultValue={CouponData.max_discount} ref={register({ required: 'Required', min: 0, maxLength: 7 })} />
                  {errors.max_discount && <p className="text-danger marginmessage">Maximum Discount Amount is required</p>}
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label className={'col-md-3 pull-left mt-2'}>Cashback Percent (%)</Label>
                  <input type="number" name="cashback_percent" maxLength={"3"} min={"1"} max={"100"} onInput={maxLengthCheck} placeholder="Cashback Percent (%)" autoComplete="off"
                    className="form-control col-md-6" defaultValue={CouponData.cashback_percent} ref={register({ required: 'Required', min: 0, max: 100, maxLength: 3 })} />
                  {errors.cashback_percent && <p className="text-danger marginmessage">Cashback Percent is required</p>}
                </FormGroup>
              </Col>
              </>
              :
              <Col md={6}>
                <FormGroup>
                  <Label className={'col-md-3 pull-left mt-2'}>Flat Discount Amount</Label>
                  <input type="number" name="flat_discount" maxLength={"3"} min={"1"} max={"100"} onInput={maxLengthCheck} placeholder="Flat Discount Amount" autoComplete="off"
                    className="form-control col-md-6" defaultValue={CouponData.flat_discount} ref={register({ required: 'Required', min: 0, max: 100, maxLength: 3 })} />
                  {errors.flat_discount && <p className="text-danger marginmessage">Flat Discount Amount is required</p>}
                </FormGroup>
              </Col>
              }
              <Col md={6}>
                <FormGroup>
                  <Label className={'col-md-3 pull-left mt-2'}>Status</Label>
                  <select name={'status'} value={CouponStatus} onChange={(e) => { setCouponStatus(e.target.value) }} className={"form-control col-md-6"} ref={register({ required: 'Required' })} >
                    <option value={''}>-- Select Coupon Type --</option>
                    <option value={'active'}>Active</option>
                    <option value={'inactive'}>Inactive</option>
                  </select>
                  {errors.status && <p className="text-danger marginmessage">Status is required</p>}
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label className={'col-md-3 pull-left mt-2'}>Limit Per User</Label>
                  <input type="number" name="limit_per_user" maxLength={"7"} min={"1"} placeholder="Limit Per User" autoComplete="off"
                    className="form-control col-md-6" defaultValue={CouponData.limit_per_user} ref={register({ required: 'Required' })} />
                  {errors.limit_per_user && <p className="text-danger marginmessage">Usage Limit is required</p>}
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label className={'col-md-3 pull-left mt-2'}>Start Date</Label>
                  <div className={"pull-left col-md-6 p-0 mb-3"}>
                    <DatePicker selected={startdate === '' ? null : new Date(startdate)} className="form-control" placeholderText=" Start Date"
                      dateFormat="dd/MM/yyyy"
                      minDate={new Date()}
                      onChange={handleStartDate}
                      disabledKeyboardNavigation
                      peekNextMonth
                      showMonthDropdown
                      showYearDropdown
                      required={true}
                      dropdownMode="select" />
                  </div>
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label className={'col-md-3 pull-left mt-2'}>Usage Limit</Label>
                  <input type="number" name="usage_limit" maxLength={"7"} min={"1"} placeholder="Usage Limit" autoComplete="off"
                    className="form-control col-md-6" defaultValue={CouponData.usage_limit} ref={register({ required: 'Required', min: 0, maxLength: 7 })} />
                  {errors.usage_limit && <p className="text-danger marginmessage">Usage Limit is required</p>}
                </FormGroup>
              </Col>              
              <Col md={6}>
                <FormGroup>
                  <Label className={'col-md-3 pull-left mt-2'}>End Date</Label>
                  <div className={"pull-left col-md-6 p-0 mb-3"}>
                    <DatePicker selected={endDate === '' ? null : new Date(endDate)} className="form-control" placeholderText=" End Date"
                      dateFormat="dd/MM/yyyy"
                      minDate={endDate ? new Date(endDate) : new Date()}
                      onChange={handleEndDate}
                      disabledKeyboardNavigation
                      peekNextMonth
                      showMonthDropdown
                      showYearDropdown
                      required={true}
                      dropdownMode="select" />
                  </div>
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                <Label className={'col-md-3 pull-left mt-2'}>Description</Label>
                  <textarea defaultValue={CouponData.description} name="description" placeholder="Description" autoComplete="off"
                      className="form-control col-md-6" ref={register({ required: 'Required' })} />
                  {errors.description && <p className="text-danger marginmessage">Description is required</p>}
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

export default EditQuiz;
