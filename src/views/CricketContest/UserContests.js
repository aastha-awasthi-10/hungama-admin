import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import Helper from '../../constants/helper';
import apiUrl from '../../constants/apiPath';
import moment from "moment";
import Pagination from "react-js-pagination";
import { Card, Button, CardBody, CardHeader, Col, Row, Table, Form, Input, FormGroup } from 'reactstrap';
import _, { isUndefined } from "lodash";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Loaders from '../CommanPage/Loader'
// import Excelreport from '../Reports/excelreport';
import useSession from "react-session-hook";
import Status from './Action/Status';
import ViewContest from "./ViewCricketContest";
import { useAlert } from "react-alert";

const Contests = (props) => {
  const session = useSession();
  const alert = useAlert();
  const [users, setUsers] = useState([]);
  const [totalitems, setTotalItems] = useState('');
  const [activepage,setActivePage] = useState(1);
  const [startdate, setStartDate] = useState('');
  const [enddate, setEndDate] = useState('');
  const [serachstatus, setSerachStatus] = useState('');
  const [keywords, setKeyWords] = useState('');
  const [visible, setVisibale] = useState(false);
  const [token] = useState(session.token);
  const [isserach, setIsserach] = useState(false);
  const [query, setQuery] = useState({});

  const pageData = async (page = activepage) => {
    setVisibale(true);
    const itemsPerPage = 10;
    let path;
    setActivePage(page)
    query["page"] = page
    query["itemsPerPage"] = itemsPerPage
    let queryString = Helper.serialize(query);
    path = apiUrl.get_cricket_user_constest + `?${queryString}`;
    getData(path)
  };

  const getData = async (path) => {
    
    const fr = await Helper.get(path, token);
    const res = await fr.response.json();
    if (fr.status === 200) {
      // console.log("res",res);
      if (res.success) {
        setUsers(res.results || []);
        console.log("res.results",res.results);
        setTotalItems(res.results[0]?.totalDocs || 0);
        setVisibale(false)
        setIsserach(false);
      } else {
        alert.error(res.msg);
        setVisibale(false)
        setIsserach(false);
      }
    } else {
      alert.error(res.error);
      setVisibale(false)
      setIsserach(false);
    }
  };

  const resetSearch = async () => {
    let path = apiUrl.get_cricket_user_constest + '?page=1&itemsPerPage=10';
    getData(path)
  }
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
      start_date: (startdate == '' ? '' : moment(startdate).format('YYYY-MM-DD')),
      end_date: (enddate == '' ? '' : moment(enddate).format('YYYY-MM-DD')),
      status: serachstatus
    }
    console.log("page",page)
    setQuery(queries)
    path = apiUrl.get_cricket_user_constest + '?page=' + `${page}` + '&itemsPerPage=' + `${itemsPerPage}` + '&keyword=' + `${keywords}` + '&start_date=' + `${startdate == '' ? '' : moment(startdate).format('YYYY-MM-DD')}` + '&end_date=' + `${enddate == '' ? '' : moment(enddate).format('YYYY-MM-DD')}`;
    console.log("path",path);
    getData(path)
  };
  const handleStartDate = (date) => {
    setEndDate('');
    setStartDate(date);
  };

  const handleEndDate = (date) => {
    setEndDate(date);
  };

  const onReset = (e) => {
    setQuery({})
    setStartDate('');
    setEndDate('');
    setKeyWords('');
    setSerachStatus('');
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
                Contest List Added By User
              </CardHeader>
            <CardBody>

            <div className="multipal-searching">
                <Row className='contest-searching'>
                  <Col lg={10}>
                    <Form>
                      <Row>
                        <Col md={4} sm={6}>
                          <FormGroup className="">
                            <Input type="text" placeholder="Search" value={keywords} className="form-control"
                              onChange={(e) => { setKeyWords(e.target.value) }} />
                          </FormGroup>
                        </Col>
                        <Col md={4} sm={6}>
                          <FormGroup className="">
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
                          <FormGroup className="">
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
                  <Col xl={2} className="d-flex">
                    <button className="btn btn-primary ml-1" type="button" onClick={handleSearching}><i className="fa fa-search" /> Search{isserach === true && <i className="fa fa-spinner fa-pulse fa-fw ml-1" />}</button>
                    <button className="btn dark_btn ml-1 " type="button" onClick={(e) => { onReset(); }}><i className="fa fa-undo" /> Reset</button>
                  </Col>
                </Row>
              </div>

              <div id="reportId" >
                <Table hover bordered responsive className="mt-3 text-center">
                  <thead>
                    <tr>
                      <th className="text-right">Contest Name</th>
                      <th className="text-right">Created By</th>
                      <th className="text-right">Winning Amount</th>
                      <th className="text-right">Contest Size</th>
                      <th className="text-left">Contest Type</th>
                      <th className="text-right">Entry Fee</th>
                      <th className="text-center">Created At</th>
                      <th className="text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((item, key) => {
                      return (
                        <tr key={Math.floor((Math.random() * 10000000) + 1)}>
                          <td className="text-right">{item.rows.name}</td>
                          <td className="text-right">{item.rows.first_name?item.rows.first_name:"" } {""}{item.rows.last_name?item.rows.last_name:"" }</td>
                          <td className="text-right">{item.rows.winning_amount}</td>
                          <td className="text-right">{item.rows.users_limit}</td>
                          <td className="text-left">{item.rows.contest_type}</td>
                          <td className="text-right">{item.rows.entry_fee}</td>
                          <td className="text-center">{moment(item.rows.created_at).format('lll')}</td>
                          <td className="text-center">
                            <div>
                              <ViewContest item={item.rows} />
                            </div>
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

export default Contests;
