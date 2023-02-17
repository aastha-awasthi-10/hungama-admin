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
  const [contests, setContests] = useState([]);
  const [totalitems, setTotalItems] = useState('');  
  const [totalEarning, setTotalEarning] = useState(0);  
  const [activepage, setActivePage] = useState(1);
  const [startdate, setStartDate] = useState('');
  const [enddate, setEndDate] = useState('');
  const [serachstatus, setSerachStatus] = useState('');
  const [keywords, setKeyWords] = useState('');
  const [series_id, setSeriesId] = useState('');
  const [match_id, setMatchId] = useState('');
  const [contest_id, setContestId] = useState('');
  const [visible, setVisibale] = useState(false);
  const [token] = useState(session.token);
  const [isserach, setIsserach] = useState(false);
  const [category, setCategory] = useState([]);
  const [category_id, setQuizCategory] = useState('');
  const [type, setType] = useState('');
  const [ToatlEarning, setToatlEarning] = useState(0);
  const [dropdown, setDropdown] = useState([]);
  const [match_dropdown, setMatchDropdown] = useState([]);
  const [contest_dropdown, setContestDropdown] = useState([]);
  const [query, setQuery] = useState({});
  const [exportExcel, setExportExcel] = useState('');

  let TotalEarning = 0;

  // const [filename] = useState('supermasterexcel-file'); 

  const pageData = async (page = activepage) => {
    setVisibale(true);
    const itemsPerPage = 10;
    setActivePage(page)
    let path;
    query["page"] = page
    query["itemsPerPage"] = itemsPerPage
    let queryString = Helper.serialize(query);
    path = apiUrl.get_cricket_contest + `?${queryString}`;
    getData(path)
  };

  const getSeriesData = async () => {
    setVisibale(true);
    let path;
    path = apiUrl.get_series;

    const fr = await Helper.get(path, token);
    const res = await fr.response.json();

    if (fr.status === 200) {

      if (res.success) {
        setDropdown(res.results || []);
      } else {
        alert.error(res.msg);
      }
    } else {
      alert.error(res.error);
    }
  };
  const getContest = async () => {
    setVisibale(true);
    let path;
    path = apiUrl.get_all_constest;

    const fr = await Helper.get(path, token);
    const res = await fr.response.json();

    if (fr.status === 200) {
      console.log("res contest",res);
      if (res.success) {
        setContestDropdown(res.results || []);
      } else {
        alert.error(res.msg);
      }
    } else {
      alert.error(res.error);
    }
  };

  useEffect(() => {
    pageData();
    getSeriesData();
    getContest();
  }, []);

  const handleChange = async (e) => {
    if(e.target.name === 'series_id') {
      let seriesId = e.target.value
      setSeriesId(e.target.value);
      let path;
      path = apiUrl.series_old_matches + '/' + `${seriesId}`;
  
      const fr = await Helper.get(path, token);
      const res = await fr.response.json();
  
      if (fr.status === 200) {
        console.log("res",res)
        if (res.success) {
          setMatchDropdown(res.results.docs || []);
        } else {
          alert.error(res.msg);
        }
      } else {
        alert.error(res.error);
      }

    } else if(e.target.name === 'match_id') {
      setMatchId(e.target.value);
    }
    else if(e.target.name === 'contest_id') {
      setContestId(e.target.value);
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
      series_id: series_id,
      match_id: match_id,
      contest_id: contest_id,
      start_date: (startdate == '' ? '' : moment(startdate).format('YYYY-MM-DD')),
      end_date: (enddate == '' ? '' : moment(enddate).format('YYYY-MM-DD')),
      status: serachstatus
    }
    setQuery(queries)

    path = apiUrl.get_cricket_contest + '?page=' + `${page}` + '&itemsPerPage=' + `${itemsPerPage}` + '&keyword=' + `${keywords}` + '&statement_type=' + `${type}` + '&quizCat=' + `${category_id}` + '&start_date=' + `${startdate == '' ? '' : moment(startdate).format('YYYY-MM-DD')}` + '&end_date=' + `${enddate == '' ? '' : moment(enddate).format('YYYY-MM-DD')}` + '&status=' + `${serachstatus}` + '&series_id=' + `${series_id}` + '&match_id=' + `${match_id}` + '&contest_id=' + `${contest_id}`;
    getData(path)
  };

  const getData = async (path) => {
    const fr = await Helper.get(path, token);
    const res = await fr.response.json();
    if (fr.status === 200) {
      if (res.success) {
        setContests(res.results || []);
        setTotalItems(res.totalRecords);
        setTotalEarning(res.TotalEarning);
        setExportExcel(res.excel_path);
        setVisibale(false)
        setIsserach(false);
      } else {
        alert.error(res.msg);
        setIsserach(false); 
        setVisibale(false);
      }
    } else {
      alert.error(res.error);
      setIsserach(false); 
      setVisibale(false);
    }
  };

  const resetSearch = async () => {
    let path = apiUrl.get_cricket_contest + '?page=1&itemsPerPage=10';
    getData(path)
  }
  
  const onReset = (e) => {
    setQuery({})
    setStartDate('');
    setEndDate('');
    setKeyWords('');
    setSerachStatus('');
    setType('');
    getData();
    setSeriesId('');
    setMatchId('');
    setContestId('');
    resetSearch();
    setActivePage(1);
  };

  return (
    <div className="animated fadeIn loader-outer">
      <Loaders className="overlay-loader" visible={visible} />
      <Row>
        <Col>
          <Card>
            <CardHeader>
              <i className="fa fa-list" /> Cricket Earning Manager
              </CardHeader>
            <CardBody>
              <div className="multipal-searching">
                <Row>
                  <Col lg={12}>
                    <Form>
                      <Row>
                        <Col md={3}>
                          <FormGroup className="mb-xl-0">
                            <select className={"form-control"} value={series_id} name="series_id" onChange={handleChange}>
                              <option value={""}>Select Series</option>
                              {
                                dropdown.map((type, index) => {
                                  return <option key={index} value={type.id_api}>{type.name}</option>
                                })
                              }
                            </select>
                          </FormGroup>
                        </Col>
                        <Col md={3}>
                          <FormGroup className="mb-xl-0">
                            <select className={"form-control"} value={match_id} name="match_id" onChange={handleChange}>
                              <option value={""}>Select Match</option>
                              {
                                match_dropdown.map((item, index) => {
                                  return <option key={index} value={item.match_id}>{item.localteam} Vs {item.visitorteam} ( {moment(item.date).format('LLL')})</option>
                                })
                              }
                            </select>
                          </FormGroup>
                        </Col>
                        <Col md={3}>
                          <FormGroup className="mb-xl-0">
                            <select className={"form-control"} value={contest_id} name="contest_id" onChange={handleChange}>
                              <option value={""}>Select Contest</option>
                              {
                                contest_dropdown.map((item, index) => {
                                  return <option key={index} value={item.id}>{item.name} </option>
                                })
                              }
                            </select>
                          </FormGroup>
                        </Col>
                        <Col md={3}>
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
                        <Col md={3}>
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
                        </Col>
                      </Row>
                    </Form>
                  </Col>
                  <Col lg={2}>
                    <Row>
                      <Col md={12}>
                        <button className="btn btn-primary mr-1 col-md-5" type="button" onClick={handleSearching}><i className="fa fa-search" /> Search{isserach === true && <i className="fa fa-spinner fa-pulse fa-fw ml-1" />}</button>
                        <button className="btn dark_btn  col-md-5" type="button" onClick={(e) => { onReset(); }}><i className="fa fa-undo" /> Reset</button>
                      </Col>
                    </Row>
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
                      <th colSpan="8"> </th>
                      <th>Total Earning : </th>
                      <th>{totalEarning.toFixed(2)}</th> 
                    </tr>

                    <tr>
                      <th>Sr.No</th>
                      <th>Match Name</th>
                      <th>Match Date</th>
                      <th>Match Status</th>
                      <th>Total Contest</th>
                      <th>Total Team</th>
                      <th>Amount INR</th>
                      <th>Bonus INR</th>
                      <th>Winning Distribution INR</th>
                      <th>Total Earning INR</th>
                      {/* <th>Action</th> */}
                    </tr>
                  </thead>
                  <tbody>
                    {
                      contests.map((item, key) => {
                        // let bonusAmount = item.bonus == 0 ? 0 : ((item.bonus * item.entry_fee) / 100);
                        // let totalEntry = item.entry_fee * item.team_count;
                        // let totalEarn = totalEntry - (bonusAmount);
                        // TotalEarning = TotalEarning + totalEarn;
                        
                        let bonusAmount = item.bonus == 0 ? 0 : item.bonus;
                        let totalEntry = item.entry_fee;
                        let totalEarn = totalEntry - (bonusAmount) - item.winning_amount;
                        TotalEarning = TotalEarning + totalEarn;
                        return (
                          <tr key={key}>
                            <td>{key + 1}</td>
                            <td>{item.localteam } Vs {item.visitorteam }</td>
                            <td>{moment(item.date).format('LLL')}</td>
                            <td>{item.match_status}</td>
                            <td>{item.contest_count}</td>
                            <td>{item.team_count}</td>
                            <td>{item.entry_fee.toFixed(2)}</td>
                            <td>{item.bonus.toFixed(2)}</td>
                            <td>{item.winning_amount.toFixed(2)}</td>
                            <td>{totalEarn.toFixed(2)}</td>
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
                    {_.isEmpty(contests) && <tr><td colSpan="11"><div className="text-center">No Record Found</div></td></tr>}
                  </tbody>
                  {/* <tfoot>
                    <tr>
                      <th colSpan="8"> </th>
                      <th>Total Earning Sum : </th>
                      <th>{TotalEarning.toFixed(2)}</th>  
                      <th></th>
                    </tr>
                  </tfoot> */}
                </Table>
              </div>
              {!_.isEmpty(contests) && <div className="show-pagination technician-page">
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
