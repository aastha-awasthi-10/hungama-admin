import React, { useState, useEffect } from 'react';
import { ErrorMessage, useForm } from 'react-hook-form';
import Helper from '../../../../constants/helper';
import { useHistory, Redirect } from "react-router-dom";
import apiUrl from '../../../../constants/apiPath';
import { Button, Card, CardBody, CardHeader, CardTitle, CardFooter, FormGroup, Label, Col, Row } from 'reactstrap';
import _ from 'lodash';
import { useAlert } from 'react-alert';
import useSession from 'react-session-hook';
// const PointsRoute = React.lazy(() => import('../../PointsRoute'));

const OdiBowlingForm = (props) => {
    const session = useSession();
    let history = useHistory();
    const alert = useAlert();
    const { register, handleSubmit, errors, watch } = useForm();
    const [loading, setLoading] = useState(false);
    const [odiData, setData] = useState({});
    const [token] = useState(session.token);

    const [should_redirect, setRedirect] = useState(false);

    const onSubmit = async data => {
        setLoading(true);
        let postJson = {
            bowlingWicket: data.bowlingWicket.trim(),
            bowling4Wicket: data.bowling4Wicket.trim(),
            bowling5Wicket: data.bowling5Wicket.trim(),
            bowlingMaiden: data.bowlingMaiden.trim()
        };

        let path = apiUrl.update_odi_bowling;
        const fr = await Helper.post(postJson, path, token);
        const res = await fr.response.json();
        if (fr.status === 200) {
            if (res.success) {
                setLoading(false);

                setRedirect(true);
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

    const getData = async () => {
        let path = apiUrl.get_odi_bowling;
        const fr = await Helper.get(path, token);
        const res = await fr.response.json();
        if (fr.status === 200) {
            if (res.success) {
                setData(res.results || []);
            } else {
                console.log(res.msg);
            }
        } else {
            console.log(res.msg);
        }
    };

    useEffect(() => {
        getData();
    }, []);

    /* if (should_redirect) {
        return <Redirect to="point-system" />
    } */

    return (
        <React.Fragment>
            {/* <PointsRoute/> */}
            <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
                <Card>
                    <CardBody>
                        <Row>
                            <Col md={6}>
                                <FormGroup>
                                    <Label className={'col-md-4 pull-left mt-2'}>Wicket:<br></br>
                                        <small>Excluding Run Out</small></Label>
                                    <input type="number" min={0} step="0.1" name="bowlingWicket" placeholder="Wicket" autoComplete="off"
                                        className="form-control col-md-8" defaultValue={odiData.bowlingWicket} ref={register({ required: 'Required' })} />
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <Label className={'col-md-4 pull-left mt-2'}>4 wicket haul Bonus:</Label>
                                    <input type="number" min={0} step="0.1" name="bowling4Wicket" placeholder="4 wicket haul Bonus" autoComplete="off"
                                        className="form-control col-md-8" defaultValue={odiData.bowling4Wicket} ref={register({ required: 'Required' })} />
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <Label className={'col-md-4 pull-left mt-2'}>5 wicket haul Bonus:</Label>
                                    <input type="number" min={0} step="0.1" name="bowling5Wicket" placeholder="5 wicket haul Bonus" autoComplete="off"
                                        className="form-control col-md-8" defaultValue={odiData.bowling5Wicket} ref={register({ required: 'Required' })} />
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <Label className={'col-md-4 pull-left mt-2'}>Maiden over:</Label>
                                    <input type="number" min={0} step="0.1" name="bowlingMaiden" placeholder="Maiden over" autoComplete="off"
                                        className="form-control col-md-8" defaultValue={odiData.bowlingMaiden} ref={register({ required: 'Required' })} />
                                </FormGroup>
                            </Col>
                        </Row>
                    </CardBody>
                    <CardFooter>
                        {/* <Button onClick={() => history.goBack()} className="dark_btn"><i className="fa fa-arrow-left" aria-hidden="true"></i> Back  </Button> */}
                        <Button className={'ml-2'} type="submit" color="primary">Submit {loading === true ? <i className="fa fa-spinner fa-pulse fa-fw ml-1"></i> : <i className="fa fa-arrow-circle-right fa-lg" aria-hidden="true"></i>}</Button>
                    </CardFooter>
                </Card>
            </form>
        </React.Fragment>
    );
}

export default OdiBowlingForm;