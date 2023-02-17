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
import Edit from "./Action/Edit";
import { useAlert } from "react-alert";

const WalletManager = (props) => {
  const session = useSession();
  const alert = useAlert();
  const [users, setUsers] = useState([]);
  const [totalitems, setTotalItems] = useState('');
  // const [activepage] = useState(1);
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
  const [query, setQuery] = useState({});
  const [exportExcel, setExportExcel] = useState('');
  const module = session.profile.user_type == "editor" ? session.profile.permissions.find((e) => e.manager == "Wallet Manager") : {}
  const { user_type } = session.profile


  // const [filename] = useState('supermasterexcel-file'); 

  const pageData = async (page = activepage) => {
    setVisibale(true);
    const itemsPerPage = 10;
    setActivePage(page);
    let path;
    query["page"] = page
    query["itemsPerPage"] = itemsPerPage
    let queryString = Helper.serialize(query);
    path = apiUrl.get_wallets + `?${queryString}`;
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
      user_start_date: (startdate == '' || startdate == null ? '' : moment(startdate).format('YYYY-MM-DD')),
      user_end_date: (enddate == '' || enddate == null ? '' : moment(enddate).format('YYYY-MM-DD')),
      status: serachstatus
    }
    setQuery(queries)
    path = apiUrl.get_wallets + '?page=' + `${page}` + '&itemsPerPage=' + `${itemsPerPage}` + '&keyword=' + `${keywords}` + '&user_start_date=' + `${startdate == '' || startdate == null ? '' : moment(startdate).format('YYYY-MM-DD')}` + '&user_end_date=' + `${enddate == '' || enddate == null ? moment(startdate).format('YYYY-MM-DD') : moment(enddate).format('YYYY-MM-DD')}` + '&status=' + `${serachstatus}`;
    getData(path);
  };

  const resetSearch = async () => {
    let path = apiUrl.get_wallets + '?page=1&itemsPerPage=10';
    getData(path)
  }

  


  const getData = async (path) => {
    const fr = await Helper.get(path, token);
    const res = await fr.response.json();
    if (fr.status === 200) {
      if (res.success) {
        setUsers(res.results.docs || []);
        setExportExcel(res.excel_path);
        setTotalItems(res.results.totalDocs);
        setIsserach(false);
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




  const onReset = (e) => {
    setQuery({})
    setStartDate('');
    setEndDate('');
    setKeyWords('');
    setSerachStatus('');
    setType('');
    getData();
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
              <i className="fa fa-list" /> Wallet Manager
              </CardHeader>
            <CardBody>
              <div className="multipal-searching">
                <Row>
                  <Col lg={10}>
                    <Form>
                      <Row>
                        <Col md={4}>
                          <FormGroup>
                            <Input type="text" placeholder="Search" value={keywords} className="form-control"
                              onChange={(e) => { setKeyWords(e.target.value) }} />
                          </FormGroup>
                        </Col>
                        <Col md={4}>
                          <FormGroup>
                            <DatePicker selected={startdate === '' || startdate === null ? '' : new Date(startdate)} className="form-control" placeholderText=" Start Date"
                              dateFormat="dd/MM/yyyy"
                              // maxDate={new Date()}
                              onChange={handleStartDate}
                              peekNextMonth
                              showMonthDropdown
                              showYearDropdown
                              dropdownMode="select" />
                          </FormGroup>
                        </Col>
                        <Col md={4}>
                          <FormGroup>
                            <DatePicker selected={enddate === '' || enddate === null ? '' : new Date(enddate)} className="form-control" placeholderText=" End Date"
                              dateFormat="dd/MM/yyyy"
                              minDate={startdate === '' || startdate === null ? '' : new Date(startdate)}
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
                  <Col lg={2}>
                    <Row>
                      <Col md={12}>
                        <button className="btn btn-primary mr-1 col-md-5" type="button" onClick={handleSearching}>{isserach === true ? <i className="fa fa-spinner fa-pulse fa-fw ml-1" />:<i className="fa fa-search" />} Search</button>
                        <button className="btn dark_btn col-md-5" type="button" onClick={(e) => { onReset(); }}><i className="fa fa-undo" /> Reset</button>
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
                      <th>Sr.No</th>
                      <th>Full Name</th>
                      <th>Mobile</th>
                      <th>Email</th>
                      <th>Deposite INR</th>
                      <th>Free Cash INR</th>
                      <th>Bonus Amount INR</th>
                      <th>Winning Amount INR</th>
                      <th>Created At</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((item, key) => {
                      return (
                        <tr key={key}>
                          <td>{key + 1}</td>
                          {/* <td>{item.first_name + ' ' + item.last_name}</td> */}
                          <td>{item.full_name}</td>
                          <td>{item.phone}</td>
                          <td>{item.email}</td>
                          <td>
                            {item.deposit_amount.toFixed(2)}
                            <div className={"pull-right"} >{((user_type === "editor" && module.edit === 1) || user_type=="admin")?<Edit type={'Deposit'} item={item} refreshData={pageData} />: null}</div>
                          </td>
                          <td>
                            {item.free_cash.toFixed(2)}
                            <div className={"pull-right"} >{((user_type === "editor" && module.edit === 1) || user_type=="admin")?<Edit type={'Free Cash'} item={item} refreshData={pageData} />: null}</div>
                          </td>
                          <td>
                            {item.bonus.toFixed(2)}
                            <div className={"pull-right"} >{((user_type === "editor" && module.edit === 1) || user_type=="admin")?<Edit type={'Bonus'} item={item} refreshData={pageData} />: null}</div>
                          </td>
                          <td>
                            {item.winngs_amount.toFixed(2)}
                            <div className={"pull-right"} >{((user_type === "editor" && module.edit === 1) || user_type=="admin")?<Edit type={'Winning'} item={item} refreshData={pageData} />
                             : null}
                            </div>
                          </td>
                          <td>{moment(item.createdAt).format('LLL')}</td>
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

export default WalletManager;
