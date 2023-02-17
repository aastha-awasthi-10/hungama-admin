import React, { useState, useEffect } from 'react';
import Helper from '../../../constants/helper';
import apiUrl from '../../../constants/apiPath';
import { FormGroup } from 'reactstrap';
import { useAlert } from 'react-alert';
import useSession from 'react-session-hook';
import Swal from "sweetalert2";

const Status = (props) => {
  const session = useSession();
  const token = session.token;
  const alert = useAlert();  
  const [item, setItem] = useState({});

  const changeStatus = async (changed_status) => {
    let SwalConfig = Helper.SwalConfig();
    const result = await Swal.fire(SwalConfig);
    if (result.value) {     
      let postJson = { id: item.id, status: changed_status };
      let path = apiUrl.quiz_category_change_Status;
      const fr = await Helper.post(postJson, path, token);
      const res = await fr.response.json();
      if (fr.status === 200) {
        if (res.success) {         
          props.refreshData();
          alert.success(res.msg);
        } else {
          alert.error(res.msg);
        }
      } else {
        alert.error(res.error);
      }
    } 
  };
  useEffect(() => {
    setItem(props.item);
  }, [props.item]);

  return (
    <FormGroup className={'mb-0'}>
      <select type="select" name="gen" className="form-control" onChange={(e) => {changeStatus(e.target.value)}} value={item.status}>
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
      </select >
    </FormGroup>
  );
}

export default Status;
