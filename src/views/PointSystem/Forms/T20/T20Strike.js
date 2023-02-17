import React, { useState, useEffect } from 'react';
import { ErrorMessage, useForm } from 'react-hook-form';
import Helper from '../../../../constants/helper';
import { useHistory, Redirect } from "react-router-dom";
import apiUrl from '../../../../constants/apiPath';
import { Button, Card, CardBody, CardFooter, FormGroup, Label, Col, Row } from 'reactstrap';
import _ from 'lodash';
import { useAlert } from 'react-alert';
import useSession from 'react-session-hook';
// const PointsRoute = React.lazy(() => import('../../PointsRoute'));

const T20StrikeForm = (props) => {
    const session = useSession();
    let history = useHistory();
    const alert = useAlert();
    const { register, handleSubmit, errors, watch } = useForm();
    const [loading, setLoading] = useState(false);
    const [t10Data, setData] = useState({});
    const [token] = useState(session.token);

    const [should_redirect, setRedirect] = useState(false);

    const onSubmit = async data => {
        setLoading(true);
        let postJson = {
            t20StrikeGt60Runs: data.t20StrikeGt60Runs.trim(),
            t20StrikeGt50Runs: data.t20StrikeGt50Runs.trim(),
            t20StrikeLt50Runs: data.t20StrikeLt50Runs.trim(),
            t20StrikeGt130Runs: data.t20StrikeGt130Runs.trim(),
            t20StrikeGt150Runs: data.t20StrikeGt150Runs.trim(),
            t20StrikeGt170Runs: data.t20StrikeGt170Runs.trim()
        };

        let path = apiUrl.update_t20_strike;
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
        let path = apiUrl.get_t20_strike;
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
                                    <Label className={'col-md-4 pull-left mt-2'}>Between 60-70 runs per 100 balls:</Label>
                                    <input type="number" step="0.1" name="t20StrikeGt60Runs" placeholder="Between 60-70 runs per 100 balls" autoComplete="off"
                                        className="form-control col-md-8" defaultValue={t10Data.t20StrikeGt60Runs} ref={register({ required: 'Required' })} />
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <Label className={'col-md-4 pull-left mt-2'}>Between 50-59.9 runs per 100 balls:</Label>
                                    <input type="number" step="0.1" name="t20StrikeGt50Runs" placeholder="Between 80-89.9 runs per 100 balls" autoComplete="off"
                                        className="form-control col-md-8" defaultValue={t10Data.t20StrikeGt50Runs} ref={register({ required: 'Required' })} />
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <Label className={'col-md-4 pull-left mt-2'}>Below 50 runs per 100 balls:</Label>
                                    <input type="number" step="0.1" name="t20StrikeLt50Runs" placeholder="Below 50 runs per 100 balls" autoComplete="off"
                                        className="form-control col-md-8" defaultValue={t10Data.t20StrikeLt50Runs} ref={register({ required: 'Required' })} />
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <Label className={'col-md-4 pull-left mt-2'}>Between 130-150 runs per 100 balls:</Label>
                                    <input type="number" step="0.1" name="t20StrikeGt130Runs" placeholder="Between 130-150 runs per 100 balls" autoComplete="off"
                                        className="form-control col-md-8" defaultValue={t10Data.t20StrikeGt130Runs} ref={register({ required: 'Required' })} />
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <Label className={'col-md-4 pull-left mt-2'}>Between 150-170 runs per 100 balls:</Label>
                                    <input type="number" step="0.1" name="t20StrikeGt150Runs" placeholder="Between 150-170 runs per 100 balls" autoComplete="off"
                                        className="form-control col-md-8" defaultValue={t10Data.t20StrikeGt150Runs} ref={register({ required: 'Required' })} />
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <Label className={'col-md-4 pull-left mt-2'}>Above 170 runs per 100 balls:</Label>
                                    <input type="number" step="0.1" name="t20StrikeGt170Runs" placeholder="Above 170 runs per 100 balls" autoComplete="off"
                                        className="form-control col-md-8" defaultValue={t10Data.t20StrikeGt170Runs} ref={register({ required: 'Required' })} />
                                </FormGroup>
                            </Col>

                        </Row>
                    </CardBody>
                    <CardFooter>
                        <Button className={'ml-2'} type="submit" color="primary">Submit {loading === true ? <i className="fa fa-spinner fa-pulse fa-fw ml-1"></i> : <i className="fa fa-arrow-circle-right fa-lg" aria-hidden="true"></i>}</Button>
                    </CardFooter>
                </Card>
            </form>
        </React.Fragment>
    );
}

export default T20StrikeForm;