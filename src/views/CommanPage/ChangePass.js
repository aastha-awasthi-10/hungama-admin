import React, { useState, useEffect, useRef } from "react";
import "react-datepicker/dist/react-datepicker.css";
import Swal from "sweetalert2";
import Helper from "../../constants/helper";
import apiUrl from "../../constants/apiPath";
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
// import { ValidatorForm } from "react-form-validator-core";
// import TextValidator from "../CommanPage/TextValidator";
import useSession from "react-session-hook";
import { ErrorMessage, useForm } from "react-hook-form";

const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
});

const ChangePass = (props) => {
  const { register, handleSubmit, errors, watch, setError, setValue } =
    useForm();

  const newPassword = useRef({});
  newPassword.current = watch("newpassword", "");
  const session = useSession();
  const [token] = useState(session.token);
  const [user_type] = useState(session.profile.user_type);
  const [id, setId] = useState("");

  const onSubmit = async (data) => {
    let path = apiUrl.change_admin_password;
    let postJson = {
      newPassword: data?.newpassword,
      oldPassword: data?.oldpassword,
    };
    const fr = await Helper.put(postJson, path, token);
    const res = await fr.response.json();
    if (fr.status === 200) {
      if (res.success) {
        Toast.fire({
          type: "success",
          title: res.msg,
        });
        setValue("oldpassword", "");
        setValue("newpassword", "");
        setValue("c_newpassword", "");
      } else {
        Toast.fire({
          type: "error",
          title: res.msg,
        });
      }
    } else {
      Toast.fire({
        type: "error",
        title: res.error,
      });
    }
  };

  useEffect(() => {}, []);

  console.log("ERRORS", errors.oldpassword);

  return (
    <React.Fragment>
      <Card>
        <CardHeader>
          <CardTitle className="text-info">
            <h3>Change Password</h3>
          </CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardBody>
            <Row>
              <Col md={4}>
                <FormGroup>
                  <Label>Old Password</Label>

                  <input
                    type="password"
                    name={"oldpassword"}
                    className="form-control"
                    id={"current_balance"}
                    placeholder={"Old Password"}
                    ref={register({
                      required: "Old password is required",
                    })}
                  />
                  <ErrorMessage
                    errors={errors}
                    name="oldpassword"
                    style={{ color: "red" }}
                  >
                    {({ message }) => (
                      <p className={"text-danger"}>{message}</p>
                    )}
                  </ErrorMessage>
                </FormGroup>
              </Col>
              <Col md={4}>
                <FormGroup>
                  <Label>New Password</Label>

                  <input
                    type="password"
                    name={"newpassword"}
                    className="form-control"
                    id={"current_balance"}
                    placeholder={"New Password"}
                    ref={register({
                      required: "New password is required",
                      validate: (value) => {
                        if (value == "") {
                          return true;
                        }

                        var paswd =
                          /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,16}$/;
                        if (value.match(paswd)) {
                          return true;
                        } else {
                          return "Password must have minimum 8 character with 1 lowercase 1 uppercase 1 digit and 1 special character.";
                        }
                      },
                    })}
                  />
                  <ErrorMessage
                    errors={errors}
                    name="newpassword"
                    style={{ color: "red" }}
                  >
                    {({ message }) => (
                      <p className={"text-danger"}>{message}</p>
                    )}
                  </ErrorMessage>
                </FormGroup>
              </Col>
              <Col md={4}>
                <FormGroup>
                  <Label>Confirm Password</Label>
                  <input
                    type="password"
                    name={"c_newpassword"}
                    className="form-control"
                    id={"current_balance"}
                    placeholder={"Confirm Password"}
                    ref={register({
                      required: "Confirm password is required",
                      validate: (value) => {
                        if (value === "") {
                          return true;
                        }
                        if (value !== newPassword.current)
                          return "Password should match confirm password.";
                      },
                    })}
                  />{" "}
                  <ErrorMessage
                    errors={errors}
                    name="c_newpassword"
                    style={{ color: "red" }}
                  >
                    {({ message }) => (
                      <p className={"text-danger"}>{message}</p>
                    )}
                  </ErrorMessage>
                </FormGroup>
              </Col>
            </Row>
          </CardBody>
          <CardFooter>
            <Button type="submit" color="primary">
              Submit
            </Button>
          </CardFooter>
        </form>
      </Card>
      {/* </ValidatorForm> */}
    </React.Fragment>
  );
};

export default ChangePass;
