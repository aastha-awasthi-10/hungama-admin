import React, { useState, useEffect, useRef, useContext } from 'react';
import { Link } from 'react-router-dom';
import {
  UncontrolledDropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Nav,
  Label
} from 'reactstrap';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { AppNavbarBrand, AppSidebarToggler } from '@coreui/react';
import { GlobalStateContext } from "../../hooks/GlobalStateContext";
import useSession from 'react-session-hook';
import Swal from 'sweetalert2';
const propTypes = {
  children: PropTypes.node,
};
const defaultProps = {};

const DefaultHeader = (props) => {

  const session = useSession();
  const [globalState, setGlobalState] = useContext(GlobalStateContext);
  const username = session.profile.username;
  const [user_type] = useState(session.profile.user_type);
  const componentIsMounted = useRef(true);

  // const [changeviewvar, setChangeviewvar] = useState(localStorage.getItem('switchItem') == 'fantasy'?"quiz":"fantasy");
  const [changeviewvar, setChangeviewvar] = useState("fantasy");
  useEffect(() => {

  }, []);

  const changeView = (e) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You want to switch to " + changeviewvar,
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      reverseButtons: true
    }).then((result) => {
      if (result.value) {
        if (changeviewvar == 'fantasy') {
          setChangeviewvar('quiz');
          window.location.href = '/fantasy-dashboard';
          localStorage.setItem('switchItem', 'fantasy');
        } else {
          setChangeviewvar('fantasy');
          localStorage.setItem('switchItem', 'quiz');
          window.location.href = '/dashboard';

        }
      }
    })
  };

  return (
    <React.Fragment>
      <AppSidebarToggler className="d-lg-none" display="md" mobile />
      <AppNavbarBrand>
        <img className="big-Logo" src={require('../../assets/img/logo/hungama_logo.png')} />
        <img className="sm-logo" src={require('../../assets/img/logo/hungama_small_logo.png')} />

        {/* {<img className="big-Logo" src={require('../../assets/img/logo/adminlogo.png')} />}
        {<img className="sm-logo" src={require('../../assets/img/logo/logo_small.png')} />} */}
      </AppNavbarBrand>
      <AppSidebarToggler className="d-md-down-none" display="lg" />
      <Nav className="ml-auto" navbar>
        <UncontrolledDropdown nav direction="down">
          <DropdownToggle nav className="text-left">
            <i className="fa fa-user fa-lg mr-2"> {username}</i><i className="fa fa-chevron-down mr-3" />
          </DropdownToggle>
          <DropdownMenu right>
            <Link to="/userprofile" title="User Profile"><DropdownItem className="text-info"> My Profile</DropdownItem></Link>
            <Link to="/change-password" title="Change Password"><DropdownItem className="text-info"> Change Password</DropdownItem></Link>
            {/* <a onClick={changeView}> <DropdownItem className="text-info">Switch To {changeviewvar}</DropdownItem></a> */}
            <a onClick={e => props.onLogout(e)}> <DropdownItem className="text-info">Logout</DropdownItem></a>
          </DropdownMenu>
        </UncontrolledDropdown>
      </Nav>
    </React.Fragment>
  );
};

DefaultHeader.propTypes = propTypes;
DefaultHeader.defaultProps = defaultProps;

export default React.memo(DefaultHeader);
