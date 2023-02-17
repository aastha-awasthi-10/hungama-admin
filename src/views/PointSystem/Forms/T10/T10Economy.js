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

const T10Economy = (props) => {
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
                            t10EconomyLt6Runs: data.t10EconomyLt6Runs.trim(), 
                            t10EconomyGt6Runs: data.t10EconomyGt6Runs.trim(),
                            t10EconomyBt7_8Runs: data.t10EconomyBt7_8Runs.trim(),
                            t10EconomyBt11_12Runs: data.t10EconomyBt11_12Runs.trim(),
                            t10EconomyBt12_13Runs: data.t10EconomyBt12_13Runs.trim(),
                            t10EconomyGt13Runs: data.t10EconomyGt13Runs.trim()
                        };        

        let path = apiUrl.update_t10_economy;
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
        let path = apiUrl.get_t10_economy;
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

   /*  if(should_redirect) {
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
                                    <Label className={'col-md-4 pull-left mt-2'}>Below 6 runs per over:</Label>
                                    <input type="number" min={0} step="0.1" name="t10EconomyLt6Runs" placeholder="Below 6 runs per over" autoComplete="off"
                                        className="form-control col-md-8" defaultValue={t10Data.t10EconomyLt6Runs} ref={register({ required: 'Required' })} />
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <Label className={'col-md-4 pull-left mt-2'}>Between 6-6.99 runs per over:</Label>
                                    <input type="number" min={0} step="0.1" name="t10EconomyGt6Runs" placeholder="Between 6-6.99 runs per over" autoComplete="off"
                                        className="form-control col-md-8" defaultValue={t10Data.t10EconomyGt6Runs} ref={register({ required: 'Required' })} />
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <Label className={'col-md-4 pull-left mt-2'}>Between 7-8 runs per over:</Label>
                                    <input type="number" min={0} step="0.1" name="t10EconomyBt7_8Runs" placeholder="Between 7-8 runs per over" autoComplete="off"
                                        className="form-control col-md-8" defaultValue={t10Data.t10EconomyBt7_8Runs} ref={register({ required: 'Required' })} />
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <Label className={'col-md-4 pull-left mt-2'}>Between 11-12 runs per over:</Label>
                                    <input type="number" step="0.1" name="t10EconomyBt11_12Runs" placeholder="Between 11-12 runs per over" autoComplete="off"
                                        className="form-control col-md-8" defaultValue={t10Data.t10EconomyBt11_12Runs} ref={register({ required: 'Required' })} />
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <Label className={'col-md-4 pull-left mt-2'}>Between 12.01-13 runs per over:</Label>
                                    <input type="number" step="0.1" name="t10EconomyBt12_13Runs" placeholder="Between 12.01-13 runs per over" autoComplete="off"
                                        className="form-control col-md-8" defaultValue={t10Data.t10EconomyBt12_13Runs} ref={register({ required: 'Required' })} />
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <Label className={'col-md-4 pull-left mt-2'}>Above 13 runs per over:</Label>
                                    <input type="number" step="0.1" name="t10EconomyGt13Runs" placeholder="Above 13 runs per over" autoComplete="off"
                                        className="form-control col-md-8" defaultValue={t10Data.t10EconomyGt13Runs} ref={register({ required: 'Required' })} />
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

export default T10Economy;
