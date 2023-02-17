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

const EditVideo = (props) => {
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

  const onSubmit = async data => {
    setLoading(true);
    let formData = new FormData();
    let postJson = {
      id: id,
      title: data.title.trim()
    };
    console.log(postJson);
    formData.append('data', JSON.stringify(postJson));
    formData.append('video_file', profilePic);
    let path = apiUrl.update_video;
    const fr = await Helper.formPost(formData, path, token);
    const res = await fr.response.json();
    if (fr.status === 200) {
      if (res.success) {
        setLoading(false);
        props.history.push('/videos');
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
    let path = apiUrl.get_video_info + '/' + `${props.match.params.id}`;
    const fr = await Helper.get(path, token);
    const res = await fr.response.json();
    if (fr.status === 200) {
      if (res.success) {
        setTitle(res.results.title);
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
    setProfilePicPreview('');
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
            <CardTitle className="text-info"><h4>Edit Video</h4></CardTitle>
          </CardHeader>
          <CardBody>
            <Row>
              <Col md={12}>
                <FormGroup>
                  <Row>
                    <Label className={'col-md-2 pull-left mt-2'}>Video Title</Label>
                    <div className={'col-md-10'}>
                      <input type="text" name="title" placeholder="Video Title" autoComplete="off" maxLength="30"
                        className="form-control " defaultValue={title} ref={register({
                          required: 'Required',
                          maxLength: 30,
                          validate: (value) => { return !!value.trim() }
                        })} />
                      {errors.title && <p className="text-danger marginmessage">Video Title is required</p>}
                    </div>
                  </Row>
                </FormGroup>
              </Col>
              <Col md={12} className="mt-5">
                <FormGroup>
                  <Row>
                    <Label className={'col-md-2 pull-left mt-2'}>Video File</Label>
                    <div className="col-md-10">
                      <input type="file" onChange={onImageChange} name="video_file" className="form-control" autoComplete="off" placeholder="Video File" />
                      {errors.title && <p className="text-danger marginmessage">Video File is required</p>}
                      <span className={"pull-left"} >
                        (Please enter only  Mp4 video with max size of 12MB for best view.)
                     </span>
                      {preview && <video height={250} width={500} controls >
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

export default EditVideo;
