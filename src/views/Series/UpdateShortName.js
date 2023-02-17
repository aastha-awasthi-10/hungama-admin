import React, { useState, useEffect } from 'react';
import { ErrorMessage, useForm } from 'react-hook-form';
import Helper from '../../constants/helper';
import { useHistory } from "react-router-dom";
import apiUrl from '../../constants/apiPath';
import { Button, Card, CardBody, CardHeader, CardTitle, CardFooter, FormGroup, Label, Col, Row } from 'reactstrap';
import _ from 'lodash';
import { useAlert } from 'react-alert';
import useSession from 'react-session-hook';

const UpdateShortName = (props) => {
    const session = useSession();
    let history = useHistory();
    const alert = useAlert();
    const { register, handleSubmit, errors, watch } = useForm();
    const [token] = useState(session.token);
    const [id, setId] = useState('');
    const [loading, setLoading] = useState(false);
    const [SeriesData, setData] = useState({});

    const onSubmit = async data => {
        setLoading(true);      
        let postJson = { id: id, short_name: data.short_name.trim() };        
        let path = apiUrl.update_short_name;
        const fr = await Helper.post(postJson,path, token);
        const res = await fr.response.json();
        if (fr.status === 200) {
            if (res.success) {
                setLoading(false);
                props.history.push('/cricket/series');
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
        let path = apiUrl.get_single_series_data + '/' + props.match.params.id;
        const fr = await Helper.get(path, token);
        const res = await fr.response.json();
        if (fr.status === 200) {
            if (res.success) {
                setId(props.match.params.id);
                setData(res.results);
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


    return (
        <React.Fragment>
            <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-info"><h4>Edit Short Name</h4></CardTitle>
                    </CardHeader>
                    <CardBody>
                        <Row>
                            <Col md={6}>
                                <FormGroup>
                                    <Label className={'col-md-2 pull-left mt-2'}>Short Name</Label>
                                    <input type="text" name="short_name" placeholder="Short Name" autoComplete="off"
                                        className="form-control col-md-8" defaultValue={SeriesData.short_name} ref={register({ required: 'Required' })} />
                                    {errors.short_name && <p className="text-danger marginmessage">Short Name is required</p>}
                                </FormGroup>
                            </Col>
                        </Row>
                    </CardBody>
                    <CardFooter>
                        <Button onClick={() => history.goBack()} className="dark_btn"><i className="fa fa-arrow-left" aria-hidden="true"></i> Back  </Button>
                        <Button className={'ml-2'} type="submit" color="primary">Submit {loading === true ? <i className="fa fa-spinner fa-pulse fa-fw ml-1"></i> : <i className="fa fa-arrow-circle-right fa-lg" aria-hidden="true"></i>}</Button>
                    </CardFooter>
                </Card>
            </form>
        </React.Fragment>
    );
}

export default UpdateShortName;
