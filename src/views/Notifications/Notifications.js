import React, { useState, useEffect } from 'react';
import { Card, CardBody, CardHeader, Col, Row, FormGroup, Label } from 'reactstrap';
import moment from "moment";
import { Link } from "react-router-dom";
import Pagination from "react-js-pagination";
import apiUrl from "../../constants/apiPath";
import Helper from "../../constants/helper";
import Swal from 'sweetalert2';
import useSession from "react-session-hook";
import { useAlert } from "react-alert";
import NotificationsTable from "./NotificationsTable";
import Modal from "react-responsive-modal";
import { ValidatorForm } from 'react-form-validator-core';
import TextValidator from '../CommanPage/TextValidator';

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000
});

const Notifications = () => {

  const session = useSession();
  const alert = useAlert();
  const [token] = useState(session.token);
  const [notifications, setNotifications] = useState([]);
  const [activepage, setActivePage] = useState(1);
  const [totalitems, setTotalItems] = useState('');
  const [Open, setOpen] = useState(false);
  const [issubmit, setIsubmit] = useState(false);
  const [isMatchsubmit, setMatchsubmit] = useState(false);
  const [message, setMessage] = useState('');
  const [title, setTitle] = useState('');
  const [noti_sound, setSound] = useState('swiftly.mp3');


  const getData = async (page = activepage) => {
    const itemsPerPage = 10;
    setActivePage(page)
    let path = apiUrl.getNotifications + '?page=' + `${page}` + '&itemsPerPage=' + `${itemsPerPage}`;
    const fr = await Helper.get(path, token);
    const res = await fr.response.json();
    if (fr.status === 200) {
      if (res.success) {
        console.log("res notifications",res);
        const { totalItems, result } = res;
        console.log("res",res);
        setNotifications(res.results.docs || []);
        setTotalItems(res.results.totalDocs || 0);
      } else {
        alert.error(res.msg);
      }
    } else {
      alert.error(res.error);
    }
  };

  const sendNotification = async () => {
    setMatchsubmit(true);
    console.log("noti_sound",noti_sound);
    let postJson = { message, title, noti_sound };
    let path, fr;
    path = apiUrl.send_notification;
    fr = await Helper.post(postJson, path, token);
    const res = await fr.response.json();
    if (fr.status === 200) {
      if (res.success) {
        setMatchsubmit(false);
        setOpen(false);
        setSound('swiftly.mp3');
        getData(1);
        Toast.fire({
          type: "success",
          title: res.msg,
        })
      } else {
        Toast.fire({
          type: "error",
          title: res.msg,
        });
        setMatchsubmit(false);
      }
    } else {
      Toast.fire({
        type: "error",
        title: res.error,
      });
      setMatchsubmit(false);
    }
  }

  useEffect(() => {
    getData(1);
  }, []);

  return (
    <div className="animated fadeIn loader-outer">
      <Row>
        <Col>
          <Card>
            <CardHeader className="align-items-center d-flex">
              Notifications List
              <div className="ml-auto">
                <a className="btn btn-primary float-right" href="#!" onClick={(e) => {
                  setOpen(true);
                  setMessage('');
                }}>
                  <i className="fa fa-plus"> Send Notification</i>
                </a>
              </div>
            </CardHeader>

            <CardBody>
              <NotificationsTable notifications={notifications} />
              {
                notifications.length ?
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
                      onChange={getData}
                    />
                  </div>
                  : null
              }
            </CardBody>
          </Card>
        </Col>
      </Row>
      <Modal className="custom-modal-lg" open={Open} onClose={(e) => {
        setOpen(false)
      }}>
        <div className="modal-header grey-1">
          <h4>Send Notification</h4>
        </div>
        <div className="modal-body">
          <ValidatorForm id="updateminmax" onSubmit={sendNotification}>
            <Row>
              <Col md={2} className="text-right">
                <FormGroup>
                  <Label className="btn-value">Title</Label>
                </FormGroup>
              </Col>
              <Col md={8}>
                <FormGroup>
                  <TextValidator type="text" name="title" value={title} placeholder="Notification Title"
                    className="form-control"
                    onChange={(e) => {
                      setTitle(e.target.value)
                    }}
                    validators={['required']}
                    errorMessages={['This field is required']} />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md={2} className="text-right">
                <FormGroup>
                  <Label className="btn-value">Sound</Label>
                </FormGroup>
              </Col>
              <Col md={8}>
                <FormGroup>
                  <select name={'noti_sound'} className={"form-control col-md-12"} onChange={(e) => {
                    setSound(e.target.value)
                  }}>
                    <option value={'swiftly.mp3'}>Swiftly</option>
                    <option value={'goes-without-saying.mp3'}>Goes Without Saying</option>
                    <option value={'just-saying.mp3'}>Just Saying</option>
                    <option value={'juntos.mp3'}>Juntos</option>
                  </select>
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md={2} className="text-right">
                <FormGroup>
                  <Label className="btn-value">Message</Label>
                </FormGroup>
              </Col>
              <Col md={8}>
                <FormGroup>
                  <TextValidator type="textarea" name="first_team" value={message} placeholder="Notification Message"
                    className="form-control"
                    onChange={(e) => {
                      setMessage(e.target.value)
                    }}
                    validators={['required']}
                    errorMessages={['This field is required']} />
                </FormGroup>
              </Col>
            </Row>
            <div className="modal-footer">
              <button type="submit" className="btn btn-primary" data-dismiss="modal">Submit{isMatchsubmit === true &&
                <i className="fa fa-spinner fa-pulse fa-fw ml-1" />}</button>
              <button type="button" className="btn dark_btn" data-dismiss="modal" onClick={(e) => {
                setOpen(false)
              }}>Close
            </button>
            </div>
          </ValidatorForm>
        </div>
      </Modal>
    </div >
  );
};

export default Notifications;
