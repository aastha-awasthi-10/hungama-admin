import React, { useState, useEffect } from 'react';
import Helper from '../../../constants/helper';
import apiUrl from '../../../constants/apiPath';
import { FormGroup } from 'reactstrap';
import { useAlert } from 'react-alert';
import useSession from 'react-session-hook';
import Swal from "sweetalert2";

const Delete = (props) => {
    const session = useSession();
    const token = session.token;
    const alert = useAlert();
    const [item, setItem] = useState({});

    const deleteItem = async () => {
        console.log("item nishant",item);
        let SwalConfig = Helper.SwalConfig("You want to delete contest");
        const result = await Swal.fire(SwalConfig);
        if (result.value) {
            let postJson = { status: "deleted", id: item._id };
            let path = apiUrl.delete_cricket_contest;
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
        <button onClick={(e) => { deleteItem() }} className="btn circle_btn btn-sm mr-1" type="button" title="Delete">
            <i className="fa fa-trash" />
        </button>
    );
}

export default Delete;




