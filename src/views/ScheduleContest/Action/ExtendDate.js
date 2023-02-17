import React, { useState, useEffect } from 'react';
import Helper from '../../../constants/helper';
import apiUrl from '../../../constants/apiPath';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import _ from 'lodash';
import TimePicker from 'react-time-picker-input';
import "react-time-picker-input/dist/components/TimeInput.css"

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
    const [time_new, setTime2] = useState('');
    const [timestamp_start, setTime3] = useState('');
    

    const updateDate = async () => {
        let SwalConfig = Helper.SwalConfig();
        const result = await Swal.fire(SwalConfig);
        console.log("TimeValue",TimeValue,_.isEmpty(TimeValue))
        console.log("time_new",time_new,_.isEmpty(time_new))
        console.log("timestamp_start",timestamp_start, _.isEmpty(timestamp_start));
        if(_.isEmpty(TimeValue) || _.isEmpty(time_new) || _.isEmpty(timestamp_start.toString()))
        {
            alert.error('Please select time.');
            return;
        }
        if (result.value) {
            let postJson = { id: Id, DateValue, TimeValue,time_new:time_new,timestamp_start:timestamp_start.toString() };
            // console.log("postJson",postJson);
            // return;
            let path = apiUrl.series_match_extend_time;
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
                    minDate={new Date()}
                    onChange={handleDateChange}
                    peekNextMonth
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select" />
            </FormGroup>
            <FormGroup className={'col-md-8'}>
                {/* <input className={'form-control col-md-12'} type={'text'} onChange={(e) => { setTime(e.target.value) }} value={TimeValue} placeholder={'00:00'} /> */}

                <TimePicker value={TimeValue} className="form-control col-md-12"
                    onChange={(dateString) => { 

                        console.log("dateString",dateString)

                        setTime2(moment(`01/01/1971 ${dateString}`, "DD/MM/YYYY hh:mm").subtract(5,'minutes').format('H:mm'))
                        setTime3(moment(`${moment(DateValue,"DD/MM/YYYY").format('MM/DD/YYYY')} ${dateString}`).unix())                        
                        setTime(dateString) }} 
                    hour12Format="false"
                />

            </FormGroup>
            <FormGroup className={'col-md-8'}>
                <button className={'btn btn-success form-control col-md-12'} type={'button'} onClick={updateDate} >Save</button>
            </FormGroup>
        </div>
    );
}

export default ExtendDate;
