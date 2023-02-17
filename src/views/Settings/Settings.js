import React, { useState, useEffect } from "react";
import { ErrorMessage, useForm } from "react-hook-form";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  CardFooter,
  FormGroup,
  Label,
  Col,
  Row,
} from "reactstrap";
import Helper from "../../constants/helper";
import apiUrl from "../../constants/apiPath";
import useSession from "react-session-hook";
import { useAlert } from "react-alert";
const Settings = () => {
  const session = useSession();
  const alert = useAlert();
  const [settingData, setSettingData] = useState({
    referral_amount: 0,
    contest_admin_commission: 0,
    quiz_admin_commission: 0,
  });

  const { register, reset, handleSubmit, errors } = useForm();
  const [token] = useState(session.token);
  const [issubmit, setIsubmit] = useState(false);
  const module =
    session.profile.user_type == "editor"
      ? session.profile.permissions.find((e) => e.manager == "Settings")
      : {};
  const { user_type } = session.profile;
  console.log(module, "mofulr");
  const onSubmit = async (data) => {
    setIsubmit(true);
    let postJson = {
      slug: "setting",
      sign_in_bonus: data.sign_in_bonus,
      referral_amount: data.referral_amount,
      max_withdrawl_limit: data.max_withdrawl_limit,
      contest_admin_commission: data.contest_admin_commission,
      quiz_admin_commission: 10,
      admin_email: data.admin_email,
      min_withdraw_amount: data.min_withdraw_amount,
      tds: data.tds,
      plateform_Fee:data.plateform_Fee,
      gst_number: data.gst_number,
      hsn_number: data.hsn_number,
      gst_rate: data.gst_rate,
      // before_time_for_bot: data.before_time_for_bot,
      // contest_minimum_fill_for_bot: data.contest_minimum_fill_for_bot,
    };
    let path = apiUrl.update_setting;
    const fr = await Helper.put(postJson, path, token);
    const res = await fr.response.json();
    if (fr.status === 200) {
      if (res.success) {
        getSettings();
        setIsubmit(false);
        alert.success(res.msg);
      } else {
        alert.error(res.msg);
        setIsubmit(false);
      }
    } else {
      alert.error(res.error);
      setIsubmit(false);
    }
  };

  const getSettings = async (id) => {
    let path = apiUrl.get_setting;
    const fr = await Helper.get(path, token);
    const res = await fr.response.json();
    if (fr.status === 200) {
      if (res.success) {
        setSettingData(res.results || []);
      } else {
        alert.error(res.msg);
      }
    } else {
      alert.error(res.error);
    }
  };

  useEffect(() => {
    reset(); // IMPORTANT Quick hook for assigning the changed data from API
    getSettings();
  }, []);

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle className="">
            <h5>Settings</h5>
          </CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardBody>
            <Row>
              <Col md={6}>
                <FormGroup>
                  <Label className={"col-md-4 pull-left mt-2"}>
                    Admin Email
                  </Label>
                  <div className="input-group col-md-6">
                    <input
                      defaultValue={settingData.admin_email}
                      ref={register({ required: "Admin Email is required" })}
                      id="admin_email"
                      name="admin_email"
                      placeholder="Admin Email"
                      type="text"
                      className="form-control"
                    />
                    <div className="input-group-append">
                      <span className="input-group-text">
                        <i className="fa fa-envelope"></i>
                      </span>
                    </div>
                  </div>
                  <ErrorMessage errors={errors} name="admin_email">
                    {({ message }) => (
                      <p className={"text-danger"}>{message}</p>
                    )}
                  </ErrorMessage>
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label className={"col-md-4 pull-left mt-2"}>
                    Referral Amount
                  </Label>
                  <div className="input-group col-md-6">
                    <input
                      defaultValue={settingData.referral_amount}
                      maxLength={"3"}
                      min={"0"}
                      step={"0.01"}
                      ref={register({
                        required: "Referral Amount is Required",
                      })}
                      id="referral_amount"
                      name="referral_amount"
                      placeholder="Referral Amount"
                      type="number"
                      className="form-control"
                    />
                    <div className="input-group-append">
                      <span className="input-group-text">
                        <i className="fa fa-money"></i>
                      </span>
                    </div>
                  </div>
                  <ErrorMessage errors={errors} name="referral_amount">
                    {({ message }) => (
                      <p className={"text-danger"}>{message}</p>
                    )}
                  </ErrorMessage>
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label className={"col-md-4 pull-left mt-2"}>
                    Maximum Withdrawl Limit
                  </Label>
                  <div className="input-group col-md-6">
                    <input
                      defaultValue={settingData.max_withdrawl_limit}
                      maxLength={"4"}
                      min={"0"}
                      step={"1"}
                      ref={register({
                        required: "Maximum Withdrawl Limit is Required",
                      })}
                      id="max_withdrawl_limit"
                      name="max_withdrawl_limit"
                      placeholder="Maximum Withdrawl Limit"
                      type="number"
                      className="form-control"
                    />
                    <div className="input-group-append">
                      <span className="input-group-text">
                        <i className="fa fa-money"></i>
                      </span>
                    </div>
                  </div>
                  <ErrorMessage errors={errors} name="max_withdrawl_limit">
                    {({ message }) => (
                      <p className={"text-danger"}>{message}</p>
                    )}
                  </ErrorMessage>
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label className={"col-md-4 pull-left mt-2"}>
                    Contest Admin Commission
                  </Label>
                  <div className="input-group col-md-6">
                    <input
                      defaultValue={settingData.contest_admin_commission}
                      maxLength={"3"}
                      min={"0"}
                      step={"0.01"}
                      ref={register({
                        required: "Contest Admin Commission Amount is Required",
                      })}
                      id="contest_admin_commission"
                      name="contest_admin_commission"
                      placeholder="Contest Admin Commission"
                      type="number"
                      className="form-control"
                    />
                    <div className="input-group-append">
                      <span className="input-group-text">
                        <i className="fa fa-percent"></i>
                      </span>
                    </div>
                  </div>
                  <ErrorMessage errors={errors} name="contest_admin_commission">
                    {({ message }) => (
                      <p className={"text-danger"}>{message}</p>
                    )}
                  </ErrorMessage>
                </FormGroup>
              </Col>

              <Col md={6}>
                <FormGroup>
                  <Label className={'col-md-4 pull-left mt-2'}>Plateform Fee For Private Contest</Label>
                  <div className="input-group col-md-6">
                    <input defaultValue={settingData.plateform_Fee} maxLength={"3"} min={"0"} step={"0.01"} ref={register({ required: "Plateform Fee For Private Contest" })} id="plateform_Fee" name="plateform_Fee" placeholder="Plateform Fee For Private Contest" type="number" className="form-control" />
                    <div className="input-group-append">
                      <span className="input-group-text"><i className="fa fa-percent"></i></span>
                    </div>
                  </div>
                  <ErrorMessage errors={errors} name="plateform_Fee">
                    {({ message }) => <p className={"text-danger"}>{message}</p>}
                  </ErrorMessage>
                </FormGroup>
              </Col>

              {/* <Col md={6}>
                <FormGroup>
                  <Label className={'col-md-4 pull-left mt-2'}>Quiz Admin Commission</Label>
                  <div className="input-group col-md-6">
                    <input defaultValue={settingData.quiz_admin_commission} maxLength={"3"} min={"0"} step={"0.01"} ref={register({ required: "Quiz Admin Commission Amount is Required" })} id="quiz_admin_commission" name="quiz_admin_commission" placeholder="Contest Admin Commission" type="number" className="form-control" />
                    <div className="input-group-append">
                      <span className="input-group-text"><i className="fa fa-percent"></i></span>
                    </div>
                  </div>
                  <ErrorMessage errors={errors} name="quiz_admin_commission">
                    {({ message }) => <p className={"text-danger"}>{message}</p>}
                  </ErrorMessage>
                </FormGroup>
              </Col> */}
              <Col md={6}>
                <FormGroup>
                  <Label className={"col-md-4 pull-left mt-2"}>
                    Minimum Withdrawl Amount
                  </Label>
                  <div className="input-group col-md-6">
                    <input
                      defaultValue={settingData.min_withdraw_amount}
                      maxLength={"3"}
                      min={"0"}
                      step={"0.01"}
                      ref={register({
                        required: "Minimum Withdrawl Amount is Required",
                      })}
                      id="min_withdraw_amount"
                      name="min_withdraw_amount"
                      placeholder="Minimum Withdrawl Amount"
                      type="number"
                      className="form-control"
                    />
                    <div className="input-group-append">
                      <span className="input-group-text">
                        <i className="fa fa-money"></i>
                      </span>
                    </div>
                  </div>
                  <ErrorMessage errors={errors} name="min_withdraw_amount">
                    {({ message }) => (
                      <p className={"text-danger"}>{message}</p>
                    )}
                  </ErrorMessage>
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label className={"col-md-4 pull-left mt-2"}>
                    TDS (On minimum 10000 INR)
                  </Label>
                  <div className="input-group col-md-6">
                    <input
                      defaultValue={settingData.tds}
                      maxLength={"3"}
                      min={"0"}
                      step={"0.01"}
                      ref={register({ required: "TDS is Required" })}
                      id="tds"
                      name="tds"
                      placeholder="TDS Amount"
                      type="number"
                      className="form-control"
                    />
                    <div className="input-group-append">
                      <span className="input-group-text">
                        <i className="fa fa-percent"></i>
                      </span>
                    </div>
                  </div>
                  <ErrorMessage errors={errors} name="tds">
                    {({ message }) => (
                      <p className={"text-danger"}>{message}</p>
                    )}
                  </ErrorMessage>
                </FormGroup>
              </Col>

              {/* <Col md={6}>
                <FormGroup>
                  <Label className={'col-md-4 pull-left mt-2'}>Level Up Reward (INR)</Label>
                  <div className="input-group col-md-6">
                    <input defaultValue={settingData.levelup_reward_amount} maxLength={3} min={0} ref={register({ required: "Level Up Reward Amount is Required" })} id="reward_amount" name="reward_amount" placeholder="Level Up Reward Amount" type="number" className="form-control" />
                    <div className="input-group-append">
                      <span className="input-group-text"><i className="fa fa-money"></i></span>
                    </div>
                  </div>
                  <ErrorMessage errors={errors} name="reward_amount">
                    {({ message }) => <p className={"text-danger"}>{message}</p>}
                  </ErrorMessage>
                </FormGroup>
              </Col> */}
              <Col md={6}>
                <FormGroup>
                  <Label className={"col-md-4 pull-left mt-2"}>
                    Sign In Bonus Amount
                  </Label>
                  <div className="input-group col-md-6">
                    <input
                      defaultValue={settingData.sign_in_bonus}
                      maxLength={"3"}
                      min={"0"}
                      step={"0.01"}
                      ref={register({
                        required: "Sign In Bonus Amount is Required",
                      })}
                      id="sign_in_bonus"
                      name="sign_in_bonus"
                      placeholder="Sign In Bonus Amount"
                      type="number"
                      className="form-control"
                    />
                    <div className="input-group-append">
                      <span className="input-group-text">
                        <i className="fa fa-money"></i>
                      </span>
                    </div>
                  </div>
                  <ErrorMessage errors={errors} name="sign_in_bonus">
                    {({ message }) => (
                      <p className={"text-danger"}>{message}</p>
                    )}
                  </ErrorMessage>
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label className={"col-md-4 pull-left mt-2"}>
                    GST Number
                  </Label>
                  <div className="input-group col-md-6">
                    <input
                      defaultValue={settingData.gst_number}
                      maxLength={15}
                      ref={register({ required: "GST number is required" })}
                      id="gst_number"
                      name="gst_number"
                      placeholder="GST Number"
                      type="text"
                      className="form-control"
                    />
                    <div className="input-group-append">
                      <span className="input-group-text">
                        <i className="fa fa-envelope"></i>
                      </span>
                    </div>
                  </div>
                  <ErrorMessage errors={errors} name="gst_number">
                    {({ message }) => (
                      <p className={"text-danger"}>{message}</p>
                    )}
                  </ErrorMessage>
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label className={"col-md-4 pull-left mt-2"}>GST Rate</Label>
                  <div className="input-group col-md-6">
                    <input
                      defaultValue={settingData.gst_rate}
                      ref={register({ required: "GST rate is required" })}
                      id="gst_rate"
                      name="gst_rate"
                      placeholder="GST Rate"
                      type="text"
                      className="form-control"
                    />
                    <div className="input-group-append">
                      <span className="input-group-text">
                        <i className="fa fa-percent"></i>
                      </span>
                    </div>
                  </div>
                  <ErrorMessage errors={errors} name="gst_rate">
                    {({ message }) => (
                      <p className={"text-danger"}>{message}</p>
                    )}
                  </ErrorMessage>
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label className={"col-md-4 pull-left mt-2"}>
                    HSN Number
                  </Label>
                  <div className="input-group col-md-6">
                    <input
                      defaultValue={settingData.hsn_number}
                      maxLength={6}
                      ref={register({ required: "HSN number is required" })}
                      id="hsn_number"
                      name="hsn_number"
                      placeholder="HSN Number"
                      type="text"
                      className="form-control"
                    />
                    <div className="input-group-append">
                      <span className="input-group-text">
                        <i class="fa fa-code"></i>
                      </span>
                    </div>
                  </div>
                  <ErrorMessage errors={errors} name="hsn_number">
                    {({ message }) => (
                      <p className={"text-danger"}>{message}</p>
                    )}
                  </ErrorMessage>
                </FormGroup>
              </Col>
              {/* <Col md={6}>
                <FormGroup>
                  <Label className={"col-md-4 pull-left mt-2"}>
                    Before Time For Bot ( Miniutes )
                  </Label>
                  <div className="input-group col-md-6">
                    <input
                      defaultValue={settingData.before_time_for_bot}
                      maxLength={6}
                      ref={register({
                        required: "Before Time For Bot is required",
                      })}
                      id="before_time_for_bot"
                      name="before_time_for_bot"
                      placeholder="Before Time For Bot"
                      type="text"
                      className="form-control"
                    />
                    <div className="input-group-append">
                      <span className="input-group-text">
                        <i class="fa fa-code"></i>
                      </span>
                    </div>
                  </div>
                  <ErrorMessage errors={errors} name="before_time_for_bot">
                    {({ message }) => (
                      <p className={"text-danger"}>{message}</p>
                    )}
                  </ErrorMessage>
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label className={"col-md-4 pull-left mt-2"}>
                    Minimum Contest Fill ( Percentage )
                  </Label>
                  <div className="input-group col-md-6">
                    <input
                      defaultValue={settingData.contest_minimum_fill_for_bot}
                      maxLength={6}
                      ref={register({
                        required: "Minimum Contest Fill is required",
                      })}
                      id="contest_minimum_fill_for_bot"
                      name="contest_minimum_fill_for_bot"
                      placeholder="Minimum Contest Fill"
                      type="text"
                      className="form-control"
                    />
                    <div className="input-group-append">
                      <span className="input-group-text">
                        <i class="fa fa-code"></i>
                      </span>
                    </div>
                  </div>
                  <ErrorMessage
                    errors={errors}
                    name="contest_minimum_fill_for_bot"
                  >
                    {({ message }) => (
                      <p className={"text-danger"}>{message}</p>
                    )}
                  </ErrorMessage>
                </FormGroup>
              </Col> */}
            </Row>
          </CardBody>
          <CardFooter>
            {(user_type === "editor" && module.edit == 1) ||
            user_type == "admin" ? (
              <Button type="submit" color="primary">
                Submit{" "}
                {issubmit === true && (
                  <i className="fa fa-spinner fa-pulse fa-fw ml-1"></i>
                )}
              </Button>
            ) : null}
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Settings;
