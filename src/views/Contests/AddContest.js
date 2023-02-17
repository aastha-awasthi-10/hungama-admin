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
var moment = require('moment');

const AddContest = (props) => {
  const session = useSession();
  let history = useHistory();
  const alert = useAlert();
  const { register, handleSubmit, errors, watch } = useForm();

  const [token] = useState(session.token);
  const [loading, setLoading] = useState(false);
  const [startdate, setStartDate] = useState('');
  const [enddate, setEndDate] = useState('');
  const [enteryFee, setEntryFee] = useState(0);
  const [winAmount, setwinAmount] = useState(0);
  const [adminProfit, setadminProfit] = useState('0');
  const [usersLimit, setUsersLimit] = useState(1);
  const [adminProfitDisable, setadminProfitDisable] = useState(false);
  const [winAmountDisable, setwinAmountDisable] = useState(false);
  const [BonsDisable, setBonsDisable] = useState(false);
  const [category, setCategory] = useState([]);
  const [mainForm, SetMainForm] = useState(true);
  const [breakUpForm, SetBreakUpForm] = useState(false);
  const [lastRank, setLastRank] = useState(0);
  const [contestId, setContestId] = useState(0);
  const [bonus, setBonus] = useState(0);



  const [rows, setRows] = useState([{ is_completed: false, start_rank: 1, end_rank: '', each_percentage: 0, each_price: 0, total_percentage: 0, total_price: 0 }]);

  const onSubmit = async data => {
    setLoading(true);
    let postJson = {
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
      users_limit: usersLimit,
      difficulty_level: data.difficulty_level,
      bonus: bonus,
      start_date: startdate,
      end_date: enddate
    };
    let path = apiUrl.add_contest;
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
    let totalPercent = 0;
    for (let i = 0; i < len; i++) {
      totalPercent = parseInt(totalPercent + rows[i].total_percentage);
    }
    if (totalPercent != 100) {
      alert.error('Sum of total percent must be equal to 100 %.');
      return;
    }

    setLoading(true);
    let postJson = {
      id: contestId,
      data: rows
    };
    let path = apiUrl.add_price_breakup;
    const fr = await Helper.post(postJson, path, token);
    const res = await fr.response.json();
    if (fr.status === 200) {
      if (res.success) {
        setLoading(false);
        SetBreakUpForm(true);
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
  }

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
    let newDate = date ? date : '';
    setEndDate(newDate);
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
  const updateEndRank = (i, filed_name) => e => {
    let end_rank = parseInt(e.target.value);
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
        objDay.total_price = total_price;
      }
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
    setRows([...rows, { is_completed: false, start_rank: lastRank, end_rank: '', each_percentage: 0, each_price: 0, total_percentage: 0, total_price: 0 }]);
  }

  useEffect(() => {
    getCategory();
  }, []);


  const handleReset = () => {
    setRows([{ is_completed: false, start_rank: 1, end_rank: '', each_percentage: 0, each_price: 0, total_percentage: 0, total_price: 0 }]);
  }

  return (
    <React.Fragment>
      <form onSubmit={handleSubmit(onSubmit)}>
        {mainForm && <Card>
          <CardHeader>
            <CardTitle className="text-info"><h4>Add Contest</h4></CardTitle>
          </CardHeader>
          <CardBody>
            <Row>
              <Col md={6}>
                <FormGroup>
                  <Label className={'col-md-3 pull-left mt-2'}>Contest Name</Label>
                  <input type="text" name="name" placeholder="Contest Name" autoComplete="off"
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
                  <Label className={'col-md-3 pull-left mt-2'}>No. Of Question</Label>
                  <input type="number" name="questions_count" maxLength={"3"} min={"1"} max={"999"} placeholder="No. of Question" autoComplete="off"
                    className="form-control col-md-6" ref={register({ required: 'Required' })} />
                  {errors.title && <p className="text-danger marginmessage">No. of Question is required</p>}
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label className={'col-md-3 pull-left mt-2'}>Contest Language</Label>
                  <select name={'contest_language'} className={"form-control col-md-6"} ref={register({ required: 'Required' })}>
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
                  <Label className={'col-md-3 pull-left mt-2'}>Difficulty Level </Label>
                  <input type="number" name="difficulty_level" maxLength={"3"} min={"0"} max={"20"} placeholder="Difficulty Level" autoComplete="off"
                    className="form-control col-md-6" ref={register({ required: 'Required' })} />
                  {errors.title && <p className="text-danger marginmessage">Difficulty Level is required</p>}
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label className={'col-md-3 pull-left mt-2'}>Small Description</Label>
                  <textarea name="description" placeholder="Small Description..." autoComplete="off" className="form-control col-md-6" ref={register({ required: 'Required' })}></textarea>
                  {errors.title && <p className="text-danger marginmessage">Description is required</p>}
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label className={'col-md-3 pull-left mt-2'}>Contest Rules</Label>
                  <textarea name="contest_rules" placeholder="Contest Rules..." autoComplete="off" className="form-control col-md-6" ref={register({ required: 'Required' })}></textarea>
                  {errors.title && <p className="text-danger marginmessage">Contest Rules is required</p>}
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label className={'col-md-3 pull-left mt-2'}>Total Winning Amount</Label>
                  <input type="number" name="winning_amount" maxLength={"3"} min={"0"}
                    value={winAmount} disabled={winAmountDisable} onChange={e => { handleWinningChange(e) }} placeholder="Total Winning Amount" autoComplete="off"
                    className="form-control col-md-6" ref={register({ required: 'Required' })} />
                  {errors.title && <p className="text-danger marginmessage">Total Winning Amount is required</p>}
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label className={'col-md-3 pull-left mt-2'}>Admin Profilt (%)</Label>
                  <input type="number" name="admin_profit" maxLength={"5"} min={"0"} step={"0.01"}
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
                      timeCaption="Time:"
                      minDate={new Date()}
                      onChange={handleStartDate}
                      disabledKeyboardNavigation
                      peekNextMonth
                      showMonthDropdown
                      showYearDropdown
                      dropdownMode="select" required={true}/>
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
                      timeCaption="Time"
                      minDate={startdate ? new Date(startdate) : new Date()}
                      minTime={startdate ? (startdate == enddate) ? setHours(setMinutes(new Date(startdate), new Date(startdate).getMinutes()), new Date(startdate).getHours()) : setHours(setMinutes(new Date(), new Date().getMinutes()), new Date().getHours()) : ''}
                      maxTime={startdate ? setHours(setMinutes(new Date(startdate), 59), 23) : ''}
                      onChange={handleEndDate}
                      disabledKeyboardNavigation
                      peekNextMonth
                      showMonthDropdown
                      showYearDropdown
                      dropdownMode="select" required={true}/>
                  </div>
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label className={'col-md-3 pull-left mt-2'}>Bonus (%)</Label>
                  <input type="number" name="bonus" maxLength={"5"} min={"0"} step={"0.01"} disabled={BonsDisable}
                    value={bonus} onChange={e => { setBonus(e.target.value) }} placeholder="Bonus" autoComplete="off"
                    className="form-control col-md-6" ref={register({ required: 'Required' })} />
                  {errors.bonus && <p className="text-danger marginmessage">Bonus is required</p>}
                </FormGroup>
              </Col>
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
                    <th>Price (each)</th>
                    <th>Total Percentage</th>
                    <th>Total Price </th>
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
                              defaultValue={item.each_percentage} disabled={item.is_completed} onBlur={updateEachPercentage(key, 'each_percentage')} placeholder="Percentage (each)" autoComplete="off"
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
                          <td></td>
                        </tr>
                      );
                    })
                  }
                </tbody>
                <tfoot>
                  <span className={'btn btn-primary mt-2 text-white'} color="primary" onClick={AddNewRow} > Add Row</span>
                  <span className={'btn btn-primary mt-2  ml-2 text-white'} color="primary" onClick={handleReset} > Reset</span>
                </tfoot>
              </Table>
            </div>
          </CardBody>
          <CardFooter>
            <Button className={'ml-2'} type="submit" color="primary">Submit {loading === true ? <i className="fa fa-spinner fa-pulse fa-fw ml-1"></i> : <i className="fa fa-arrow-circle-right fa-lg" aria-hidden="true"></i>}</Button>
          </CardFooter>
        </Card>}
      </form>

    </React.Fragment >
  );
}

export default AddContest;
