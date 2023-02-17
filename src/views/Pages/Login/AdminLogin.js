import React, { useState } from "react";
import useSession from "react-session-hook";
import { Redirect } from "react-router-dom";
import { ErrorMessage, useForm } from "react-hook-form";
import Helper from "../../../constants/helper";
import apiUrl from "../../../constants/apiPath";
import {
  Button,
  Card,
  CardBody,
  CardGroup,
  Col,
  Container,
  Row,
  FormGroup,
} from "reactstrap";
import Loader from "../../CommanPage/Loader";
import { useAlert } from "react-alert";
import _ from "lodash";
import appLogo from "../../../assets/img/logo/logo.svg";

function parseJwt(token) {
  var base64Url = token.split(".")[1];
  var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  var jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );
  return JSON.parse(jsonPayload);
}

const AdminLoginFrom = () => {
  const alert = useAlert();
  const [visible, setVisibale] = useState(false);
  const session = useSession();
  const { register, handleSubmit, errors } = useForm();

  const onSubmit = async (data) => {
    setVisibale(true);
    let postJson = {
      email: data.username,
      password: data.password,
      user_type: "admin",
    };
    let path = apiUrl.adminLogin;
    const fr = await Helper.post(postJson, path);
    const response_data = await fr.response.json();
    if (fr.status === 200) {
      if (response_data.success) {
        alert.success(response_data.msg);
        setVisibale(false);
        session.setSession({ token: response_data.token });
        let profile = parseJwt(response_data.token);
        localStorage.setItem("user_type", profile.user_type);
      } else {
        alert.error(response_data.msg);
        setVisibale(false);
      }
    } else {
      alert.error(response_data.error);
      setVisibale(false);
    }
  };

  if (session.isAuthenticated && session.profile.user_type == "admin") {
    //console.log("switchItem", localStorage.getItem('switchItem'));
    if (localStorage.getItem("switchItem") == "fantasy") {
      return <Redirect to="/fantasy-dashboard" />;
    } else {
      return <Redirect to="/fantasy-dashboard" />;
    }
  }

  if (
    localStorage.getItem("user_inactive") === "inactive" &&
    session.profile.user_type == "editor"
  ) {
    session.removeSession();
    localStorage.clear();
    alert.success("Successfully Logout");
    document.cookie =
      "token" + "=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
  }
  if (session.isAuthenticated && session.profile.user_type == "editor") {
    // console.log("my session", session.profile.permissions);
    let getLocalArr = [];
    let getPer = session.profile.permissions;
    if (!_.isEmpty(getPer)) {
      getPer.map((item, key) => {
        getLocalArr.push(item.label);
      });
    }
    localStorage.setItem("modules", getLocalArr);
    // console.log("getLocalArr",getLocalArr)

    if (localStorage.getItem("switchItem") == "fantasy") {
      return <Redirect to="/fantasy-dashboards" />;
    } else {
      return (
        // <Redirect to='/dashboard' />
        <Redirect to="/fantasy-dashboards" />
      );
    }
  }

  return (
    <div className="app flex-row align-items-center justify-content-center flex-column loginmodal">
      <Loader className="overlay-loader" visible={visible} />
      <img
        src={appLogo}
        alt=""
        style={{ height: "20%", width: "20%", marginBottom: "32px" }}
      />

      <Container>
        <Row className="justify-content-center">
          <Col md="6">
            <CardGroup>
              <Card className="modal-content">
                <CardBody>
                  <form id="login" onSubmit={handleSubmit(onSubmit)}>
                    <h5 className="modal-title">Welcome Admin !!</h5>
                    <FormGroup>
                      <input
                        type="text"
                        name="username"
                        className="custom-formcontrol form-control"
                        placeholder="Enter Email"
                        ref={register({ required: "Required" })}
                      />
                      {errors.username && (
                        <p className="text-danger marginmessage">
                          Email is required
                        </p>
                      )}
                    </FormGroup>
                    <FormGroup>
                      <input
                        type="password"
                        name="password"
                        className="custom-formcontrol form-control"
                        placeholder="Enter Password"
                        ref={register({
                          required: "Password is Required",
                          // validate: (value) => {
                          //   var paswd = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,30}$/;
                          //   if (value.match(paswd)) {
                          //     return true;
                          //   } else {
                          //     return 'Password must have minimum 8 character with 1 digit and 1 special character.';
                          //   }
                          // }
                        })}
                      />
                      {/* {errors.password && <p className="text-danger marginmessage">Password is required</p>} */}
                      <ErrorMessage errors={errors} name="password">
                        {({ message }) => (
                          <p className={"text-danger"}>{message}</p>
                        )}
                      </ErrorMessage>
                    </FormGroup>
                    <Button type="submit" className="btn btn-primary">
                      Login
                    </Button>
                  </form>
                </CardBody>
              </Card>
            </CardGroup>
          </Col>
        </Row>
      </Container>
    </div>
  );
};
export default AdminLoginFrom;
