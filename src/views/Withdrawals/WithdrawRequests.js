import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import Helper from '../../constants/helper';
import apiUrl from '../../constants/apiPath';
import moment from "moment";
import Pagination from "react-js-pagination";
import { Card, Button,Modal,ModalBody,ModalFooter,ModalHeader,Label, CardBody, CardHeader, Col, Row, Table, Form, Input, FormGroup } from 'reactstrap';
import _ from "lodash";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Loaders from '../CommanPage/Loader'
// import Excelreport from '../Reports/excelreport';
import useSession from "react-session-hook";
import Status from './Action/Status';
import View from "./Action/View";
import ViewBankDetails from "./Action/ViewBankDetails";
import ViewPancard from "./Action/ViewPancard";
import { useAlert } from "react-alert";
import Swal from "sweetalert2";
const WithdrawRequests = (props) => {
  const session = useSession();
  const alert = useAlert();
  const [users, setUsers] = useState([]);
  const [totalitems, setTotalItems] = useState('');
  const [activepage] = useState(1);
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
  const [bankImage, setBankImage] = useState('');
  const [panImage, setPanImage] = useState('');
  const [userImage, setUserImage] = useState('');
  const [error, setError] = useState(false);
  const [reason, setReason] = useState('');
  const [reason_text, setReasonText] = useState('');
  const [is_reject, setIs_reject] = useState(false);
  const module = session.profile.user_type == "editor" ? session.profile.permissions.find((e) => e.manager == "Withdraw Request") : {}
  const { user_type } = session.profile;

  const [reject_req, setReject_req] = useState({});
  // const [filename] = useState('supermasterexcel-file'); 

  const getData = async (page = activepage) => {
    setVisibale(true);
    const itemsPerPage = 10;
    let path;
    if (props.match.params.id) {
      path = apiUrl.get_withdrawals + '/' + `${props.match.params.id}` + '?page=' + `${page}` + '&itemsPerPage=' + `${itemsPerPage}`;
    } else {
      path = apiUrl.get_withdrawals + '?page=' + `${page}` + '&itemsPerPage=' + `${itemsPerPage}`;
    }
    const fr = await Helper.get(path, token);
    const res = await fr.response.json();
    if (fr.status === 200) {
      if (res.success) {
        setUsers(res.results.docs || []);
        setTotalItems(res.results.totalDocs);
        setBankImage(res.bank_statement);
        setPanImage(res.pan_image_path);
        setUserImage(res.user_image);
        setVisibale(false)
      } else {
        alert.error(res.msg);
        setVisibale(false)
      }
    } else {
      alert.error(res.error);
      setVisibale(false)
    }

  };

  const updateBankStatus = async (id, user_id, status) => {
    let postJson = { id: id, user_id: user_id, withdraw_status: status,reason,reason_text:reason_text };
    let path = apiUrl.update_withdrawal_request;
    const fr = await Helper.post(postJson, path, token);
    const res = await fr.response.json();
    console.log("res",res);
    if (fr.status === 200) {
      if (res.success) {
        getData();
        setReject_req({})
        setIs_reject(false)
        alert.success(res.msg);
      } else {
        alert.error(res.msg);
      }
    } else {
      alert.error(res.error);
    }
  }

  useEffect(() => {
    getData();
  }, []);
  useEffect(() => {
   if(is_reject == false)
   {
    setReason(false);
   }
  }, [is_reject]);

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
    if (props.match.params.id) {
      path = apiUrl.get_withdrawals + '/' + `${props.match.params.id}` + '?page=' + `${activepage}` + '&itemsPerPage=' + `${itemsPerPage}` + '&keyword=' + `${keywords}` + '&start_date=' + `${startdate == '' || startdate == null ? '' : moment(startdate).format('YYYY-MM-DD')}` + '&end_date=' + `${enddate == '' || enddate == null ? '' : moment(enddate).format('YYYY-MM-DD')}` + '&status=' + `${serachstatus}`;
    } else {
      path = apiUrl.get_withdrawals + '?page=' + `${activepage}` + '&itemsPerPage=' + `${itemsPerPage}` + '&keyword=' + `${keywords}` + '&wallet_status=' + `${type}` + '&start_date=' + `${startdate == '' || startdate == null ? '' : moment(startdate).format('YYYY-MM-DD')}` + '&end_date=' + `${enddate == '' || enddate == null ? '' : moment(enddate).format('YYYY-MM-DD')}` + '&status=' + `${serachstatus}`;
    }
    const fr = await Helper.get(path, token);
    const res = await fr.response.json();
    if (fr.status === 200) {
      if (res.success) {
        setUsers(res.results.docs || []);
        setTotalItems(res.totalItems);
        setIsserach(false);
      } else {
        alert.error(res.msg);
        setIsserach(false);
      }
    } else {
      alert.error(res.error);
      setIsserach(false);
    }
  };
  const onReset = (e) => {
    setStartDate('');
    setEndDate('');
    setKeyWords('');
    setSerachStatus('');
    setType('');
    getData();
  };

  const changeStatus = async (item) => {
    let SwalConfig = Helper.SwalConfig();
    const result = await Swal.fire(SwalConfig);
    if (result.value) {     
      updateBankStatus(item.id, item.user_id._id, 1)
    } 
  };

  return (
    <div className="animated fadeIn loader-outer">
      <Loaders className="overlay-loader" visible={visible} />
      <Row>
        <Col>
          <Card>
            <CardHeader>
              Withdraw Requests
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
                            <select name={'request_status'} className={"form-control"} value={type} onChange={(e) => { setType(e.target.value); }} >
                              <option value={''}>-- Select Request Status --</option>
                              <option value='pending'>Pending</option>
                              <option value='waiting_confirm'>Waiting Confirmation</option>
                              <option value='decline'>Declined</option>
                              <option value='approved'>Approved</option>
                            </select>
                          </FormGroup>
                        </Col>
                        <Col md={3} sm={6}>
                          <FormGroup className="mb-xl-0">
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
                        <Col md={3} sm={6}>
                          <FormGroup className="mb-xl-0">
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
                  <Col xl={3} className="text-xl-right ">
                    <button className="btn btn-primary ml-1" type="button" onClick={handleSearching}><i className="fa fa-search" /> Search{isserach === true && <i className="fa fa-spinner fa-pulse fa-fw ml-1" />}</button>
                    <button className="btn dark_btn ml-1 " type="button" onClick={(e) => { onReset(); }}><i className="fa fa-undo" /> Reset</button>
                  </Col>
                </Row>
              </div>
              <div id="reportId" className='table-responisve-custom'>
                <Table hover bordered responsive className="mt-3 text-center">
                  <thead>
                    <tr>
                      <th className="text-left">Full Name</th>
                      <th className="text-left">Email</th>
                      <th className="text-right">Phone</th>
                      <th className="text-right">Total Balance INR</th>
                      <th className="text-right">Requested Amount INR</th>
                      <th className="text-right">Remaining Amount INR</th>
                      <th className="text-left">Type</th>
                      <th className="text-center">Status</th>
                      <th className="text-center">Created At</th>
                      <th className="text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((item, key) => {
                      return (
                        <tr key={key}>
                          <td className="text-left">{item.user_id.full_name}</td>
                          <td className="text-left">{item.email}</td>
                          <td className="text-right">{item.phone}</td>
                          <td className="text-right">{item.total_balance.toFixed(2)}</td>
                          <td className="text-right">{item.requested_amount.toFixed(2)}</td>
                          <td className="text-right">{/*item.remaining_amount*/}{(item.total_balance - item.requested_amount).toFixed(2)}</td>
                          <td className="text-left">{item.type}</td>
                          <td className="text-center">
                            {item.status == 'pending' ? 'Pending' : item.status == 'decline' ? 'Declined' : item.status == 'waiting_confirm' ? 'Waiting Confirmation' : 'Approved'}
                          </td>
                          <td className="text-center">{moment(item.created_at).format('LLL')}</td>
                          <td className="text-center w-40">
                            {
                              _.isEmpty(props.match.params.id && true) ?
                                <div>
                                  {((user_type === "editor" && module.edit == 1) || user_type=="admin")?item.status == 'pending' && <button type="button" className="btn btn-danger pull-left text-white w-25" onClick={(e) => { setReject_req(item);setIs_reject(true) }}>Decline</button>:null}

                                  {((user_type === "editor" && module.view == 1) || user_type=="admin")?
                                  <>
                                    <ViewBankDetails item={item.user_id} bank_img={bankImage} refreshData={getData} />
                                    <ViewPancard item={item.user_id} pan_img={panImage} refreshData={getData} />
                                  </>                                  
                                  :null}
                                  
                                  {((user_type === "editor" && module.edit == 1) || user_type=="admin")?item.status == 'pending' && <button type="button" className="btn btn-success pull-right" onClick={(e) => { changeStatus(item) }}>Approve</button>:null}

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
                  onChange={getData}
                />
              </div>}
            </CardBody>
          </Card>
        </Col>
      </Row>
      {is_reject && (<Modal isOpen={is_reject} toggle={e => { setIs_reject(false) }} className={"custom-modal"}>
        <ModalHeader toggle={e => { setIs_reject(false) }}>Withdraw Request</ModalHeader>
        <ModalBody>
          <Row>
            <Col>
              <FormGroup>
                <Label><strong>Decline Reason</strong></Label>
                <div>                  
                  <Col md={12}>
                    <FormGroup>
                      <select name="reason" className={"form-control"} onChange={(e) => { setReason(e.target.value); }} >
                        <option value={''}>-- Select Reason --</option>
                        <option value='KYC Not Verified'>KYC Not Verified</option>
                        <option value='Incorrect Account Details'>Incorrect Account Details</option>
                        <option value='Insufficient Fund'>Insufficient Fund</option>
                        <option value='PAN Card not uploaded'>PAN Card not uploaded</option>
                        <option value='Other'>Other</option>
                      </select>
                    </FormGroup>
                  </Col>
                  {reason == 'Other' && <Col md={12}>
                    <FormGroup className="mb-xl-0">
                      <Input type="text" placeholder="Reason Text" className="form-control"
                        onChange={(e) => { setReasonText(e.target.value) }} />
                    </FormGroup>
                  </Col>}
                </div>
                {error && reason.length == 0 && <p className="text-danger marginmessage">Decline Reason is required.</p>}
              </FormGroup>
            </Col>
          </Row>
        </ModalBody>
        <ModalFooter>
          <button type="button" className="btn btn-success" data-dismiss="modal" onClick={(e) => { if (reason != '') { updateBankStatus(reject_req.id, reject_req.user_id._id, 0) } else { setError(true) } }}>Submit</button>
          <button type="button" className="btn btn-danger" data-dismiss="modal" onClick={(e) => { setIs_reject(false); }}>Close</button>
        </ModalFooter>
      </Modal>)}
    </div >
  );
};

export default WithdrawRequests;
