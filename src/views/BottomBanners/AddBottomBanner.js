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

const AddBottomBanner = (props) => {
  const session = useSession();
  let history = useHistory();
  const alert = useAlert();
  const { register, handleSubmit, errors, watch } = useForm();
  const [visible, setVisibale] = useState(false);
  const [token] = useState(session.token);
  const [loading, setLoading] = useState(false);
  const [startdate, setStartDate] = useState('');
  const [enddate, setEndDate] = useState('');
  const [link, setLink] = useState('');
  const [profilePic, setProfilePic] = useState('');
  const [preview, setProfilePicPreview] = useState('');
  const [series_id, setSeriesId] = useState('');
  const [offer_id, setOfferId] = useState('');
  const [match_id, setMatchId] = useState('');
  const [dropdown, setDropdown] = useState([]);
  const [match_dropdown, setMatchDropdown] = useState([]);
  const [offer_dropdown, setOfferDropdown] = useState([]);
  const [show_series_match, setShowSeriesMatch] = useState(false);
  const [show_offer, setShowOffer] = useState(false);
  const [mediaType, setMediaType] = useState("");

  const handleChange = (e) => {
    if (e.target.name === 'banner_type') {

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
    else if (e.target.name === 'offer_id') {
      setOfferId(e.target.value);
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
    formData.append('data', JSON.stringify(postJson));
    formData.append('banner_pic', profilePic);
    let path = apiUrl.add_bottom_banner;
    const fr = await Helper.formPost(formData, path, token);
    const res = await fr.response.json();
    if (fr.status === 200) {
      if (res.success) {
        setLoading(false);
        props.history.push('/bottom-banners');
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

  const handleStartDate = (date) => {
    setEndDate('');
    let newDate = date ? date : new Date();
    setStartDate(newDate);
  };

  const handleEndDate = (date) => {
    let newDate = date ? date : '';
    setEndDate(newDate);
  };

  const getData = async () => {
    setVisibale(true);
    const itemsPerPage = 10;
    let path = apiUrl.get_series;

    const fr = await Helper.get(path, token);
    const res = await fr.response.json();

    if (fr.status === 200) {

      if (res.success) {
        setDropdown(res.results || []);
        setVisibale(false);
      } else {
        alert.error(res.msg);
        setVisibale(false)
      }
    } else {
      alert.error(res.error);
      setVisibale(false)
    }


    path = apiUrl.get_coupons_for_banners;

    const fr1 = await Helper.get(path, token);
    const res1 = await fr1.response.json();

    if (fr1.status === 200) {
      if (res1.success) {
        setOfferDropdown(res1.results || []);
        setVisibale(false);
      } else {
        alert.error(res1.msg);
        setVisibale(false)
      }
    } else {
      alert.error(res1.error);
      setVisibale(false)
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <React.Fragment>
      <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
        <Card>
          <CardHeader>
            <CardTitle className="text-info"><h4>Add Bottom Banner</h4></CardTitle>
          </CardHeader>
          <CardBody>
            <Row>
              <Col md={6}>
                <FormGroup>
                  <Label className={'col-md-2 pull-left mt-2'}>Banner Title</Label>
                  <input type="text" name="title" minLength={"3"} maxLength={"50"} placeholder="Banner Title" autoComplete="off"
                    className="form-control col-md-8" ref={register({ required: 'Required' })} />
                  {errors.title && <p className="text-danger marginmessage">Banner Title is required</p>}
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label className={'col-md-2 pull-left mt-2'}>Banner Hyperlink</Label>
                  <input type="text" name="link" placeholder="ex:https://www.google.com" autoComplete="off"
                    className="form-control col-md-8" ref={register({ required: 'Required',pattern:/(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/ })} />
                  <span className={"pull-left mb-2"} >
                    (Ex:https://www.google.com)
                  </span>
                  {errors.link && <p className="text-danger marginmessage">Banner Hyperlink is required</p>}
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label className={'col-md-2 pull-left mt-2'}>Start Date</Label>
                  <div className={"pull-left col-md-8 p-0 mb-3"}>
                    <DatePicker selected={startdate === '' ? null : new Date(startdate)} className="form-control" placeholderText=" Start Date"
                      dateFormat="dd/MM/yyyy"
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
                  <Label className={'col-md-2 pull-left mt-2'}>End Date</Label>
                  <div className={"pull-left col-md-8 p-0 mb-3"}>
                    <DatePicker selected={enddate === '' ? null : new Date(enddate)} className="form-control" placeholderText=" End Date"
                      dateFormat="dd/MM/yyyy"
                      minDate={startdate ? new Date(startdate) : new Date()}
                      onChange={handleEndDate}
                      peekNextMonth
                      showMonthDropdown
                      showYearDropdown
                      dropdownMode="select"
                      required={true} />
                  </div>
                </FormGroup>
              </Col>
              {/* <Col md={6}>
                <FormGroup>
                  <Label className={'col-md-2 pull-left mt-2'}>Media Type</Label>
                  <select name={'type'} className={"form-control col-md-8"} onChange={(e) => setMediaType(e.target.value)} ref={register({ required: 'Required' })}>
                    <option value={''}>-- Select Media Type --</option>
                    <option value={'image'}>Image</option>
                    <option value={'video'}>Video</option>
                  </select>
                  {errors.type && <p className="text-danger marginmessage">Media Type is required</p>}
                </FormGroup>
              </Col> */}
              <Col md={6}>
                <FormGroup>
                  <Label className={'col-md-2 pull-left mt-2'}>Banner {mediaType ? mediaType : "Image"}</Label>
                  <input type="file" required onChange={onImageChange} name="banner_pic" className="form-control  col-md-8" autoComplete="off" placeholder="Banner Image" />
                  {mediaType === 'video' ?
                    <span className={"pull-left"} > (Please enter only .mp4, .ogg mpeg and .webm video with max size of 2MB.) </span>
                    : <span className={"pull-left"} > (Please enter only .png, .jpg and .jpeg images with dimension 600 X 400 and max size of 2MB for best view.) </span>
                  }
                  <ErrorMessage errors={errors} name="banner_pic">
                    {({ message }) => <p className={"text-danger"}>{message}</p>}
                  </ErrorMessage>
                  <img id="target" className={'mt-3 rounded'} height={250} src={preview} />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label className={'col-md-2 pull-left mt-2'}>Banner Type</Label>
                  <select type="select" name="banner_type" placeholder="Status" className="form-control col-md-8" onChange={handleChange} ref={register({ required: 'Required' })}>
                    <option value=""> Banner Type </option>
                    {/* <option value="match">Match</option> */}
                    <option value="invite">Invite</option>
                    {/* <option value="offer">Offer </option> */}
                  </select>
                  {errors.banner_type && <p className="text-danger marginmessage">Banner Type is required</p>}
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label className={'col-md-2 pull-left mt-2'}>Banner Sequence</Label>
                  <input type="number" name="sequence" placeholder="Banner Sequence" autoComplete="off"
                    className="form-control col-md-8" maxLength={"3"} min={"0"} ref={register({ required: 'Required' })} />
                  {errors.sequence && <p className="text-danger marginmessage">Banner Sequence is required</p>}
                </FormGroup>
              </Col>

              {show_offer === true && (<Col md={6}>
                <FormGroup>
                  <Label className={'col-md-2 pull-left mt-2'}>Offer</Label>
                  <select className={"form-control col-md-8"} defaultValue={offer_id} name="offer_id" onChange={handleChange}>
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
                  <Label className={'col-md-2 pull-left mt-2'}>Series</Label>
                  <select className={"form-control col-md-8"} name="series_id" onChange={handleChange}>
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
                  <Label className={'col-md-2 pull-left mt-2'}>Matches</Label>
                  <select className={"form-control col-md-8"} defaultValue={match_id} name="match_id" onChange={handleChange}>
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
            <Button onClick={() => history.goBack()} className="dark_btn"><i className="fa fa-arrow-left" aria-hidden="true"></i> Back  </Button>
            <Button className={'ml-2'} type="submit" color="primary">Submit {loading === true ? <i className="fa fa-spinner fa-pulse fa-fw ml-1"></i> : <i className="fa fa-arrow-circle-right fa-lg" aria-hidden="true"></i>}</Button>
          </CardFooter>
        </Card>
      </form>
    </React.Fragment>
  );
}

export default AddBottomBanner;
