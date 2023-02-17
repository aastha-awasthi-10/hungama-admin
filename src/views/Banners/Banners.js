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
// import View from "./Action/View";
import { useAlert } from "react-alert";

const Banners = (props) => {
  const session = useSession();
  const alert = useAlert();
  const [users, setUsers] = useState([]);
  const [totalitems, setTotalItems] = useState('');
  const [activepage, setActivePage] = useState(1);
  const [startdate, setStartDate] = useState("");
  const [enddate, setEndDate] = useState("");
  const [serachstatus, setSerachStatus] = useState('');
  const [keywords, setKeyWords] = useState('');
  const [visible, setVisibale] = useState(false);
  const [token] = useState(session.token);
  const [isserach, setIsserach] = useState(false);
  const [bannerPath, setBannerPath] = useState(false);
  const [query, setQuery] = useState({});
  // const [filename] = useState('supermasterexcel-file'); 
  const module = session.profile.user_type == "editor" ? session.profile.permissions.find((e) => e.manager == "Banners") : {}
  const { user_type } = session.profile;
  const pageData = async (page = activepage) => {
    setVisibale(true);
    const itemsPerPage = 10;
    let path;
    setActivePage(page)
    query["page"] = page
    query["itemsPerPage"] = itemsPerPage
    let queryString = Helper.serialize(query);
    path = apiUrl.get_banners + `?${queryString}`;
    getData(path)
  };
  const handleStartDate = (date) => {
    setEndDate(null);
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
      start_date: (startdate == null || startdate == "" ? '' : moment(startdate).format('YYYY-MM-DD')),
      end_date: (enddate == null || enddate == "" ? '' : moment(enddate).format('YYYY-MM-DD')),
      status: serachstatus
    }

    setQuery(queries)
    path = apiUrl.get_banners + '?page=' + `${page}` + '&itemsPerPage=' + `${itemsPerPage}` + '&keyword=' + `${keywords}` + '&start_date=' + `${startdate == null || startdate == "" ? '' : moment(startdate).format('YYYY-MM-DD')}` + '&end_date=' + `${enddate == null || enddate == "" ? '' : moment(enddate).format('YYYY-MM-DD')}` + '&status=' + `${serachstatus}`;
    getData(path)
  };

  const resetSearch = async () => {
    let path = apiUrl.get_banners + '?page=1&itemsPerPage=10';
    getData(path)
  }

  const getData = async (path) => {
    const fr = await Helper.get(path, token);
    const res = await fr.response.json();
    if (fr.status === 200) {
      if (res.success) {
        setUsers(res.results.docs || []);
        setTotalItems(res.results.totalDocs);
        setBannerPath(res.banner_path);
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
    setStartDate("");
    setEndDate("");
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
              Banners
              <div className="ml-auto">
                <Link to="/add-banner" className="btn btn-primary">
                  <i className="fa fa-plus mr-1"></i>Add Banner
                </Link>
              </div>
            </CardHeader>
            <CardBody>
              <div className="multipal-searching">
                <Row>
                  <Col xl={9}>
                    <Form>
                      <Row>
                        <Col md={3} sm={6}>
                          <FormGroup className="mb-xl-0">
                            <Input type="text" placeholder="Title" value={keywords} className="form-control"
                              onChange={(e) => { setKeyWords(e.target.value) }} />
                          </FormGroup>
                        </Col>
                        <Col md={3} sm={6}>
                          <FormGroup className="mb-xl-0">
                            <DatePicker selected={startdate == null || startdate == "" ? "" : new Date(startdate)} className="form-control" placeholderText=" Start Date"
                              dateFormat="dd/MM/yyyy"
                              onChange={handleStartDate}
                              peekNextMonth
                              showMonthDropdown
                              showYearDropdown
                              dropdownMode="select" />
                          </FormGroup>
                        </Col>
                        <Col md={3} sm={6}>
                          <FormGroup className="mb-xl-0">
                            <DatePicker selected={enddate == null || enddate == "" ? "" : new Date(enddate)} className="form-control" placeholderText=" End Date"
                              dateFormat="dd/MM/yyyy"
                              minDate={startdate == null || startdate == "" ? "" : new Date(startdate)}
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
                              <option value="">Select User Status</option>
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
                <Table hover bordered responsive className=" text-center">
                  <thead>
                    <tr>
                      <th className="text-align-left">Title</th>
                      <th className="text-align-right">Sequence</th>
                      <th className="text-align-left">Type</th>
                      <th className="text-align-left">Banner</th>
                      <th className="text-align-center">Status</th>
                      <th className="text-align-center">End Date</th>
                      <th className="text-align-center">Created At</th>
                      <th className="text-align-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((item, key) => {
                      return (
                        <tr key={key}>
                          <td className="text-align-left">{item.title}</td>
                          <td className="text-align-right">{item.sequence}</td>
                          <td className="text-align-left">{item.banner_type}</td>
                          <td className="text-align-center">
                            {(item.media_type == 'image') &&  ((!_.isEmpty(item.image)) ? <img src={bannerPath + item.image} height="100" width="200" /> : <img src={bannerPath + 'avtar.png'} height="100" width="200" />)}
                            {(item.media_type == 'video') && <video height={80} width={200} controls >
                              <source src={bannerPath + item.image} type="video/mp4" />
                            </video>}
                          </td>
                          <td className="text-align-center">
                            <Status item={item} refreshData={pageData} />
                          </td>
                          <td className="text-align-center">{moment(item.end_date).format('LLL')}</td>
                          <td className="text-align-center">{moment(item.created_at).format('LLL')}</td>
                          <td className="text-align-center w-40">
                            {
                              _.isEmpty(props.match.params.id && true) ?
                                <div>
                                  
                                  {((user_type === "editor" && module.delete == 1) || user_type=="admin")?<Delete item={item} refreshData={pageData} />:null}
                                  {((user_type === "editor" && module.edit == 1) || user_type=="admin")?                                  
                                  <Link to={{ pathname: `/edit-banner/${item.id}` }} className="btn-link">
                                    <button className="btn circle_btn btn-sm mr-1" type="button" title="Edit">
                                      <i className="fa fa-pencil" />
                                    </button>
                                  </Link>
                                  :null}

                                  {/* <View item={item} /> */}

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

export default Banners;
