import React, { useState, useEffect } from 'react';
import { ErrorMessage, useForm } from 'react-hook-form';
import Helper from '../../constants/helper';
import { useHistory,Redirect } from "react-router-dom";
import apiUrl from '../../constants/apiPath';
import { Button, Card, CardBody, CardHeader, CardTitle, CardFooter, FormGroup, Label, Col, Row } from 'reactstrap';
import _ from 'lodash';
import { useAlert } from 'react-alert';
import useSession from 'react-session-hook';

const UpdateFlag = (props) => {
    const session = useSession();
    let history = useHistory();
    const alert = useAlert();
    const { register, handleSubmit, errors, watch } = useForm();
    const [token] = useState(session.token);
    const [id, setId] = useState('');
    const [loading, setLoading] = useState(false);

    const [team_flag, setTeamFlag] = useState('');
    const [preview, setTeamFlagPreview] = useState('');
    const [should_redirect, setRedirect] = useState(false);

    const [SeriesData, setData] = useState({});

    const onSubmit = async data => {
        let formData = new FormData();
        let postJson = { id: id, team_short_name: data.team_short_name.trim() };
        formData.append('data', JSON.stringify(postJson));
        formData.append('team_flag', team_flag);
        let path = apiUrl.update_flag;
        const fr = await Helper.formPost(formData, path, token);
        const res = await fr.response.json();
        if (fr.status === 200) {
            if (res.success) {
                setLoading(false);
                setRedirect(true); 
                props.history.push('/cricket/mst-teams');
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
        let path = apiUrl.get_single_team_data + '/' + props.match.params.id;
        const fr = await Helper.get(path, token);
        const res = await fr.response.json();
        if (fr.status === 200) {
            if (res.success) {
                setId(props.match.params.id);
                setTeamFlagPreview(res.results.flag?res.results.flag:process.env.REACT_APP_IMAGE_BASE_URL +
                    "/static/team_flags/no_image.jpg");
                // setTeamFlagPreview(process.env.REACT_APP_IMAGE_BASE_URL + '/static/team_flags/'+res.results.flag);
                setData(res.results);
            } else {
                console.log(res.msg);
            }
        } else {
            console.log(res.msg);
        }
    };

    const onImageChange = (event) => {
        if (event.target.files && event.target.files[0]) {
            setTeamFlagPreview(URL.createObjectURL(event.target.files[0]));
            setTeamFlag(event.target.files[0]);
        }
    }

    useEffect(() => {
        getData();
    }, []);

    if(should_redirect) {
        return <Redirect to="/mst-teams"/>
    }
    return (
        <React.Fragment>
            <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-info"><h4>Update Flag</h4></CardTitle>
                    </CardHeader>
                    <CardBody>
                        <Row>
                            <Col md={6}>
                                <FormGroup>
                                    <Label className={'col-md-2 pull-left mt-2'}>Short Name</Label>
                                    <input type="text" name="team_short_name" placeholder="Short Name" autoComplete="off"
                                        className="form-control col-md-8" defaultValue={SeriesData.team_short_name} ref={register({ required: 'Required' })} />
                                    {errors.short_name && <p className="text-danger marginmessage">Short Name is required</p>}
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <Label className={'col-md-2 pull-left mt-2'}>Team Flag</Label>
                                    <input type="file" onChange={onImageChange} name="team_flag" className="form-control  col-md-8" autoComplete="off" placeholder="Pic" />
                                    <img id="target" className={'mt-3 rounded'} src={preview} />
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

export default UpdateFlag;