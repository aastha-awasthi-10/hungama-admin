import React, { useEffect, useState } from 'react';
import { JsonToExcel } from 'react-json-excel';
import _ from "lodash";
import Helper from '../../constants/helper';
import apiUrl from '../../constants/apiPath';
import useSession  from 'react-session-hook';

const Exclereport = (props) => {

  const session = useSession();
  const [data, setData] = useState([]);
  const [token] = useState(session.token);
  const [filename] = useState(props.filename);


  const getDataexcle = async () => {
    let path;
    switch (filename) {
      case "supersupermasterexcel-file":
        path = apiUrl.get_Super_Super_Master;
        break;
      case "supermasterexcel-file":
        path = props.id ? apiUrl.get_Super_Master + '/' + props.id : apiUrl.get_Super_Master;
        break;
      case "masterexcel-file":
        path = props.id ? apiUrl.get_Master + '/' + props.id : apiUrl.get_Master;
        break;
      case "clientexcel-file":
        path = props.id ? apiUrl.get_Client + '/' + props.id : apiUrl.get_Client;
        break;
      default:
        break;

    }
    const fr = await Helper.get(path, token);
    const res = await fr.response.json();
    if (fr.status === 200) {
      if (res.success) {
        setData(res.result);
      } else {

      }
    } else {

    }
  };


  useEffect(() => {
    getDataexcle();
  }, []);

  const className = 'class-name-for-style btn btn-primary',
    fields = {
      "id": 'Id',
      "user_type": "User Type",
      "username": "User Name",
      "name": "Name",
      "mobile": "Mobile",
      "credit_reference": "Credit Reference",
      "cricket_commission": "Cricket Commission",
      "cricket_partnership": "Cricket Partnership",
      "football_commission": "Football Commission",
      "football_partnership": "Football Partnership",
      "tennis_commission": "Tennis Commission",
      "tennis_partnership": "Tennis Partnership",
      "status": "Status",
      "created": "Created",
    },
    style = {
      padding: "5px",
      type: "button"
    };

  return (
    <div className="animated fadeIn" onClick={(e) => e.preventDefault()}>
      {!_.isEmpty(data) &&
        < JsonToExcel
          data={data}
          className={className}
          filename={filename}
          fields={fields}
          style={style}
        />}
    </div>
  );
};

export default Exclereport;
