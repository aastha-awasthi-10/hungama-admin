import React from "react";
import { Link } from 'react-router-dom';

import '../../../assets/css/bootstrap.min.css'
import '../../../assets/css/custom.css';
import '../../../assets/css/developer.css';

export default function Header() {
  return (
<header className="navigation">
        <nav className="navbar navbar-expand-md">
          <div className="container">
            <Link className="logo" to="#" title=""><img src={require('../../../assets/img/logo/weblogo.png')} height="50" /></Link>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon" />
              <span className="navbar-toggler-icon" />
              <span className="navbar-toggler-icon" />
            </button>
            <div className="collapse navbar-collapse" id="navbarCollapse">
              <ul className="navbar-nav d-flex ml-0 ml-lg-auto">
                <li className="nav-item active"><Link to="#" title="Home">Home</Link></li>
                <li className="nav-item"><Link  to="#" title="About Us">About Us</Link></li>
                <li className="nav-item"><Link to="#" title="Services">Services</Link></li>
                <li className="nav-item"><Link to="#" title="How It Works">How It Works</Link></li>
                <li className="nav-item"><Link to="#" title="Contact Us">Contact Us</Link></li>
              </ul>
              <ul className="home_toggle_block ml-0 ml-lg-0">
                <li className="selected"><Link to="#">Login</Link></li>
                <li><Link to="#">Sign up</Link></li>
              </ul>
            </div>
          </div>
        </nav>
</header>
  );
}