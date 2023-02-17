import React, { useState, useEffect } from 'react';
import { ErrorMessage, useForm } from 'react-hook-form';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import Helper from '../../constants/helper';
import { useHistory } from "react-router-dom";
import apiUrl from '../../constants/apiPath';
import moment from "moment";
import { Button, Card, CardBody, CardHeader, CardTitle, CardFooter, FormGroup, Label, Col, Row } from 'reactstrap';
import _ from 'lodash';
import { useAlert } from 'react-alert';
import useSession from 'react-session-hook';
import { useParams } from "react-router";

const EditWebBanner = (props) => {
  const session = useSession();
  let history = useHistory();
  const alert = useAlert();
  const { register, handleSubmit, errors, watch } = useForm();
  const [token] = useState(session.token);
  const [loading, setLoading] = useState(false);
  const [startdate, setStartDate] = useState('');
  const [enddate, setEndDate] = useState('');
  const [link, setLink] = useState('');
  const [profilePic, setProfilePic] = useState('');
  const [preview, setProfilePicPreview] = useState('');
  const [title, setTitle] = useState('');
  const [id, setId] = useState('');
  const [visible, setVisibale] = useState(false);
  const [series_id, setSeriesId] = useState('');
  const [offer_id, setOfferId] = useState('');
  const [match_id, setMatchId] = useState('');
  const [dropdown, setDropdown] = useState([]);
  const [match_dropdown, setMatchDropdown] = useState([]);
  const [offer_dropdown, setOfferDropdown] = useState([]);
  const [show_series_match, setShowSeriesMatch] = useState(false);
  const [show_offer, setShowOffer] = useState(false);
  const [sequence, setSequence] = useState('');
  const [banner_type, setBannerType] = useState('');
  const [mediaType, setMediaType] = useState('');


  const handleChange = (e) => {
    if (e.target.name === 'banner_type') {
      setBannerType(e.target.value);
      if (e.target.value == 'match') {
        setShowSeriesMatch(true);
        setShowOffer(false);
      }
      else if (e.target.value == 'offer') {
        setShowSeriesMatch(false);
        setShowOffer(true);
      }
      else {
        setShowSeriesMatch(false);
        setShowOffer(false);
      }
    } else if (e.target.name === 'series_id') {
      setSeriesId(e.target.value);
      getSeriesMatches(e.target.value);
    }
    else if (e.target.name === 'match_id') {
      setMatchId(e.target.value);
    }
  }

  const getSeriesMatches = async (sr_id) => {
    const itemsPerPage = 2;
    let path;
    // console.log(props.item.id_api);
    path = apiUrl.get_series_all_matches + '/' + sr_id;

    const fr = await Helper.get(path, token);
    const res = await fr.response.json();
    if (fr.status === 200) {
      if (res.success) {
        setMatchDropdown(res.results.docs || []);
      } else {
        alert.error(res.msg);
      }
    } else {
      alert.error(res.error);
    }

  };

  const onSubmit = async data => {
    setLoading(true);
    let formData = new FormData();
    let postJson = {
      id: id,
      title: data.title.trim(),
      banner_type: data.banner_type,
      media_type: 'image',//data.type,
      sequence: data.sequence,
      offer_id: offer_id,
      series_id: series_id,
      match_id: match_id,
      start_date: startdate,
      end_date: enddate,
      link: data.link.trim()
    };
    // console.log(postJson);
    // return;
    formData.append('data', JSON.stringify(postJson));
    formData.append('banner_pic', profilePic);
    let path = apiUrl.update_bottom_banner;
    const fr = await Helper.formPost(formData, path, token);
    const res = await fr.response.json();
    if (fr.status === 200) {
      if (res.success) {
        setLoading(false);
        props.history.push('/edit-web-banner');
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
    let path = apiUrl.get_bottom_banner_by_type + '/' + `invite`;
    const fr = await Helper.get(path, token);
    const res = await fr.response.json();
    if (fr.status === 200) {
      if (res.success) {
        setTitle(res.results.title);
        setStartDate(res.results.start_date || '');
        setEndDate(res.results.end_date || '');
        setLink(res.results.link);
        setMediaType(res.results.media_type || '');
        setSequence(res.results.sequence);
        setBannerType(res.results.banner_type);
        setOfferId(res.results.offer_id);
        setProfilePicPreview(res.results.image);
        setShowSeriesMatch(res.results.series_id != '' ? true : false);
        setSeriesId(res.results.series_id);
        getSeriesMatches(res.results.series_id);
        setMatchId(res.results.match_id);
        //    const [show_series_match, setShowSeriesMatch] = useState(false);
        //    const [show_offer, setShowOffer] = useState(false);

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

  const handleStartDate = (date) => {
    setEndDate('');
    let newDate = date ? date : new Date();
    setStartDate(newDate);
  };
  const handleEndDate = (date) => {
    let newDate = date ? date : '';
    setEndDate(newDate);
  };


  useEffect(() => {
    getData();
  }, []);

  return (
    <React.Fragment>
      <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
        <Card>
          <CardHeader>
            <CardTitle className=""><h4>Edit Cricket Banner</h4></CardTitle>
          </CardHeader>
          <CardBody>
            <Row>
              <Col md={12}>
                <FormGroup>
                  <Label className={'col-md-2 pull-left mt-2'}>Banner Title</Label>
                  <input type="text" minLength={"3"} maxLength={"50"} name="title" placeholder="Banner Title" autoComplete="off"
                    className="form-control col-md-8" defaultValue={title} ref={register({ required: 'Required' })} />
                  {errors.title && <p className="text-danger marginmessage">Banner Title is required</p>}
                </FormGroup>
              </Col>
              <Col md={12}>
                <FormGroup>
                  <Label className={'col-md-2 pull-left mt-2'}>Banner Hyperlink</Label>
                  <input type="text" name="link" placeholder="ex:https://www.google.com" autoComplete="off"
                    className="form-control col-md-8" defaultValue={link} ref={register({ required: 'Required',pattern:/(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/ })} />
                  <span className={"pull-left mb-2"} >
                    (Ex:https://www.google.com) 
                   </span>
                  {errors.link && <p className="text-danger marginmessage">Banner Hyperlink is required</p>}
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label className={'col-md-4 pull-left mt-2'}>Start Date</Label>
                  <div className={"pull-left col-md-6 p-0 mb-3"}>
                    <DatePicker selected={startdate === '' ? null : new Date(startdate)} className="form-control" placeholderText=" Start Date"
                      dateFormat="dd/MM/yyyy"
                      timeInputLabel="Time:"
                      // showTimeInput
                      minDate={new Date()}
                      onChange={handleStartDate}
                      peekNextMonth
                      showMonthDropdown
                      showYearDropdown
                      dropdownMode="select"
                      required={true} />
                  </div>
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label className={'col-md-4 pull-left mt-2'}>End Date</Label>
                  <div className={"pull-left col-md-6 p-0 mb-3"}>
                    <DatePicker selected={enddate === '' ? null : new Date(enddate)} className="form-control" placeholderText=" End Date"
                      dateFormat="dd/MM/yyyy"
                      timeInputLabel="Time:"
                      // showTimeInput
                      // minDate={startdate ? new Date(startdate) : new Date()}
                      minDate={new Date()}
                      onChange={handleEndDate}
                      peekNextMonth
                      showMonthDropdown
                      showYearDropdown
                      dropdownMode="select"
                      required={true} />
                  </div>
                </FormGroup>
              </Col>
              {/* <Col md={12}>
                <FormGroup>
                  <Label className={'col-md-2 pull-left mt-2'}>Media Type</Label>
                  <select name={'type'} className={"form-control col-md-8"} value={mediaType} onChange={(e) => setMediaType(e.target.value)} ref={register({ required: 'Required' })} >
                    <option value={''}>-- Select Media Type --</option>
                    <option value={'image'}>Image</option>
                    <option value={'video'}>Video</option>
                  </select>
                  {errors.title && <p className="text-danger marginmessage">Media Type is required</p>}
                </FormGroup>
              </Col> */}
              <Col md={12}>
                <FormGroup>
                  <Label className={'col-md-2 pull-left mt-2'}>Banner Image</Label>
                  <input type="file" onChange={onImageChange} name="banner_pic" className="form-control  col-md-8" autoComplete="off" placeholder="Banner Image" />
                  <span className={""} >
                    (Please enter only .png, .jpg and .jpeg images with dimension 600 X 400 and max size of 12MB for best view.) <br></br>
                  (Please enter only  Mp4 video with max size of 12MB for best view.)
                   </span>
                  <ErrorMessage errors={errors} name="banner_pic">
                    {({ message }) => <p className={"text-danger"}>{message}</p>}
                  </ErrorMessage>
                  <br></br>
                  {(mediaType == 'image') && <img id="target" className={'mt-3 rounded'} height={250} width={500} src={preview} />}
                  {(mediaType == 'video') && <video height={250} width={500} controls >
                    <source src={preview} type="video/mp4" />
                  </video>}
                </FormGroup>
              </Col>

              <Col md={6}>
                <FormGroup>
                  <select type="select" name="banner_type" value={banner_type} placeholder="Status" className="form-control" onChange={handleChange} ref={register({ required: 'Required' })}>
                    <option value=""> Banner Type </option>
                    {/* <option value="match">Match</option> */}
                    <option value="invite">Invite</option>
                  </select>
                  {errors.banner_type && <p className="text-danger marginmessage">Banner Type is required</p>}
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <input type="number" name="sequence" defaultValue={sequence} placeholder="Banner Sequence" autoComplete="off"
                    className="form-control col-md-8" maxLength={"3"} min={"0"} ref={register({ required: 'Required' })} />
                  {errors.sequence && <p className="text-danger marginmessage">Banner Sequence is required</p>}
                </FormGroup>
              </Col>

              {show_offer === true && (<Col md={6}>
                <FormGroup>
                  <select className={"form-control"} value={offer_id} name="offer_id" onChange={handleChange}>
                    <option value={""}>Select Offer</option>
                    {
                      offer_dropdown.map((type, index) => {
                        return <option key={index} value={type._id}>{type.coupon_code}</option>
                      })
                    }
                  </select>

                </FormGroup>
              </Col>)}
              {show_series_match === true && (<Col md={6}>
                <FormGroup>
                  <select className={"form-control"} value={series_id} name="series_id" onChange={handleChange}>
                    <option value={""}>Select Series</option>
                    {
                      dropdown.map((type, index) => {
                        return <option key={index} value={type.id_api}>{type.name}</option>
                      })
                    }
                  </select>

                </FormGroup>
              </Col>)}
              {show_series_match === true && (<Col md={6}>
                <FormGroup>
                  <select className={"form-control"} value={match_id} name="match_id" onChange={handleChange}>
                    <option value={""}>Select Match</option>
                    {
                      match_dropdown.map((type, index) => {
                        return <option key={index} value={type.match_id}>{type.localteam} Vs {type.visitorteam} {type.type} @ {moment(type.date).format('YYYY-MM-DD')}</option>
                      })
                    }
                  </select>
                </FormGroup>
              </Col>)}

            </Row>
          </CardBody>
          <CardFooter>
            <Button onClick={() => history.goBack()} className="btn dark_btn ml-1" color="danger"><i className="fa fa-arrow-left" aria-hidden="true"></i> Back  </Button>
            <Button className={'ml-2'} type="submit" color="primary">Submit {loading === true ? <i className="fa fa-spinner fa-pulse fa-fw ml-1"></i> : <i className="fa fa-arrow-circle-right fa-lg" aria-hidden="true"></i>}</Button>
          </CardFooter>
        </Card>
      </form>
    </React.Fragment>
  );
}

export default EditWebBanner;
