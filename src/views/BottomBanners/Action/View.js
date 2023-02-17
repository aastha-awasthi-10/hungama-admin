import React, { useState, useEffect } from 'react';
import Helper from '../../../constants/helper';
import apiUrl from '../../../constants/apiPath';
import {Button, Modal, ModalHeader, ModalBody, ModalFooter, Label, FormGroup, Col, Row} from 'reactstrap';
import {useAlert} from 'react-alert';
import useSession from 'react-session-hook';
import Swal from "sweetalert2";
import _ from "lodash";
import moment from "moment";

const View = (props) => {

  const session = useSession();
  const [modal, setModal] = useState(false);
  const [item, setItem] = useState({});
  const [banner_path, setBannerPath] = useState(process.env.API_PATH + "static/banners/");

  const getData = async (page = activepage) => {
    setVisibale(true);
    const itemsPerPage = 10;
    let path;
    
    path = apiUrl.get_single_series_data + '/' + props.item.series_id;
    
    const fr = await Helper.get(path, token);
    const res = await fr.response.json();
    if (fr.status === 200) {
      if (res.success) {
        setUsers(res.results.docs || []);
        setTotalItems(res.results.totalDocs);
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

  useEffect(() => {
      getData();
      setItem(props.item);
  }, [props.item]);

  return (
    <div className={"inline-btn"}>
      <Button className="btn circle_btn btn-sm mr-1" type="button" title="Status" onClick={(e) => { setModal(true);}}><i className="fa fa-eye" /></Button>
      <Modal isOpen={modal} toggle={e => {setModal(false)}} className={"custom-modal"}>
        <ModalHeader toggle={e => {setModal(false)}}>View</ModalHeader>
        <ModalBody>
          <Row>            
            <Col md={6}>
              <FormGroup>
                <Label><strong>Banner Type</strong></Label>
                <div>{item.banner_type}</div>
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label><strong>Image</strong></Label>
                <div>{_.upperFirst(item.first_name+' '+item.last_name)}</div>
              </FormGroup>
            </Col>
          </Row>
        </ModalBody>
        <ModalFooter>
          <button type="button" className="btn dark_btn" data-dismiss="modal" onClick={(e) => { setModal(false); }}>Close</button>
        </ModalFooter>
      </Modal>
    </div>
  );
}

export default View;
