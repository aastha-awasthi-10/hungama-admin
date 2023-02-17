import React, { useState, useEffect } from 'react';
import { ErrorMessage, useForm } from 'react-hook-form';
import Helper from '../../constants/helper';
import { useHistory } from "react-router-dom";
import apiUrl from '../../constants/apiPath';
import { Button, Card, CardBody, CardHeader, CardTitle, CardFooter, FormGroup, Label, Col, Row } from 'reactstrap';
import _ from 'lodash';
import { useAlert } from 'react-alert';
import useSession from 'react-session-hook';
import { useParams } from "react-router";

const EditQuiz = (props) => {
  const session = useSession();
  let history = useHistory();
  const alert = useAlert();
  const { register, handleSubmit, errors, watch } = useForm();
  const [token] = useState(session.token);
  const [loading, setLoading] = useState(false);
  const [id, setId] = useState('');
  const [enteryFee, setEntryFee] = useState(0);
  const [winAmount, setwinAmount] = useState(0);
  const [adminProfit, setadminProfit] = useState(0);
  const [winAmountDisable, setwinAmountDisable] = useState(false);
  const [adminProfitDisable, setadminProfitDisable] = useState(false);
  const [BonsDisable, setBonsDisable] = useState(false);
  const [category, setCategory] = useState([]);
  const [CategoryId, setCategoryId] = useState('');
  const [quizLanguage, setQuizLanguage] = useState('');
  const [quizType, setQuizType] = useState('');
  const [quizData, setQuizData] = useState({});
  const [bonus, setBonus] = useState(0);



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

  const onSubmit = async data => {
    setLoading(true);
    let postJson = {
      id: id,
      bonus: bonus,
      name: data.name.trim(),
      questions_count: data.questions_count,
      category_id: CategoryId,
      quiz_language: quizLanguage,
      quiz_type: data.quiz_type,
      entry_fee: data.entry_fee,
      description: data.description,
      quiz_rules: data.quiz_rules,
      winning_amount: data.winning_amount,
      admin_profit: data.admin_profit,
      difficulty_level: data.difficulty_level
    };
    let path = apiUrl.update_quiz;
    const fr = await Helper.put(postJson, path, token);
    const res = await fr.response.json();
    if (fr.status === 200) {
      if (res.success) {
        setLoading(false);
        props.history.push('/quizzes');
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
    let path = apiUrl.get_quiz + '/' + `${props.match.params.id}`;
    const fr = await Helper.get(path, token);
    const res = await fr.response.json();
    if (fr.status === 200) {
      if (res.success) {
        if (res.results.quiz_type == 'free') {
          setwinAmountDisable(true);
          setadminProfitDisable(true);
        }
        setId(res.results.id);
        setQuizData(res.results);
        setEntryFee(res.results.entry_fee);
        setwinAmount(res.results.winning_amount);
        setadminProfit(res.results.admin_profit);
        setBonus(res.results.bonus);
        setCategoryId(res.results.category_id._id);
        setQuizLanguage(res.results.quiz_language);
        setQuizType(res.results.quiz_type);
        setadminProfit(res.results.admin_profit);
      } else {
        console.log(res.msg);
      }
    } else {
      console.log(res.msg);
    }
  };

  const handleType = async (e) => {
    let type = e.target.value;
    if (type == 'free') {
      setEntryFee(0);
      setwinAmount(0);
      setadminProfit(0);
      setwinAmountDisable(true);
      setadminProfitDisable(true);
      setBonsDisable(true);
    } else {
      setEntryFee(0);
      setwinAmount(0);
      setadminProfit(0);
      setwinAmountDisable(false);
      setadminProfitDisable(false);
      setBonsDisable(false);
    }
    setQuizType(type);
  }

  const handleWinningChange = async (e) => {
    let win_amount = parseInt(e.target.value);
    let entryFee = (win_amount + (win_amount * adminProfit / 100)) / 2
    setEntryFee(entryFee);
    setwinAmount(win_amount);
  }
  const handleAdminProfitChange = async (e) => {
    let admin_profit = parseFloat(e.target.value);
    let entryFee = (winAmount + (winAmount * admin_profit / 100)) / 2
    setEntryFee(entryFee);
    setadminProfit(admin_profit);
  }

  useEffect(() => {
    getData();
    getCategory();
  }, []);

  return (
    <React.Fragment>
      <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
        <Card>
          <CardHeader>
            <CardTitle className="text-info"><h4>Edit Quiz</h4></CardTitle>
          </CardHeader>
          <CardBody>
            <Row>
              <Col md={6}>
                <FormGroup>
                  <Label className={'col-md-3 pull-left mt-2'}>Quiz Name</Label>
                  <input type="text" name="name" placeholder="Quiz Name" autoComplete="off"
                    className="form-control col-md-6" defaultValue={quizData.name} ref={register({ required: 'Required' })} />
                  {errors.title && <p className="text-danger marginmessage">Quiz Name is required</p>}
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label className={'col-md-3 pull-left mt-2'}>Quiz Category</Label>
                  <select name={'category'} className={"form-control col-md-6"} value={CategoryId} onChange={(e) => setCategoryId(e.target.value)} ref={register({ required: 'Required' })}>
                    <option value={''}>-- Select Quiz Type --</option>
                    {category.map((item, key) => {
                      return <option key={key} value={item.id}>{item.title}</option>
                    })};
                  </select>
                  {errors.title && <p className="text-danger marginmessage">Quiz Category is required</p>}
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label className={'col-md-3 pull-left mt-2'}>No. Of Question</Label>
                  <input type="number" name="questions_count" maxLength={"3"} min={"1"} max={"999"} placeholder="No. of Question" autoComplete="off"
                    className="form-control col-md-6" defaultValue={quizData.questions_count} ref={register({ required: 'Required' })} />
                  {errors.title && <p className="text-danger marginmessage">No. of Question is required</p>}
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label className={'col-md-3 pull-left mt-2'}>Quiz Language</Label>
                  <select name={'quiz_language'} className={"form-control col-md-6"} value={quizLanguage} onChange={(e) => setQuizLanguage(e.target.value)} ref={register({ required: 'Required' })}>
                    <option value={''}>-- Select Quiz Language --</option>
                    <option value={'english'}>English</option>
                    <option value={'hindi'}>Hindi</option>
                    <option value={'english_hindi'}>Hindi & English</option>
                  </select>
                  {errors.title && <p className="text-danger marginmessage">Quiz Language is required</p>}
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label className={'col-md-3 pull-left mt-2'}>Quiz Type</Label>
                  <select name={'quiz_type'} className={"form-control col-md-6"} value={quizType} ref={register({ required: 'Required' })} onChange={(e) => { handleType(e) }}>
                    <option value={''}>-- Select Quiz Type --</option>
                    <option value={'free'}>Free</option>
                    <option value={'paid'}>Paid</option>
                  </select>
                  {errors.title && <p className="text-danger marginmessage">Quiz Type is required</p>}
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label className={'col-md-3 pull-left mt-2'}>Difficulty Level </Label>
                  <input type="number" name="difficulty_level" defaultValue={quizData.difficulty_level} maxLength={"3"} min={"0"} max={"20"} placeholder="Difficulty Level" autoComplete="off"
                    className="form-control col-md-6" ref={register({ required: 'Required' })} />
                  {errors.title && <p className="text-danger marginmessage">Difficulty Level is required</p>}
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label className={'col-md-3 pull-left mt-2'}>Small Description</Label>
                  <textarea name="description" placeholder="Small Description..." autoComplete="off" defaultValue={quizData.description} className="form-control col-md-6" ref={register({ required: 'Required' })} />
                  {errors.description && <p className="text-danger marginmessage">Description is required</p>}
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label className={'col-md-3 pull-left mt-2'}>Quiz Rules</Label>
                  <textarea name="quiz_rules" placeholder="Quiz Rules..." autoComplete="off" defaultValue={quizData.quiz_rules} className="form-control col-md-6" ref={register({ required: 'Required' })}>
                    {quizData.quiz_rules}
                  </textarea>
                  {errors.title && <p className="text-danger marginmessage">Quiz Rules is required</p>}
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label className={'col-md-3 pull-left mt-2'}>Total Winning Amount</Label>
                  <input type="number" name="winning_amount" maxLength={"3"} min={"0"}
                    value={winAmount} disabled={winAmountDisable} onChange={e => { handleWinningChange(e) }} placeholder="Total Winning Amount" autoComplete="off"
                    className="form-control col-md-6" ref={register({ required: 'Required' })} />
                  {errors.title && <p className="text-danger marginmessage">Total Winning Amount is required</p>}
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label className={'col-md-3 pull-left mt-2'}>Admin Profilt (%)</Label>
                  <input type="number" name="admin_profit" maxLength={"3"} min={"0"}
                    value={adminProfit} disabled={adminProfitDisable} onChange={e => { handleAdminProfitChange(e) }} placeholder="Admin Profilt" autoComplete="off"
                    className="form-control col-md-6" ref={register({ required: 'Required' })} />
                  {errors.title && <p className="text-danger marginmessage">Admin Profilt is required</p>}
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label className={'col-md-3 pull-left mt-2'}>Entry Fee</Label>
                  <input type="number" name="entry_fee" maxLength={"3"} min={"0"}
                    value={enteryFee} disabled onChange={e => { setEntryFee(e.target.value) }} placeholder="Entry Fee" autoComplete="off"
                    className="form-control col-md-6" ref={register({ required: 'Required' })} />
                  {errors.title && <p className="text-danger marginmessage">Entry Fee is required</p>}
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label className={'col-md-3 pull-left mt-2'}>Bonus (%)</Label>
                  <input type="number" name="bonus" maxLength={"5"} min={"0"} step={"0.01"} disabled={BonsDisable}
                    value={bonus} onChange={e => { setBonus(e.target.value) }} placeholder="Bonus used" autoComplete="off"
                    className="form-control col-md-6" ref={register({ required: 'Required' })} />
                  {errors.bonus && <p className="text-danger marginmessage">Bonus is required</p>}
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

export default EditQuiz;
