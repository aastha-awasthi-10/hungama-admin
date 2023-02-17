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

const T10OtherForm = (props) => {
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
                            othersCaptain: data.othersCaptain.trim(), 
                            othersViceCaptain: data.othersViceCaptain.trim(),
                            othersStarting11: data.othersStarting11.trim()
                        };        

        let path = apiUrl.update_t10_other;
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
        let path = apiUrl.get_t10_other;
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
                                    <Label className={'col-md-4 pull-left mt-2'}>Captain:</Label>
                                    <input type="number" min={0} step="0.1" name="othersCaptain" placeholder="Captain" autoComplete="off"
                                        className="form-control col-md-8" defaultValue={t10Data.othersCaptain} ref={register({ required: 'Required' })} />
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <Label className={'col-md-4 pull-left mt-2'}>Vice-Captain:</Label>
                                    <input type="number" min={0} step="0.1" name="othersViceCaptain" placeholder="Vice-Captain" autoComplete="off"
                                        className="form-control col-md-8" defaultValue={t10Data.othersViceCaptain} ref={register({ required: 'Required' })} />
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <Label className={'col-md-4 pull-left mt-2'}>In starting 11:</Label>
                                    <input type="number" min={0} step="0.1" name="othersStarting11" placeholder="In starting 11" autoComplete="off"
                                        className="form-control col-md-8" defaultValue={t10Data.othersStarting11} ref={register({ required: 'Required' })} />
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

export default T10OtherForm;
