import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import Helper from '../../../constants/helper';
import apiUrl from '../../../constants/apiPath';
import moment from "moment";
import Pagination from "react-js-pagination";
import { Card, Button, CardBody, CardHeader, Col, Row, Table, Form, Input, FormGroup } from 'reactstrap';
import _ from "lodash";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Loaders from '../../CommanPage/Loader'
import useSession from "react-session-hook";
import { useAlert } from "react-alert";

const ContestWinners = (props) => {
    const session = useSession();
    const alert = useAlert();
    const [users, setUsers] = useState([]);
    const [totalitems, setTotalItems] = useState('');
    const [activepage] = useState(1);   
    const [visible, setVisibale] = useState(false);
    const [token] = useState(session.token);     

    const getData = async (page = activepage) => {
        setVisibale(true);
        const itemsPerPage = 10;
        let path;
        if (props.match.params.id) {
            path = apiUrl.contest_winners + '/' + `${props.match.params.id}` + '?page=' + `${page}` + '&itemsPerPage=' + `${itemsPerPage}`;
        } else {
            path = apiUrl.contest_winners + '?page=' + `${page}` + '&itemsPerPage=' + `${itemsPerPage}`;
        }
        const fr = await Helper.get(path, token);
        const res = await fr.response.json();
        if (fr.status === 200) {
            if (res.success) {
                setUsers(res.results.docs || []);
                setTotalItems(res.results.totalDocs);
                setVisibale(false)
            } else {
                alert.error(res.msg);
                setVisibale(false)
            }
        } else {
            alert.error(res.error);
            setVisibale(false)
        }

    };


    useEffect(() => {
        getData();
    }, []);


    return (
        <div className="animated fadeIn loader-outer">
            <Loaders className="overlay-loader" visible={visible} />
            <Row>
                <Col>
                    <Card>
                        <CardHeader>
                            <i className="fa fa-list" /> Contest Match Winners
              </CardHeader>
                        <CardBody>
                            <div id="reportId" >
                                <Table hover bordered responsive className="mt-3 text-center">
                                    <thead>
                                        <tr>
                                            <th>Sr.No</th>
                                            <th>Contest Name</th>
                                            <th>Rank</th>
                                            <th>User Name</th>
                                            <th>User Point</th>
                                            <th>Winning Amount</th>
                                            <th>Questions</th>
                                            <th>Right/Wrong</th>
                                            <th>Entry Fee</th>
                                            <th>Created At</th>                                            
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.map((item, key) => {
                                            return (
                                                <tr key={key}>
                                                    <td>{key + 1}</td>
                                                    <td>{item.game_id.name}</td>
                                                    <td>{item.user_rank}</td>
                                                    <td>{item.user_id.first_name + '' + item.user_id.last_name}</td>
                                                    <td>{item.user_total_points}</td>
                                                    <td>{item.win_amount}</td>
                                                    <td>{item.game_id.questions_count}</td>
                                                    <td>{item.user_right_answers + ' / ' + item.user_wrong_answers}</td>
                                                    <td>{item.game_id.entry_fee}</td>
                                                    <td>{moment(item.createdAt).format('LLL')}</td>                                                    
                                                </tr>
                                            )
                                        })}
                                        {_.isEmpty(users) && <tr><td colSpan="11"><div className="text-center">No Record Found</div></td></tr>}
                                    </tbody>
                                </Table>
                            </div>
                            {!_.isEmpty(users) && <div className="show-pagination technician-page">
                                <Pagination
                                    activeClass={""}
                                    activeLinkClass={"page-link active"}
                                    itemClass={"page-item"}
                                    linkClass={"page-link"}
                                    activePage={activepage}
                                    itemsCountPerPage={10}
                                    totalItemsCount={totalitems}
                                    pageRangeDisplayed={4}
                                    prevPageText="Previous"
                                    nextPageText="Next"
                                    firstPageText="<"
                                    lastPageText=">"
                                    onChange={getData}
                                />
                            </div>}
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </div >
    );
};

export default ContestWinners;
