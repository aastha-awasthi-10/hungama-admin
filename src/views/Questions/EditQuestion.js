import React, { useState, useEffect } from 'react';
import { ErrorMessage, useForm } from 'react-hook-form';
import Helper from '../../constants/helper';
import { useHistory } from "react-router-dom";
import apiUrl from '../../constants/apiPath';
import { Button, Card, CardBody, CardHeader, CardTitle, CardFooter, FormGroup, Label, Col, Row } from 'reactstrap';
import _ from 'lodash';
import { useAlert } from 'react-alert';
import useSession from 'react-session-hook';

const EditQuestion = (props) => {
  const session = useSession();
  let history = useHistory();
  const alert = useAlert();
  const { register, handleSubmit, errors, watch } = useForm();

  const [token] = useState(session.token);
  const [id, setId] = useState('');
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState([]);
  const [disableQueMde, setDisableQueMde] = useState(true);
  const [disableQuizName, setDisableQuizName] = useState(true);
  const [selectedCat, setSelectedCat] = useState('');
  const [quizContest, setQuizContest] = useState([]);
  const [hindiDisable, setHindiDisable] = useState(false);
  const [englishDisable, setEnglishDisable] = useState(false);
  const [QueModeSelectedValue, setQueModeSelectedValue] = useState('');
  const [QuizNameSelectedValue, setQuizNameSelectedValue] = useState('');
  const [questionLanguage, setLanguage] = useState('');
  const [quizData, setQuizData] = useState({});
  const [questiontype, setquestiontype]=useState('');
  const [answerEnglish,setAnswerEnglish] = useState('');
  const [answerHindi,setAnswerHindi] = useState('');
  const [profilePic, setProfilePic] = useState('');
  const [preview, setProfilePicPreview] = useState('');

  const onSubmit = async data => {
    setLoading(true);
    let postJson = {
      id:id,
      category_id: selectedCat,
      question_mode: QueModeSelectedValue,
      question_language: questionLanguage,
      question_type: data.question_type,
      question_time: data.question_time,
      question_hindi: data.question_hindi,
      first_option_hindi: data.first_option_hindi,
      second_option_hindi: data.second_option_hindi,
      third_option_hindi: data.third_option_hindi,
      fourth_option_hindi: data.fourth_option_hindi,
      question_english: data.question_english,
      first_option_english: data.first_option_english,
      second_option_english: data.second_option_english,
      third_option_english: data.third_option_english,
      fourth_option_english: data.fourth_option_english,
      answer_hindi: data.answer_hindi,
      answer_english: data.answer_english,
    };
    if (QueModeSelectedValue == 'quiz') {
      postJson.quiz_id = QuizNameSelectedValue
    } else { postJson.contest_id = QuizNameSelectedValue }

    let formData = new FormData();
    formData.append('data', JSON.stringify(postJson));
    formData.append('question_media', profilePic);
    let path = apiUrl.update_question;
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
  
  const onImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setProfilePicPreview(URL.createObjectURL(event.target.files[0]));
      setProfilePic(event.target.files[0]);
    }
  }

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

  const getQuizByCat = async (type,selectedCat) => {
    const itemsPerPage = 100;
    let path = (type == 'quiz') ? apiUrl.get_quiz_by_category + '/' + selectedCat : apiUrl.get_contest_by_category + '/' + selectedCat;
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

  const getData = async () => {
    const user_Id = session.profile.id;
    let path = apiUrl.get_question + '/' + `${props.match.params.id}`;
    const fr = await Helper.get(path, token);
    const res = await fr.response.json();
    if (fr.status === 200) {
      if (res.success) {
        console.log(res.results);
        setId(res.results.id);
        setQuizData(res.results);  
        setSelectedCat(res.results.category_id);
        setAnswerEnglish(res.results.answer_english);
        setAnswerHindi(res.results.answer_hindi);
        setquestiontype(res.results.question_type);     
        setQueModeSelectedValue(res.results.question_mode);
        setQuizNameSelectedValue(res.results.quiz_id || res.results.contest_id);   
        getQuizByCat(res.results.question_mode,res.results.category_id)
        
        
        setLanguage(res.results.question_language);
      if (res.results.question_language === 'english_hindi') {
        setHindiDisable(true);
        setEnglishDisable(true);
      } else if (res.results.question_language === 'english') {
        setHindiDisable(false);
        setEnglishDisable(true);
      } else {
        setHindiDisable(true);
        setEnglishDisable(false);
      }
      } else {
        console.log(res.msg);
      }
    } else {
      console.log(res.msg);
    }
  };

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
    setHindiDisable(false);
    setEnglishDisable(false);
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
    setHindiDisable(false);
    setEnglishDisable(false);
  }

  const handleNameChange = async (e) => {
    let type = e.target.value;
    setHindiDisable(false);
    setEnglishDisable(false);
    if (type != '') {
      setQuizNameSelectedValue(type);
      const quizCon = quizContest.find(element => element.id == type);
      let lang = (QueModeSelectedValue == 'quiz') ? quizCon.quiz_language : quizCon.contest_language;
      setLanguage(lang);
      if (lang === 'english_hindi') {
        setHindiDisable(true);
        setEnglishDisable(true);
      } else if (lang === 'english') {
        setHindiDisable(false);
        setEnglishDisable(true);
      } else {
        setHindiDisable(true);
        setEnglishDisable(false);
      }
    } else {
      setQuizNameSelectedValue('');
    }

  }

  useEffect(() => {
    getCategory();
    getData();
  }, []);

  return (
    <React.Fragment>
      <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
        <Card>
          <CardHeader>
            <CardTitle className="text-info"><h4>Edit Question</h4></CardTitle>
          </CardHeader>
          <CardBody>
            <Row>
              <Col md={6}>
                <FormGroup>
                  <Label className={'col-md-3 pull-left mt-2'}>Question Category</Label>
                  <select name={'category'}  disabled value={selectedCat} className={"form-control col-md-6"} onChange={(e) => { handleCatChange(e) }} ref={register({ required: 'Required' })}>
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
                  <Label className={'col-md-3 pull-left mt-2'}>Question Type</Label>
                  <select name={'question_type'} value={questiontype} onChange={(e)=>{setquestiontype(e.target.value)}} className={"form-control col-md-6"} ref={register({ required: 'Required' })}>
                    <option value={''}>-- Question Type --</option>
                    <option value={'text'}>Text Only</option>
                    <option value={'audio'}>Audio</option>
                    <option value={'video'}>Video</option>
                    <option value={'image'}>Image</option>
                  </select>
                  {errors.question_type && <p className="text-danger marginmessage">Question Type is required</p>}
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label className={'col-md-3 pull-left mt-2'}>Question Timer (Seconds)</Label>
                  <input type="number" name="question_time" maxLength={"3"} min={"1"} max={"999"} placeholder="Question Timer" autoComplete="off"
                    className="form-control col-md-6" ref={register({ required: 'Required' })}  defaultValue={quizData.question_time}/>
                  {errors.question_time && <p className="text-danger marginmessage">Question Timer is required</p>}
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label className={'col-md-3 pull-left mt-2'}>Question Media</Label>
                  <input type="file" name="question_media" placeholder="Question Media" onChange={onImageChange} autoComplete="off"
                    className="form-control col-md-6" ref={register({ })}  defaultValue={quizData.question_file}/>
                  {errors.question_file && <p className="text-danger marginmessage">Question Media is required</p>}
                </FormGroup>
              </Col>
              {hindiDisable && <div className={" col-md-12"}>
                <div className={"row questions_div"}>
                  <Col md={12}>
                    <FormGroup>
                      <Label className={'col-md-1 pull-left mt-2 mr-5 '} style={{ 'padding': '0', 'marginLeft': '15px' }}>Question (Hindi)</Label>
                      <textarea name="question_hindi" placeholder="Question in hindi..." autoComplete="off" defaultValue={quizData.question_hindi} className="form-control col-md-9" ref={register({ required: 'Required' })}></textarea>
                      {errors.question_hindi && <p className="text-danger marginmessage">Description is required</p>}
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label className={'col-md-3 pull-left mt-2'}>1st Option Hindi </Label>
                      <input type="text" name="first_option_hindi" placeholder="1st Option Hindi" autoComplete="off"
                        className="form-control col-md-6" ref={register({ required: 'Required' })}  defaultValue={quizData.first_option_hindi} />
                      {errors.first_option_hindi && <p className="text-danger marginmessage">1st Option Hindi is required</p>}
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label className={'col-md-3 pull-left mt-2'}>2nd Option Hindi </Label>
                      <input type="text" name="second_option_hindi" placeholder="2nd Option Hindi" autoComplete="off"
                        className="form-control col-md-6" ref={register({ required: 'Required' })} defaultValue={quizData.second_option_hindi} />
                      {errors.second_option_hindi && <p className="text-danger marginmessage">2nd Option Hindi is required</p>}
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label className={'col-md-3 pull-left mt-2'}>3rd Option Hindi </Label>
                      <input type="text" name="third_option_hindi" placeholder="3rd Option Hindi" autoComplete="off"
                        className="form-control col-md-6" ref={register({ required: 'Required' })} defaultValue={quizData.third_option_hindi} />
                      {errors.third_option_hindi && <p className="text-danger marginmessage">3rd Option Hindi is required</p>}
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label className={'col-md-3 pull-left mt-2'}>4th Option Hindi </Label>
                      <input type="text" name="fourth_option_hindi" placeholder="4th Option Hindi" autoComplete="off"
                        className="form-control col-md-6" ref={register({ required: 'Required' })} defaultValue={quizData.fourth_option_hindi} />
                      {errors.fourth_option_hindi && <p className="text-danger marginmessage">4th Option Hindi is required</p>}
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label className={'col-md-3 pull-left mt-2'}>Correct Answer (Hindi) </Label>
                      <select name={'answer_hindi'} value={answerHindi} onChange={(e)=>{setAnswerHindi(e.target.value)}} className={"form-control col-md-6"} ref={register({ required: 'Required' })}>
                        <option value={''}>-- Correct Answer (Hindi) --</option>
                        <option value={'first_option_hindi'}>1st Option</option>
                        <option value={'second_option_hindi'}>2nd Option</option>
                        <option value={'third_option_hindi'}>3rd Option</option>
                        <option value={'fourth_option_hindi'}>4th Option</option>
                      </select>
                      {errors.answer_hindi && <p className="text-danger marginmessage">Correct Answer (Hindi) is required</p>}
                    </FormGroup>
                  </Col>
                </div>
              </div>}
              {englishDisable && <div className={" col-md-12"}>
                <div className={" row questions_div"}>
                  <Col md={12}>
                    <FormGroup>
                      <Label className={'col-md-1 pull-left mt-2 mr-5'} style={{ 'padding': '0', 'marginLeft': '15px' }}>Question (English)</Label>
                      <textarea name="question_english" placeholder="Question in english...." defaultValue={quizData.question_english} autoComplete="off" className="form-control col-md-9" ref={register({ required: 'Required' })}></textarea>
                      {errors.question_english && <p className="text-danger marginmessage">Question (English) is required</p>}
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label className={'col-md-3 pull-left mt-2'}>1st Option English </Label>
                      <input type="text" name="first_option_english" defaultValue={quizData.first_option_english} placeholder="1st Option English" autoComplete="off"
                        className="form-control col-md-6" ref={register({ required: 'Required' })} />
                      {errors.first_option_english && <p className="text-danger marginmessage">1st Option English is required</p>}
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label className={'col-md-3 pull-left mt-2'}>2nd Option English </Label>
                      <input type="text" name="second_option_english" defaultValue={quizData.second_option_english} placeholder="2nd Option English" autoComplete="off"
                        className="form-control col-md-6" ref={register({ required: 'Required' })} />
                      {errors.second_option_english && <p className="text-danger marginmessage">2nd Option English is required</p>}
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label className={'col-md-3 pull-left mt-2'}>3rd Option English </Label>
                      <input type="text" name="third_option_english" defaultValue={quizData.third_option_english} placeholder="3rd Option English" autoComplete="off"
                        className="form-control col-md-6" ref={register({ required: 'Required' })} />
                      {errors.third_option_english && <p className="text-danger marginmessage">3rd Option English is required</p>}
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label className={'col-md-3 pull-left mt-2'}>4th Option English </Label>
                      <input type="text" name="fourth_option_english" defaultValue={quizData.fourth_option_english} placeholder="4th Option English" autoComplete="off"
                        className="form-control col-md-6" ref={register({ required: 'Required' })} />
                      {errors.fourth_option_english && <p className="text-danger marginmessage">4th Option English is required</p>}
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label className={'col-md-3 pull-left mt-2'}>Correct Answer (English) </Label>
                      <select name={'answer_english'} value={answerEnglish} onChange={(e)=>{setAnswerEnglish(e.target.value)}}  className={"form-control col-md-6"} ref={register({ required: 'Required' })}>
                        <option value={''}>-- Correct Answer (English) --</option>
                        <option value={'first_option_english'}>1st Option</option>
                        <option value={'second_option_english'}>2nd Option</option>
                        <option value={'third_option_english'}>3rd Option</option>
                        <option value={'fourth_option_english'}>4th Option</option>
                      </select>
                      {errors.answer_english && <p className="text-danger marginmessage">Correct Answer (English) is required</p>}
                    </FormGroup>
                  </Col>
                </div>
              </div>}
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

export default EditQuestion;
