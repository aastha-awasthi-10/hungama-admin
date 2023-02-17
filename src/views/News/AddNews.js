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

const AddNews = (props) => {
  const session = useSession();
  let history = useHistory();
  const alert = useAlert();
  const { register, handleSubmit, errors, watch, setValue } = useForm();

  const [token] = useState(session.token);
  const [loading, setLoading] = useState(false);
  const [profilePic, setProfilePic] = useState('');
  const [preview, setProfilePicPreview] = useState('');
  const [content, setContent] = useState('');
  const [type, setType] = useState('');
  const [ContentRequired, setContentRequired] = useState(false);

  const onSubmit = async data => {
    setLoading(true);
    if (content == '') {
      alert.error('News Content is required');
      setLoading(false);
      return;
    } else {
      let contentData = draftToHtml(convertToRaw(content.getCurrentContent()));
      if (contentData == '<p></p>\n') {
        alert.error('News Content is required');
        setLoading(false);
        return;
      }
    }
    let formData = new FormData();
    let postJson = {
      title: data.title.trim(),
      type: data.news_type,
      content: draftToHtml(convertToRaw(content.getCurrentContent()))
    };
    formData.append('data', JSON.stringify(postJson));
    formData.append('news_pic', profilePic);
    let path = apiUrl.add_news;
    const fr = await Helper.formPost(formData, path, token);
    const res = await fr.response.json();
    if (fr.status === 200) {
      if (res.success) {
        setLoading(false);
        props.history.push('/news');
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

  const onEditorStateChange = async (editorState) => {
    setContent(editorState);
    // let thedraftToHtml = draftToHtml(convertToRaw(editorState.getCurrentContent()));
    // if(thedraftToHtml == "<p></p>") {
    //   thedraftToHtml = '';
    // }
    // console.log(editorState);
    // setValue("news_content", editorState )
  };


  useEffect(() => {
  }, []);

  return (
    <React.Fragment>
      <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
        <Card>
          <CardHeader>
            <CardTitle className="text-info"><h4>Add News</h4></CardTitle>
          </CardHeader>
          <CardBody>
            <Row>
              <Col md={12}>
                <FormGroup>
                  <Label className={'col-md-2 pull-left mt-2'}>News Title</Label>
                  <input type="text" name="title" placeholder="News Title" autoComplete="off"
                    className="form-control col-md-10" ref={register({ required: 'Required' })} />
                  {errors.title && <p className="text-danger marginmessage">News Title is required</p>}
                </FormGroup>
              </Col>
              <Col md={12}>
                <FormGroup>
                  <Label className={'col-md-2 pull-left mt-2'}>News Type</Label>
                  <select name={'news_type'} className={"form-control col-md-6"} value={type} onChange={(e) => setType(e.target.value)} ref={register({ required: 'Required' })}>
                    <option value={''}>-- News Type --</option>
                    <option value={'text'}>Text Only</option>
                    <option value={'video'}>Video</option>
                    <option value={'image'}>Image</option>
                  </select>
                  {errors.news_type && <p className="text-danger marginmessage">News Type is required</p>}
                </FormGroup>
              </Col>
              <Col md={12} className="mb-5">
                <FormGroup>
                  <Row>
                    <Label className={'col-md-2 pull-left mt-2'}>News Content</Label>
                    {/* <textarea name="content" placeholder="Content for news." defaultValue={content} autoComplete="off" className="form-control col-md-9" ref={register({ required: 'Required' })}></textarea> */}
                    <Editor
                      editorState={content}
                      toolbarClassName="toolbarClassName"
                      wrapperClassName="wrapperClassName col-md-10"
                      editorClassName="editorClassName form-control"
                      onEditorStateChange={onEditorStateChange}
                      required={true}
                    />
                  </Row>
                </FormGroup>
              </Col>
              {((type == 'image') || (type == 'video')) && <Col md={12}>
                <FormGroup>
                  <Row>
                    <Label className={'col-md-2 pull-left mt-2'}>News Image</Label>
                    <div className="col-md-10">
                      <input type="file" onChange={onImageChange} name="news_pic" className="form-control" autoComplete="off" placeholder="News Image" />
                      <ErrorMessage errors={errors} name="news_pic">
                        {({ message }) => <p className={"text-danger"}>{message}</p>}
                      </ErrorMessage>
                      {(type == 'image') && <img src={preview} height="200" width="300" />}
                      {(type == 'video') && <video height={200} width={300} controls >
                        <source src={preview} type="video/mp4" />
                      </video>}
                    </div>
                  </Row>
                </FormGroup>
              </Col>}
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

export default AddNews;
