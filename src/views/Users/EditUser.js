import React, { useState, useEffect } from 'react';
import { ErrorMessage, useForm } from 'react-hook-form';
import Helper from '../../constants/helper';
import { useHistory } from "react-router-dom";
import apiUrl from '../../constants/apiPath';
import { Button, Card, CardBody, CardHeader, CardTitle, CardFooter, FormGroup, Label, Col, Row } from 'reactstrap';
import _ from 'lodash';
import moment from "moment";
import { useAlert } from 'react-alert';
import useSession from 'react-session-hook';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const EditUser = (props) => {
    const session = useSession();
    let history = useHistory();
    const alert = useAlert();
    const { register, handleSubmit, errors, watch } = useForm();

    const [token] = useState(session.token);
    const [id, setId] = useState('');
    const [loading, setLoading] = useState(false);
    const [profilePic, setProfilePic] = useState('');
    const [preview, setProfilePicPreview] = useState('');
    const [UserData, setData] = useState({});
    const [gender, SetGender] = useState('male');
    const [dob, setDob] = useState(new Date());


    const onSubmit = async data => {
        setLoading(true);
        let formData = new FormData();
        let postJson = { id: id, gender: gender, dob: dob, full_name: data.full_name.trim(), email: data.email, username: _.snakeCase(data.username), phone: data.mobile };
        formData.append('data', JSON.stringify(postJson));
        formData.append('profile_pic', profilePic);
        let path = apiUrl.update_user;
        const fr = await Helper.formPost(formData, path, token);
        const res = await fr.response.json();
        if (fr.status === 200) {
            if (res.success) {
                setLoading(false);
                props.history.push('/users');
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
        const user_Id = session.profile.id;
        let path = apiUrl.get_user + '/' + `${props.match.params.id}`;
        const fr = await Helper.get(path, token);
        const res = await fr.response.json();
        if (fr.status === 200) {
            if (res.success) {
                setId(res.results.id);
                setProfilePicPreview(res.results.image);
                setData(res.results);
                SetGender(res.results.gender || 'male');
                var timestamp = Date.parse(res.results.dob);
                if (isNaN(timestamp) == false) {
                    setDob(new Date(res.results.dob));
                } else {
                    setDob('');
                }
            } else {
                console.log(res.msg);
            }
        } else {
            console.log(res.msg);
        }
    };
    const onImageChange = (event) => {
        if (event.target.files && event.target.files[0]) {
            setProfilePicPreview(URL.createObjectURL(event.target.files[0]));
            setProfilePic(event.target.files[0]);
        }
    }
    const handleDob = (date) => {
        let newDate = date ? date : new Date();
        setDob(newDate);
    };
    useEffect(() => {
        getData();
    }, []);

    return (
        <React.Fragment>
            <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-info"><h4>Edit User</h4></CardTitle>
                    </CardHeader>
                    <CardBody>
                        <Row>
                            <Col md={6}>
                                <FormGroup>
                                    <Label className={'col-md-2 pull-left mt-2'}>Full Name</Label>
                                    <input type="text" minLength={"3"} maxLength={"50"} name="full_name" placeholder="Full Name" autoComplete="off"
                                        className="form-control col-md-8" defaultValue={UserData.full_name} ref={register({ required: 'Required', pattern: /^[a-z\d\-_\s]+$/i })} />
                                    {errors.full_name && <p className="text-danger marginmessage">Full Name is required and should be alphabatic only</p>}
                                </FormGroup>
                            </Col>
                            {/* <Col md={6}>
                                <FormGroup>
                                    <Label className={'col-md-2 pull-left mt-2'}>Last Name</Label>
                                    <input type="text" minLength={"3"} maxLength={"50"} name="last_name" placeholder="Last Name" autoComplete="off"
                                        className="form-control col-md-8" defaultValue={UserData.last_name} ref={register({ required: 'Required', pattern: /^[A-Za-z]+$/i })} />
                                    {errors.last_name && <p className="text-danger marginmessage">Last Name is required and should be alphabatic only</p>}
                                </FormGroup>
                            </Col> */}
                            <Col md={6}>
                                <FormGroup>
                                    <Label className={'col-md-2 pull-left mt-2'}>User Name</Label>
                                    <input type="text" disabled name="username" id={"username"} defaultValue={UserData.username} className="form-control col-md-8" autoComplete="off" placeholder="User Name"
                                        ref={register({ required: 'Username Required' })} />
                                    <ErrorMessage errors={errors} name="username">
                                        {({ message }) => <p className={"text-danger"}>{message}</p>}
                                    </ErrorMessage>
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <Label className={'col-md-2 pull-left mt-2'}>Mobile Number</Label>
                                    <input type="text" disabled name="mobile" className="form-control  col-md-8" defaultValue={UserData.phone} maxLength="10" placeholder="Phone Number"
                                        ref={register({
                                            required: 'Mobile is Required',
                                            maxLength: 10,
                                            minLength: 10,
                                            validate: (value) => {
                                                var paswd = /^(\+\d{1,3}[- ]?)?\d{10}$/;
                                                if (value.match(paswd)) {
                                                    return true;
                                                } else {
                                                    return 'Mobile number is invalid';
                                                }
                                            }
                                        })} />
                                    <ErrorMessage errors={errors} name="mobile">
                                        {({ message }) => <p className={"text-danger"}>{message}</p>}
                                    </ErrorMessage>
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <Label className={'col-md-2 pull-left mt-2'}>Email</Label>
                                    <input type="text" disabled name="email" className="form-control  col-md-8" defaultValue={UserData.email} placeholder="Email"
                                        ref={register({
                                            required: 'Phone is Required',
                                            pattern: {
                                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                message: "invalid email address"
                                            }
                                        })} />
                                    <ErrorMessage errors={errors} name="email">
                                        {({ message }) => <p className={"text-danger"}>{message}</p>}
                                    </ErrorMessage>
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <Label className={'col-md-2 pull-left mt-2'}>Gender</Label>
                                    <select type="select" name="gender" value={gender} className="form-control col-md-8" onChange={(e) => { SetGender(e.target.value) }}>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                    </select >
                                    <ErrorMessage errors={errors} name="gender">
                                        {({ message }) => <p className={"text-danger"}>{message}</p>}
                                    </ErrorMessage>
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <Label className={'col-md-2 pull-left mt-2'}>Date of birth</Label>
                                    <div className={"pull-left col-md-8 p-0 mb-3"}>
                                        <DatePicker selected={dob === '' ? null : new Date(dob)} className="form-control" placeholderText=" Date of Birth"
                                            dateFormat="dd/MM/yyyy"
                                            maxDate={new Date(new Date().setFullYear(new Date().getFullYear() - 18))}
                                            onChange={handleDob}
                                            peekNextMonth
                                            showMonthDropdown
                                            showYearDropdown
                                            dropdownMode="select"
                                            required={true} />
                                    </div>
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <Label className={'col-md-2 pull-left mt-2'}>Profile Pic</Label>
                                    <input type="file" onChange={onImageChange} name="profile_pic" className="form-control  col-md-8" autoComplete="off" placeholder="Pic" />
                                    <ErrorMessage errors={errors} name="profile_pic">
                                        {({ message }) => <p className={"text-danger"}>{message}</p>}
                                    </ErrorMessage>
                                    <img id="target" className={'mt-3 rounded'} height={200} src={preview} />
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

export default EditUser;
