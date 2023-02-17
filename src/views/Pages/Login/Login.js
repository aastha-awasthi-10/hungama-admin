import React, {useState} from 'react';
import useSession  from 'react-session-hook';
import { Redirect } from 'react-router-dom';
import {useForm} from 'react-hook-form';
import Helper from '../../../constants/helper';
import apiUrl from '../../../constants/apiPath';
import { Button, Card, CardBody, CardGroup, Col, Container, Row, FormGroup } from 'reactstrap';
import Loader from '../../CommanPage/Loader';
import { useAlert } from 'react-alert';



const AdminLoginFrom = () => {

  const alert = useAlert();
  const [visible, setVisibale] = useState(false);
  const session = useSession();
  const { register, handleSubmit, errors } = useForm();
 
 
  return (
    <div className="app flex-row align-items-center loginmodal">
      <Loader className="overlay-loader" visible={visible} />
      <Container>
        <Row className="justify-content-center">
          <Col md="6">
            <CardGroup>
              <Card className="modal-content">
                <CardBody>
                  
                </CardBody>
              </Card>
            </CardGroup>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
export default AdminLoginFrom;
