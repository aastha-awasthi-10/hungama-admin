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

const T20Economy = (props) => {
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
        let postJson =  {   
                            t20EconomyLt4Runs: data.t20EconomyLt4Runs.trim(), 
                            t20EconomyGt4Runs: data.t20EconomyGt4Runs.trim(),
                            t20EconomyGt5Runs: data.t20EconomyGt5Runs.trim(),
                            t20EconomyGt9Runs: data.t20EconomyGt9Runs.trim(),
                            t20EconomyGt10Runs: data.t20EconomyGt10Runs.trim(),
                            t20EconomyGt11Runs: data.t20EconomyGt11Runs.trim()
                        };        

        let path = apiUrl.update_t20_economy;
        const fr = await Helper.post(postJson,path, token);
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
        let path = apiUrl.get_t20_economy;
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

    /* if(should_redirect) {
        return <Redirect to="point-system"/>
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
                                    <Label className={'col-md-4 pull-left mt-2'}>Below 4 runs per over:</Label>
                                    <input type="number" min={0} step="0.1" name="t20EconomyLt4Runs" placeholder="Below 4 runs per over" autoComplete="off"
                                        className="form-control col-md-8" defaultValue={t10Data.t20EconomyLt4Runs} ref={register({ required: 'Required' })} />
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <Label className={'col-md-4 pull-left mt-2'}>Between 4-4.99 runs per over:</Label>
                                    <input type="number" min={0} step="0.1" name="t20EconomyGt4Runs" placeholder="Between 4-4.99 runs per over" autoComplete="off"
                                        className="form-control col-md-8" defaultValue={t10Data.t20EconomyGt4Runs} ref={register({ required: 'Required' })} />
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <Label className={'col-md-4 pull-left mt-2'}>Between 5-6 runs per over:</Label>
                                    <input type="number" min={0} step="0.1" name="t20EconomyGt5Runs" placeholder="Between 5-6 runs per over" autoComplete="off"
                                        className="form-control col-md-8" defaultValue={t10Data.t20EconomyGt5Runs} ref={register({ required: 'Required' })} />
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <Label className={'col-md-4 pull-left mt-2'}>Between 9-10 runs per over:</Label>
                                    <input type="number" step="0.1" name="t20EconomyGt9Runs" placeholder="Between 9-10 runs per over" autoComplete="off"
                                        className="form-control col-md-8" defaultValue={t10Data.t20EconomyGt9Runs} ref={register({ required: 'Required' })} />
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <Label className={'col-md-4 pull-left mt-2'}>Between 10.1-11 runs per over:</Label>
                                    <input type="number" step="0.1" name="t20EconomyGt10Runs" placeholder="Between 10.1-11 runs per over" autoComplete="off"
                                        className="form-control col-md-8" defaultValue={t10Data.t20EconomyGt10Runs} ref={register({ required: 'Required' })} />
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <Label className={'col-md-4 pull-left mt-2'}>Above 11 runs per over:</Label>
                                    <input type="number" step="0.1" name="t20EconomyGt11Runs" placeholder="Above 13 runs per over" autoComplete="off"
                                        className="form-control col-md-8" defaultValue={t10Data.t20EconomyGt11Runs} ref={register({ required: 'Required' })} />
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

export default T20Economy;