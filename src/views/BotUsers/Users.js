import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import Helper from '../../constants/helper';
import apiUrl from '../../constants/apiPath';
import moment from "moment";
import Pagination from "react-js-pagination";
import { Card, CardBody, CardHeader, Col, Row, Table, Form, Input, FormGroup } from 'reactstrap';
import _ from "lodash";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Loaders from '../CommanPage/Loader'
// import Excelreport from '../Reports/excelreport';
import useSession from "react-session-hook";
import Status from './Action/Status';
import Delete from './Action/Delete';
import View from "./Action/View";
import BotInput from "./Action/BotInput";
import { useAlert } from "react-alert";
const Users = (props) => {
  const session = useSession();
  const alert = useAlert();
  const [users, setUsers] = useState([]);
  const [totalitems, setTotalItems] = useState('');
  const [activepage, setActivePage] = useState(1);
  const [startdate, setStartDate] = useState('');
  const [enddate, setEndDate] = useState('');
  const [serachstatus, setSerachStatus] = useState('');
  const [keywords, setKeyWords] = useState('');
  const [uniqueId, setUniqueId] = useState('');
  const [visible, setVisibale] = useState(false);
  const [token] = useState(session.token);
  const [isserach, setIsserach] = useState(false);
  // const [filename] = useState('supermasterexcel-file');
  const [serachbetstatus, setSerachbetStatus] = useState('');
  const [bankImage, setBankImage] = useState('');
  const [panImage, setPanImage] = useState('');
  const [userImage, setUserImage] = useState('');
  const [query, setQuery] = useState({});
  const [sortType, setSortType] = useState('');
  const [dateSortType, setDateSortType] = useState('');
  const [exportExcel, setExportExcel] = useState('');
  const module = session.profile.user_type == "editor" ? session.profile.permissions.find((e) => e.manager == "Users") : {}
  const { user_type } = session.profile
  const pageData = async (page = activepage) => {
    setVisibale(true);
    const itemsPerPage = 10;
    let path;
    setActivePage(page)
    query["page"] = page
    query["itemsPerPage"] = itemsPerPage
    let queryString = Helper.serialize(query);
    path = apiUrl.get_bot_users + `?${queryString}`;
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
      start_date: (startdate == '' ? '' : moment(startdate).format('YYYY-MM-DD')),
      end_date: (enddate == '' ? '' : moment(enddate).format('YYYY-MM-DD')),
      status: serachstatus
    }
    setQuery(queries)
    path = apiUrl.get_bot_users + '?uniqueId=' + `${uniqueId}` + '&page=' + `${page}` + '&itemsPerPage=' + `${itemsPerPage}` + '&keyword=' + `${keywords}` + '&user_start_date=' + `${startdate == '' ? '' : moment(startdate).format('YYYY-MM-DD')}` + '&user_end_date=' + `${enddate == '' ? moment(startdate).format('YYYY-MM-DD') : moment(enddate).format('YYYY-MM-DD')}` + '&status=' + `${serachstatus}` ;
    getData(path);
  };
  const handleNameSort = async () => {
    let nameSort = '';
    if (sortType == '') {
      setSortType('asc');
      nameSort = 'asc';
    } else if (sortType == 'asc') {
      setSortType('desc');
      nameSort = 'desc';
    } else {
      setSortType('asc');
      nameSort = 'asc';
    }

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
      status: serachstatus,
      nameSort: nameSort
    }
    setQuery(queries)
    path = apiUrl.get_bot_users + '?page=' + `${page}` + '&itemsPerPage=' + `${itemsPerPage}` + '&keyword=' + `${keywords}` + '&user_start_date=' + `${startdate == '' ? '' : moment(startdate).format('YYYY-MM-DD')}` + '&user_end_date=' + `${enddate == '' ? '' : moment(enddate).format('YYYY-MM-DD')}` + '&status=' + `${serachstatus}` + '&nameSort=' + `${nameSort}`;
    getData(path);

  }
  const handleDateSort = async () => {
    let dateSort = '';
    if (dateSortType == '') {
      setDateSortType('asc');
      dateSort = 'asc';
    } else if (dateSortType == 'asc') {
      setDateSortType('desc');
      dateSort = 'desc';
    } else {
      setDateSortType('asc');
      dateSort = 'asc';
    }

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
      status: serachstatus,
      dateSort: dateSort
    }
    setQuery(queries)
    path = apiUrl.get_bot_users + '?page=' + `${page}` + '&itemsPerPage=' + `${itemsPerPage}` + '&keyword=' + `${keywords}` + '&user_start_date=' + `${startdate == '' ? '' : moment(startdate).format('YYYY-MM-DD')}` + '&user_end_date=' + `${enddate == '' ? '' : moment(enddate).format('YYYY-MM-DD')}` + '&status=' + `${serachstatus}` + '&dateSort=' + `${dateSort}`;
    getData(path);

  }

  const resetSearch = async () => {
    let path = apiUrl.get_bot_users + '?page=1&itemsPerPage=10';
    getData(path)
  }

  const getData = async (path) => {
    const fr = await Helper.get(path, token);
    const res = await fr.response.json();
    if (fr.status === 200) {
      if (res.success) {
        setUsers(res.results.docs || []);
        setTotalItems(res.results.totalDocs);
        setExportExcel(res.excel_path);
        setBankImage(res.bank_statement);
        setPanImage(res.pan_image_path);
        setUserImage(res.user_image);
        setIsserach(false);
        setVisibale(false);
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
    setStartDate('');
    setEndDate('');
    setKeyWords('');
    setUniqueId('');
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
            <CardHeader className="align-items-center d-flex">
              Bot Users
              <div className="ml-auto">
                {<BotInput refreshData={pageData}/>}
              </div>
            </CardHeader>
            <CardBody>
              <div className="multipal-searching">
                <Row>
                  <Col lg={12}>
                    <Form>
                      <Row>
                        <Col md={3} sm={6} className="mb-2">
                          <FormGroup className="mb-xl-0">
                            <Input type="text" placeholder="Unique Id" value={uniqueId} className="form-control"
                              onChange={(e) => { setUniqueId(e.target.value) }} />
                          </FormGroup>
                        </Col>
                        <Col md={3} sm={6} className="mb-2">
                          <FormGroup className="mb-xl-0">
                            <Input type="text" placeholder="Search" value={keywords} className="form-control"
                              onChange={(e) => { setKeyWords(e.target.value) }} />
                          </FormGroup>
                        </Col>
                        <Col md={3} sm={6}>
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
                        <Col md={3} sm={6}>
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
                        <Col md={3} sm={6}>
                          <FormGroup className="mb-xl-0">
                            <select type="text" placeholder="Status" className="form-control" value={serachstatus}
                              onChange={(e) => { setSerachStatus(e.target.value) }} >
                              <option value="">Select Status</option>
                              <option value='active'>Active</option>
                              <option value='inactive'>Inactive</option>
                            </select>
                          </FormGroup>
                        </Col>

                        <Col md={6} sm={6} className="">
                    <button className="btn btn-primary ml-1" type="button" onClick={handleSearching}><i className="fa fa-search" /> Search{isserach === true && <i className="fa fa-spinner fa-pulse fa-fw ml-1" />}</button>
                    <button className="btn btn-success ml-1 " type="button" onClick={(e) => { onReset(); }}><i className="fa fa-undo" /> Reset</button>
                  </Col>

                      </Row>
                    </Form>
                  </Col>
      
                </Row>
                <br></br>
                <Row>
                  <Col md={3}>
                    <a href={exportExcel} download>
                      <button className="btn btn-primary mr-1 col-md-12" type="button"><i className="fa fa-file-excel-o" /> Export Excel</button>
                    </a>
                  </Col>
                  {/* <Col md={3}>
                    <div>
                      <Link to={{ pathname: `/import-users/` }} className="btn-link">
                        <button className="btn btn-primary mr-1 col-md-12" type="button" title="Import Excel">
                          <i className="fa fa-file-excel-o" /> Import Users
                            </button>
                      </Link>
                    </div>
                  </Col> */}
                </Row>
              </div>
              <div id="reportId" className='table-responisve-custom'>
                <Table hover bordered responsive className="mt-3 text-center">
                  <thead>
                    <tr>
                      <th className="text-align-left">Unique Id</th>
                      <th className="text-align-left">Name  {(sortType == '') ? <span onClick={handleNameSort}><i className="fa fa-sort pull-right sortSpan"></i></span> : sortType == 'asc' ? <span onClick={handleNameSort}><i className="fa fa-sort-up pull-right sortSpan"></i></span> : <span onClick={handleNameSort}><i className="fa fa-sort-down pull-right sortSpan"></i></span>}  </th>
                      <th className="text-align-left">Username</th>
                      {/* <th className="text-align-left">Email</th>
                      <th className="text-align-right">Phone</th>
                      <th className="text-align-right">Gender</th> */}
                      <th className="text-align-right">State</th>
                      <th className="text-align-left">OS Type</th>
                      <th className="text-align-left">Referral/Direct</th>
                      {/* <th className="text-align-center">Status</th> */}
                      <th className="text-align-center">Created At {(dateSortType == '') ? <span onClick={handleDateSort}><i className="fa fa-sort pull-right sortSpan"></i></span> : dateSortType == 'asc' ? <span onClick={handleDateSort}><i className="fa fa-sort-down pull-right sortSpan"></i></span> : <span onClick={handleDateSort}><i className="fa fa-sort-up pull-right sortSpan"></i></span>}  </th>
                      <th className="text-align-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    
                    {users.map((item, key) => {
                      return (
                        <tr key={key}>
                          <td className="text-align-left">{item._id}</td>
                          <td className="text-align-left">{item.first_name} {item.last_name}</td>
                          <td className="text-align-left">{item.username}
                            {/* <Link to={{ pathname: `/users/${item.id}` }} className="btn-link" target="_blank">{item.username}</Link> */}</td>
                          {/* <td className="text-align-left">{item.email}</td>
                          <td className="text-align-right">{item.phone}</td>
                          <td className="text-align-right">{item.gender}</td> */}
                          <td className="text-align-right">{item.state}</td>
                          <td className="text-align-left">Bot</td>
                          <td className="text-align-left">{item.referred_by ? 'Referral' : 'Direct'}</td>
                          {/* <td className="text-align-center">
                            <Status item={item} refreshData={pageData} />
                          </td> */}
                          <td className="text-align-center">{item.createdAt ? moment(item.createdAt).format('LLL') : moment(item.created_at).format('LLL')}</td>
                          <td className="text-align-center w-40 w-260">
                            {
                              _.isEmpty(props.match.params.id && true) ?
                                <div>
                                 {/*  {user_type === "editor" && module.delete == 1 ? <Delete item={item} refreshData={pageData} /> : user_type=="admin"?<Delete item={item} refreshData={pageData} />:null}
                                  {user_type === "editor" && module.edit == 1 ? <Link to={{ pathname: `/edit-bot-user/${item.id}` }} className="btn-link">
                                    <button className="btn btn-warning btn-sm mr-1" type="button" title="Edit Bot User">
                                      <i className="fa fa-pencil" />
                                    </button>
                                  </Link> : user_type=="admin"?<Link to={{ pathname: `/edit-user/${item.id}` }} className="btn-link">
                                    <button className="btn btn-warning btn-sm mr-1" type="button" title="Edit User">
                                      <i className="fa fa-pencil" />
                                    </button>
                                  </Link>:null} */}
                                  {user_type === "editor" && module.view === 1 ? <View item={item} userImage={userImage} /> :user_type=="admin"? <View item={item} userImage={userImage} />:null}
                                </div>
                                : null
                            }
                          </td>
                        </tr>
                      )
                    })}
                    {_.isEmpty(users) && <tr><td colSpan="13"><div className="text-center">No Record Found</div></td></tr>}
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

export default Users;
