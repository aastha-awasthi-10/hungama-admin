import React, { useState, useEffect } from 'react';
import { ErrorMessage, useForm } from 'react-hook-form';
import Helper from '../../constants/helper';
import { useHistory } from "react-router-dom";
import apiUrl from '../../constants/apiPath';
import { Button, Card, CardBody, CardHeader, CardTitle, CardFooter, FormGroup, Label, Col, Row } from 'reactstrap';
import _ from 'lodash';
import { useAlert } from 'react-alert';
import useSession from 'react-session-hook';

const ImportQuestions = (props) => {
    const session = useSession();
    let history = useHistory();
    const alert = useAlert();
    const { register, handleSubmit, errors, watch } = useForm();

    const [token] = useState(session.token);
    const [loading, setLoading] = useState(false);
    const [category, setCategory] = useState([]);
    const [disableQueMde, setDisableQueMde] = useState(true);
    const [disableQuizName, setDisableQuizName] = useState(true);
    const [selectedCat, setSelectedCat] = useState('');
    const [quizContest, setQuizContest] = useState([]);
    const [QueModeSelectedValue, setQueModeSelectedValue] = useState('');
    const [QuizNameSelectedValue, setQuizNameSelectedValue] = useState('');
    const [questionLanguage, setLanguage] = useState('');
    const [profilePic, setExcelFile] = useState('');

    const onSubmit = async data => {
        setLoading(true);
        let postJson = {
            category_id: selectedCat,
            question_mode: QueModeSelectedValue,
            question_type: data.question_type
        };
        if (QueModeSelectedValue == 'quiz') {
            postJson.quiz_id = QuizNameSelectedValue
        } else { postJson.contest_id = QuizNameSelectedValue }

        let formData = new FormData();
        formData.append('data', JSON.stringify(postJson));
        formData.append('excel_file', profilePic);
        let path = apiUrl.import_questions;
        const fr = await Helper.formPost(formData, path, token);
        const res = await fr.response.json();
        if (fr.status === 200) {
            if (res.success) {
                setLoading(false);
                props.history.push('/questions');
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


    const getCategory = async () => {
        const itemsPerPage = 100;
        let path = apiUrl.get_active_categories;
        const fr = await Helper.get(path, token);
        const res = await fr.response.json();
        if (fr.status === 200) {
            if (res.success) {
                setCategory(res.results || []);
            } else {
                console.log(res.msg);
            }
        } else {
            console.log(res.error);
        }
    }

    const getQuizByCat = async (type) => {
        const itemsPerPage = 100;
        let path = (type == 'quiz') ? apiUrl.get_quiz_by_category + '/' + `${selectedCat}` : apiUrl.get_contest_by_category + '/' + `${selectedCat}`;
        const fr = await Helper.get(path, token);
        const res = await fr.response.json();
        if (fr.status === 200) {
            if (res.success) {
                setQuizContest(res.results || []);

            } else {
                console.log(res.msg);
            }
        } else {
            console.log(res.error);
        }
    }

    const onImageChange = (event) => {
        if (event.target.files && event.target.files[0]) {
            setExcelFile(event.target.files[0]);
        }
    }

    const handleCatChange = async (e) => {
        let type = e.target.value;
        if (type != '') {
            setSelectedCat(type);
            setDisableQueMde(false);
            setQueModeSelectedValue('');
            setQuizNameSelectedValue('');
        } else {
            setDisableQueMde(true);
            setDisableQuizName(true);
            setQueModeSelectedValue('');
            setQuizNameSelectedValue('');
        }
    }

    const handleModeChange = async (e) => {
        let type = e.target.value;
        if (type != '') {
            setDisableQuizName(false);
            setQueModeSelectedValue(type);
            setQuizNameSelectedValue('');
            getQuizByCat(type)
        } else {
            setDisableQuizName(true);
            setQueModeSelectedValue('');
            setQuizNameSelectedValue('');
        }
    }

    const handleNameChange = async (e) => {
        let type = e.target.value;
        if (type != '') {
            setQuizNameSelectedValue(type);
            const quizCon = quizContest.find(element => element.id == type);
            let lang = (QueModeSelectedValue == 'quiz') ? quizCon.quiz_language : quizCon.contest_language;
            setLanguage(lang);
        } else {
            setQuizNameSelectedValue('');
        }
    }

    useEffect(() => {
        getCategory();
    }, []);

    return (
        <React.Fragment>
            <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-info"><h4>Import Questions</h4></CardTitle>
                    </CardHeader>
                    <CardBody>
                        <Row>
                            <Col md={6}>
                                <FormGroup>
                                    <Label className={'col-md-3 pull-left mt-2'}>Question Category</Label>
                                    <select name={'category'} className={"form-control col-md-6"} onChange={(e) => { handleCatChange(e) }} ref={register({ required: 'Required' })}>
                                        <option value={''}>-- Select Quiz Category --</option>
                                        {category.map((item, key) => {
                                            return <option key={key} value={item.id}>{item.title}</option>
                                        })};
                                     </select>
                                    {errors.category && <p className="text-danger marginmessage">Question Category is required</p>}
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <Label className={'col-md-3 pull-left mt-2'}>Question Mode</Label>
                                    <select name={'quiz_mode'} disabled={disableQueMde} value={QueModeSelectedValue} onChange={(e) => { handleModeChange(e) }} className={"form-control col-md-6"} ref={register({ required: 'Required' })}>
                                        <option value={''}>-- Select Question Mode --</option>
                                        <option value={'quiz'}>Quiz</option>
                                        <option value={'contest'}>Contest</option>
                                    </select>
                                    {errors.quiz_mode && <p className="text-danger marginmessage">Question Mode is required</p>}
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <Label className={'col-md-3 pull-left mt-2'}>Quiz/Contest Name</Label>
                                    <select name={'quiz_name'} disabled={disableQuizName} value={QuizNameSelectedValue} onChange={(e) => { handleNameChange(e) }} className={"form-control col-md-6"} ref={register({ required: 'Required' })}>
                                        <option value={''}>-- Select Quiz/Contest --</option>
                                        {quizContest.map((item, key) => {
                                            return <option key={key} value={item.id}>{item.name}</option>
                                        })};
                                    </select>
                                    {errors.quiz_name && <p className="text-danger marginmessage">Quiz/Contest Name is required</p>}
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <Label className={'col-md-3 pull-left mt-2'}>Questions Excel File</Label>
                                    <input type="file" name="excel_file" placeholder="Question Media" onChange={onImageChange} autoComplete="off"
                                        className="form-control col-md-6" ref={register({ required: 'Required' })} />
                                    {errors.excel_file && <p className="text-danger marginmessage">Excel File is required</p>}
                                </FormGroup>
                            </Col>
                        </Row>
                    </CardBody>
                    <CardFooter>
                        <Button onClick={() => history.goBack()} className="dark_btn"><i className="fa fa-arrow-left" aria-hidden="true"></i> Back  </Button>
                        <Button className={'ml-2'} type="submit" color="primary">Upload {loading === true ? <i className="fa fa-spinner fa-pulse fa-fw ml-1"></i> : <i className="fa fa-arrow-circle-right fa-lg" aria-hidden="true"></i>}</Button>
                    </CardFooter>
                </Card>
            </form>
        </React.Fragment>
    );
}

export default ImportQuestions;
