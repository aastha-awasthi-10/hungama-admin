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
import View from "./Action/View";
import Delete from './Action/Delete';
import ViewBankDetails from "./Action/ViewBankDetails";
import ViewPancard from "./Action/ViewPancard";
import ChangePassword from "./Action/ChangePassword";
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
  const [visible, setVisibale] = useState(false);
  const [token] = useState(session.token);
  const [isserach, setIsserach] = useState(false);
  // const [filename] = useState('supermasterexcel-file');
  const [serachbetstatus, setSerachbetStatus] = useState('');
  const [bankImage, setBankImage] = useState('');
  const [panImage, setPanImage] = useState('');
  const [userImage, setUserImage] = useState('');
  const [query, setQuery] = useState({});
  const module = session.profile.user_type == "editor" ? session.profile.permissions.find((e) => e.manager == "Sub Admins") : {}
  const { user_type } = session.profile;
  const pageData = async (page = activepage) => {
    setVisibale(true);
    const itemsPerPage = 10;
    let path;
    setActivePage(page)
    query["page"] = page
    query["itemsPerPage"] = itemsPerPage
    let queryString = Helper.serialize(query);
    console.log("queryString",queryString)
    path = apiUrl.get_sub_admins + `?${queryString}`;
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
      start_date: (startdate == '' || startdate == null ? '' : moment(startdate).format('YYYY-MM-DD')),
      end_date: (enddate == ''  || enddate == null ? '' : moment(enddate).format('YYYY-MM-DD')),
      status: serachstatus
    }
    setQuery(queries)
    path = apiUrl.get_sub_admins + '?page=' + `${page}` + '&itemsPerPage=' + `${itemsPerPage}` + '&keyword=' + `${keywords}` + '&user_start_date=' + `${startdate == '' || startdate == null ? '' : moment(startdate).format('YYYY-MM-DD')}` + '&user_end_date=' + `${enddate == '' || enddate == null ? '' : moment(enddate).format('YYYY-MM-DD')}` + '&status=' + `${serachstatus}`;
    getData(path)
  };

  const resetSearch = async () => {
    let path = apiUrl.get_sub_admins + '?page=1&itemsPerPage=10';
    getData(path)
  }

  const getData = async (path) => {
    const fr = await Helper.get(path, token);
    const res = await fr.response.json();
    if (fr.status === 200) {
      if (res.success) {
        setUsers(res.results.docs || []);
        setTotalItems(res.results.totalDocs);
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
              Sub Admins
              <div className="ml-auto">
                <Link to="/add-sub-admin" className="btn btn-primary">
                  <i className="fa fa-plus mr-1"></i>Add Sub Admin
                </Link>
              </div>
            </CardHeader>
            <CardBody>
              <div className="multipal-searching">
                <Row>
                  <Col lg={9}>
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
                        <Col md={3} sm={6}>
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
                        <Col md={3} sm={6}>
                          <FormGroup className="mb-xl-0">
                            <select type="text" placeholder="Status" className="form-control" value={serachstatus}
                              onChange={(e) => { setSerachStatus(e.target.value) }} >
                              <option value="">Select  Status</option>
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
                      <th className="text-align-left">Name</th>
                      <th className="text-align-left">Username</th>
                      <th className="text-align-left">Email</th>
                      <th className="text-align-right">Phone</th>
                      <th className="text-align-center">Status</th>
                      <th className="text-align-center">Created At</th>
                      <th className="text-align-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((item, key) => {
                      return (
                        <tr key={key}>
                          <td className="text-align-left">{item.full_name}</td>
                          <td className="text-align-left"><Link to={{ pathname: `/users/${item.id}` }} className="btn-link" target="_blank">{item.username}</Link></td>
                          <td className="text-align-left">{item.email}</td>
                          <td className="text-align-right">{item.phone}</td>
                          <td className="text-align-center">
                            <Status item={item} refreshData={pageData} />
                          </td>
                          <td className="text-align-center">{moment(item.createdAt).format('LLL')}</td>
                          <td className="text-align-center w-40">
                            {
                              _.isEmpty(props.match.params.id && true) ?
                                <div>
                                  {((user_type === "editor" && module.delete == 1) || user_type=="admin")?<Delete item={item} refreshData={pageData} />:null}
                                  
                                  {((user_type === "editor" && module.edit == 1) || user_type=="admin")?                                  
                                  <Link to={{ pathname: `/edit-sub-admin/${item.id}` }} className="btn-link">
                                    <button className="btn circle_btn btn-sm mr-1" type="button" title="Edit User">
                                      <i className="fa fa-pencil" />
                                    </button>
                                  </Link>
                                  :null}

                                  {((user_type === "editor" && module.view == 1) || user_type=="admin")?
                                  <>
                                  <View item={item} userImage={userImage} />
                                  <ChangePassword item={item} refreshData={pageData} />
                                  {(item.bank_verified && item.bank_verified != 0) ? <ViewBankDetails item={item} bank_img={bankImage} refreshData={getData} /> : null}
                                  {(item.pan_verified && item.pan_verified != 0) ? <ViewPancard item={item} pan_img={panImage} refreshData={getData} /> : null}
                                  </>
                                  :null}
                                  
                                </div>
                                : null
                            }
                          </td>
                        </tr>
                      )
                    })}
                    {_.isEmpty(users) && <tr><td colSpan="10"><div className="text-center">No Record Found</div></td></tr>}
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
