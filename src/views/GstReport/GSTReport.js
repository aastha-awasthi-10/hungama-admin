import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Helper from "../../constants/helper";
import apiUrl from "../../constants/apiPath";
import moment from "moment";
import Pagination from "react-js-pagination";
import {
  Card,
  Button,
  CardBody,
  CardHeader,
  Col,
  Row,
  Table,
  Form,
  Input,
  FormGroup,
} from "reactstrap";
import _, { isEmpty } from "lodash";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Loaders from "../CommanPage/Loader";
// import Excelreport from '../Reports/excelreport';
import useSession from "react-session-hook";
import Status from "./Action/Status";
import View from "./Action/View";
import { useAlert } from "react-alert";

const GSTReport = (props) => {
  const session = useSession();
  const alert = useAlert();
  const [users, setUsers] = useState([]);
  const [totalitems, setTotalItems] = useState(1);
  const [activepage, setActivePage] = useState(1);
  const [startdate, setStartDate] = useState("");
  const [enddate, setEndDate] = useState("");
  const [serachstatus, setSerachStatus] = useState("");
  const [keywords, setKeyWords] = useState("");
  const [visible, setVisibale] = useState(false);
  const [token] = useState(session.token);
  const [isserach, setIsserach] = useState(false);
  const [isreset, setReset] = useState(false);
  const [userId, setUserId] = useState("");
  const [category, setCategory] = useState([]);
  const [category_id, setQuizCategory] = useState("");
  const [type, setType] = useState("");
  const [query, setQuery] = useState({});
  const [exportExcel, setExportExcel] = useState("");

  // const [filename] = useState('supermasterexcel-file');

  const pageData = async (page = activepage) => {
    setVisibale(true);
    const itemsPerPage = 10;
    let path;
    setActivePage(page);
    query["page"] = page;
    query["itemsPerPage"] = itemsPerPage;
    if (typeof props.match.params.userId !== "undefined") {
      query["user"] = props.match.params.userId;
    }
    let queryString = Helper.serialize(query);
    path = apiUrl.gst_report + `?${queryString}`;
    getData(path);
  };

  const handleStartDate = (date) => {
    setEndDate("");
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
    setActivePage(page);
    let queries = {
      page: page,
      itemsPerPage: itemsPerPage,
      keyword: keywords,
    };
    setQuery(queries);
    let user_id = "";
    if (typeof props.match.params.userId !== "undefined") {
      user_id = props.match.params.userId;
    }
    path =
      apiUrl.gst_report +
      "?page=" +
      `${page}` +
      "&itemsPerPage=" +
      `${itemsPerPage}` +
      "&keyword=" +
      `${keywords}` +
      "&start_date=" +
      `${startdate == "" ? "" : moment(startdate).format("YYYY-MM-DD")}` +
      "&end_date=" +
      `${enddate == "" ? "" : moment(enddate).format("YYYY-MM-DD")}`;
    getData(path);
  };

  const resetSearch = async (page = activepage) => {
    let path = apiUrl.gst_report + '?page=1&itemsPerPage=10';
    getData(path)
  };

  const getData = async (path) => {
    const fr = await Helper.get(path, token);
    const res = await fr.response.json();
    if (fr.status === 200) {
      if (res.success) {
        setUsers(res?.results || []);
        setExportExcel(res.excel_path);
        // setTotalItems(res.totalItems);
        setTotalItems(
          !_.isEmpty(res.results[0]) ? parseInt(res.results[0].totalDocs) : 0
        );
        setIsserach(false);
        setVisibale(false);
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

  const onReset = (e) => {
    setQuery({});
    setReset(true);
    setStartDate("");
    setEndDate("");
    setKeyWords("");
    setSerachStatus("");
    setType("");
    resetSearch(1);
    setActivePage(1);
  };

  useEffect(() => {
    pageData();
  }, []);
  useEffect(() => {
    pageData();
  }, [props]);

  return (
    <div className="animated fadeIn loader-outer">
      <Loaders className="overlay-loader" visible={visible} />
      <Row>
        <Col>
          <Card>
            <CardHeader>GST Report</CardHeader>
            <CardBody>
              <div className="multipal-searching">
                <Row>
                  <Col lg={9}>
                    <Form>
                      <Row>
                        <Col md={3} sm={6}>
                          <FormGroup className="mb-xl-0">
                            <Input
                              type="text"
                              placeholder="Search"
                              value={keywords}
                              className="form-control"
                              onChange={(e) => {
                                setKeyWords(e.target.value);
                              }}
                            />
                          </FormGroup>
                        </Col>
                        <Col md={3} sm={6}>
                          <FormGroup className="mb-xl-0">
                            <DatePicker
                              selected={
                                startdate === "" ? null : new Date(startdate)
                              }
                              className="form-control"
                              placeholderText=" Start Date"
                              dateFormat="dd/MM/yyyy"
                              maxDate={new Date()}
                              onChange={handleStartDate}
                              peekNextMonth
                              showMonthDropdown
                              showYearDropdown
                              dropdownMode="select"
                            />
                          </FormGroup>
                        </Col>
                        <Col md={3} sm={6}>
                          <FormGroup className="mb-xl-0">
                            <DatePicker
                              selected={
                                enddate === "" ? null : new Date(enddate)
                              }
                              className="form-control"
                              placeholderText=" End Date"
                              dateFormat="dd/MM/yyyy"
                              minDate={new Date(startdate)}
                              maxDate={new Date()}
                              onChange={handleEndDate}
                              peekNextMonth
                              showMonthDropdown
                              showYearDropdown
                              dropdownMode="select"
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                    </Form>
                  </Col>
                  <Col xl={3} className="text-xl-right ">
                    <button
                      className="btn btn-primary ml-1"
                      type="button"
                      onClick={handleSearching}
                    >
                      <i className="fa fa-search" /> Search
                      {isserach === true && (
                        <i className="fa fa-spinner fa-pulse fa-fw ml-1" />
                      )}
                    </button>
                    <button
                      className="btn dark_btn ml-1 "
                      type="button"
                      onClick={(e) => {
                        onReset();
                      }}
                    >
                      <i className="fa fa-undo" /> Reset
                    </button>
                  </Col>
                </Row>
                <br></br>
                <Row>
                  <Col md={3}>
                    <a href={exportExcel} download>
                      <button
                        className="btn btn-primary mr-1 col-md-12"
                        type="button"
                      >
                        <i className="fa fa-file-excel-o" /> Export Excel
                      </button>
                    </a>
                  </Col>
                </Row>
              </div>
              <div id="reportId">
                <Table hover bordered responsive className="mt-3 text-center">
                  <thead>
                    <tr>
                      <th className="text-left">Full Name</th>
                      <th className="text-left">State</th>
                      <th className="text-left">Contest Name</th>
                      <th className="text-right">Entree Fees INR</th>
                      <th className="text-right">Platform Fee from Admin</th>
                      <th className="text-right">SGST</th>
                      <th className="text-right">CGST</th>
                      <th className="text-right">IGST</th>
                      <th className="text-center">Created At</th>

                      {/* <th>Action</th> */}
                    </tr>
                  </thead>
                  <tbody>
                    {!_.isEmpty(users) &&
                      users.map((item, key) => {
                        return (
                          <tr key={key}>
                            <td className="text-left">
                              {/* {item.rows.first_name + " " + item.rows.last_name} */}
                              {item?.rows?.full_name}
                            </td>
                            <td className="text-left">
                              {item.rows.state}
                            </td>
                            <td className="text-left">
                              {item.rows.contest_name}
                            </td>
                            <td className="text-right">
                              {item.rows.entry_fee}
                            </td>
                            <td className="text-right">
                              {item.rows.platform_fees_from_admin}
                            </td>
                            <td className="text-right">
                              {item.rows.sgst
                                ? item.rows.sgst.toFixed(2)
                                : item.rows.sgst == 0
                                ? "-"
                                : "-"}
                            </td>
                            <td className="text-right">
                              {item.rows.cgst
                                ? item.rows.cgst.toFixed(2)
                                : item.rows.cgst == 0
                                ? "-"
                                : "-"}
                            </td>
                            <td className="text-right">
                              {item.rows.igst
                                ? item.rows.igst.toFixed(2)
                                : item.rows.igst == 0
                                ? "-"
                                : "-"}
                            </td>
                            <td className="text-center">
                              {moment(item.rows.createdAt).format("LLL")}
                            </td>
                          </tr>
                        );
                      })}
                    {_.isEmpty(users) && (
                      <tr>
                        <td colSpan="9">
                          <div className="text-center">No Record Found</div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>
              {!_.isEmpty(users) && (
                <div className="show-pagination technician-page">
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
                </div>
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default GSTReport;
