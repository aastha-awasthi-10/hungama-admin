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
// import { useParams } from "react-router";

const EditNews = (props) => {
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
  const [validMedia, setvalidMedia] = useState(true);

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
    // if ((data.news_type == 'image') || (data.news_type == 'video')) {
    //   if (!validMedia) {
    //     alert.error('please select correct media file.');
    //     setLoading(false);
    //     return;
    //   }
    // }
    let postJson = {
      id: id,
      title: data.title.trim(),
      type: data.news_type,
      content: draftToHtml(convertToRaw(content.getCurrentContent()))
    };
    formData.append('data', JSON.stringify(postJson));
    formData.append('news_pic', profilePic);
    let path = apiUrl.update_news;
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

  const getData = async () => {
    const user_Id = session.profile.id;
    let path = apiUrl.get_news_info + '/' + `${props.match.params.id}`;
    const fr = await Helper.get(path, token);
    const res = await fr.response.json();
    if (fr.status === 200) {
      if (res.success) {
        setTitle(res.results.title);
        setType(res.results.type);
        setProfilePicPreview(res.results.image);
        setId(res.results.id);
        const contentBlock = htmlToDraft(res.results.content);
        if (contentBlock) {
          const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
          const editorState = EditorState.createWithContent(contentState);
          console.log(editorState);
          setContent(editorState);
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
      let fileType = event.target.files[0].type;
      setProfilePicPreview(URL.createObjectURL(event.target.files[0]));
      setProfilePic(event.target.files[0]);
      // if (type == 'image') {
      //   if (fileType == "image/png" || fileType == "image/jpg" || fileType == "image/jpeg") {
      //     setProfilePicPreview(URL.createObjectURL(event.target.files[0]));
      //     setProfilePic(event.target.files[0]);
      //   } else {
      //     alert.error('Only .png, .jpg and .jpeg format allowed!');
      //     setvalidMedia(false);
      //   }
      // } else {
      //   if (fileType == "video/x-msvideo" || fileType == "video/mpeg" || fileType == "video/mp4" || fileType == "video/ogg" || fileType == "video/webm") {
      //     setProfilePicPreview(URL.createObjectURL(event.target.files[0]));
      //     setProfilePic(event.target.files[0]);
      //   } else {
      //     alert.error('Only Video files are allowed.');
      //     setvalidMedia(false);
      //   }
      // }
    }
  }
  const onEditorStateChange = async (editorState) => {
    setContent(editorState);
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <React.Fragment>
      <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
        <Card>
          <CardHeader>
            <CardTitle className="text-info"><h4>Edit News</h4></CardTitle>
          </CardHeader>
          <CardBody>
            <Row>
              <Col md={12}>
                <FormGroup>
                  <Row>
                    <Label className={'col-md-2 pull-left mt-2'}>News Title</Label>
                    <input type="text" name="title" placeholder="News Title" autoComplete="off"
                      className="form-control col-md-10" defaultValue={title} ref={register({ required: 'Required' })} />
                    {errors.title && <p className="text-danger marginmessage">News Title is required</p>}
                  </Row>
                </FormGroup>
              </Col>
              <Col md={12}>
                <FormGroup>
                  <Row>
                    <Label className={'col-md-2 pull-left mt-2'}>News Type</Label>
                    <select name={'news_type'} value={type} onChange={(e) => setType(e.target.value)} className={"form-control col-md-6"} ref={register({ required: 'Required' })}>
                      <option value={''}>-- News Type --</option>
                      <option value={'text'}>Text Only</option>
                      <option value={'video'}>Video</option>
                      <option value={'image'}>Image</option>
                    </select>
                    {errors.news_type && <p className="text-danger marginmessage">News Type is required</p>}
                  </Row>
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
                      required
                    />
                  </Row>
                </FormGroup>
              </Col>
              {((type == 'image') || (type == 'video')) && < Col md={12}>
                <FormGroup>
                  <Row>
                    <Label className={'col-md-2 pull-left mt-2'}>News Media</Label>
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
    </React.Fragment >
  );
}

export default EditNews;
