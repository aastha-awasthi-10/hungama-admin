import React, { useState, useEffect } from 'react';
import Helper from '../../../constants/helper';
import apiUrl from '../../../constants/apiPath';
import {Button, Modal, ModalHeader, ModalBody, ModalFooter,Table, Label, FormGroup, Col, Row} from 'reactstrap';
import {useAlert} from 'react-alert';
import useSession from 'react-session-hook';
import Swal from "sweetalert2";
import _ from "lodash";
import moment from "moment-timezone";
import MatchStatus from './MatchStatus';
var tz_asia = 'Asia/Kolkata';

const View = (props) => {

  const session = useSession();
  const alert = useAlert();
  const [modal, setModal] = useState(false);
  const [matches, setMatches] = useState([]);
  const [item, setItem] = useState({});
  const [token] = useState(session.token);

  const getSeriesMatches = async () => {
    const itemsPerPage = 2;
    let path;
    console.log(props.item.id_api);
    path = apiUrl.get_series_all_matches+'/'+props.item.id_api;
    console.log(path);
    const fr = await Helper.get(path, token);
    const res = await fr.response.json();
    if (fr.status === 200) {
      if (res.success) {
        setMatches(res.results.docs || []);
      } else {
        alert.error(res.msg);
      }
    } else {
      alert.error(res.error);
    }

  };

  useEffect(() => {
    getSeriesMatches();
  }, [props]);

  return (
    <div className={"inline-btn"}>
      <button className="btn circle_btn btn-sm mr-1" type="button" title="View Details" onClick={(e) => { setModal(true);}}>Matches</button>
      <Modal isOpen={modal} toggle={e => {setModal(false)}} className="custom-modal modal-lg">
        <ModalHeader toggle={e => {setModal(false)}}>View</ModalHeader>
        <ModalBody>
          <Table hover bordered responsive className="mt-3 text-center">
            <thead>
              <tr>
                <th>Match</th>
                <th>Date</th>
                <th>Time</th>
                <th>Type</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {matches.map((item, key) => {
                return (
                  <tr key={key}>
                    <td>{item.localteam} Vs {item.visitorteam}</td>
                    <td>{moment(item.match_date).tz(tz_asia).format('YYYY-MM-DD')}</td>
                    <td>{moment(item.match_date).tz(tz_asia).format('hh:mm a')}</td>
                    <td>{item.type}</td>
                    <td>
                      {
                        <MatchStatus getData={props.getData} pagePath={props.pagePath} item={item} refreshStatusData={getSeriesMatches} />
                        //item.rows.status?'Active':'Inactive' 
                      }
                    </td>
                  </tr>
                )
              })}
              {_.isEmpty(matches) && <tr><td colSpan="11"><div className="text-center">No Record Found</div></td></tr>}
            </tbody>
          </Table>
        </ModalBody>
        <ModalFooter>
          <button type="button" className="btn dark_btn" data-dismiss="modal" onClick={(e) => { setModal(false); }}>Close</button>
        </ModalFooter>
      </Modal>
    </div>
  );
}

export default View;
