import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import Swal from 'sweetalert2';
import Helper from '../../constants/helper';
import apiUrl from '../../constants/apiPath';
import { Button, Card, CardBody, CardHeader, CardTitle, CardFooter, FormGroup, Label, Col, Row } from 'reactstrap';
import { ValidatorForm } from 'react-form-validator-core';
import TextValidator from '../CommanPage/TextValidator';
import useSession from "react-session-hook";
import CreateCryptoWallet from "../CommanPage/CreateCryptoWallet";


const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000
});

const UserProfile = (props) => {

    const session = useSession();
    let history = useHistory();
    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [mobile, setMobile] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [token] = useState(session.token);
    const [user_type] = useState(session.profile.user_type);
    const [id, setId] = useState("");
    const [profilePic, setProfilePic] = useState('');
    const [preview, setProfilePicPreview] = useState('');   
    const [buttonstate, setButtonState] = useState(false);   

    const onSumbit = async e => {
        let formData = new FormData();
        let postJson = { firstName: firstname, lastName: lastname, username: username, email: email, phone: mobile, country_code: "+91" };       
        formData.append('data', JSON.stringify(postJson));
        // formData.append('profile_pic', profilePic);
        let path = apiUrl.update_admin_profile;        
        const fr = await Helper.formPost(formData, path, token);
        const res = await fr.response.json();
        if (fr.status === 200) {
            if (res.success) {
                Toast.fire({
                    type: "success",
                    title: res.msg,
                });
                localStorage.setItem("username", username);
                props.history.push('/userprofile');
            } else {
                Toast.fire({
                    type: "error",
                    title: res.msg,
                });
            }
        } else {
            Toast.fire({
                type: "error",
                title: res.error,
            });
        }
        
    };

    const getData = async () => {
        const user_Id = session.profile._id;
        // console.log("session.profile",session.profile);
        let path = apiUrl.get_admin_profile + '/?userId=' + user_Id;
        const fr = await Helper.get(path, token);
        const res = await fr.response.json();
        console.log("res",res);
        if (fr.status === 200) {
            if (res.success) {                              
                setFirstname(res.results.first_name);
                setLastname(res.results.last_name);
                setUsername(res.results.username);
                setMobile(res.results.phone);
                setEmail(res.results.email);
                setId(res.results.id);
                setProfilePicPreview(res.results.image)
            } else {
                Toast.fire({
                    type: "error",
                    title: res.msg,
                });
            }
        } else {
            Toast.fire({
                type: "error",
                title: res.error,
            });
        }
    };

    const onImageChange = (event) => {
        if (event.target.files && event.target.files[0]) {
            const image = event.target.files[0];
            if (!image.name.match(/\.(jpg|jpeg|png)$/)) {
                Toast.fire({
                    type: "error",
                    title: "select valid image.",
                });
                setButtonState(true)
                return false;
            }else{
                // setProfilePicPreview(URL.createObjectURL(event.target.files[0]));
                // setProfilePic(event.target.files[0]);
                setButtonState(false)
            }
        }
    }
    useEffect(() => { getData(); }, []);

    return (
        <React.Fragment>
            <ValidatorForm onSubmit={onSumbit}>
                <Card>

                <CardHeader className="align-items-center d-flex">
                <CardTitle className="text-info"><h3>My Profile</h3></CardTitle>
                {/* <div className="ml-auto">
                    {<CreateCryptoWallet item={id} />}
                </div> */}
                </CardHeader>
                    <CardBody>
                        <Row>
                            <Col md={6}>
                                <FormGroup>
                                    <Label className={'col-md-2 pull-left mt-2'}>First Name</Label>
                                    <TextValidator type="text" name="fname" placeholder="Frist Name" className="form-control col-md-8"
                                        onChange={(e) => { setFirstname(e.target.value) }}
                                        value={firstname}
                                        validators={['required']}
                                        errorMessages={['This field is required']} />
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <Label className={'col-md-2 pull-left mt-2'}>Last Name</Label>
                                    <TextValidator type="text" name="lname" placeholder="Last Name" className="form-control col-md-8"
                                        onChange={(e) => { setLastname(e.target.value) }}
                                        value={lastname}
                                        validators={['required']}
                                        errorMessages={['This field is required']} />
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <Label className={'col-md-2 pull-left mt-2'}>User Name</Label>
                                    <TextValidator type="text" name="username" className="form-control col-md-8" disabled placeholder="User Name"
                                        onChange={(e) => { setUsername(e.target.value) }}
                                        value={username}
                                        validators={['required']}
                                        errorMessages={['This field is required']}
                                    />
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <Label className={'col-md-2 pull-left mt-2'}>Email</Label>
                                    <TextValidator type="text" name="email" className="form-control col-md-8" disabled placeholder="Email"
                                        value={email}
                                        validators={['required', 'isEmail']}
                                        errorMessages={['This field is required', 'email is not valid']}
                                    />
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <Label className={'col-md-2 pull-left mt-2'}>Mobile Number</Label>
                                    <TextValidator type="text" name="phone" className="form-control col-md-8" maxLength="10" placeholder="Phone Number"
                                        value={mobile || ''}
                                        onChange={(e) => { setMobile(e.target.value) }}
                                        validators={['required', 'isNumber', 'minStringLength:10']}
                                        errorMessages={['This field is required', 'Only number are allowed', 'Invalid mobile number']} />
                                </FormGroup>
                            </Col>
                            {/* <Col md={6}>
                                <FormGroup>
                                    <Label className={'col-md-2 pull-left mt-2'}>Profile Pic</Label>
                                    <TextValidator type="file" onChange={onImageChange} name="profile_pic" className="form-control  col-md-8" autoComplete="off" placeholder="Pic"
                                        validators={[]}
                                        errorMessages={[]}
                                    />
                                    <img id="target" className={'mt-3 rounded'} height={200} src={preview} />
                                </FormGroup>
                            </Col> */}
                        </Row>
                    </CardBody>
                    <CardFooter>
                        <Button onClick={() => history.goBack()} className="dark_btn"><i className="fa fa-arrow-left" aria-hidden="true"></i> Back  </Button>
                        <Button disabled={buttonstate} className={'ml-2'} type="submit" color="primary">Submit <i className="fa fa-arrow-circle-right fa-lg" aria-hidden="true"></i></Button>
                    </CardFooter>
                </Card>
            </ValidatorForm>
        </React.Fragment>
    );
};

export default UserProfile;
