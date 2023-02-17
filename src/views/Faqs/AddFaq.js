import React, { useState, useEffect } from 'react';
import { ErrorMessage, useForm } from 'react-hook-form';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { useHistory } from "react-router-dom";
import Helper from '../../constants/helper';
import apiUrl from '../../constants/apiPath';
import moment from "moment";
import { Button, Card, CardBody, CardHeader, CardTitle, CardFooter, FormGroup, Label, Col, Row } from 'reactstrap';
import _ from 'lodash';
import { useAlert } from 'react-alert';
import useSession from 'react-session-hook';

const AddFaq = (props) => {
  const session = useSession();
  let history = useHistory();
  const alert = useAlert();
  const { register, handleSubmit, errors, watch } = useForm();
  const [visible, setVisibale] = useState(false);
  const [token] = useState(session.token);
  const [loading, setLoading] = useState(false);
  
  const onSubmit = async data => {
    setLoading(true);
    let formData = new FormData();
    let postJson = {
      question: data.question.trim(),
      answer: data.answer,
    };
    formData.append('data', JSON.stringify(postJson));
    let path = apiUrl.add_faq;
    const fr = await Helper.post(postJson, path, token);
    const res = await fr.response.json();
    if (fr.status === 200) {
      if (res.success) {
        setLoading(false);
        props.history.push('/faqs');
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

  useEffect(() => {
    
  }, []);

  return (
    <React.Fragment>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle className="text-info"><h4>Add Faq</h4></CardTitle>
          </CardHeader>
          <CardBody>
            <Row>
              <Col md={6}>
                <FormGroup>
                  <Label className={'col-md-2 pull-left mt-2'}>Faq Question</Label>
                  <input type="text" name="question" minLength={"3"} maxLength={"50"} placeholder="Question" autoComplete="off"
                    className="form-control col-md-8" ref={register({ required: 'Required' })} />
                  {errors.title && <p className="text-danger marginmessage">Faq question is required</p>}
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label className={'col-md-2 pull-left mt-2'}>Faq Answer</Label>
                  <input type="text" name="answer" placeholder="Answer" autoComplete="off"
                    className="form-control col-md-8" ref={register({ required: 'Required'})} />
                  {errors.link && <p className="text-danger marginmessage">Faq answer is required</p>}
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

export default AddFaq;
