
import React, { useState, useEffect, Fragment } from 'react';
import { ErrorMessage, useForm } from 'react-hook-form';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Link } from "react-router-dom";
// import { i18n } from 'element-react'
// import locale from 'element-react/src/locale/lang/en'
// import { DateRangePicker } from 'element-react';
// import 'element-theme-default';

import Helper from '../../constants/helper';
import { useHistory } from "react-router-dom";
import apiUrl from '../../constants/apiPath';
import { Button, Card, CardBody, CardHeader, CardTitle, CardFooter, FormGroup, Label, Col, Row, Table } from 'reactstrap';

import _ from 'lodash';
import { useAlert } from 'react-alert';
import useSession from 'react-session-hook';
import { useParams } from "react-router";
import moment from "moment";
// i18n.use(locale);

const ScheduleAddContest = (props) => {
    const session = useSession();
    let history = useHistory();
    const alert = useAlert();
    const { register, handleSubmit, errors, watch } = useForm();
    const [token] = useState(session.token);
    const [loading, setLoading] = useState(false);
    const [id, setId] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [users, setUsers] = useState([]);
    const [contestIds, setContestIds] = useState([]);
    const [joinedContestIds, setJoinedContestIds] = useState([]);
    const [showbtn, setShowBtn] = useState(false);


    const onSubmit = async data => {
        setLoading(true);
        let postJson = {
            id: props.match.params.id,
            contestIds: contestIds
        };
        if (!contestIds.length) {
            setLoading(false);
            alert.error('Please select atleast one contest.');
            return;
        }
        let path = apiUrl.update_soccer_match_schedule_contest;
        const fr = await Helper.put(postJson, path, token);
        const res = await fr.response.json();
        if (fr.status === 200) {
            if (res.success) {
                setLoading(false);
                props.history.push('/soccer/schedule-contest');
                alert.success(res.msg);
            } else {
                alert.error(res.msg);
                setLoading(false);
            }
        } else {
            alert.error(res.error);
            setLoading(false);
        }
    };

    const getCatData = async (matchId) => {
        const user_Id = session.profile.id;
        let path = apiUrl.get_soccer_contest_Bycategory + '/' + matchId;
        const fr = await Helper.get(path, token);
        const res = await fr.response.json();
        if (fr.status === 200) {
            if (res.success) {
                setImageUrl(res.image_path);
                setUsers(res.results);
            } else {
                console.log(res.msg);
            }
        } else {
            console.log(res.msg);
        }
    };

    const getData = async (matchId) => {
        const user_Id = session.profile.id;
        let path = apiUrl.get_soccer_match_byId + '/' + matchId;
        const fr = await Helper.get(path, token);
        const res = await fr.response.json();
        if (fr.status === 200) {
            if (res.success) {
                let scheduledContestIds = res.results.joined_contest.map(val => val.contest_id)
                getCatData(res.results.match_id);
                setContestIds(scheduledContestIds);
                setJoinedContestIds(scheduledContestIds);
            } else {
                console.log(res.msg);
            }
        } else {
            console.log(res.msg);
        }
    };

    const handleCheck = (e) => {
        let checkStatus = e.target.checked;
        let checkVal = e.target.value;
        console.log(checkStatus);
        if (checkStatus) {
            setContestIds(oldArray => [...oldArray, checkVal]);
        } else {
            // var index = contestIds.indexOf(checkVal);
            // console.log(index, checkVal);
            // contestIds.splice(index, 1);
            // setContestIds(contestIds);
            setContestIds(contestIds.filter(prev => prev !== checkVal));

        }
    }
    useEffect(() => {
        setId(props.match.params.id);
        getData(props.match.params.id);
    }, []);



    return (
        <React.Fragment>
            <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-info"><h4>Add contest for match</h4></CardTitle>
                    </CardHeader>
                    <CardBody>
                        <div id="reportId" >
                            <Table hover bordered responsive className="mt-3 text-center">
                                <tbody>
                                    {users.map((item, key) => {
                                        if (item.contestData.length) {
                                            return (
                                                <Fragment key={key}>
                                                    <tr key={key} style={{ "background": "rgba(0, 0, 0, 0.075)" }}>
                                                        <td className="border-right-0">
                                                            <img className={"pull-left"} src={imageUrl + (item.cat_data.image || 'avtar.png')} alt='Category Image' style={{ "border": "1px solid #ccc" }, { "borderRadius": "5px" }} height={70} width={70} />
                                                        </td>
                                                        <td colSpan="3" className="text-left border-left-0" style={{ "verticalAlign": "middle" }}><h5>{item.cat_data.title}</h5></td>
                                                    </tr>
                                                    <tr key={key + 1}>
                                                        <th className="text-center"></th>
                                                        <th>Winning Amount</th>
                                                        <th>Contest Size</th>
                                                        <th>Entry Fee</th>
                                                    </tr>
                                                    {item.contestData.map((val, k) => {
                                                        let checkedStatus = (contestIds.indexOf(val._id) !== -1) ? true : false;
                                                        let isJoined = (joinedContestIds.indexOf(val._id) !== -1) ? true : false;
                                                        let disabled = (isJoined) ? true : false;
                                                        return (
                                                            <tr key={k}>
                                                                <td className="text-center">
                                                                    <input type={'checkbox'} checked={checkedStatus} disabled={disabled} name={'contest_id[]'} value={val._id} onChange={handleCheck} />
                                                                </td>
                                                                <td>{val.winning_amount}</td>
                                                                <td>{val.users_limit}</td>
                                                                <td>{val.entry_fee}</td>
                                                            </tr>);
                                                    })
                                                    }
                                                </Fragment>
                                            )
                                        }
                                    })}
                                    {_.isEmpty(users) && <tr><td colSpan="11"><div className="text-center">No Record Found</div></td></tr>}
                                </tbody>
                            </Table>
                        </div>
                    </CardBody>



                    {!_.isEmpty(users) ? (
                        <CardFooter>
                            <Button onClick={() => history.goBack()} className="dark_btn"><i className="fa fa-arrow-left" aria-hidden="true"></i> Back  </Button>
                            <Button className={'ml-2'} type="submit" color="primary">Submit {loading === true ? <i className="fa fa-spinner fa-pulse fa-fw ml-1"></i> : <i className="fa fa-arrow-circle-right fa-lg" aria-hidden="true"></i>}</Button>
                        </CardFooter>
                    ) : null}

                </Card>
            </form>
        </React.Fragment >
    );
}

export default ScheduleAddContest;
