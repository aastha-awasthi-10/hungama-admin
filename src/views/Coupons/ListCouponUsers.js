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
import { useAlert } from "react-alert";

const Coupons = (props) => {
  const session = useSession();
  const alert = useAlert();
  const [users, setUsers] = useState([]);
  const [totalitems, setTotalItems] = useState('');
  const [activepage] = useState(1);
  const [visible, setVisibale] = useState(false);
  const [token] = useState(session.token);
  const [exportExcel, setExportExcel] = useState('');
  const [coupon_data, setCouponData] = useState({});


  const getData = async (page = activepage) => {
    setVisibale(true);
    const itemsPerPage = 10;
    let path;
    path = apiUrl.get_coupons_users + '/' + `${props.match.params.coupon_code}`;
    const fr = await Helper.get(path, token);
    const res = await fr.response.json();
    if (fr.status === 200) {
      if (res.success) {

        setUsers(res.results || []);
        setCouponData(res.couponData);
        // console.log()
        console.log("res",res);
        setTotalItems(res.totalDocs.length);
        setVisibale(false)
        setExportExcel(res.excel_path);
      } else {
        alert.error(res.msg);
        setVisibale(false)
      }
    } else {
      alert.error(res.error);
      setVisibale(false)
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="animated fadeIn loader-outer">
      <Loaders className="overlay-loader" visible={visible} />
      <Row>
        <Col>
          <Card>
            <CardHeader className="align-items-center d-flex">
              Coupons
            </CardHeader>
            <CardBody>
            <div className="multipal-searching">
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
                      <th className="text-left">User Name</th>
                      <th className="text-right">Email</th>
                      <th className="text-right">Transaction Id</th>
                      <th className="text-right">Coupon Type</th>
                      <th className="text-right">Transaction Amount</th>
                      <th className="text-right">Cashback Amount</th>
                      <th className="text-center">Transaction Date</th>
                      <th className="text-center">Created At</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((item, key) => {
                      return (
                        <tr key={key}>
                          <td className="text-left">{item.rows.first_name + ' ' + item.rows.last_name}</td>
                          <td className="text-right">{item.rows.email}</td>
                          <td className="text-right">{item.rows.txn_id}</td>
                          <td className="text-right">{coupon_data.type}</td>
                          <td className="text-right">{item.rows.txn_amount}</td>
                          <td className="text-right">{item.rows.coupon_cashback_amount}</td>
                          <td className="text-center">{moment(item.rows.txn_date).format('LLL')}</td>
                          <td className="text-center">{moment(item.rows.created_at).format('LLL')}</td>
                        </tr>
                      )
                    })}
                    {_.isEmpty(users) && <tr><td colSpan="9"><div className="text-center">No Record Found</div></td></tr>}
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
    </div >
  );
};

export default Coupons;
