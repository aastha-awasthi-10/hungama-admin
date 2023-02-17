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
import { useAlert } from "react-alert";
const Tokens = (props) => {
  const session = useSession();
  const alert = useAlert();
  const [tokens, setTokens] = useState([]);
  const [totalitems, setTotalItems] = useState('');
  const [activepage, setActivePage] = useState(1);
  const [startdate, setStartDate] = useState('');
  const [enddate, setEndDate] = useState('');
  const [serachstatus, setSerachStatus] = useState('');
  const [verifystatus, setVerifyStatus] = useState('');
  const [keywords, setKeyWords] = useState('');
  const [uniqueId, setUniqueId] = useState('');
  const [visible, setVisibale] = useState(false);
  const [token] = useState(session.token);
  const [isserach, setIsserach] = useState(false);
  const [tokenImage, setTokenImage] = useState('');
  const [query, setQuery] = useState({});
  const [sortType, setSortType] = useState('');
  const [dateSortType, setDateSortType] = useState('');
  const [exportExcel, setExportExcel] = useState('');
  const module = session.profile.user_type == "editor" ? session.profile.permissions.find((e) => e.manager == "Tokens") : {}
  const { user_type } = session.profile
  const pageData = async (page = activepage) => {
    setVisibale(true);
    const itemsPerPage = 10;
    let path;
    setActivePage(page)
    query["page"] = page
    query["itemsPerPage"] = itemsPerPage
    let queryString = Helper.serialize(query);
    path = apiUrl.get_tokens + `?${queryString}`;
    getData(path)
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
      status: serachstatus
    }
    setQuery(queries)
    path = apiUrl.get_tokens + '?uniqueId=' + `${uniqueId}` + '&page=' + `${page}` + '&itemsPerPage=' + `${itemsPerPage}` + '&keyword=' + `${keywords}` + '&status=' + `${serachstatus}`;
    getData(path);
  };
  
  const resetSearch = async () => {
    let path = apiUrl.get_tokens + '?page=1&itemsPerPage=10';
    getData(path)
  }

  const getData = async (path) => {
    const fr = await Helper.get(path, token);
    const res = await fr.response.json();
    if (fr.status === 200) {
      if (res.success) {
        setTokens(res.results.docs || []);
        setTotalItems(res.results.totalDocs);
        setExportExcel(res.excel_path);
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
              Tokens
              <div className="ml-auto">
                <Link to="/add-token" className="btn btn-primary">
                  <i className="fa fa-plus mr-1"></i>
                  Add Token
                </Link>
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
                            <Input type="text" placeholder="Search" value={keywords} className="form-control"
                              onChange={(e) => { setKeyWords(e.target.value) }} />
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
                          <button className="btn dark_btn ml-1 " type="button" onClick={(e) => { onReset(); }}><i className="fa fa-undo" /> Reset</button>
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
                </Row>
              </div>
              <div id="reportId" className='table-responisve-custom'>
                <Table hover bordered responsive className="mt-3 text-center">
                  <thead>
                    <tr>
                      <th className="text-align-left">Token Name </th>
                      <th className="text-align-left">Token Address</th>
                      <th className="text-align-left">Token Image</th>
                      <th className="text-align-right">Transaction Fees</th>
                      <th className="text-align-right">Minimum Withdraw Limit</th>
                      <th className="text-align-center">Status</th>
                      <th className="text-align-center">Created At</th>
                      <th className="text-align-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    
                    {tokens.map((item, key) => {
                      return (
                        <tr key={key}>
                          <td className="text-align-left">{item.token_name}</td>
                          <td className="text-align-left">{item.token_address}</td>
                          <td className="text-align-left"><img src={item.token_image} /></td>
                          <td className="text-align-right">{item.transaction_fee}</td>
                          <td className="text-align-right">{item.minimum_withdraw_limit}</td>
                          <td className="text-align-center">
                            <Status item={item} refreshData={pageData} />
                          </td>
                          <td className="text-align-center">{item.createdAt ? moment(item.createdAt).format('LLL') : moment(item.created_at).format('LLL')}</td>
                          <td className="text-align-center w-40 w-260">
                            {
                              _.isEmpty(props.match.params.id && true) ?
                                <div>
                                    {
                                      user_type === "editor" && module.edit == 1 ? 
                                      <Link to={{ pathname: `/edit-token/${item.id}` }} className="btn-link">
                                        <button className="btn circle_btn btn-sm mr-1" type="button" title="Edit Token">
                                          <i className="fa fa-pencil" />
                                        </button>
                                    </Link> : user_type=="admin"?
                                    <Link to={{ pathname: `/edit-token/${item.id}` }} className="btn-link">
                                      <button className="btn circle_btn btn-sm mr-1" type="button" title="Edit Token">
                                        <i className="fa fa-pencil" />
                                      </button>
                                    </Link>:null
                                    }
                                    {user_type === "editor" && module.view === 1 ? <View item={item} tokenImage={tokenImage} /> :user_type=="admin"? <View item={item} tokenImage={tokenImage} />:null}
                                </div>
                                : null
                            }
                          </td>
                        </tr>
                      )
                    })}
                    {_.isEmpty(tokens) && <tr><td colSpan="13"><div className="text-center">No Record Found</div></td></tr>}
                  </tbody>
                </Table>
              </div>
              {!_.isEmpty(tokens) && <div className="show-pagination technician-page">
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

export default Tokens;
