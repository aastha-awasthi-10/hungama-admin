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

const EditSoccerCategory = (props) => {
  const session = useSession();
  let history = useHistory();
  const alert = useAlert();
  const { register, handleSubmit, errors, watch } = useForm();
  const [token] = useState(session.token);
  const [loading, setLoading] = useState(false);
  const [profilePic, setProfilePic] = useState('');
  const [preview, setProfilePicPreview] = useState('');
  const [data, setData] = useState({});
  const [id, setId] = useState('');

  const onSubmit = async data => {
    setLoading(true);
    let formData = new FormData();    
    let postJson = { id: id, title: data.title.trim(), sequence: data.category_sequence, description: data.description };
    console.log(postJson);
    formData.append('data', JSON.stringify(postJson));
    formData.append('cricket_category_pic', profilePic);
    let path = apiUrl.update_soccer_category;
    const fr = await Helper.formPost(formData, path, token);
    const res = await fr.response.json();
    if (fr.status === 200) {
      if (res.success) {
        setLoading(false);
        props.history.push('/soccer/category');
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
    let path = apiUrl.get_soccer_category + '/' + `${props.match.params.id}`;
    const fr = await Helper.get(path, token);
    const res = await fr.response.json();
    if (fr.status === 200) {
      if (res.success) {
        setData(res.results);
        setProfilePicPreview(res.results.image);
        setId(res.results.id);
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

  useEffect(() => {
    getData();
  }, []);

  return (
    <React.Fragment>
      <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
        <Card>
          <CardHeader>
            <CardTitle className="text-info"><h4>Edit Soccer Category</h4></CardTitle>
          </CardHeader>
          <CardBody>
            <Row>
              <Col md={12}>
                <FormGroup>
                  <Label className={'col-md-2 pull-left mt-2'}>Soccer Category Title</Label>
                  <input type="text" name="title" placeholder="Soccer Category Title" autoComplete="off"
                    className="form-control col-md-8" defaultValue={data.title} ref={register({ required: 'Required' })} />
                  {errors.title && <p className="text-danger marginmessage">Soccer Category Title is required</p>}
                </FormGroup>
              </Col>
              <Col md={12}>
                <FormGroup>
                  <Label className={'col-md-2 pull-left mt-2'}>Soccer Category Sequence</Label>
                  <input type="number" name="category_sequence" defaultValue={data.sequence} maxLength={"3"} min={"1"} max={"999"} placeholder="Category Sequence" autoComplete="off"
                    className="form-control col-md-8" ref={register({ required: 'Required' })} />
                  {errors.title && <p className="text-danger marginmessage">Category Sequence is required</p>}
                </FormGroup>
              </Col>
              <Col md={12}>
                <FormGroup>
                  <Label className={'col-md-2 pull-left mt-2'}>Soccer Category Description</Label>
                  <textarea name="description" placeholder="Small Description..." autoComplete="off" defaultValue={data.description} className="form-control col-md-8" ref={register({ required: 'Required' })}></textarea>
                  {errors.title && <p className="text-danger marginmessage">Description is required</p>}
                </FormGroup>
              </Col>
              <Col md={12}>
                <FormGroup>
                  <Label className={'col-md-2 pull-left mt-2'}>Soccer Category Image</Label>
                  <input type="file" onChange={onImageChange} name="cricket_category_pic" className="form-control  col-md-8" autoComplete="off" placeholder="Soccer Category Image" />
                  <ErrorMessage errors={errors} name="cricket_category_pic">
                    {({ message }) => <p className={"text-danger"}>{message}</p>}
                  </ErrorMessage>
                  <img id="target" className={'mt-3 rounded'} height={250} width={500} src={preview} />
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

export default EditSoccerCategory;
