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

const ContestEarningManager = (props) => {
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
  const [category, setCategory] = useState([]);
  const [category_id, setQuizCategory] = useState('');
  const [type, setType] = useState('');
  const [ToatlEarning, setToatlEarning] = useState(0);
  const [query, setQuery] = useState({});
  let TotalEarning = 0;

  const pageData = async (page = activepage) => {
    setVisibale(true);
    const itemsPerPage = 10;
    let path;
    setActivePage(page)
    query["page"] = page
    query["itemsPerPage"] = itemsPerPage
    let queryString = Helper.serialize(query);
    path = apiUrl.get_constest + `?${queryString}`;
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
      quizCat: category_id,
      statement_type: type,
      start_date: (startdate == '' ? '' : moment(startdate).format('YYYY-MM-DD')),
      end_date: (enddate == '' ? '' : moment(enddate).format('YYYY-MM-DD')),
      status: serachstatus
    }
    setQuery(queries)

    path = apiUrl.get_constest + '?page=' + `${page}` + '&itemsPerPage=' + `${itemsPerPage}` + '&keyword=' + `${keywords}` + '&statement_type=' + `${type}` + '&quizCat=' + `${category_id}` + '&start_date=' + `${startdate == '' ? '' : moment(startdate).format('YYYY-MM-DD')}` + '&end_date=' + `${enddate == '' ? '' : moment(enddate).format('YYYY-MM-DD')}` + '&status=' + `${serachstatus}`;
    getData(path);
  };

  const resetSearch = async () => {
    let path = apiUrl.get_constest + '?page=1&itemsPerPage=10';
    getData(path)
  }

  const getData = async (path) => {
    const fr = await Helper.get(path, token);
    const res = await fr.response.json();
    if (fr.status === 200) {
      if (res.success) {
        setUsers(res.results.docs || []);
        setTotalItems(res.results.totalDocs);
        setVisibale(false)
        setIsserach(false);
        setEndDate(startdate !== '' ? moment().format('LLL') : '')
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
    setStartDate('');
    setEndDate('');
    setKeyWords('');
    setSerachStatus('');
    setType('');
    resetSearch();
    setActivePage(1);
  };

  useEffect(() => {
    pageData();
  }, []);

  return (
    <div className="animated fadeIn loader-outer">
      <Loaders className="overlay-loader" visible={visible} />
      <Row>
        <Col>
          <Card>
            <CardHeader>
              Contest Earning Manager
              </CardHeader>
            <CardBody>
              <div className="multipal-searching">
                <Row>
                  <Col lg={9}>
                    <Form>
                      <Row>
                        <Col md={5} sm={6}>
                          <FormGroup className="mb-xl-0">
                            <DatePicker selected={startdate === '' ? null : new Date(startdate)} className="form-control" placeholderText=" Start Date"
                              dateFormat="dd/MM/yyyy"
                              maxDate={new Date()}
                              onChange={handleStartDate}
                              peekNextMonth
                              showMonthDropdown
                              showYearDropdown
                              dropdownMode="select" />
                          </FormGroup>
                        </Col>
                        <Col md={5} sm={6}>
                          <FormGroup className="mb-xl-0">
                            <DatePicker selected={enddate === '' ? null : new Date(enddate)} className="form-control" placeholderText=" End Date"
                              dateFormat="dd/MM/yyyy"
                              minDate={new Date(startdate)}
                              maxDate={new Date()}
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
                  <Col xl={3} className="text-xl-right ">
                    <button className="btn btn-primary ml-1" type="button" onClick={handleSearching}><i className="fa fa-search" /> Search{isserach === true && <i className="fa fa-spinner fa-pulse fa-fw ml-1" />}</button>
                    <button className="btn dark_btn ml-1 " type="button" onClick={(e) => { onReset(); }}><i className="fa fa-undo" /> Reset</button>
                  </Col>
                </Row>
              </div>
              <div id="reportId" >
                <Table hover bordered responsive className="mt-3 text-center">
                  <thead>
                    <tr>
                      <th className="text-left">Match Name</th>
                      <th className="text-center">Date</th>
                      <th className="text-right">Total Contest</th>
                      <th className="text-right">Total Team</th>
                      <th className="text-right">Amount INR</th>
                      <th className="text-right">Bonus INR</th>
                      <th className="text-right">Winning Distribution INR</th>
                      <th className="text-right">Total Earning INR</th>
                      {/* <th>Action</th> */}
                    </tr>
                  </thead>
                  <tbody>
                    {
                      users.map((item, key) => {
                        let bonusAmount = item.bonus == 0 ? 0 : ((item.bonus * item.entry_fee) / 100);
                        let totalEntry = item.entry_fee * item.joined_user_count;
                        let totalEarn = totalEntry - (item.winning_amount + bonusAmount);
                        TotalEarning = TotalEarning + totalEarn;
                        return (
                          <tr key={key}>
                            <td className="text-left">{item.name}</td>
                            <td className="text-center">{moment(item.createdAt).format('LLL')}</td>
                            <td className="text-right">1</td>
                            <td className="text-right">{item.joined_user_count}</td>
                            <td className="text-right">{totalEntry}</td>
                            <td className="text-right">{bonusAmount}</td>
                            <td className="text-right">{item.winning_amount}</td>
                            <td className="text-right">{Math.round(totalEarn * 10) / 10}</td>
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
                    {_.isEmpty(users) && <tr><td colSpan="8"><div className="text-center">No Record Found</div></td></tr>}
                  </tbody>
                  <tfoot>
                    <tr>
                      <th colspan="6"> </th>
                      <th className="text-right">Total Earning Sum : </th>
                      <th className="text-right">{TotalEarning}</th>
                    </tr>
                  </tfoot>
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

export default ContestEarningManager;
