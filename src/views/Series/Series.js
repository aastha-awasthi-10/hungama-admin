import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import Helper from '../../constants/helper';
import apiUrl from '../../constants/apiPath';
import Pagination from "react-js-pagination";
import { Card, CardBody, CardHeader, Col, Row, Table, Form, Input, FormGroup } from 'reactstrap';
import _ from "lodash";
import "react-datepicker/dist/react-datepicker.css";
import Loaders from '../CommanPage/Loader'
import useSession from "react-session-hook";
import Status from './Action/Status';
import View from "./Action/View";
import { useAlert } from "react-alert";
import { MDBDataTableV5 } from 'mdbreact';


const Series = (props) => {
  const session = useSession();
  const alert = useAlert();
  const [series, setSeries] = useState([]);
  const [totalitems, setTotalItems] = useState('');
  const [activepage,setActivePage] = useState(1);
  const [serachstatus, setSerachStatus] = useState('');
  const [keywords, setKeyWords] = useState('');
  const [visible, setVisibale] = useState(false);
  const [token] = useState(session.token);
  const [isserach, setIsserach] = useState(false);
  const [query, setQuery] = useState({});
  const [pagePath, setPagePath] = useState('');
  // const [CountSeries, setCountSeries] = useState("");

  const pageData = async (page = activepage) => {
    setVisibale(true);
    const itemsPerPage = 10;
    let path;
    setActivePage(page)
    query["page"] = page
    query["itemsPerPage"] = itemsPerPage
    let queryString = Helper.serialize(query); 
    path = apiUrl.get_series_contest + `?${queryString}`;
    getData(path)
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
      status:serachstatus
    }
    setQuery(queries)

    path = apiUrl.get_series_contest + '?page=' + `${page}` + '&itemsPerPage=' + `${itemsPerPage}` + '&keyword=' + `${keywords}` + '&status=' + `${serachstatus}`;
    getData(path)    
  };

  const resetSearch = async () => {
    let path = apiUrl.get_series_contest + '?page=1&itemsPerPage=10';
    getData(path)
  }  

  const getData = async (path) => {
    const fr = await Helper.get(path, token);
    const res = await fr.response.json();
    if (fr.status === 200) {
      if (res.success) {
        setPagePath(path);
        setSeries(res.results || []);
        setTotalItems(res.results[0].totalDocs || 0);
        setVisibale(false);
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
    setKeyWords('');
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
              Series
            </CardHeader>
            <CardBody>
              <div className="multipal-searching">
                <Row>
                  <Col lg={9}>
                    <Form>
                      <Row>
                      <Col md={3} sm={6}>
                          <FormGroup className="mb-xl-0">
                            <Input type="text" placeholder="Series name" value={keywords} className="form-control"
                              onChange={(e) => { setKeyWords(e.target.value) }} />
                          </FormGroup>
                        </Col>
                      </Row>
                    </Form>
                  </Col>
                  <Col xl={3} className="text-xl-right">
                        <button className="btn btn-primary ml-1" type="button" onClick={handleSearching}><i className="fa fa-search" /> Search{isserach === true && <i className="fa fa-spinner fa-pulse fa-fw ml-1" />}</button>
                        <button className="btn dark_btn ml-1 " type="button" onClick={(e) => { onReset(); }}><i className="fa fa-undo" /> Reset</button>
                  </Col>
                </Row>
              </div>
              <div id="reportId" >
                <Table hover bordered responsive className="mt-3 text-center seriesTable">
                  <thead>
                    <tr>
                      <th className="text-left">Series Name</th>
                      <th className="text-left">Short Name</th>
                      <th className="text-right">Inactive Matches</th>
                      <th className="text-center">Status</th>
                      <th className="text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {series.map((item, key) => {
                      return (
                        <tr key={key}>
                          <td className="text-left">{item.rows.name}</td>
                          <td className="text-left">{item.rows.short_name}</td>
                          <td className="text-right">{item.rows.numOfinactive}</td>
                          <td className="text-center">
                            {
                              <Status item={item.rows} refreshData={pageData} />
                              //item.rows.status?'Active':'Inactive' 
                            }
                          </td>
                          <td className="text-center" className="w-40">
                            {
                              _.isEmpty(props.match.params.id && true) ?
                                <div>
                                  <Link to={{ pathname: `/update-short-name/${item.rows.id_api}` }} className="btn-link">
                                    <button className="btn circle_btn btn-sm mr-1" type="button" title="Update Short Name">
                                      Update Short Name
                                    </button>
                                  </Link>
                                  {<View getData={getData} pagePath={pagePath} item={item.rows} />}
                                  {/* 
                                  {(item.bank_verified && item.bank_verified != 0) ? <ViewBankDetails item={item} bank_img={bankImage} refreshData={getData} /> : null}
                                  {(item.pan_verified && item.pan_verified != 0) ? <ViewPancard item={item} pan_img={panImage} refreshData={getData} /> : null} */}
                                </div>
                                : null
                            }
                          </td>
                        </tr>
                      )
                    })}
                    {_.isEmpty(series) && <tr><td colSpan="5"><div className="text-center">No Record Found</div></td></tr>}
                  </tbody>
                </Table>
              </div>
              {!_.isEmpty(series) && <div className="show-pagination technician-page">
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

export default Series;
