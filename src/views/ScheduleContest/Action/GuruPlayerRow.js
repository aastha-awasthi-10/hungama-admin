import React, { useState, useEffect, useRef } from "react";
import { Link, Redirect } from "react-router-dom";
import Pagination from "react-js-pagination";
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Row,
  Table,
  Form,
  Input,
  FormGroup,
} from "reactstrap";
import _ from "lodash";
import "react-datepicker/dist/react-datepicker.css";
import useSession from "react-session-hook";
// import View from "./Action/View";
import { useAlert } from "react-alert";
import { f } from "html2pdf.js";

const GuruPlayerRow = (props) => {
  const session = useSession();
  const alert = useAlert();
  const [item, setItem] = useState("");
  const [sno, setKey] = useState("");
  const [token] = useState(session.token);
  const [player_id, setPlayerId] = useState(props.item.player_id);
  const [player_credit, setPlayerCredit] = useState(0.0);
  const [playing_role, setPlayingRole] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [isCaptainChecked, setIsCaptainChecked] = useState(false);
  const [isViceCaptainChecked, setIsViceCaptainChecked] = useState(false);

  useEffect(() => {
    setPlayerId(props.item.player_id);
    setPlayerCredit(props.item.player_credit);
    setPlayingRole(props.item.playing_role);
    setIsPlaying(props.item.is_playing == true ? true : false);
    setItem(props.item);
    setKey(props.sno);
    let check = props.guru.find((o) => o.player_id === props.item.player_id);
    setIsChecked(check ? true : false);

    // let cChek = props.guru.find(o => o.isCaptainId === props.item.player_id)
    // let cvChek = props.guru.find(o => o.isViceCaptainId === props.item.player_id)
    // setIsCaptainChecked(cChek ? true : false)
    // setIsViceCaptainChecked(cvChek ? true : false)

    console.log("props.guru", props.guru);
    // console.log("isChecked",isChecked.toString())
    // console.log("props.captain",props.captain)
    // console.log("props.vice_captain",props.vice_captain)
  }, [
    props.item,
    isChecked,
    isCaptainChecked,
    isViceCaptainChecked,
    props.guru,
  ]);

  return (
    <tr key={"key_" + sno}>
      <td className="text-left">
        <input
          type="checkbox"
          name="player_id"
          checked={isChecked}
          value={props.item.player_id}
          onChange={(e) => {
            props.handleChange(e, props.item);
          }}
        />
      </td>
      <td className="text-left">
        {/* <input type="radio" name="captain" checked={props.guru.isCaptain} onChange={(e) => { props.handleCVChange(e, props.item, 'Captain') }} /> Captain {" "}
        <input type="radio" name="vice_captain" checked={props.guru.isViceCaptain} onChange={(e) => { props.handleCVChange(e, props.item, 'Vice_Captain') }} /> Vice Captain */}
        <input
          type="radio"
          name="captain"
          // checked={props.guru.isCaptain}
          checked={props?.captain === props?.item.player_id}
          onChange={(e) => {
            props.handleCVChange(e, props.item, "Captain");
          }}
          disabled={props?.vice_captain === props?.item.player_id}
          style={
            props?.vice_captain === props?.item.player_id
              ? { cursor: "not-allowed" }
              : {}
          }
          title={
            props?.vice_captain === props?.item.player_id &&
            "You can not select captain and vise captain for single player"
          }
        />{" "}
        Captain{" "}
        <input
          type="radio"
          name="Vice_Captain"
          // checked={props.guru.isViceCaptain}
          checked={props?.vice_captain === props?.item?.player_id}
          disabled={props?.captain === props?.item.player_id}
          style={
            props?.captain === props?.item.player_id
              ? { cursor: "not-allowed" }
              : {}
          }
          title={
            props?.captain === props?.item.player_id &&
            "You can not select captain and vise captain for single player"
          }
          onChange={(e) => {
            props.handleCVChange(e, props.item, "Vice_Captain");
          }}
        />{" "}
        Vice Captain
      </td>
      <td className="text-left">{props.item.player_name}</td>
      <td className="text-left">
        <img width="80px" src={props.item.player_image} />
      </td>
      <td className="text-center">{props.item.player_role}</td>
      <td className="text-left" className="w-40">
        {props.item.team_name}
      </td>
      <td className="text-right" className="w-40">
        {props.item.player_credit}
      </td>
    </tr>
  );
};

export default GuruPlayerRow;
