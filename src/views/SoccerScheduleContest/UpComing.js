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
import Swal from "sweetalert2";

import EditNews from '../News/EditNews';

const UpComing = (props) => {
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
  // const [filename] = useState('supermasterexcel-file'); 
  const [auto_create, setAutoCreate] = useState(false);
  const [query, setQuery] = useState({});


  const pageData = async (page = activepage) => {
    setVisibale(true);
    const itemsPerPage = 10;
    let path;
    setActivePage(page)
    query["page"] = page
    query["itemsPerPage"] = itemsPerPage
    let queryString = Helper.serialize(query);
    path = apiUrl.get_soccer_series_matches + `?${queryString}`;
    getData(path)
  };

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

    path = apiUrl.get_soccer_series_matches + '?page=' + `${page}` + '&itemsPerPage=' + `${itemsPerPage}` + '&keyword=' + `${keywords}` + '&contestType=' + `${contestType}` + '&quizCat=' + `${category_id}` + '&start_date=' + `${startdate == '' ? '' : moment(startdate).format('YYYY-MM-DD')}` + '&end_date=' + `${enddate == '' ? '' : moment(enddate).format('YYYY-MM-DD')}` + '&status=' + `${serachstatus}`;
    getData(path)
  };

  const resetSearch = async () => {
    let path = apiUrl.get_soccer_series_matches + '?page=1&itemsPerPage=10';
    getData(path)
  }

  const getData = async (path) => {
    const fr = await Helper.get(path, token);
    const res = await fr.response.json();
    if (fr.status === 200) {
      if (res.success) {
        setUsers(res.results || []);
        // setTotalItems(res.results[0].totalDocs);
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

  const updateMatchLineUP = async (status, Id) => {
    let SwalConfig = Helper.SwalConfig();
    const result = await Swal.fire(SwalConfig);
    let postJson = { id: Id, status: status };
    let path = apiUrl.update_soccer_match_lineup;
    const fr = await Helper.post(postJson, path, token);
    const res = await fr.response.json();
    if (fr.status === 200) {
      if (res.success) {
        pageData();
        alert.success(res.msg);
      } else {
        alert.error(res.msg);
      }
    } else {
      alert.error(res.error);
    }

  }

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
                  <Col lg={9}>
                    <Form>
                      <Row>
                        <Col md={4} sm={6}>
                          <FormGroup className="mb-xl-0">
                            <Input type="text" placeholder="Series Name" value={keywords} className="form-control"
                              onChange={(e) => { setKeyWords(e.target.value) }} />
                          </FormGroup>
                        </Col>
                        {/* <Col md={4} sm={6}>
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
                        <Col md={4} sm={6}>
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
                      <th className="text-center">Add Contests</th>
                      <th className="text-center">LineUp</th>
                      <th className="text-center">Extend Time</th>
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
                          <td className="text-center">
                            <Link to={{ pathname: `/soccer/schedule-update-contests/${item._id}` }} className="btn-link">
                              <button className="btn btn-success col-md-12" type="button" title="Add Contest">Add Contest</button>
                            </Link>
                          </td>
                          <td>
                            <span> <input type="checkbox" name="test" checked={item.lineup || false} onChange={() => updateMatchLineUP(!item.lineup, item._id)} /></span>
                          </td>
                          <td className="text-center">
                            <ExtendDate id={item._id} selected={new Date(item.date)} time={item.time} refreshData={pageData} />
                          </td>
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

export default UpComing;