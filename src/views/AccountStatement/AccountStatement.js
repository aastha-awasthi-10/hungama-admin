import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import Helper from '../../constants/helper';
import apiUrl from '../../constants/apiPath';
import moment from "moment";
import Pagination from "react-js-pagination";
import { Card, Button, CardBody, CardHeader, Col, Row, Table, Form, Input, FormGroup } from 'reactstrap';
import _ from "lodash";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Loaders from '../CommanPage/Loader'
// import Excelreport from '../Reports/excelreport';
import useSession from "react-session-hook";
import Status from './Action/Status';
import View from "./Action/View";
import { useAlert } from "react-alert";

const AccountStatement = (props) => {
  const session = useSession();
  const alert = useAlert();
  const [users, setUsers] = useState([]);
  const [totalitems, setTotalItems] = useState('');
  const [activepage, setActivePage] = useState(1);
  const [startdate, setStartDate] = useState('');
  const [enddate, setEndDate] = useState('');
  const [serachstatus, setSerachStatus] = useState('');
  const [keywords, setKeyWords] = useState('');
  const [visible, setVisibale] = useState(false);
  const [token] = useState(session.token);
  const [isserach, setIsserach] = useState(false);
  const [isreset, setReset] = useState(false);
  const [userId, setUserId] = useState('');
  const [category, setCategory] = useState([]);
  const [category_id, setQuizCategory] = useState('');
  const [type, setType] = useState('');
  const [query, setQuery] = useState({});
  const [exportExcel, setExportExcel] = useState('');


  // const [filename] = useState('supermasterexcel-file'); 

  const pageData = async (page = activepage) => {
    setVisibale(true);
    const itemsPerPage = 10;
    let path;
    setActivePage(page)
    query["page"] = page
    query["itemsPerPage"] = itemsPerPage
    if (typeof (props.match.params.userId) !== 'undefined') {
      query["user"] = props.match.params.userId
    }
    let queryString = Helper.serialize(query);
    path = apiUrl.get_statements + `?${queryString}`;
    getData(path)
  };


  const handleStartDate = (date) => {
    setEndDate('');
    setStartDate(date);
  };

  const handleEndDate = (date) => {
    setEndDate(date);
  };

  const handleSearching = async () => {
    setIsserach(true);
    const itemsPerPage = 10;
    let path;
    let page = 1;
    setActivePage(page)
    let queries = {
      page: page,
      itemsPerPage: itemsPerPage,
      keyword: keywords,
      statement_type: type,
      quizCat: category_id,
      account_start_date: (startdate == '' || startdate == null ? '' : moment(startdate).format('YYYY-MM-DD')),
      account_end_date: (enddate == '' || enddate == null ? '' : moment(enddate).format('YYYY-MM-DD')),
      status: serachstatus
    }
    setQuery(queries)
    let user_id = ''
    if (typeof (props.match.params.userId) !== 'undefined') {
      user_id = props.match.params.userId
    }
    path = apiUrl.get_statements + '?user=' + `${user_id}` + '&page=' + `${page}` + '&itemsPerPage=' + `${itemsPerPage}` + '&keyword=' + `${keywords}` + '&statement_type=' + `${type}` + '&quizCat=' + `${category_id}` + '&account_start_date=' + `${startdate == '' || startdate == null ? '' : moment(startdate).format('YYYY-MM-DD')}` + '&account_end_date=' + `${enddate == '' || enddate == null ? '' : moment(enddate).format('YYYY-MM-DD')}` + '&status=' + `${serachstatus}`;
    getData(path)
  };

  const resetSearch = async (page = activepage) => {
    setVisibale(true);
    const itemsPerPage = 10;
    let path;
    setActivePage(page)
    query["page"] = page
    query["itemsPerPage"] = itemsPerPage
    if (typeof (props.match.params.userId) !== 'undefined') {
      query["user"] = props.match.params.userId
    }
    let queryString = Helper.serialize(query);
    path = apiUrl.get_statements;

    getData(path)
  }

  const getData = async (path) => {
    const fr = await Helper.get(path, token);
    const res = await fr.response.json();
    if (fr.status === 200) {
      if (res.success) {
        setUsers(res.results || []);
        setExportExcel(res.excel_path);
        //setTotalItems(res.totalItems);
        setTotalItems(!_.isEmpty(res.results[0]) ? res.results[0].totalDocs : 0);
        setIsserach(false); setVisibale(false);
      } else {
        alert.error(res.msg);
        setIsserach(false); setVisibale(false);
      }
    } else {
      alert.error(res.error);
      setIsserach(false); setVisibale(false);
    }
  }

  const onReset = (e) => {
    setQuery({})
    setReset(true);
    setStartDate('');
    setEndDate('');
    setKeyWords('');
    setSerachStatus('');
    setType('');
    resetSearch(1);
    setActivePage(1);
  };

  useEffect(() => {
    pageData();
  }, []);
  useEffect(() => {
    pageData();
  }, [props]);

  return (
    <div className="animated fadeIn loader-outer">
      <Loaders className="overlay-loader" visible={visible} />
      <Row>
        <Col>
          <Card>
            <CardHeader>
              Account Statements
              </CardHeader>
            <CardBody>
              <div className="multipal-searching">
                <Row>
                  <Col lg={10} className="multiple-column">
                    <Form>
                      <Row>
                        <Col md={3} sm={6}>
                          <FormGroup className="mb-xl-0">
                            <Input type="text" placeholder="Search" value={keywords} className="form-control"
                              onChange={(e) => { setKeyWords(e.target.value) }} />
                          </FormGroup>
                        </Col>
                        <Col md={3} sm={6}>
                          <FormGroup className="mb-xl-0">
                            <select name={'statement_type'} className={"form-control"} value={type} onChange={(e) => { setType(e.target.value); }} >
                              <option value={''}>-- Statement Type --</option>
                              <option value='open_account'>Account Open</option>
                              <option value='wallet_deposit'>Wallet Deposit</option>
                              <option value='contest'>Contest Statement</option>
                              <option value='cricket_contest'>Contest Winning</option>
                              <option value='entry_fees'>Entry Fees</option>
                              <option value='bonus'>Bonus</option>
                              <option value='refer'>Referrals</option>
                              <option value='withdraw'>Wallet Withdraw</option>
                              <option value='winning'>Admin Update Winning</option>
                              <option value='sign_in_bonus'>Sign In Bonus</option>                              
                            </select>
                          </FormGroup>
                        </Col>
                        <Col md={3} sm={6}>
                          <FormGroup className="mb-xl-0">
                            <DatePicker selected={startdate === '' || startdate == null ? null : new Date(startdate)} className="form-control" placeholderText=" Start Date"
                              dateFormat="dd/MM/yyyy"
                              // maxDate={new Date()}
                              onChange={handleStartDate}
                              peekNextMonth
                              showMonthDropdown
                              showYearDropdown
                              dropdownMode="select" />
                          </FormGroup>
                        </Col>
                        <Col md={3} sm={6}>
                          <FormGroup className="mb-xl-0">
                            <DatePicker selected={enddate === '' || enddate == null ? null : new Date(enddate)} className="form-control" placeholderText=" End Date"
                              dateFormat="dd/MM/yyyy"
                              minDate={new Date(startdate)}
                              // maxDate={new Date()}
                              onChange={handleEndDate}
                              peekNextMonth
                              showMonthDropdown
                              showYearDropdown
                              dropdownMode="select" />
                          </FormGroup>
                        </Col>
                      </Row>
                    </Form>
                  </Col>
                  <Col xl={2} className="d-flex">
                    <button className="btn btn-primary ml-1" type="button" onClick={handleSearching}><i className="fa fa-search" /> Search{isserach === true && <i className="fa fa-spinner fa-pulse fa-fw ml-1" />}</button>
                    <button className="btn dark_btn ml-1 " type="button" onClick={(e) => { onReset(); }}><i className="fa fa-undo" /> Reset</button>
                  </Col>
                </Row>
                <br></br>
                <Row>
                  <Col md={3}>
                    <a href={exportExcel} download>
                      <button className="btn btn-primary mr-1 col-md-12" type="button"><i className="fa fa-file-excel-o" /> Export Excel</button>
                    </a>
                  </Col>
                </Row>
              </div>
              <div id="reportId" >
                <Table hover bordered responsive className="mt-3 text-center">
                  <thead>
                    <tr>
                      <th className="text-left">Full Name</th>
                      <th className="text-left">Username</th>
                      <th className="text-left">Email</th>
                      <th className="text-right">Phone</th>
                      <th className="text-right">Debit INR</th>
                      <th className="text-right">Credit INR</th>
                      <th className="text-right">Balance INR</th>
                      <th className="text-left">Type</th>
                      <th className="text-left">Remark</th>
                      <th className="text-center">Created At</th>
                      {/* <th>Action</th> */}
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((item, key) => {
                      return (
                        <tr key={key}>
                          {/* <td className="text-left">{item.rows.first_name + ' ' + item.rows.last_name}</td> */}
                          <td className="text-left">{item.rows.full_name}</td>
                          <td className="text-left">{item.rows.username}</td>
                          <td className="text-left">{item.rows.email}</td>
                          <td className="text-right">{item.rows.phone}</td>
                          <td className="text-right">{item.rows.debit}</td>
                          <td className="text-right">{item.rows.credit}</td>
                          <td className="text-right">{item.rows.balance.toFixed(2)}</td>
                          <td className="text-left">{(item.rows.type == 'open_account') ? 'Account Open' : (item.rows.type == 'wallet_deposit') ? 'Wallet Deposit' : (item.rows.type == 'quiz') ? 'Quiz Statement' : (item.rows.type == 'contest') ? 'Contest Statement' : (item.rows.type == 'bonus') ? 'Bonus' : (item.rows.type == 'refer') ? 'Referrals' : (item.rows.type== "withdraw")?"Wallet Withdraw":(item.rows.type== "winning")?"Winning":(item.rows.type== "sign_in_bonus")?"Sign in bonus":(item.rows.type== "cricket_contest")?"Cricket Contest":(item.rows.type== "entry_fees")?"Entry Fees":""}</td>
                          <td className="text-left">{item.rows.remarks}</td>
                          {/* <td>
                            {item.rows.status == 0 ? 'Not paid' : item.rows.status == 1 ? 'Success' : item.rows.status == 2 ? 'Pending' : 'Failed'}
                          </td> */}
                          <td className="text-center">{moment(item.rows.createdAt).format('LLL')}</td>
                          {/* <td className="w-40">
                            {
                              _.isEmpty(props.match.params.id && true) ?
                                <div>
                                  <View item={item} fullname={item.user_id.first_name + ' ' + item.user_id.last_name} />
                                </div>
                                : null
                            }
                          </td> */}
                        </tr>
                      )
                    })}
                    {_.isEmpty(users) && <tr><td colSpan="11"><div className="text-center">No Record Found</div></td></tr>}
                  </tbody>
                </Table>
              </div>
              {!_.isEmpty(users) && <div className="show-pagination technician-page">
                <Pagination
                  activeClass={""}
                  activeLinkClass={"page-link active"}
                  itemClass={"page-item"}
                  linkClass={"page-link"}
                  activePage={activepage}
                  itemsCountPerPage={10}
                  totalItemsCount={totalitems}
                  pageRangeDisplayed={4}
                  prevPageText="Previous"
                  nextPageText="Next"
                  firstPageText="<"
                  lastPageText=">"
                  onChange={pageData}
                />
              </div>}
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div >
  );
};

export default AccountStatement;
