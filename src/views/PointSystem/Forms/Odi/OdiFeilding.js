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

const OdiFeildingForm = (props) => {
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
            fieldingCatch: data.fieldingCatch.trim(),
            fieldingStumpRunOut: data.fieldingStumpRunOut.trim(),
            fieldingRunOutThrower: data.fieldingRunOutThrower.trim()
        };

        let path = apiUrl.update_odi_feilding;
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
        let path = apiUrl.get_odi_feilding;
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
    const handleCatch = (e) => {
        if(e.target.value > 11)
        e.target.value = 11;
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
                                    <Label className={'col-md-4 pull-left mt-2'}>Catch:</Label>
                                    <input type="number" max={11} onChange={handleCatch} min={0} step="0.1" name="fieldingCatch" placeholder="Catch" autoComplete="off"
                                        className="form-control col-md-8" defaultValue={odiData.fieldingCatch} ref={register({ required: 'Required' })} />
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <Label className={'col-md-4 pull-left mt-2'}>Stumping:<br></br>
                                        <small>Direct</small></Label>
                                    <input type="number" min={0} step="0.1" name="fieldingStumpRunOut" placeholder="Stumping Direct" autoComplete="off"
                                        className="form-control col-md-8" defaultValue={odiData.fieldingStumpRunOut} ref={register({ required: 'Required' })} />
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <Label className={'col-md-4 pull-left mt-2'}>Run-out:</Label>
                                    <input type="number" min={0} step="0.1" name="fieldingRunOutThrower" placeholder="Run-out" autoComplete="off"
                                        className="form-control col-md-8" defaultValue={odiData.fieldingRunOutThrower} ref={register({ required: 'Required' })} />
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

export default OdiFeildingForm;