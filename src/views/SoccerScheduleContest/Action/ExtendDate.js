import React, { useState, useEffect } from 'react';
import Helper from '../../../constants/helper';
import apiUrl from '../../../constants/apiPath';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FormGroup } from 'reactstrap';
import { useAlert } from 'react-alert';
import useSession from 'react-session-hook';
import Swal from "sweetalert2";

const ExtendDate = (props) => {
    const session = useSession();
    const token = session.token;
    const alert = useAlert();
    const [Id, setId] = useState('');
    const [DateValue, setDate] = useState('');
    const [TimeValue, setTime] = useState('');

    const updateDate = async () => {
        let SwalConfig = Helper.SwalConfig();
        const result = await Swal.fire(SwalConfig);
        if (result.value) {
            let postJson = { id: Id, DateValue, TimeValue };
            let path = apiUrl.soccer_series_match_extend_time;
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
    const handleDateChange = async (date) => {
        setDate(date);
    }

    useEffect(() => {
        setId(props.id);
        setDate(props.selected);
        setTime(props.time);
    }, [props]);

    return (
        <div>
            <FormGroup className={'col-md-8'}>
                <DatePicker selected={DateValue} className="form-control"
                    dateFormat="dd/MM/yyyy"
                    minDate={new Date(DateValue)}
                    onChange={handleDateChange}
                    peekNextMonth
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select" />
            </FormGroup>
            <FormGroup className={'col-md-8'}>
                <input className={'form-control col-md-12'} type={'text'} onChange={(e) => { setTime(e.target.value) }} value={TimeValue} placeholder={'00:00'} />
            </FormGroup>
            <FormGroup className={'col-md-8'}>
                <button className={'btn btn-success form-control col-md-12'} type={'button'} onClick={updateDate} >Save</button>
            </FormGroup>
        </div>
    );
}

export default ExtendDate;
