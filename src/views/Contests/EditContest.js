
import React, { useState, useEffect } from 'react';
import { ErrorMessage, useForm } from 'react-hook-form';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// import { i18n } from 'element-react'
// import locale from 'element-react/src/locale/lang/en'
// import { DateRangePicker } from 'element-react';
// import 'element-theme-default';

import Helper from '../../constants/helper';
import { useHistory } from "react-router-dom";
import apiUrl from '../../constants/apiPath';
import { Button, Card, CardBody, CardHeader, CardTitle, CardFooter, FormGroup, Label, Col, Row } from 'reactstrap';
import _ from 'lodash';
import { useAlert } from 'react-alert';
import useSession from 'react-session-hook';
import { useParams } from "react-router";
import moment from "moment";
// i18n.use(locale);

const EditBanner = (props) => {
  const session = useSession();
  let history = useHistory();
  const alert = useAlert();
  const { register, handleSubmit, errors, watch } = useForm();
  const [token] = useState(session.token);
  const [loading, setLoading] = useState(false);
  const [startdate, setStartDate] = useState('');
  const [enddate, setEndDate] = useState('');
  const [id, setId] = useState('');
  const [enteryFee, setEntryFee] = useState(0);
  const [winAmount, setwinAmount] = useState(0);
  const [adminProfit, setadminProfit] = useState(0);
  const [usersLimit, setUsersLimit] = useState(1);
  const [winAmountDisable, setwinAmountDisable] = useState(false);
  const [adminProfitDisable, setadminProfitDisable] = useState(false);
  const [BonsDisable, setBonsDisable] = useState(false);
  const [category, setCategory] = useState([]);
  const [CategoryId, setCategoryId] = useState('');
  const [contestLanguage, setContestLanguage] = useState('');
  const [contestType, setContestType] = useState('');
  const [quizData, setQuizData] = useState({});
  const [bonus, setBonus] = useState(0);


  const getCategory = async () => {
    const itemsPerPage = 100;
    let path = apiUrl.get_active_categories;
    const fr = await Helper.get(path, token);
    const res = await fr.response.json();
    if (fr.status === 200) {
      if (res.success) {
        setCategory(res.results || []);
      } else {
        console.log(res.msg);
      }
    } else {
      console.log(res.error);
    }

  }
  const handleStartDate = (date) => {
    setEndDate('');
    let newDate = date ? date : new Date();
    setStartDate(newDate);
  };
  const handleEndDate = (date) => {
    let endTimeStamp = new Date(date).getTime();
    let startTimeSt = new Date(startdate).getTime();
    if (endTimeStamp < startTimeSt) {
      alert.error("End date time should be greater then start date.");
      setEndDate('');
      return false;
    }
    let newDate = date ? date : '';
    setEndDate(newDate);
  };

  const onSubmit = async data => {
    setLoading(true);
    let postJson = {
      id: id,
      name: data.name.trim(),
      questions_count: data.questions_count,
      category_id: data.category,
      contest_language: data.contest_language,
      contest_type: data.contest_type,
      entry_fee: data.entry_fee,
      description: data.description,
      contest_rules: data.contest_rules,
      winning_amount: data.winning_amount,
      admin_profit: adminProfit,
      bonus: bonus,
      users_limit: usersLimit,
      difficulty_level: data.difficulty_level,
      start_date: startdate,
      end_date: enddate
    };
    let path = apiUrl.update_contest;
    const fr = await Helper.put(postJson, path, token);
    const res = await fr.response.json();
    if (fr.status === 200) {
      if (res.success) {
        setLoading(false);
        props.history.push('/contests');
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

  const getData = async () => {
    const user_Id = session.profile.id;
    let path = apiUrl.get_contest + '/' + `${props.match.params.id}`;
    const fr = await Helper.get(path, token);
    const res = await fr.response.json();
    if (fr.status === 200) {
      if (res.success) {
        setId(res.results.id);
        setQuizData(res.results);
        setEntryFee(res.results.entry_fee);
        setBonus(res.results.bonus);
        setwinAmount(res.results.winning_amount);
        setCategoryId(res.results.category_id.id);
        setContestLanguage(res.results.contest_language);
        setContestType(res.results.contest_type);
        setadminProfit(res.results.admin_profit);
        setStartDate(res.results.start_date);
        setEndDate(res.results.end_date);
        setUsersLimit(res.results.users_limit);
      } else {
        console.log(res.msg);
      }
    } else {
      console.log(res.msg);
    }
  };

  const handleType = async (e) => {
    let type = e.target.value;
    if (type == 'free') {
      setEntryFee(0);
      setwinAmount(0);
      setadminProfit(0);
      setwinAmountDisable(true);
      setadminProfitDisable(true);
      setBonsDisable(true);
    } else {
      setEntryFee(0);
      setwinAmount(0);
      setadminProfit(0);
      setwinAmountDisable(false);
      setadminProfitDisable(false);
      setBonsDisable(false);
    }
  }

  const handleWinningChange = async (e) => {
    let win_amount = parseInt(e.target.value);
    let entryFee = (win_amount + (win_amount * adminProfit / 100)) / usersLimit
    setEntryFee(parseFloat(entryFee).toFixed(2) || 0);
    setwinAmount(win_amount || '');
  }
  const handleAdminProfitChange = async (e) => {
    let admin_profit = parseFloat(e.target.value);
    let entryFee = (winAmount + (winAmount * admin_profit / 100)) / usersLimit
    setEntryFee(parseFloat(entryFee).toFixed(2) || 0);
    setadminProfit(admin_profit || '');
  }

  const handleUsersLimitChange = async (e) => {
    let users_limit = parseInt(e.target.value);
    let entryFee = (winAmount + (winAmount * adminProfit / 100)) / users_limit
    setEntryFee(parseFloat(entryFee).toFixed(2) || 0);
    setUsersLimit(users_limit);
  }


  useEffect(() => {
    getData();
    getCategory();
  }, []);

  return (
    <React.Fragment>
      <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
        <Card>
          <CardHeader>
            <CardTitle className="text-info"><h4>Edit Contest</h4></CardTitle>
          </CardHeader>
          <CardBody>
            <Row>
              <Col md={6}>
                <FormGroup>
                  <Label className={'col-md-3 pull-left mt-2'}>Contest Name</Label>
                  <input type="text" name="name" placeholder="Contest Name" autoComplete="off"
                    className="form-control col-md-6" defaultValue={quizData.name} ref={register({ required: 'Required' })} />
                  {errors.title && <p className="text-danger marginmessage">Contest Name is required</p>}
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label className={'col-md-3 pull-left mt-2'}>Contest Category</Label>
                  <select name={'category'} className={"form-control col-md-6"} value={CategoryId} onChange={(e) => setCategoryId(e.target.value)} ref={register({ required: 'Required' })}>
                    <option value={''}>-- Select Contest Type --</option>
                    {category.map((item, key) => {
                      return <option key={key} value={item.id}>{item.title}</option>
                    })};
                  </select>
                  {errors.title && <p className="text-danger marginmessage">Contest Category is required</p>}
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label className={'col-md-3 pull-left mt-2'}>No. Of Question</Label>
                  <input type="number" name="questions_count" maxLength={"3"} min={"1"} max={"999"} placeholder="No. of Question" autoComplete="off"
                    className="form-control col-md-6" defaultValue={quizData.questions_count} ref={register({ required: 'Required' })} />
                  {errors.title && <p className="text-danger marginmessage">No. of Question is required</p>}
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label className={'col-md-3 pull-left mt-2'}>Contest Language</Label>
                  <select name={'contest_language'} className={"form-control col-md-6"} value={contestLanguage} onChange={(e) => setContestLanguage(e.target.value)} ref={register({ required: 'Required' })}>
                    <option value={''}>-- Select Contest Language --</option>
                    <option value={'english'}>English</option>
                    <option value={'hindi'}>Hindi</option>
                    <option value={'english_hindi'}>Hindi & English</option>
                  </select>
                  {errors.title && <p className="text-danger marginmessage">Contest Language is required</p>}
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label className={'col-md-3 pull-left mt-2'}>Contest Type</Label>
                  <select name={'contest_type'} disabled className={"form-control col-md-6"} value={contestType} onChange={(e) => setContestType(e.target.value)} ref={register({ required: 'Required' })} onChange={(e) => { handleType(e) }}>
                    <option value={''}>-- Select Contest Type --</option>
                    <option value={'free'}>Free</option>
                    <option value={'paid'}>Paid</option>
                  </select>
                  {errors.title && <p className="text-danger marginmessage">Contest Type is required</p>}
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label className={'col-md-3 pull-left mt-2'}>Difficulty Level </Label>
                  <input type="number" name="difficulty_level" defaultValue={quizData.difficulty_level} maxLength={"3"} min={"0"} max={"20"} placeholder="Difficulty Level" autoComplete="off"
                    className="form-control col-md-6" ref={register({ required: 'Required' })} />
                  {errors.title && <p className="text-danger marginmessage">Difficulty Level is required</p>}
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label className={'col-md-3 pull-left mt-2'}>Small Description</Label>
                  <textarea name="description" placeholder="Small Description..." autoComplete="off" value={quizData.description} className="form-control col-md-6" ref={register({ required: 'Required' })} />
                  {errors.title && <p className="text-danger marginmessage">Description is required</p>}
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label className={'col-md-3 pull-left mt-2'}>Contest Rules</Label>
                  <textarea name="contest_rules" placeholder="Contest Rules..." autoComplete="off" value={quizData.contest_rules} className="form-control col-md-6" ref={register({ required: 'Required' })} />
                  {errors.title && <p className="text-danger marginmessage">Contest Rules is required</p>}
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label className={'col-md-3 pull-left mt-2'}>Total Winning Amount</Label>
                  <input type="number" name="winning_amount" maxLength={"3"} min={"0"}
                    value={winAmount} disabled onChange={e => { handleWinningChange(e) }} placeholder="Total Winning Amount" autoComplete="off"
                    className="form-control col-md-6" ref={register({ required: 'Required' })} />
                  {errors.title && <p className="text-danger marginmessage">Total Winning Amount is required</p>}
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label className={'col-md-3 pull-left mt-2'}>Admin Profilt (%)</Label>
                  <input type="number" name="admin_profit" maxLength={"3"} min={"0"} step={"0.01"}
                    value={adminProfit} disabled={adminProfitDisable} onChange={e => { handleAdminProfitChange(e) }} placeholder="Admin Profilt" autoComplete="off"
                    className="form-control col-md-6" ref={register({ required: 'Required' })} />
                  {errors.title && <p className="text-danger marginmessage">Admin Profilt is required</p>}
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label className={'col-md-3 pull-left mt-2'}>Users Limit</Label>
                  <input type="number" name="users_limit" maxLength={"3"} min={"0"}
                    value={usersLimit} onChange={e => { handleUsersLimitChange(e) }} placeholder="Users Limit" autoComplete="off"
                    className="form-control col-md-6" ref={register({ required: 'Required' })} />
                  {errors.title && <p className="text-danger marginmessage">Users Limit is required</p>}
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label className={'col-md-3 pull-left mt-2'}>Entry Fee</Label>
                  <input type="number" name="entry_fee" maxLength={"3"} min={"0"}
                    value={enteryFee} disabled onChange={e => { setEntryFee(e.target.value) }} placeholder="Entry Fee" autoComplete="off"
                    className="form-control col-md-6" ref={register({ required: 'Required' })} />
                  {errors.title && <p className="text-danger marginmessage">Entry Fee is required</p>}
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label className={'col-md-3 pull-left mt-2'}>Start Date</Label>
                  <div className={"pull-left col-md-6 p-0 mb-3"}>
                    <DatePicker selected={startdate === '' ? null : new Date(startdate)} className="form-control" placeholderText=" Start Date"
                      dateFormat="dd/MM/yyyy h:mm aa"
                      showTimeSelect
                      timeFormat="HH:mm"
                      timeIntervals={15}
                      timeInputLabel="Time:"                      
                      minDate={new Date()}
                      onChange={handleStartDate}
                      peekNextMonth
                      showMonthDropdown
                      showYearDropdown
                      dropdownMode="select"
                      required={true} />
                  </div>
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label className={'col-md-3 pull-left mt-2'}>End Date</Label>
                  <div className={"pull-left col-md-6 p-0 mb-3"}>
                    <DatePicker selected={enddate === '' ? null : new Date(enddate)} className="form-control" placeholderText=" End Date"
                      dateFormat="dd/MM/yyyy h:mm aa"
                      showTimeSelect
                      timeFormat="HH:mm"
                      timeIntervals={15}
                      timeInputLabel="Time:"                      
                      minDate={startdate ? new Date(startdate) : new Date()}
                      onChange={handleEndDate}
                      peekNextMonth
                      showMonthDropdown
                      showYearDropdown
                      dropdownMode="select"
                      required={true} />
                  </div>
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label className={'col-md-3 pull-left mt-2'}>Bonus (%)</Label>
                  <input type="number" name="bonus" maxLength={"5"} min={"0"} step={"0.01"} disabled
                    value={bonus} onChange={e => { setBonus(e.target.value) }} placeholder="Bonus used" autoComplete="off"
                    className="form-control col-md-6" ref={register({ required: 'Required' })} />
                  {errors.bonus && <p className="text-danger marginmessage">Bonus is required</p>}
                </FormGroup>
              </Col>
              {/* <Col md={6}>
                <Label className={'col-md-3 pull-left mt-2'}>End Date</Label>
                <div className="source">
                  <div className="block">
                    <span className="demonstration">Default</span>
                    <DateRangePicker
                      isShowTime={true}
                      value={startdate}
                      placeholder="Pick a range"
                      onChange={date => {
                        console.debug('DateRangePicker1 changed: ', date)
                        handleStartChange(date);
                      }}
                    />
                  </div>
                </div>
              </Col> */}
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

export default EditBanner;
