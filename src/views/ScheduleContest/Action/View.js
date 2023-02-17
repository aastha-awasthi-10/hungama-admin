import React, { useState, useEffect } from 'react';
import Helper from '../../../constants/helper';
import apiUrl from '../../../constants/apiPath';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Table, Label, FormGroup, Col, Row } from 'reactstrap';
import { useAlert } from 'react-alert';
import useSession from 'react-session-hook';
import Swal from "sweetalert2";
import _ from "lodash";
import moment from "moment";
import GuruPlayerRow from './GuruPlayerRow'
import Loaders from '../../CommanPage/Loader'



const Body = (props) => {

  const session = useSession();
  const alert = useAlert();
  const [players, setPlayers] = useState({});
  const [token] = useState(session.token);
  const [visible, setVisibale] = useState(false);
  const [guru, setGuru] = useState([]);
  const [newState, setNewState] = useState(false);
  const [loading, setLoading] = useState(false);
  const [captain, setCaptain] = useState(false);
  const [vice_captain, setViceCaptain] = useState(false);
  const [guru_team, setGuruTeam] = useState(props.item.guru_team);

  // console.log("props.item Nishant",props.item);
  const getPlayers = async () => {
    setVisibale(true);
    let path = apiUrl.get_players_list;
    let postJson = { match_id: props.item.match_id, series_id: props.item.series_id, local_team_id: props.item.localteam_id, visitor_team_id: props.item.visitorteam_id };
    const fr = await Helper.post(postJson, path, token);
    const res = await fr.response.json();
    if (fr.status === 200) {
      if (res.success) {

        let categorized = [{ "category": 'Batsman', players: [] }, { "category": 'Bowler', players: [] }, { "category": 'Allrounder', players: [] }, { "category": 'Wicketkeeper', players: [] }].map((category) => {
          category['players'] = res.results.filter(player => player.player_role === category['category'])
          return category
        })
        // console.log(res.totalDocs);
        setPlayers(categorized || []);
        setGuru(props.item.guru_team ? props.item.guru_team.player_id : [])
        setCaptain(props.item.guru_team ? props.item.guru_team.captain : false)
        setViceCaptain(props.item.guru_team ? props.item.guru_team.vice_captain : false)
        setVisibale(false);

      } else {
        alert.error(res.msg);
      }
    } else {
      alert.error(res.error);
    }

  };
  const getValidate = () => {
    var nFlag = true;
    if (guru.length != 11) {
      alert.error('11 Players are mandatory.');
      nFlag = false;
    }
    if(guru.filter(gItem => gItem.player_role == 'Wicketkeeper').length === 0) {
      alert.error('Please select atleast 1 wicketkeeper.');
      nFlag = false;
      return false;
    }
    if(guru.filter(gItem => gItem.player_role == 'Allrounder').length === 0) {
      alert.error('Please select atleast 1 allrounder.');
      nFlag = false;
      return false;
    }
    if (captain == false || vice_captain == false) {
      alert.error('Please select captain and vice captain.');
      nFlag = false;
    }
    return nFlag;
  }
  const handleSubmit = async data => {
    // console.log("guru",guru);
    // console.log("captain",captain);
    // console.log("vice_captain",vice_captain);
    // return;
    // setVisibale(true);
    // let filterArray = guru.map(v=>v.player_id);
    let flag = getValidate();
    if (!flag) {
      return;
    }
    let path = apiUrl.create_guru_team;
    let postJson = { match_id: props.item.match_id, series_id: props.item.series_id, player_id: guru, captain: captain, vice_captain: vice_captain };
    const fr = await Helper.post(postJson, path, token);
    const res = await fr.response.json();
    if (fr.status === 200) {
      if (res.success) {
        alert.success(res.msg);
        setVisibale(false);
      } else {
        alert.error(res.msg);
      }
    } else {
      alert.error(res.error);
    }
  };

  const handleCVChange = (e, guruItem, cv) => {
    const isFound = guru.some(element => {
      if (element.player_id === guruItem.player_id) {
        return true;
      }
    });
    if (!isFound) {
      alert.error('Please select ' + cv + ' from selected players');      
      setGuru(guru);
      return false;
    } else {
      if (cv == 'Captain') {
        setCaptain(guruItem.player_id)
        setGuru(guru.map(item => { item['isCaptain'] = guruItem.player_id == item.player_id; return item; }));
        return true;
      }
      else {
        setViceCaptain(guruItem.player_id)
        setGuru(guru.map(item => { item['isViceCaptain'] = guruItem.player_id == item.player_id; return item; }));
        return true;
      }
    }
  }
  const handleChange = (e, guruItem) => {
    var flag = true;
    if (e.target.checked) {
      if (guru.length < 11) {
        if (guru.filter(gItem => gItem.team_id == guruItem.team_id).length === 7) {
          flag = false;
          alert.error('Only 7 Players are allowed from a team.');
          return false;
        }

        if (guruItem.player_role == 'Batsman') {
          if (guru.filter(gItem => gItem.player_role == 'Batsman').length === 5) {
            flag = false;
            alert.error('Maximum 5 batsman is allowed.');
            return false;
          }
        }
        if (guruItem.player_role == 'Bowler') {
          if (guru.filter(gItem => gItem.player_role == 'Bowler').length === 5) {
            flag = false;
            alert.error('Maximum 5 bowler is allowed.');
            return false;
          }
        }
        if (guruItem.player_role == 'Allrounder') {
          if (guru.filter(gItem => gItem.player_role == 'Allrounder').length === 3) {
            flag = false;
            alert.error('Maximum 3 allrounder is allowed.');
            return false;
          }
        }
        if (guruItem.player_role == 'Wicketkeeper') {
          if (guru.filter(gItem => gItem.player_role == 'Wicketkeeper').length === 1) {
            flag = false;
            alert.error('Maximum 1 wicketkeeper is allowed.');
            return false;
          }
        }
        let totalCredit = guru.reduce((acc,cur) => { return acc + cur['player_credit']  },0);
        let remainingCredit = 100 - totalCredit;
        if(guruItem.player_credit > remainingCredit)
        {
          flag = false;
          alert.error('Sorry! You do not have sufficiant credit left.');
          return false;
        }

        if (flag) {
          setGuru([...guru, guruItem]);
        }
      } else {
        alert.error('Only 11 Players are allowed.');
        return false;
      }
    }
    else {
      let res = guru.filter(function (item) {
        return item.player_id !== guruItem.player_id
      });
      setGuru(res);
    }
  }

  useEffect(() => {
    getPlayers();
  }, []);

  useEffect(() => { console.log("guru.length", guru.length); console.log("guruItem", guru); }, [guru]);

  return (
    <div className={'col-md-12'} >
      <Loaders className="overlay-loader" visible={visible} />
      <Table bordered responsive className="mt-3 text-center playertabl">
        <thead>
          <tr>
            <th className="text-left">Select</th>
            <th className="text-left">Captain / Vice Captain</th>
            <th className="text-left">Name</th>
            <th className="text-left">Image</th>
            <th className="text-center">Role</th>
            <th className="text-left">Team</th>
            <th className="text-right">Credits</th>
          </tr>
        </thead>
        <tbody>
          {!_.isEmpty(players) && players.map((item, key) => {
            // console.log("captain",captain);
            // console.log("vice_captain",vice_captain);
            return (

              <><Categoryrow key={key} category={item.category} />

                {item.players.map((itemPlayer, keys) => {
                  return (
                    <GuruPlayerRow captain={captain} vice_captain={vice_captain} item={itemPlayer} sno={keys} guru={guru} handleCVChange={handleCVChange} handleChange={handleChange} />
                  )
                })
                }</>
            )


          })}
          {_.isEmpty(players) && <tr><td colSpan="7"><div className="text-center">No Record Found</div></td></tr>}
        </tbody>
      </Table>
      <Button className={'ml-2'} type="submit" color="primary" onClick={(e) => { handleSubmit(e); }}>Submit {loading === true ? <i className="fa fa-spinner fa-pulse fa-fw ml-1"></i> : <i className="fa fa-arrow-circle-right fa-lg" aria-hidden="true"></i>}</Button>
    </div>)

}

const Categoryrow = (props) => {
  return (
    <tr key={props.category}>
      <td colSpan="7" className="text-left"><strong>{props.category} {props.category === 'Wicketkeeper' ? '(1 Wicketkeeper)' : props.category === 'Batsman' ? '(3-5 batsman)' : props.category === 'Allrounder' ? '(1-3 Allrounder)' : props.category === 'Bowler' ? '(3-5 Bowler)' : ''}</strong></td>
    </tr>
  );
}



const View = (props) => {

  const [modal, setModal] = useState(false);
  const [item, setItem] = useState({});

  useEffect(() => {
    setItem(props.item);
  }, []);

  return (
    <div className={"inline-btn"}>

      <button className="btn circle_btn btn-sm mr-1" type="button" title="View Details" onClick={(e) => { setModal(true); }}><i className="fa fa-eye" /></button>
      <Modal isOpen={modal} toggle={e => { setModal(false) }} className={"custom-modal modal-xl"}>
        <ModalHeader toggle={e => { setModal(false) }}>View</ModalHeader>
        <ModalBody>
          <Row>
            {(modal) && <Body item={item} />}
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
