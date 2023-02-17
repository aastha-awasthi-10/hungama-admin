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
import Delete from './Action/Delete';
import { useAlert } from "react-alert";

const Quizzes = (props) => {
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
  const [category, setCategory] = useState([]);
  const [category_id, setQuizCategory] = useState('');
  const [quizType, setQuizType] = useState('');
  const [query, setQuery] = useState({});

  // const [filename] = useState('supermasterexcel-file'); 
  const pageData = async (page = activepage) => {
    setVisibale(true);
    const itemsPerPage = 10;
    let path;
    setActivePage(page)
    query["page"] = page
    query["itemsPerPage"] = itemsPerPage
    let queryString = Helper.serialize(query); 
    path = apiUrl.get_quizzes + `?${queryString}`;
    getData(path)
  };

  /* const getData = async (page = activepage) => {
    setVisibale(true);
    const itemsPerPage = 10;
    let path;
    if (props.match.params.id) {
      path = apiUrl.get_quizzes + '/' + `${props.match.params.id}` + '?page=' + `${page}` + '&itemsPerPage=' + `${itemsPerPage}`;
    } else {
      path = apiUrl.get_quizzes + '?page=' + `${page}` + '&itemsPerPage=' + `${itemsPerPage}`;
    }
    const fr = await Helper.get(path, token);
    const res = await fr.response.json();
    if (fr.status === 200) {
      if (res.success) {
        setUsers(res.results.docs || []);
        setTotalItems(res.results.totalDocs);
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
      page:page,
      itemsPerPage:itemsPerPage,
      keyword:keywords,
      quizCat:category_id,
      quizType:quizType,
      start_date:(startdate == '' || startdate == null ? '' : moment(startdate).format('YYYY-MM-DD')),
      end_date:(enddate == '' || enddate == null ? '' : moment(enddate).format('YYYY-MM-DD')),
      status:serachstatus
    }
    setQuery(queries)

    path = apiUrl.get_quizzes + '?page=' + `${page}` + '&itemsPerPage=' + `${itemsPerPage}` + '&keyword=' + `${keywords}` + '&quizType=' + `${quizType}` + '&quizCat=' + `${category_id}` + '&start_date=' + `${startdate == '' || startdate == null ? '' : moment(startdate).format('YYYY-MM-DD')}` + '&end_date=' + `${enddate == '' || enddate == null ? '' : moment(enddate).format('YYYY-MM-DD')}` + '&status=' + `${serachstatus}`;
    getData(path);
  };

  const resetSearch = async () => {
    let path = apiUrl.get_quizzes
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
        setEndDate(startdate !==''?moment().format('LLL'):'')
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
    setQuizCategory('');
    setQuizType('');
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
            <CardHeader className="align-items-center d-flex">
            Quizzes Categories
              <div className="ml-auto">
                <Link to="/add-quiz" className="btn btn-primary">           
                  <i className="fa fa-plus mr-1"></i>Add Quiz
                </Link>   
              </div>
            </CardHeader>
            <CardBody>
              <div className="multipal-searching">
                <Row>
                  <Col lg={9}>
                    <Form>
                      <Row>
                        <Col md={2} sm={6}>
                          <FormGroup className="mb-xl-0">
                            <Input type="text" placeholder="Keyword" value={keywords} className="form-control"
                              onChange={(e) => { setKeyWords(e.target.value) }} />
                          </FormGroup>
                        </Col>
                        <Col md={2} sm={6}>
                          <FormGroup className="mb-xl-0">
                            <select name={'category'} className={"form-control"} value={category_id} onChange={(e) => { setQuizCategory(e.target.value); }} >
                              <option value={''}>Select Quiz Category</option>
                              {category.map((item, key) => {
                                return <option key={key} value={item.id}>{item.title}</option>
                              })};
                            </select>
                          </FormGroup>
                        </Col>
                        <Col md={2} sm={6}>
                          <FormGroup className="mb-xl-0">
                            <select name={'category'} className={"form-control"} value={quizType} onChange={(e) => { setQuizType(e.target.value); }} >
                              <option value={''}>-- Select Quiz Type --</option>
                              <option value={'free'}>Free</option>
                              <option value={'paid'}>Paid</option>
                            </select>
                          </FormGroup>
                        </Col>
                        <Col md={2} sm={6}>
                          <FormGroup className="mb-xl-0">
                            <DatePicker selected={startdate === '' || startdate === null ? "" : new Date(startdate)} className="form-control" placeholderText=" Start Date"
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
                          <FormGroup className="mb-xl-0">
                            <DatePicker selected={enddate === '' || enddate === null ? "" : new Date(enddate)} className="form-control" placeholderText=" End Date"
                              dateFormat="dd/MM/yyyy"
                              minDate={startdate === '' || startdate === null ? "" : new Date(startdate)}
                              // maxDate={new Date()}
                              onChange={handleEndDate}
                              peekNextMonth
                              showMonthDropdown
                              showYearDropdown
                              dropdownMode="select" />
                          </FormGroup>
                        </Col>
                        <Col md={2} sm={6}>
                          <FormGroup className="mb-xl-0">
                            <select type="text" placeholder="Status" className="form-control" value={serachstatus}
                              onChange={(e) => { setSerachStatus(e.target.value) }} >
                              <option value="">Select Quiz Status</option>
                              <option value='active'>Active</option>
                              <option value='inactive'>Inactive</option>
                            </select>
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
                      <th className="text-left">Name</th>
                      <th className="text-right">Question Count</th>
                      <th className="text-left">Quiz Category</th>
                      <th className="text-right">Difficulty Level</th>
                      <th className="text-right">Question Added</th>
                      <th className="text-left">Quiz Type</th>
                      <th className="text-left">Quiz Language</th>
                      <th className="text-right">Entry Fee</th>
                      <th className="text-right">winning Amount</th>
                      <th className="text-center">Status</th>
                      <th className="text-center">Created At</th>
                      <th className="text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((item, key) => {
                      return (
                        <tr key={key}>
                          <td className="text-left">{item.name}</td>
                          <td className="text-right">{item.questions_count}</td>
                          <td className="text-left">{item.category_id.title}</td>
                          <td className="text-right">{item.difficulty_level}</td>
                          <td className="text-left">{item.is_questions_added ? 'Yes' : 'No'}</td>
                          <td className="text-left">{_.upperFirst(item.quiz_type)}</td>
                          <td className="text-left">{item.quiz_language == 'english_hindi' ? _.upperFirst('hindi & english') : _.upperFirst(item.quiz_language)}</td>
                          <td className="text-right">{item.entry_fee}</td>
                          <td className="text-right">{item.winning_amount}</td>
                          <td className="text-center">
                            <Status item={item} refreshData={pageData} />
                          </td>
                          <td className="text-center">{moment(item.created_at).format('LLL')}</td>
                          <td className="text-center" className="w-40">
                            {
                              _.isEmpty(props.match.params.id && true) ?
                                <div>
                                  <Delete item={item} refreshData={pageData} />
                                  <Link to={{ pathname: `/edit-quiz/${item.id}` }} className="btn-link">
                                    <button className="btn circle_btn btn-sm mr-1" type="button" title="Status">
                                      <i className="fa fa-pencil" />
                                    </button>
                                  </Link>
                                </div>
                                : null
                            }
                          </td>
                        </tr>
                      )
                    })}
                    {_.isEmpty(users) && <tr><td colSpan="12"><div className="text-center">No Record Found</div></td></tr>}
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

export default Quizzes;
