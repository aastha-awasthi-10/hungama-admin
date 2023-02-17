import React, { useState, useEffect } from 'react';
import { ErrorMessage, useForm } from 'react-hook-form';
import DatePicker from "react-datepicker";
import setHours from "date-fns/setHours";
import setMinutes from "date-fns/setMinutes";
import "react-datepicker/dist/react-datepicker.css";
import Helper from '../../constants/helper';
import { useHistory } from "react-router-dom";
import apiUrl from '../../constants/apiPath';
import { Button, Card, CardBody, CardHeader, Table, CardTitle, CardFooter, FormGroup, Label, Col, Row } from 'reactstrap';
import _ from 'lodash';
import { useAlert } from 'react-alert';
import useSession from 'react-session-hook';
import Swal from "sweetalert2";
var moment = require('moment');
var converter = require('number-to-words');

const AddContest = (props) => {
  const session = useSession();
  let history = useHistory();
  const alert = useAlert();
  // const { register, handleSubmit, errors, watch,setValue } = useForm();
  const { register, handleSubmit, setValue, errors, watch } = useForm({ mode: 'onBlur', souldFocusError: true, defaultValues: {} });
  const [settingData, setSettingData] = useState({ referral_amount: 0, contest_admin_commission: 0, quiz_admin_commission: 0 });
  const [token] = useState(session.token);
  const [loading, setLoading] = useState(false);
  const [startdate, setStartDate] = useState('');
  const [enddate, setEndDate] = useState('');

  const [enteryFee, setEntryFee] = useState(0);
  const [winAmount, setwinAmount] = useState(0);
  const [plateFormFee, setPlateFormFee] = useState('0');
  const [GST, setGST] = useState('18');
  const [totalAdminFee, setTotalAdminFee] = useState('0');

  const [usersLimit, setUsersLimit] = useState(1);
  const [adminProfitDisable, setadminProfitDisable] = useState(false);
  const [winAmountDisable, setwinAmountDisable] = useState(false);
  const [category, setCategory] = useState([]);
  const [mainForm, SetMainForm] = useState(true);
  const [breakUpForm, SetBreakUpForm] = useState(false);
  const [lastRank, setLastRank] = useState(0);
  const [contestId, setContestId] = useState(0);
  const [total_percentage, setTotalPercentage] = useState(0);
  const [remaining_amount, setRemainingAmount] = useState(0);
  const [bonus, setBonus] = useState(0);
  const [max_team_join_count, setMaxTeamJoinCount] = useState('');
  const [confirm_winning, setConfirmWinning] = useState(false);
  const [auto_create, setAutoCreate] = useState(false);
  const [join_multiple_team, setJoinMultiple] = useState(false);
  const [cryptotokenvalue, setCryptoTokenValue] = useState('');
  const [cryptotokenname, setCryptoTokenName] = useState('');
  const [tokenvisible, settokenVisible] = useState(false);
  const [user_wallet_password, setUserWalletPassword] = useState(false);


  const [rows, setRows] = useState([{ is_completed: false, start_rank: 1, end_rank: '', each_percentage: 0, each_price: 0, total_percentage: 0, total_price: 0, rand: 1 }]);

  const onSubmit = async data => {
    setLoading(true);
    let postJson = {
      name: data.name.trim(),
      category_id: data.category,
      contest_type: data.contest_type,
      entry_fee: parseFloat(data.entry_fee),
      winning_amount: parseFloat(data.winning_amount),
      admin_profit: totalAdminFee,
      plateform_Fee: plateFormFee,
      users_limit: usersLimit,
      bonus: bonus,
      confirm_winning: confirm_winning,
      auto_create: auto_create,
      join_multiple_team: join_multiple_team,
      max_team_join_count: max_team_join_count,
      token_address: cryptotokenvalue,
      token_name: cryptotokenname,
      user_id: session.profile._id
    };
    // console.log("postJson",postJson);
    // return
    let path = apiUrl.add_cricket_contest;
    const fr = await Helper.post(postJson, path, token);
    const res = await fr.response.json();
    if (fr.status === 200) {
      if (res.success) {
        setContestId(res.results.id);
        setLoading(false);
        SetMainForm(false);
        SetBreakUpForm(true);
        //props.history.push('/contests');
        //alert.success(res.msg);
      } else {
        alert.error(res.msg);
        setLoading(false);
      }
    } else {
      alert.error(res.error);
      setLoading(false);
    }
  };
  const onSubmitBreakup = async () => {
    let len = parseInt(rows.length);
    console.log("rows", rows);
    console.log("len", len);
    let totalPercent = 0;
    for (let i = 0; i < len; i++) {
      totalPercent = parseFloat(totalPercent + rows[i].total_percentage);
    }
    console.log("totalPercent", totalPercent);

    if (totalPercent != 100) {
      alert.error('Sum of total percent must be equal to 100 %.');
      return;
    }

    setLoading(true);
    let postJson = {
      id: contestId,
      data: rows
    };
    let path = apiUrl.add_price_breakup_cricket;
    const fr = await Helper.post(postJson, path, token);
    const res = await fr.response.json();
    if (fr.status === 200) {
      if (res.success) {
        setLoading(false);
        SetBreakUpForm(true);
        props.history.push('/cricket/contests');
        alert.success(res.msg);
      } else {
        alert.error(res.msg);
        setLoading(false);
      }
    } else {
      alert.error(res.error);
      setLoading(false);
    }
  }

  const getCategory = async () => {
    const itemsPerPage = 100;
    let path = apiUrl.get_active_cricket_categories;
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
  const handleCrypto = async (e) => {
    let name = e.target.selectedOptions[0].text;
    let token_address = e.target.value;
    setCryptoTokenName(name);
    setCryptoTokenValue(token_address);

  }
  const handleJoinMultiple = async (e) => {
    setJoinMultiple(!join_multiple_team);
  }
  const handleType = async (e) => {
    let type = e.target.value;
    console.log('e', e.target.selectedOptions[0].text)
    if (type == 'free') {
      setEntryFee(0);
      setBonus(0);
      setwinAmount(0);
      setPlateFormFee(0);
      setwinAmountDisable(true);
      setadminProfitDisable(true);
      settokenVisible(false);
    } else if (type == 'paid') {
      setEntryFee(0);
      setwinAmount(0);
      setPlateFormFee(0);
      setwinAmountDisable(false);
      setadminProfitDisable(false);
      settokenVisible(false);
    } else {
      setEntryFee(0);
      setwinAmount(0);
      setPlateFormFee(0);
      setwinAmountDisable(false);
      setadminProfitDisable(false);
      settokenVisible(true);
    }
  }
  const handleWinningChange = async (e) => {
    let win_amount = parseInt(e.target.value);
    let platform_fee = (win_amount * plateFormFee / 100);
    let GST_Fee = (platform_fee * GST / 100);
    let entryFee = (win_amount + platform_fee + GST_Fee) / usersLimit
    entryFee = Math.ceil(entryFee);
    setEntryFee(entryFee.toFixed(2) || 0);
    setwinAmount(win_amount || '');
    setTotalAdminFee(((platform_fee + GST_Fee) * 100) / win_amount);

  }
  const handlePlateformFeeChange = async (e) => {
    let plateform_fee_per = parseFloat(e.target.value);
    let platform_fee = (winAmount * plateform_fee_per / 100);
    let GST_Fee = (platform_fee * GST / 100);
    let entryFee = (winAmount + platform_fee + GST_Fee) / usersLimit
    entryFee = Math.ceil(entryFee);
    setEntryFee(entryFee.toFixed(2) || 0);
    setPlateFormFee(plateform_fee_per || '');
    setTotalAdminFee(((platform_fee + GST_Fee) * 100) / winAmount);
  }
  const handleUsersLimitChange = async (e) => {
    let users_limit = parseInt(e.target.value);
    let platform_fee = (winAmount * plateFormFee / 100);
    let GST_Fee = (platform_fee * GST / 100);
    let entryFee = (winAmount + platform_fee + GST_Fee) / users_limit
    entryFee = Math.ceil(entryFee);
    setEntryFee(entryFee.toFixed(2) || 0);
    setUsersLimit(users_limit);
  }

  const handleBonusChange = async  (e)=> {
    // let bonus = e.target.value;
    console.log("e.target.value", e.target.value)
    setBonus(e.target.value);
  }
console.log('bounsss=====',bonus)
  const maxLengthCheck = (object) => {
    if (object.target.value.length > object.target.maxLength) {
      object.target.value = object.target.value.slice(0, object.target.maxLength)
    }
  }
  const updateEndRank = (i, filed_name) => e => {
    let end_rank = parseInt(e.target.value);
    if (usersLimit < end_rank) {
      alert.error('End rank must not be greater than user limit.');
      e.target.value = 0;
      return;
    }
    if (end_rank < rows[i].start_rank) {
      alert.error('End rank must not be less than start rank.');
      return;
    }
    let len = parseInt(rows.length);
    let totalAmount = 0;
    let totalPercent = 0;
    for (i = 0; i < len - 1; i++) {
      totalAmount = parseInt(totalAmount + rows[i].total_price);
      totalPercent = parseInt(totalPercent + rows[i].total_percentage);
    }
    setLastRank(end_rank + 1);
    setRows(rows => {
      let objDay = rows.find((row, index) => index === i);
      let winners = end_rank - (objDay.start_rank - 1)
      let eachPercent = parseInt(objDay.each_percentage);
      let total_price = ((eachPercent * winAmount) / 100) * winners;
      if (((totalAmount + total_price) > winAmount) || ((totalPercent + (eachPercent * winners)) > 100)) {
        alert.error('Sum of total price must be less than winning price and total percentage must be less than 100%')
        return [...rows];
      }
      objDay[filed_name] = end_rank || 0;
      if (objDay.each_percentage != 0) {
        objDay.each_price = (eachPercent * winAmount) / 100;
        objDay.total_percentage = eachPercent * winners;
        objDay.total_price = total_price;
      }
      return [...rows];
    });


    // let newArr = [...rows];
    // newArr[i] = e.target.value;
  }
  const updateEachPercentage = (i, filed_name) => e => {
    let eachPercent = e.target.value || 0;
    let len = parseInt(rows.length) - 1;
    let totalAmount = 0;
    let totalPercent = 0;
    for (i = 0; i < len; i++) {
      totalAmount = parseInt(totalAmount + rows[i].total_price);
      totalPercent = parseInt(totalPercent + rows[i].total_percentage);
    }

    setRows(rows => {
      let objDay = rows.find((row, index) => index === i);
      let winners = objDay.end_rank - (objDay.start_rank - 1);
      let total_price = ((eachPercent * winAmount) / 100) * winners;
      if (((totalAmount + total_price) > winAmount) || ((totalPercent + (eachPercent * winners)) > 100)) {
        alert.error('Sum of total price must be less than winning price and total percentage must be less than 100%')
        return [...rows];
      }
      objDay[filed_name] = parseInt(eachPercent);
      if (objDay.end_rank != 0) {
        objDay.each_price = (eachPercent * winAmount) / 100;
        objDay.total_percentage = eachPercent * winners;
        objDay.each_percentage = parseFloat(eachPercent);
        objDay.total_price = total_price;
      }

      let lent = parseInt(rows.length);
      let UsedPercent = 0;
      for (let h = 0; h < lent; h++) {
        UsedPercent = parseFloat(UsedPercent + rows[h].total_percentage);
      }

      let remaining_amount = winAmount - (((100 - UsedPercent) * winAmount) / 100);

      setTotalPercentage(UsedPercent);
      setRemainingAmount(remaining_amount);

      return [...rows];
    });
  }
  const AddNewRow = () => {
    let len = parseInt(rows.length) - 1;
    if (rows[len].end_rank == '' || rows[len].each_percentage == 0) {
      alert.error('Please complete last row before add more row.')
      return;
    }
    let totalPercent = 0;
    for (let i = 0; i < parseInt(rows.length); i++) {
      totalPercent = parseInt(totalPercent + rows[i].total_percentage);
    }
    if (totalPercent >= 100) {
      alert.error('Sum of total percent must not exceed 100 %.');
      return;
    }
    rows[len].is_completed = true;

    let rand = Math.floor((Math.random() * 10000000) + 2);

    setRows([...rows, { is_completed: false, start_rank: lastRank, end_rank: '', each_percentage: 0, each_price: 0, total_percentage: 0, total_price: 0, rand: (rows.length + 1) }]);
  }

  useEffect(() => {
    getCategory();
  }, []);

  const handleDelete = (key) => {

    let newRows = rows.filter((item) => { return item.rand < key })
    setRows(newRows);
    updateEachPercentage(key, 'each_percentage')

    let lent = parseInt(newRows.length);
    let UsedPercent = 0;
    for (let h = 0; h < lent; h++) {
      UsedPercent = parseFloat(UsedPercent + newRows[h].total_percentage);
    }

    let remaining_amount = winAmount - (((100 - UsedPercent) * winAmount) / 100);
    setTotalPercentage(UsedPercent);
    setRemainingAmount(remaining_amount);

    let lastRank = newRows[newRows.length - 1].end_rank;
    setLastRank(lastRank + 1);

  }
  const handleReset = () => {
    setRows([{ is_completed: false, start_rank: 1, end_rank: '', each_percentage: 0, each_price: 0, total_percentage: 0, total_price: 0, rand: 1 }]);
    setValue("end_rank[]", "")
    setValue("each_percentage[]", "")
    setTotalPercentage(0)
    setRemainingAmount(0);
  }
  const deleteItem = async () => {
    let SwalConfig = Helper.SwalConfig("You want to delete Contest");
    const result = await Swal.fire(SwalConfig);
    if (result.value) {
      let postJson = { id: contestId };
      let path = apiUrl.delete_cricket_contest;
      const fr = await Helper.post(postJson, path, token);
      const res = await fr.response.json();
      if (fr.status === 200) {
        if (res.success) {
          props.history.push('/cricket/contests');
          alert.success(res.msg);
        } else {
          alert.error(res.msg);
        }
      } else {
        alert.error(res.error);
      }
    }
  };

  const getSettings = async (id) => {
    let path = apiUrl.get_setting;
    const fr = await Helper.get(path, token);
    const res = await fr.response.json();
    if (fr.status === 200) {
      if (res.success) {
        console.log('------->', res.results || []);
        setSettingData(res.results || []);
        setGST(res.results.gst_rate);
      } else {
        alert.error(res.msg);
      }
    } else {
      alert.error(res.error);
    }
  };

  useEffect(() => {
    setMaxTeamJoinCount(join_multiple_team ? max_team_join_count : '')
  }, [join_multiple_team]);

  useEffect(() => {
    getSettings();
    // console.log("converter",converter.toWords(3048));
  }, [rows])

  return (
    <React.Fragment>
      <form onSubmit={handleSubmit(onSubmit)}>
        {mainForm && <Card>
          <CardHeader>
            <CardTitle className="text-info"><h4>Add Cricket Contest</h4></CardTitle>
          </CardHeader>
          <CardBody>
            <Row>
              <Col md={6}>
                <FormGroup>
                  <Label className={'col-md-3 pull-left mt-2'}>Contest Name</Label>
                  <input type="text" name="name" minLength={"3"} maxLength={"50"} placeholder="Contest Name" autoComplete="off"
                    className="form-control col-md-6" ref={register({ required: 'Required' })} />
                  {errors.title && <p className="text-danger marginmessage">Contest Name is required</p>}
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label className={'col-md-3 pull-left mt-2'}>Contest Category</Label>
                  <select name={'category'} className={"form-control col-md-6"} ref={register({ required: 'Required' })}>
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
                  <Label className={'col-md-3 pull-left mt-2'}>Contest Type</Label>
                  <select name={'contest_type'} className={"form-control col-md-6"} ref={register({ required: 'Required' })} onChange={(e) => { handleType(e) }}>
                    <option value={''}>-- Select Contest Type --</option>
                    <option value={'free'}>Free</option>
                    <option value={'paid'}>Paid</option>
                  </select>
                  {errors.title && <p className="text-danger marginmessage">Contest Type is required</p>}
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label className={'col-md-3 pull-left mt-2'}>Total Winning Amount (INR)</Label>
                  <input type="number" name="winning_amount" maxLength={"9"} min={"0"}
                    value={winAmount} disabled={winAmountDisable} onChange={e => { handleWinningChange(e) }} placeholder="Total Winning Amount" autoComplete="off"
                    className="form-control col-md-6" onInput={maxLengthCheck} ref={register({ required: 'Required' })} />
                  <span>{winAmount > 0 ? _.capitalize(converter.toWords(winAmount)) : ''}</span>
                  {errors.title && <p className="text-danger marginmessage">Total Winning Amount is required</p>}
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label className={'col-md-3 pull-left mt-2'}>Platform Fee (%)</Label>
                  <div className="input-group col-md-6 p-0">
                    <input type="number" name="platform_fee" maxLength={"5"} min={"0"} step={"0.01"}
                      value={plateFormFee} disabled={adminProfitDisable} onChange={e => { handlePlateformFeeChange(e) }} placeholder="Admin Profilt" autoComplete="off"
                      className="form-control" ref={register({ required: 'Required' })} />
                    <div className="input-group-append">
                      <span className="input-group-text"><i className="fa fa-percent"></i></span>
                    </div>
                  </div>
                  {errors.title && <p className="text-danger marginmessage">Admin Profilt is required</p>}
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label className={'col-md-3 pull-left mt-2'}>GST(%)</Label>
                  <div className="input-group col-md-6 p-0">
                    <input type="number" name="gst_value" maxLength={"5"} min={"0"} step={"0.01"} disabled
                      value={GST} placeholder="GST Applied" autoComplete="off"
                      className="form-control " ref={register({ required: 'Required' })} />
                    <div className="input-group-append">
                      <span className="input-group-text"><i className="fa fa-percent"></i></span>
                    </div>
                  </div>
                  {errors.title && <p className="text-danger marginmessage">GST is required</p>}
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label className={'col-md-3 pull-left mt-2'}>Total Admin Fee (%)</Label>
                  <div className="input-group col-md-6 p-0">
                    <input type="number" name="admin_profit" maxLength={"5"} min={"0"} step={"0.01"}
                      value={totalAdminFee} disabled placeholder="Admin Fee" autoComplete="off"
                      className="form-control " ref={register({ required: 'Required' })} />
                    <div className="input-group-append">
                      <span className="input-group-text"><i className="fa fa-percent"></i></span>
                    </div>
                  </div>
                  {errors.title && <p className="text-danger marginmessage">Admin Fee is required</p>}
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label className={'col-md-3 pull-left mt-2'}>Users Limit</Label>
                  <input type="number" name="users_limit" maxLength={"6"} min={"0"}
                    onInput={maxLengthCheck} placeholder="Users Limit" autoComplete="off" value={usersLimit} onChange={e => { handleUsersLimitChange(e) }}
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
                  <Label className={'col-md-3 pull-left mt-2'}>Bonus (%)</Label>
                  <input type="number" name="bonus"
                    maxLength={"5"}
                    min={"0"}
                    step={"0.01"}
                    value={bonus}
                    onChange={handleBonusChange}
                    disabled={winAmountDisable}
                    placeholder="Bonus" autoComplete="off"
                    className="form-control col-md-6"
                    ref={register({ required: 'Required' })} 
                    // {...register("bonus", { required: true })}
                    // onChange={e =>  {
                    //   console.log('on change called==>>>')
                    //   handleBonusChange(e)
                    //   // errors.bonus.type = ''
                    // } } 
                    onKeyDown={(e)=>setBonus(e.target.key)}
                  />
                  {console.log('errrrrrrr==>>>>>', errors)}
                  {errors?.bonus?.type == "required" && <p className="text-danger marginmessage">Bonus is required</p>}
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <input type="checkbox" name="confirm_winning" checked={confirm_winning} onChange={(e) => { setConfirmWinning(!confirm_winning) }} autoComplete="off" className="mt-2 col-md-2 pull-left" />
                  <Label className={'col-md-10 mt-1'}>Confirmed winning even if the contest remains unfilled.</Label>
                </FormGroup>
              </Col>

              <Col md={6}>
                <FormGroup>
                  <input type="checkbox" name="join_multiple_team" checked={join_multiple_team} onChange={(e) => { setJoinMultiple(!join_multiple_team) }} autoComplete="off" className="mt-2 col-md-2 pull-left" />
                  <Label className={'col-md-10 mt-1'}>Join with multiple teams.</Label>
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <input type="checkbox" name="auto_create" checked={auto_create} onChange={(e) => { setAutoCreate(!auto_create) }} autoComplete="off" className="mt-2 col-md-2 pull-left" />
                  <Label className={'col-md-10 mt-1'}>Auto create.</Label>
                </FormGroup>
              </Col>
              {join_multiple_team && <Col md={6}>
                <FormGroup>
                  <Label className={'col-md-3 pull-left mt-2'}>Maximum Team Join Count</Label>
                  <input type="number" name="max_team_join_count" maxLength={"3"} min={"2"} step={"1"} onInput={maxLengthCheck}
                    value={max_team_join_count} onChange={e => { setMaxTeamJoinCount(e.target.value) }} placeholder="Maximum Team Count For Join Contest" autoComplete="off"
                    className="form-control col-md-6" ref={register({ required: 'Required' })} />
                  {errors.max_team_join_count && <p className="text-danger marginmessage">Maximum team count is required</p>}
                </FormGroup>
              </Col>
              }
            </Row>
          </CardBody>
          <CardFooter>
            <Button onClick={(e) => { history.goBack() }} color="danger"><i className="fa fa-arrow-left" aria-hidden="true"></i> Back</Button>
            <Button className={'ml-2'} type="submit" color="primary">Submit & Next {loading === true ? <i className="fa fa-spinner fa-pulse fa-fw ml-1"></i> : <i className="fa fa-arrow-circle-right fa-lg" aria-hidden="true"></i>}</Button>
          </CardFooter>
        </Card>}
      </form>
      <form onSubmit={handleSubmit(onSubmitBreakup)}>
        {breakUpForm && <Card>
          <CardHeader>
            <CardTitle className="text-info"><h4>Prize Breakup </h4></CardTitle>
          </CardHeader>
          <CardBody>
            <div id="reportId" >
              <Table hover bordered responsive className="mt-3 text-center">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Start Rank</th>
                    <th>End Rank</th>
                    <th>Percentage (each)</th>
                    <th>Price INR (each)</th>
                    <th>Total Percentage</th>
                    <th>Total Price INR </th>
                    <th>Action </th>
                  </tr>
                </thead>
                < tbody >
                  {
                    rows.map((item, key) => {
                      return (
                        <tr key={key}>
                          <td>{key + 1}</td>
                          <td>
                            <input type="number" name="start_rank[]" maxLength={"5"} min={1}
                              value={item.start_rank} disabled placeholder="Start Rank" autoComplete="off" className="form-control" ref={register({ required: 'Required' })} />
                          </td>
                          <td>
                            <input type="number" name="end_rank[]" maxLength={"5"} min={0}
                              defaultValue={item.end_rank} disabled={item.is_completed} onBlur={updateEndRank(key, 'end_rank')} placeholder="End rank" autoComplete="off"
                              className="form-control col-md-12" ref={register({ required: 'Required' })} />
                          </td>
                          <td>
                            <input type="number" name="each_percentage[]" maxLength={"5"} min={"0"} step={"0.01"}
                              defaultValue={item?.each_percentage} disabled={item.is_completed} onBlur={updateEachPercentage(key, 'each_percentage')} placeholder="Percentage (each)" autoComplete="off"
                              className="form-control col-md-12" ref={register({ required: 'Required' })} />
                          </td>
                          <td>
                            <input type="number" name="each_price[]" maxLength={"5"} min={"0"} step={"0.01"}
                              value={item.each_price} disabled placeholder="Price (each)" autoComplete="off" className="form-control" ref={register({ required: 'Required' })} />
                          </td>
                          <td>
                            <input type="number" name="total_percentage[]" maxLength={"5"} min={"0"} step={"0.01"}
                              value={item.total_percentage} disabled placeholder="Total Percentage" autoComplete="off" className="form-control" ref={register({ required: 'Required' })} />
                          </td>
                          <td>
                            <input type="number" name="total_price[]" maxLength={"10"} min={"0"} step={"0.01"}
                              value={item.total_price} disabled placeholder="Total Price" autoComplete="off" className="form-control" ref={register({ required: 'Required' })} />
                          </td>
                          <td>{key != 0 ? <span className={'btn btn-primary mt-2  ml-2 text-white'} color="primary" onClick={(e) => handleDelete(item.rand)} > Delete</span> : ''}</td>
                        </tr>
                      );
                    })
                  }
                  <tr><td colSpan="5" className='text-right pr-4 remaining'><strong>Remaining Percentage :  <span className=''>{100 - total_percentage}</span></strong></td> <td colSpan="3" className='text-left pl-4 remaining'><strong>Remaining Amount : <span className=''>{winAmount - remaining_amount}</span></strong></td></tr>
                </tbody>



              </Table>
              <div className='bottom-outer d-flex align-items-center justify-content-between'>
                <div className='d-flex align-items-center'>
                  <span className={'btn btn-primary mt-2 text-white'} color="primary" onClick={AddNewRow} > Add Row</span>
                  <span className={'btn btn-primary mt-2  ml-2 text-white'} color="primary" onClick={handleReset} > Reset</span>
                </div>


              </div>
            </div>
          </CardBody>
          <CardFooter>
            <Button className={'ml-2'} type="submit" color="primary">Submit {loading === true ? <i className="fa fa-spinner fa-pulse fa-fw ml-1"></i> : <i className="fa fa-arrow-circle-right fa-lg" aria-hidden="true"></i>}</Button>
            <button onClick={(e) => { deleteItem() }} className="btn btn-sm mr-1 ml-2" type="button" title="Delete">
              Delete
            </button>
          </CardFooter>
          {/* <span className={'btn btn-primary mt-2  ml-2 text-white'} color="primary" onClick={deleteItem} > Discard</span> */}
        </Card>}
      </form>

    </React.Fragment >
  );
}

export default AddContest;
