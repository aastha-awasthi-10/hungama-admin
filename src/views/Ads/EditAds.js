import React, { useState, useEffect } from 'react';
import { ErrorMessage, useForm } from 'react-hook-form';
import Helper from '../../constants/helper';
import { useHistory } from "react-router-dom";
import apiUrl from '../../constants/apiPath';
import { Button, Card, CardBody, CardHeader, CardTitle, CardFooter, FormGroup, Label, Col, Row } from 'reactstrap';
import _ from 'lodash';
import { useAlert } from 'react-alert';
import useSession from 'react-session-hook';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import htmlToDraft from 'html-to-draftjs';
import draftToHtml from 'draftjs-to-html';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { useParams } from "react-router";

const EditAds = (props) => {
  const session = useSession();
  let history = useHistory();
  const alert = useAlert();
  const { register, handleSubmit, errors, watch } = useForm();
  const [token] = useState(session.token);
  const [loading, setLoading] = useState(false);
  const [profilePic, setProfilePic] = useState('');
  const [preview, setProfilePicPreview] = useState('');
  const [title, setTitle] = useState('');
  const [type, setType] = useState('');
  const [content, setContent] = useState('');
  const [id, setId] = useState('');
  const [mediaType, setmediaType] = useState('');

  const onSubmit = async data => {
    setLoading(true);
    let formData = new FormData();
    let postJson = {
      id: id,
      title: data.title.trim(),
      type: data.ads_type
    };
    console.log(postJson);
    formData.append('data', JSON.stringify(postJson));
    formData.append('ads_pic', profilePic);
    let path = apiUrl.update_ads;
    const fr = await Helper.formPost(formData, path, token);
    const res = await fr.response.json();
    if (fr.status === 200) {
      if (res.success) {
        setLoading(false);
        props.history.push('/ads');
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
    let path = apiUrl.get_ads_info + '/' + `${props.match.params.id}`;
    const fr = await Helper.get(path, token);
    const res = await fr.response.json();
    if (fr.status === 200) {
      if (res.success) {
        setTitle(res.results.title);
        setType(res.results.type);
        setmediaType(res.results.type);
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
  const handleTypeChange = (e) => {
    setProfilePicPreview('');
    setType(e.target.value)
  }

  useEffect(() => {
    getData();
  }, []);

  return (
    <React.Fragment>
      <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
        <Card>
          <CardHeader>
            <CardTitle className="text-info"><h4>Edit Ads</h4></CardTitle>
          </CardHeader>
          <CardBody>
            <Row>
              <Col md={12}>
                <FormGroup>
                  <Row>
                    <Label className={'col-md-2 pull-left mt-2'}>Ads Title</Label>
                    <input type="text" name="title" placeholder="Ads Title" autoComplete="off"
                      className="form-control col-md-10" defaultValue={title} ref={register({ required: 'Required' })} />
                    {errors.title && <p className="text-danger marginmessage">Ads Title is required</p>}
                  </Row>
                </FormGroup>
              </Col>
              <Col md={12}>
                <FormGroup>
                  <Row>
                    <Label className={'col-md-2 pull-left mt-2'}>Ads Type</Label>
                    <select name={'ads_type'} value={type} onChange={handleTypeChange} className={"form-control col-md-6"} ref={register({ required: 'Required' })}>
                      <option value={''}>-- Ads Type --</option>
                      <option value={'video'}>Video</option>
                      <option value={'image'}>Image</option>
                    </select>
                    {errors.ads_type && <p className="text-danger marginmessage">Ads Type is required</p>}
                  </Row>
                </FormGroup>
              </Col>
              <Col md={12} className="mt-5">
                <FormGroup>
                  <Row>
                    <Label className={'col-md-2 pull-left mt-2'}>Ads File</Label>
                    <div className="col-md-10">
                      <input type="file" onChange={onImageChange} name="ads_pic" className="form-control" autoComplete="off" placeholder="Ads File" />
                      <span className={"pull-left"} >
                        (Please enter only .png, .jpg and .jpeg images with dimension 600 X 400 and max size of 12MB for best view.) <br></br>
                  (Please enter only  Mp4 video with max size of 12MB for best view.)
                   </span>
                      <ErrorMessage errors={errors} name="ads_pic">
                        {({ message }) => <p className={"text-danger"}>{message}</p>}
                      </ErrorMessage>
                      {(type == 'image') && preview && < img id="target" className={'mt-3 rounded'} height={300} width={300} src={preview} />}
                      {type == 'video' && preview && <video height={250} width={500} controls >
                        <source src={preview} type="video/mp4" />
                      </video>}
                    </div>
                  </Row>
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

export default EditAds;
