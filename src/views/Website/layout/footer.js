import React from "react";
import { Link } from 'react-router-dom';
console.log(process.env)
export default function Header() {
  return (
<footer>
        <div className="dividers">
          <div className="container">
            <div className="row">
              <div className="col-12 col-lg-8">
                <ul className="text-center text-lg-left">
                  <li><Link to="#">Home</Link></li>
                  <li>|</li>
                  <li><Link to="#">About us</Link></li>
                  <li>|</li>
                  <li><Link to="#">Services</Link></li>
                  <li>|</li>
                  <li><Link to="#">How it Works</Link></li>
                  <li>|</li>
                  <li><Link to="#">Contact Us</Link></li>
                  <li>|</li>
                  <li><Link to="#">Book</Link></li>
                  <li>|</li>
                  <li><Link to="#">Sign in</Link></li>
                </ul>
                <div className="copy text-center text-lg-left mt-3">
                  <Link to="#">Privacy policy</Link><span className="px-3">|</span><Link to="#" >Terms and conditions</Link>
                </div>
              </div>
              <div className="col-12 col-lg-4">
                {/* <div className="footersocila text-center text-lg-right">
                  <Link to="#"><img src={require('../assets/img/facebook.png')} alt="facebook" /></Link>
                  <Link to="#"><img src={require('../assets/img/facebook.png')} alt="twitter" /></Link>
                  <Link to="#"><img src={require('../assets/img/facebook.png')} alt="google_plus" /></Link>
                  <Link to="#"><img src={require('../assets/img/facebook.png')} alt="youtube" /></Link>
                </div> */}
                <div className="copy_right_text text-center text-lg-right mt-3">©Copyright 2019. All rights reserved</div>
              </div>
            </div>
          </div>
        </div>
      </footer>
  );
}