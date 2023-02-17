import React, { useState, useEffect } from 'react';
import { Link,Redirect } from "react-router-dom";
import Helper from '../../constants/helper';
import apiUrl from '../../constants/apiPath';
import Pagination from "react-js-pagination";
import { Card, CardBody, CardHeader, Col, Row, Table, Form, Input, FormGroup } from 'reactstrap';
import _ from "lodash";
import "react-datepicker/dist/react-datepicker.css";
import Loaders from '../CommanPage/Loader'
import Loaders from './PlayerRow'
import useSession from "react-session-hook";
// import View from "./Action/View";
import { useAlert } from "react-alert";

const SeriesPlayers = (props) => {
  const session = useSession();
  const alert = useAlert();
  const [series, setSeries] = useState([]);
  const [totalitems, setTotalItems] = useState('');
  const [activepage] = useState(1);
  const [serachstatus, setSerachStatus] = useState('');
  const [series_id, setSeriesId] = useState('');
  const [team_type, setTeamType] = useState('');
  const [team_id, setTeamId] = useState('');
  const [disabled, setDisabled] = useState(true);
  const [keywords, setKeyWords] = useState('');
  const [visible, setVisibale] = useState(false);
  const [token] = useState(session.token);
  const [isserach, setIsserach] = useState(false);
  const [isupdate, setIsupdate] = useState(false);
  const [dropdown, setDropdown] = useState([]);
  const [teams, setTeams] = useState([]);
  const [players, setPlayers] = useState([]);
  const [checked, setChecked] = useState(true);
  const [player_image, setPlayerImage] = useState('');
  const [preview, setPlayerImagePreview] = useState('');
  
  const handleChange = (e) => {
    if(e.target.name === 'keywords') {
      setKeyWords(e.target.value);
    } else if(e.target.name === 'series_id') {
      setSeriesId(e.target.value);
      getTeams(e.target.value);
    } else if(e.target.name === 'team_type') {
      setTeamType(e.target.value);
      // getPlayers();
    } else if(e.target.name === 'team_id') {
      setTeamId(e.target.value);
      // getPlayers();
    }
  }

  const getPlayers = async () => {
    setVisibale(true);
    const itemsPerPage = 10;
    let path;
    path = apiUrl.get_series_players + '?team_id=' + `${team_id}` + '&team_type=' + `${team_type}` + '&keyword=' + `${keywords}` + '&series_id=' + `${series_id}`;

    const frr = await Helper.get(path, token);
    const resr = await frr.response.json();

    if (frr.status === 200) {

      if (resr.success) {
        setPlayers(resr.results || []);
        setVisibale(false);
      } else {
        alert.error(resr.msg);
        setVisibale(false)
      }
    } else {
      alert.error(resr.error);
      setVisibale(false)
    }

  };

  const getData = async () => {
    setVisibale(true);
    const itemsPerPage = 10;
    let path;

    path = apiUrl.get_series;

    const fr = await Helper.get(path, token);
    const res = await fr.response.json();

    if (fr.status === 200) {

      if (res.success) {
        setDropdown(res.results || []);
        setVisibale(false);
      } else {
        alert.error(res.msg);
        setVisibale(false)
      }
    } else {
      alert.error(res.error);
      setVisibale(false)
    }
  };

  const getTeams = async (series_id) => {
    setVisibale(true);
    const itemsPerPage = 10;
    let path;
    path = apiUrl.get_series_teams + '?series_id=' + `${series_id}`;

    const frr = await Helper.get(path, token);
    const resr = await frr.response.json();

    if (frr.status === 200) {

      if (resr.success) {
        setTeams(resr.results || []);
        setDisabled(function checkTeam() {
          if (resr.results.length > 0 ) {
            return false;
          }
        }
        )
        setVisibale(false);
      } else {
        alert.error(resr.msg);
        setVisibale(false)
      }
    } else {
      alert.error(resr.error);
      setVisibale(false)
    }

  };
  
  const onImageChange = (event) => {
      if (event.target.files && event.target.files[0]) {
          setPlayerImagePreview(URL.createObjectURL(event.target.files[0]));
          setPlayerImage(event.target.files[0]);
      }
  }

const onReset = (e) => {
    setKeyWords("");
    setSeriesId(""); 
    // getTeams();
};

useEffect(() => {
  getData();
  // getTeams();
}, []);


  return (
    
    <div className="animated fadeIn loader-outer">
      <Loaders className="overlay-loader" visible={visible} />
      <Row>
        <Col>
          <Card>
            <CardBody>
              <div className="multipal-searching">
                <Row>
                  <Col lg={10}>
                    <Form>
                      <Row>
                      <Col md={3}>
                          <FormGroup>
                            <select className={"form-control"} value={series_id} name="series_id" onChange={handleChange}>
                              <option value={""}>Select Series</option>
                              {
                                dropdown.map((type, index) => {
                                  return <option key={index} value={type.id_api}>{type.name}</option>
                                })
                              }
                            </select>
                          </FormGroup>
                        </Col>
                        <Col md={3}>
                          <FormGroup> 
                            <select type="text"  name="team_type" placeholder="Status" className="form-control" value={team_type}
                              onChange={handleChange} >
                              <option value="">Select Team Type</option>
                              <option value="all">All</option>
                              <option value="t10">T10</option>
                              <option value="t20">T20</option>
                              <option value="odi">ODI</option>
                              <option value="test">Test</option>
                            </select>
                          </FormGroup>
                        </Col>
                        <Col md={3}>
                          <FormGroup> 
                          <select className={"form-control"} value={team_id} name="team_id" onChange={handleChange}>
                              <option value={""}>Select Team</option>
                              {
                                teams.map((type, index) => {
                                  return <option key={index} value={type.team_id}>{type.team_name}</option>
                                })
                              }
                            </select>
                          </FormGroup>
                        </Col>
                        <Col md={3}>
                          <FormGroup>
                            <input type="text" placeholder="Keywords" value={keywords} className="form-control" name="keywords" onChange={handleChange} />
                          </FormGroup>
                        </Col>
                      </Row>
                    </Form>
                  </Col>
                  <Col lg={2}>
                    <Row>
                      <Col md={12}>
                       <button className="btn btn-primary mr-1 col-md-6" type="button" onClick={getPlayers}><i className="fa fa-search" /> Search{isserach === true && <i className="fa fa-spinner fa-pulse fa-fw ml-1" />}</button>
                       {/*   <button className="btn btn-success col-md-5" type="button" onClick={onReset}><i className="fa fa-undo" /> Reset</button> */}
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </div>
              <div id="reportId" >
              <Table hover bordered responsive className="mt-3 text-center">
                  <thead>
                    <tr>
                      <th>Sr.No</th>
                      <th>Name</th>
                      <th>Image</th>
                      <th>Role</th>
                      <th>Type</th>
                      <th>Team</th>
                      <th>Credits</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {players.map((item, key) => {
                      return (
                        <tr key={key}>
                          <td>{key + 1}</td>
                          <td>{item.player_name}</td>
                          <td><img width="40px" src={process.env.REACT_APP_IMAGE_BASE_URL + 'static/player_images/'+item.image} />
                          
                          <input type="file" onChange={onImageChange} name="player_image" className="form-control  col-md-8" autoComplete="off" placeholder="Pic"/>
                          <img id="target" className={'mt-3 rounded'} src={preview} />
                          
                          </td>
                          <td>  
                            <FormGroup className={'mb-0'}>
                            <select type="select" name="playing_role" placeholder="Status" className="form-control" value={item.playing_role}
                                onChange={handleChange} >
                                <option value="">Player Role</option>
                                <option value="Bowler">Bowler</option>
                                <option value="Batsman">Batsman</option>
                                <option value="Wicketkeeper">Wicketkeeper</option>
                                <option value="Allrounder">Allrounder</option>
                              </select> 
                            </FormGroup>                           
                          </td>
                          <td className="w-40">
                            
                          <input type="checkbox"
                            checked={item.t10 == "True"}
                            onChange={() => setChecked(!checked)}
                          /> T10 &nbsp;
                          <input type="checkbox"
                            checked={item.t20 == "True"}
                            onChange={() => setChecked(!checked)}
                          /> T20 &nbsp;
                          <input type="checkbox"
                            checked={item.odi == "True"}
                            onChange={() => setChecked(!checked)}
                          /> ODI &nbsp;
                          <input type="checkbox"
                            checked={item.test == "True"}
                            onChange={() => setChecked(!checked)}
                          /> TEST &nbsp;

                          
                          </td>
                          <td className="w-40">
                            {item.team_name}
                          </td>
                          <td className="w-40">
                            <input type="text" name="player_credit" placeholder="Credit" autoComplete="off"
                                        className="form-control col-md-8" defaultValue={item.player_credit} />
                          </td>
                          <td>
                            <button className="btn btn-primary mr-1 col-md-12" type="button"> Update{isupdate === true && <i className="fa fa-spinner fa-pulse fa-fw ml-1" />}</button>
                          </td>
                        </tr>
                      )
                    })}
                    {_.isEmpty(teams) && <tr><td colSpan="11"><div className="text-center">No Record Found</div></td></tr>}
                  </tbody>
                </Table>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div >
  );
};

export default SeriesPlayers;