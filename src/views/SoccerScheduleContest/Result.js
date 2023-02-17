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
import { useAlert } from "react-alert";
import ExtendDate from "./Action/ExtendDate";


import EditNews from '../News/EditNews';

const Result = (props) => {
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
  const [contestType, setContestType] = useState('');
  const [query, setQuery] = useState({});
  const [loading, setLoading] = useState(false);

  const pageData = async (page = activepage) => {
    setVisibale(true);
    const itemsPerPage = 10;
    let path;
    setActivePage(page)
    query["page"] = page
    query["itemsPerPage"] = itemsPerPage
    let queryString = Helper.serialize(query);
    path = apiUrl.get_soccer_series_completed_matches + `?${queryString}`;
    getData(path)
  };

  /* const getData = async (page = activepage) => {
    setVisibale(true);
    const itemsPerPage = 10;
    let path;
    
      path = apiUrl.get_series_completed_matches + '?page=' + `${page}` + '&itemsPerPage=' + `${itemsPerPage}`;
    
    const fr = await Helper.get(path, token);
    const res = await fr.response.json();
    if (fr.status === 200) {
      if (res.success) {
        console.log(res.results);
        setUsers(res.results || []);
        setTotalItems(res.totalItems);
        setVisibale(false)
      } else {
        alert.error(res.msg);
        setVisibale(false)
      }
    } else {
      alert.error(res.error);
      setVisibale(false)
    }

  }; */

  const getCategory = async () => {
    const itemsPerPage = 100;
    let path = apiUrl.get_active_soccer_categories;
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

  const winning_distribute = async (match_id, series_id) => {
    setLoading(true);
    let postJson = {
      match_id: match_id,
      series_id: series_id
    };
    let path = apiUrl.soccer_series_completed_matches_distribution;
    const fr = await Helper.post(postJson, path, token);
    const res = await fr.response.json();
    if (fr.status === 200) {
      if (res.success) {
        setLoading(false);
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

  const refresh_rank = async (match_id, series_id) => {
    setLoading(true);
    let postJson = {
      match_id: match_id,
      series_id: series_id
    };
    let path = apiUrl.refresh_soccer_series_completed_matches_rank;
    const fr = await Helper.post(postJson, path, token);
    const res = await fr.response.json();
    if (fr.status === 200) {
      if (res.success) {
        setLoading(false);
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
      contestType: contestType,
      quizCat: category_id,
      start_date: (startdate == '' ? '' : moment(startdate).format('YYYY-MM-DD')),
      end_date: (enddate == '' ? '' : moment(enddate).format('YYYY-MM-DD')),
      status: serachstatus
    }
    setQuery(queries)

    path = apiUrl.get_soccer_series_live_matches + '?page=' + `${page}` + '&itemsPerPage=' + `${itemsPerPage}` + '&keyword=' + `${keywords}` + '&contestType=' + `${contestType}` + '&quizCat=' + `${category_id}` + '&start_date=' + `${startdate == '' ? '' : moment(startdate).format('YYYY-MM-DD')}` + '&end_date=' + `${enddate == '' ? '' : moment(enddate).format('YYYY-MM-DD')}` + '&status=' + `${serachstatus}`;
    getData(path)
  };

  const resetSearch = async () => {
    let path = apiUrl.get_soccer_series_live_matches + '?page=1&itemsPerPage=10';
    getData(path)
  }

  const getData = async (path) => {
    const fr = await Helper.get(path, token);
    const res = await fr.response.json();
    if (fr.status === 200) {
      if (res.success) {
        setUsers(res.results || []);
        setTotalItems(!_.isEmpty(res.results[0]) ? res.results[0].totalDocs : 0);
        setVisibale(false)
        setIsserach(false);
      } else {
        alert.error(res.msg);
        setIsserach(false); setVisibale(false);
      }
    } else {
      alert.error(res.error);
      setIsserach(false); setVisibale(false);
    }
  };

  const onReset = (e) => {
    setQuery({})
    setStartDate('');
    setEndDate('');
    setKeyWords('');
    setSerachStatus('');
    setQuizCategory('');
    setContestType('');
    resetSearch();
    setActivePage(1);
  };

  useEffect(() => {
    pageData();
    getCategory();
  }, []);

  return (
    <div className="animated fadeIn loader-outer">
      <Loaders className="overlay-loader" visible={visible} />
      <Row>
        <Col>
          <Card>
            <CardBody>
              <div className="multipal-searching">
                <Row>
                  <Col lg={10}>
                    <Form>
                      <Row>
                        <Col md={4}>
                          <FormGroup>
                            <Input type="text" placeholder="Series Name" value={keywords} className="form-control"
                              onChange={(e) => { setKeyWords(e.target.value) }} />
                          </FormGroup>
                        </Col>
                        {/* <Col md={4}>
                          <FormGroup>
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
                        <Col md={4}>
                          <FormGroup>
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
                        </Col> */}
                      </Row>
                    </Form>
                  </Col>
                  <Col lg={2}>
                    <Row>
                      <Col md={12}>
                        <button className="btn btn-primary mr-1 col-md-5" type="button" onClick={handleSearching}><i className="fa fa-search" /> Search{isserach === true && <i className="fa fa-spinner fa-pulse fa-fw ml-1" />}</button>
                        <button className="btn btn-success col-md-5" type="button" onClick={(e) => { onReset(); }}><i className="fa fa-undo" /> Reset</button>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </div>
              <div id="reportId" >
                <Table hover bordered responsive className="mt-3 text-center">
                  <thead>
                    <tr>
                      <th className="text-left">Team 1 Vs Team 2 </th>
                      <th className="text-left">Series name</th>
                      <th className="text-center">Date</th>
                      <th className="text-center">Time</th>
                      <th className="text-right">No of Contest</th>
                      <th className="text-right">Distribute Winning Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((itemData, key) => {
                      let item = itemData.rows;
                      return (
                        <tr key={key}>
                          <td className="text-left">{item.localteam + ' Vs ' + item.visitorteam}</td>
                          <td className="text-left">{item.seriesData.name}</td>
                          <td className="text-center">{moment(item.date).format('MMM Do YYYY')}</td>
                          <td className="text-center">{item.time}</td>
                          <td className="text-right">{(item.joined_contest) ? item.joined_contest.length : 0}</td>
                          <td className="text-right">
                            {((item.win_flag == 0) && (item.show_win_amount == true)) ?
                              <button className={'btn btn-info mr-5'} type={'button'} onClick={(e) => { winning_distribute(item.match_id, item.series_id) }} > Winning Distribute</button>
                              : ((item.win_flag == 1) && (item.show_win_amount == true))
                                ? <span className={'btn btn-info mr-5'}> Distributed </span>
                                : <span className={'btn btn-info mr-5'}> No Amount Yet </span>
                            }
                            <button className={'btn circle_btn'} type={'button'} onClick={(e) => { refresh_rank(item.match_id, item.series_id) }}><i className="fa fa-undo fa-fw ml-1"></i> Refresh</button>

                          </td>
                        </tr>
                      )
                    })}
                    {_.isEmpty(users) && <tr><td colSpan="5"><div className="text-center">No Record Found</div></td></tr>}
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

export default Result;