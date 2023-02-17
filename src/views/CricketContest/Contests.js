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
import Delete from './Action/Delete';
import View from "./Action/View";
import ContestWinners from "./Action/ContestWinners";
import ViewContest from "./ViewCricketContest";
import { useAlert } from "react-alert";

const Contests = (props) => {
  const session = useSession();
  const alert = useAlert();
  const [users, setUsers] = useState([]);
  const [totalitems, setTotalItems] = useState('');
  const [activepage, setActivePage] = useState(1);
  const [startdate, setStartDate] = useState('');
  const [enddate, setEndDate] = useState('');
  const [min_entry_fee, setMinEntryFee] = useState('');
  const [max_entry_fee, setMaxEntryFee] = useState('');
  const [min_winning_amount, setMinWinningAmount] = useState('');
  const [max_winning_amount, setMaxWinningAmount] = useState('');
  const [serachstatus, setSerachStatus] = useState('');
  const [keywords, setKeyWords] = useState('');
  const [contest_size, setContestSize] = useState('');
  const [visible, setVisibale] = useState(false);
  const [token] = useState(session.token);
  const [isserach, setIsserach] = useState(false);
  const [category, setCategory] = useState([]);
  const [category_id, setQuizCategory] = useState('');
  const [contestType, setContestType] = useState('');
  const [query, setQuery] = useState({});
  const [limit, setLimit] = useState(10);
  // const [filename] = useState('supermasterexcel-file'); 

  const pageData = async (page = activepage) => {
    setVisibale(true);
    const itemsPerPage = 10;
    let path;
    setActivePage(page)
    query["page"] = page
    query["itemsPerPage"] = itemsPerPage
    let queryString = Helper.serialize(query);
    path = apiUrl.get_cricket_constest + `?${queryString}`;
    getData(path)
  };
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
      contest_size: contest_size,
      min_entry_fee: min_entry_fee,
      max_entry_fee: max_entry_fee,
      min_winning_amount: min_winning_amount,
      max_winning_amount: max_winning_amount,
      contestType: contestType,
      quizCat: category_id,
      start_date: (startdate == '' || startdate == null ? '' : moment(startdate).format('YYYY-MM-DD')),
      end_date: (enddate == '' || enddate == null ? '' : moment(enddate).format('YYYY-MM-DD')),
      status: serachstatus
    }
    setQuery(queries)
    path = apiUrl.get_cricket_constest + '?page=' + `${page}` + '&itemsPerPage=' + `${itemsPerPage}` + '&keyword=' + `${keywords}` + '&min_entry_fee=' + `${min_entry_fee}` + '&max_entry_fee=' + `${max_entry_fee}` + '&min_winning_amount=' + `${min_winning_amount}` + '&max_winning_amount=' + `${max_winning_amount}` + '&contest_size=' + `${contest_size}` + '&contestType=' + `${contestType}` + '&quizCat=' + `${category_id}` + '&start_date=' + `${startdate == '' || startdate == null ? '' : moment(startdate).format('YYYY-MM-DD')}` + '&end_date=' + `${enddate == '' || enddate == null ? '' : moment(enddate).format('YYYY-MM-DD')}` + '&status=' + `${serachstatus}`;
    getData(path)
  };

  const resetSearch = async () => {
    let path = apiUrl.get_cricket_constest + '?page=1&itemsPerPage=10';
    getData(path)
  }

  const getData = async (path) => {
    const fr = await Helper.get(path, token);
    const res = await fr.response.json();
    if (fr.status === 200) {
      if (res.success) {
        setUsers(res.results.docs || []);
        setTotalItems(res.results.totalDocs);
        setLimit(res.results.limit);
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
    setContestSize("")
    setMinWinningAmount('');
    setMaxWinningAmount('');
    setMinEntryFee('');
    setMaxEntryFee('');
    setActivePage(1);
  };

  const handleUpdateRank = async (contestid) => {
    let path = apiUrl.update_rank;
    const fr = await Helper.post({ contest_id: contestid }, path, token);
    const res = await fr.response.json();
    if (fr.status === 200) {
      if (res.success) {
        alert.success(res.msg);
        getData();
        setVisibale(false)
      } else {
        alert.error(res.msg);
        setVisibale(false)
      }
    } else {
      alert.error(res.error);
      setVisibale(false)
    }
  }

  const handleUpdatePrize = async (contestid) => {
    let path = apiUrl.update_prize_distribution;
    const fr = await Helper.post({ contest_id: contestid }, path, token);
    const res = await fr.response.json();
    if (fr.status === 200) {
      if (res.success) {
        alert.success(res.msg);
        getData();
        setVisibale(false)
      } else {
        alert.error(res.msg);
        setVisibale(false)
      }
    } else {
      alert.error(res.error);
      setVisibale(false)
    }
  }

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
            <CardHeader className="align-items-center d-flex">
              Cricket Contests
              <div className="ml-auto">
                <Link to="/cricket/add-contest" className="btn btn-primary">
                  <i className="fa fa-plus mr-1"></i>Add Cricket Contest
                </Link>
              </div>
            </CardHeader>
            <CardBody>
              <div className="multipal-searching">
                <Row className='contest-searching'>
                  <Col lg={12}>
                    <Form>
                      <Row>
                        <Col md={2} sm={6}>
                          <FormGroup className="">
                            <Input type="text" placeholder="Search" value={keywords} className="form-control"
                              onChange={(e) => { setKeyWords(e.target.value) }} />
                          </FormGroup>
                        </Col>
                        <Col md={2} sm={6}>
                          <FormGroup className="">
                            <Input type="number" placeholder="Contest Size" value={contest_size} className="form-control"
                              onChange={(e) => { setContestSize(e.target.value) }} />
                          </FormGroup>
                        </Col>
                        <Col md={2} sm={6}>
                          <FormGroup className="">
                            <select name={'category'} className={"form-control"} value={category_id} onChange={(e) => { setQuizCategory(e.target.value); }} >
                              <option value={''}>Cricket Category</option>
                              {category.map((item, key) => {
                                return <option key={key} value={item.id}>{item.title}</option>
                              })};
                            </select>
                          </FormGroup>
                        </Col>
                        <Col md={2} sm={6}>
                          <FormGroup className="">
                            <select name={'category'} className={"form-control"} value={contestType} onChange={(e) => { setContestType(e.target.value); }} >
                              <option value={''}>Contest Type</option>
                              <option value={'free'}>Free</option>
                              <option value={'paid'}>Paid</option>
                            </select>
                          </FormGroup>
                        </Col>
                        <Col md={2} sm={6}>
                          <FormGroup className="">
                            <Input type="text" placeholder="Min Winning Amount" value={min_winning_amount} className="form-control"
                              onChange={(e) => { setMinWinningAmount(e.target.value) }} />
                          </FormGroup>
                        </Col>
                        <Col md={2} sm={6}>
                          <FormGroup className="">
                            <Input type="text" placeholder="Max Winning Amount" value={max_winning_amount} className="form-control"
                              onChange={(e) => { setMaxWinningAmount(e.target.value) }} />
                          </FormGroup>
                        </Col>
                        <Col md={2} sm={6}>
                          <FormGroup className="">
                            <Input type="text" placeholder="Min Entry Fee" value={min_entry_fee} className="form-control"
                              onChange={(e) => { setMinEntryFee(e.target.value) }} />
                          </FormGroup>
                        </Col>
                        <Col md={2} sm={6}>
                          <FormGroup className="">
                            <Input type="text" placeholder="Max Entry Fee" value={max_entry_fee} className="form-control"
                              onChange={(e) => { setMaxEntryFee(e.target.value) }} />
                          </FormGroup>
                        </Col>
                        <Col md={2} sm={6}>
                          <FormGroup className="">
                            <DatePicker selected={startdate == '' || startdate == null ? "" : new Date(startdate)} className="form-control" placeholderText=" Start Date"
                              dateFormat="dd/MM/yyyy"
                              // maxDate={new Date()}
                              onChange={handleStartDate}
                              peekNextMonth
                              showMonthDropdown
                              showYearDropdown
                              dropdownMode="select" />
                          </FormGroup>
                        </Col>
                        <Col md={2} sm={6}>
                          <FormGroup className="">
                            <DatePicker selected={enddate == '' || enddate == null ? "" : new Date(enddate)} className="form-control" placeholderText=" End Date"
                              dateFormat="dd/MM/yyyy"
                              minDate={startdate == '' || startdate == null ? "" : new Date(startdate)}
                              // maxDate={new Date()}
                              onChange={handleEndDate}
                              peekNextMonth
                              showMonthDropdown
                              showYearDropdown
                              dropdownMode="select" />
                          </FormGroup>
                        </Col>
                        <Col md={2} sm={6}>
                          <FormGroup className="">
                            <select type="text" placeholder="Status" className="form-control" value={serachstatus}
                              onChange={(e) => { setSerachStatus(e.target.value) }} >
                              <option value="">Contest Status</option>
                              <option value='active'>Active</option>
                              <option value='inactive'>Inactive</option>
                            </select>
                          </FormGroup>
                        </Col>

                        <Col md={2} sm={6} className=" ">
                        <button className="btn btn-primary ml-1" type="button" onClick={handleSearching}><i className="fa fa-search" /> Search{isserach === true && <i className="fa fa-spinner fa-pulse fa-fw ml-1" />}</button>
                        <button className="btn dark_btn ml-1 " type="button" onClick={(e) => { onReset(); }}><i className="fa fa-undo" /> Reset</button>
                      </Col>

                      </Row>
                    </Form>
                  </Col>
       
                </Row>
              </div>
              <div id="reportId" >
                <Table hover bordered responsive className="mt-3 text-center">
                  <thead>
                    <tr>
                      <th className="text-left">Name</th>
                      <th className="text-left">Contest Category</th>
                      <th className="text-right">Winning Amount</th>
                      <th className="text-right">Contest Size</th>
                      <th className="text-left">Contest Type</th>
                      <th className="text-right">Entry Fee</th>
                      <th className="text-center">Max Team For Contest</th>
                      <th className="text-center">Created At</th>
                      {/* <th>Joined Users</th>
                      <th>Start Date</th>                     
                      <th>End Date</th>  */}
                      <th className="text-center">Status</th>
                      <th className="text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((item, key) => {
                      return (
                        <tr key={Math.floor((Math.random() * 10000000) + 1)}>
                          <td className="text-left">{item.name}</td>
                          <td className="text-left">{item.category_id.title}</td>
                          <td className="text-right">{item.winning_amount}</td>
                          <td className="text-right">{item.users_limit}</td>
                          <td className="text-left">{item.contest_type}</td>
                          <td className="text-right">{item.entry_fee}</td>
                          <td className="text-right">{item.max_team_join_count!=0?item.max_team_join_count:'1'}</td>
                          <td className="text-center">{moment(item.created_at).format('lll')}</td>
                          {/* <td>{item.joined_user_count}</td>
                          <td>{moment(item.start_date).format('lll')}</td>
                          <td>{moment(item.end_date).format('lll')}</td> */}
                          <td className="text-center">
                            {item.status != 'inactive' ? item.status : <Status item={item} refreshData={pageData} />}
                          </td>
                          <td className="text-center" className="w-40">
                            {
                              _.isEmpty(props.match.params.id && true) ?
                                item.status === 'inactive' &&
                                <div>
                                  <Link to={{ pathname: `/cricket/edit-contest/${item.id}` }} className="btn-link">
                                    <button className="btn circle_btn btn-sm mr-1" type="button" title="Edit">
                                      <i className="fa fa-pencil" />
                                    </button>
                                  </Link>
                                  <Delete item={item} refreshData={pageData} />
                                </div>
                                : null
                            }
                            {item.status == 'completed' && !item.isRanked ?
                              <button className="btn circle_btn btn-sm mr-1" onClick={(e) => handleUpdateRank(item.id)} type="button" title="Update rank"> Update rank</button>
                              : null
                            }
                            {item.status == 'completed' && item.isRanked && !item.isPrizeDistributed ?
                              <button className="btn circle_btn btn-sm mr-1 mt-1" onClick={(e) => handleUpdatePrize(item.id)} type="button" title="Prize Distribution"> Prize Distribution</button>
                              : null
                            }
                            {item.status == 'completed' ?
                              <div>
                                <Link to={{ pathname: `/view-winners/${item.id}` }} className="btn-link">
                                  <button className="btn btn-success btn-sm mt-1 " type="button" title="Winners">Winners
                                  </button>
                                </Link>
                              </div>
                              : null
                            }

                            <ViewContest item={item} />
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
