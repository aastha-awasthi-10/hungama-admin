import React, { useState } from 'react';
import useSession from 'react-session-hook';
import { Redirect } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Button, Card, CardBody, CardGroup, Col, Container, Row, FormGroup } from 'reactstrap';
import Loader from '../CommanPage/Loader';
import { useAlert } from 'react-alert';


const Header = React.lazy(() => import('./layout/header'));
const Footer = React.lazy(() => import('./layout/footer'));
const MainPage = React.lazy(() => import('./index'));



const AdminLoginFrom = () => {

    const alert = useAlert();
    const [visible, setVisibale] = useState(false);
    const session = useSession();
    const { register, handleSubmit, errors } = useForm();


    return (
        <div className={"full_container"}>
            <Loader className={"overlay-loader"} visible={visible} />
            <Header />
            <MainPage />
            <Footer />
        </div>

    );
}
export default AdminLoginFrom;
