import React, { useState, useEffect } from 'react';
import { ErrorMessage, useForm } from 'react-hook-form';
import Helper from '../../constants/helper';
import { useHistory } from "react-router-dom";
import apiUrl from '../../constants/apiPath';
import { Button, Card, CardBody, CardHeader, CardTitle, CardFooter, FormGroup, Label, Col, Row, Input } from 'reactstrap';
import _, { includes } from 'lodash';
import { useAlert } from 'react-alert';
import useSession from 'react-session-hook';
import Select from 'react-select';

import _nav from "../../nav/fantasynav"

const EditUser = (props) => {
    const session = useSession();
    let history = useHistory();
    const alert = useAlert();
    const { register, handleSubmit, errors, watch, setValue } = useForm();
    const [access_managers, setAccessManagers] = useState([]);
    const [token] = useState(session.token);
    const [id, setId] = useState('');
    const [loading, setLoading] = useState(false);
    const [profilePic, setProfilePic] = useState('');
    const [preview, setProfilePicPreview] = useState('');
    const [UserData, setData] = useState({});
    const [SideModules, setSideModule] = useState({});
    const [selectedOption, setselectedOption] = useState([]);

    const handleOnAccessSelect = (event) => {
        // let pre_access_managers = [...access_managers]
        let pre_access_managers = access_managers.map((e) => {
            return e.manager
        })
        // console.log("pre_access_managers",pre_access_managers)
        let new_pre_access_managers = [...access_managers]
        if (event.target.value == 'all' && event.target.checked) {
            let data = document.getElementsByName(event.target.name)
            data.forEach((e) => {
                e.checked = true
            })
        } else if (event.target.value == 'all' && !event.target.checked) {
            let data = document.getElementsByName(event.target.name)
            data.forEach((e) => {
                e.checked = false
            })
        }
        if (event.target.checked) {
            // console.log("event.target.name",event.target.name)
            if (!includes(pre_access_managers, event.target.name)) {
                let view = event.target.value == 'view' || event.target.value == 'all' ? 1 : 0
                let edit = event.target.value == 'edit' || event.target.value == 'all' ? 1 : 0
                let deletes = event.target.value == 'delete' || event.target.value == 'all' ? 1 : 0
                new_pre_access_managers.push({ manager: event.target.name, view, edit, delete: deletes })
            } else if (includes(pre_access_managers, event.target.name)) {
                let index = new_pre_access_managers.findIndex((e) => e.manager == event.target.name)
                new_pre_access_managers[index].view =
                    event.target.value == 'view' || event.target.value == 'all'
                        ? 1
                        : new_pre_access_managers[index].view
                new_pre_access_managers[index].edit =
                    event.target.value == 'edit' || event.target.value == 'all'
                        ? 1
                        : new_pre_access_managers[index].edit
                new_pre_access_managers[index].delete =
                    event.target.value == 'delete' || event.target.value == 'all'
                        ? 1
                        : new_pre_access_managers[index].delete
            }
        } else {
            let index = new_pre_access_managers.findIndex((e) => e.manager == event.target.name)
            if (event.target.value == 'all') {
                new_pre_access_managers = new_pre_access_managers.filter((e) => {
                    return e.manager != event.target.name && e
                })
            } else {
                new_pre_access_managers[index].view =
                    event.target.value == 'view' || event.target.value == 'all'
                        ? 0
                        : new_pre_access_managers[index].view
                new_pre_access_managers[index].edit =
                    event.target.value == 'edit' || event.target.value == 'all'
                        ? 0
                        : new_pre_access_managers[index].edit
                new_pre_access_managers[index].delete =
                    event.target.value == 'delete' || event.target.value == 'all'
                        ? 0
                        : new_pre_access_managers[index].delete

                if (
                    new_pre_access_managers[index].edit == 0 &&
                    new_pre_access_managers[index].view == 0 &&
                    new_pre_access_managers[index].delete == 0
                ) {
                    new_pre_access_managers = new_pre_access_managers.filter((e) => {
                        return e.manager != event.target.name && e
                    })
                }
            }
        }
        console.log(new_pre_access_managers)
        setValue('access_managers', new_pre_access_managers.join(','))
        setAccessManagers(new_pre_access_managers)
    }
    const onSubmit = async data => {
        setLoading(true);
        let formData = new FormData();
        let postJson = { id: id, full_name: data.full_name.trim(), email: data.email, username: data.username, phone: data.mobile };
        postJson.module_permission = JSON.stringify(access_managers)
        formData.append('data', JSON.stringify(postJson));
        formData.append('profile_pic', profilePic);
        let path = apiUrl.update_sub_admin;
        const fr = await Helper.formPost(formData, path, token);
        const res = await fr.response.json();
        if (fr.status === 200) {
            if (res.success) {
                setLoading(false);
                props.history.push('/sub-admins');
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
        let path = apiUrl.get_sub_admin + '/' + `${props.match.params.id}`;
        const fr = await Helper.get(path, token);
        const res = await fr.response.json();
        if (fr.status === 200) {
            if (res.success) {
                setId(res.results.id);
                setProfilePicPreview(res.results.image);
                setData(res.results);
                setAccessManagers(res.results.permissions)
                setselectedOption(res.results.permissions);
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

    const getModules = async () => {
        const user_Id = session.profile.id;
        let path = apiUrl.get_sidebar_moudles;
        const fr = await Helper.get(path, token);
        const res = await fr.response.json();
        if (fr.status === 200) {
            if (res.success) {
                let options = res.results.map((item, key) => {
                    return { value: item._id, label: item.name };
                });
                setSideModule(options);
            } else {
                console.log(res.msg);
            }
        } else {
            console.log(res.msg);
        }
    };

    useEffect(() => {
        getData();
        getModules();
    }, []);

    return (
        <React.Fragment>
            <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-info"><h4>Edit Sub Admin</h4></CardTitle>
                    </CardHeader>
                    <CardBody>
                        <Row>
                            <Col md={6}>
                                <FormGroup>
                                    <Label className={'col-md-2 pull-left mt-2'}>First Name</Label>
                                    <input type="text" minLength={3} name="full_name" placeholder="Full Name" autoComplete="off"
                                        className="form-control col-md-8" defaultValue={UserData.full_name} ref={register({ required: 'Required', pattern: /^[a-z\d\-_\s]+$/i })} />
                                    {errors.full_name && <p className="text-danger marginmessage">Full Name is required and should be alphabatic only</p>}
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <Label className={'col-md-2 pull-left mt-2'}>User Name</Label>
                                    <input type="text" minLength={3} name="username" id={"username"} defaultValue={UserData.username} className="form-control col-md-8" autoComplete="off" placeholder="User Name"
                                        ref={register({ required: 'User name Required' })} />
                                    <ErrorMessage errors={errors} name="username">
                                        {({ message }) => <p className={"text-danger"}>{message}</p>}
                                    </ErrorMessage>
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <Label className={'col-md-2 pull-left mt-2'}>Mobile Number</Label>
                                    <input type="text" name="mobile" className="form-control  col-md-8" defaultValue={UserData.phone} maxLength="10" placeholder="Mobile Number"
                                        ref={register({
                                            required: 'Mobile number is Required',
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
                                    <input type="text" name="email" className="form-control  col-md-8" defaultValue={UserData.email} placeholder="Email"
                                        ref={register({
                                            required: 'Email is Required',
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
                            {/* <Col md={6}>
                                <FormGroup>
                                    <Label className={'col-md-2 pull-left mt-2'}>Module Permission</Label>
                                    <div className={"pull-left col-md-8"}>
                                        <Select name="form-field-name" isMulti isSearchable value={selectedOption} options={SideModules} onChange={(tag) => {
                                            //console.log(e.target.value);
                                            //console.log(tag);
                                            setselectedOption(tag)
                                        }} />
                                    </div>
                                </FormGroup>
                            </Col> */}
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
                            <Col md={12}>
                                <Row>
                                    <Col>Manager</Col>
                                    <Col>View</Col>
                                    <Col>Edit</Col>
                                    <Col>Delete</Col>
                                    <Col>All</Col>
                                </Row>
                                {_nav.items.map((e, i) => {
                                    return (
                                        <Row>
                                            <Col>{e.name}</Col>
                                            <Col>
                                                <Input className="m-2" defaultChecked={
                                                    access_managers.find((k) => {
                                                        return k.manager === e.name && k
                                                    })?.view === 1
                                                        ? true
                                                        : false
                                                }
                                                disabled={e.name == 'Dashboard'?true:false}
                                                    checked={
                                                        access_managers.find((k) => {
                                                            return k.manager === e.name && k
                                                        })?.view === 1
                                                            ? true
                                                            : false
                                                    } onChange={handleOnAccessSelect} value={"view"} name={e.name} type="checkbox" />{' '}
                                            </Col>
                                            <Col> <Input className="m-2" defaultChecked={
                                                access_managers.find((k) => {
                                                    return k.manager == e.name && k
                                                })?.edit == 1
                                                    ? e
                                                    : false
                                            }
                                                checked={
                                                    access_managers.find((k) => {
                                                        return k.manager == e.name && k
                                                    })?.edit == 1
                                                        ? e
                                                        : false
                                                } onChange={handleOnAccessSelect} value={"edit"} name={e.name} type="checkbox" />{' '}</Col>
                                            <Col> <Input className="m-2" defaultChecked={
                                                access_managers.find((k) => {
                                                    return k.manager == e.name && k
                                                })?.delete == 1
                                                    ? e
                                                    : false
                                            }
                                                checked={
                                                    access_managers.find((k) => {
                                                        return k.manager == e.name && k
                                                    })?.delete == 1
                                                        ? e
                                                        : false
                                                } onChange={handleOnAccessSelect} value={"delete"} name={e.name} type="checkbox" />{' '}</Col>
                                            <Col> <Input className="m-2" defaultChecked={
                                                access_managers.find((keys) => {
                                                    return (
                                                        keys.edit == 1 &&
                                                        keys.view == 1 &&
                                                        keys.delete == 1 &&
                                                        keys.manager == e.name
                                                    )
                                                })
                                                    ? true
                                                    : false
                                            } checked={
                                                access_managers.find((keys) => {
                                                    return (
                                                        keys.edit == 1 &&
                                                        keys.view == 1 &&
                                                        keys.delete == 1 &&
                                                        keys.manager == e.name
                                                    )
                                                })
                                                    ? true
                                                    : false
                                            } onChange={handleOnAccessSelect} value={"all"} name={e.name} type="checkbox" />{' '}</Col>
                                        </Row>
                                    )
                                })}

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
