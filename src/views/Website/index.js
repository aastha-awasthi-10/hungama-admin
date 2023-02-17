import React from 'react';
import { Link } from 'react-router-dom';
const home = () => {
    return (
        <div className="body_section">
        <section className="banner_block position-relative" style={{backgroundImage: 'url(img/sliderbg.jpg)'}}>
          <div className="container">
            <div className="row align-items-center">
              <div className="col-12 col-lg-7 col-xl-7">
                <div className="banner_data_block text-md-left text-center">
                  <h1 className="banner_title">What is Lorem Ipsum. Every Appointment</h1>
                  <div className="banner_desc">Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. </div>
                  <div className="book_now_btns">
                    <a href="javascript:;">Learn More</a>
                  </div>
                </div>
              </div>
              <div className="col-12 col-lg-5 col-xl-5">
                <div className="banner_data_img text-center">                 
                  <img src={require("../../assets/img/rightslider.png")} alt="" />                  
                </div>
              </div>
            </div>
          </div>
        </section>
        <section>
        <ul className="d11_app_store_box">
        <li>
          <a  id="android_button" href="https://drive.google.com/file/d/16gb-juVx4dnOgfCFq8QxoXHrOw1CRdBc/view?usp=sharing" target="_blank">
            <amp-img src="https://d13ir53smqqeyp.cloudfront.net/d11-static-pages/images/d11_playstore.webp" width={156} height={50} layout="responsive" alt="Download Android App" className="i-amphtml-element i-amphtml-layout-responsive i-amphtml-layout-size-defined i-amphtml-layout" i-amphtml-layout="responsive"><i-amphtml-sizer slot="i-amphtml-svc" style={{paddingTop: '32.0513%'}} />
              <amp-img fallback src="https://d13ir53smqqeyp.cloudfront.net/d11-static-pages/images/d11_playstore.png" width={156} height={50} layout="responsive" alt="Download Android App" className="i-amphtml-element i-amphtml-layout-responsive i-amphtml-layout-size-defined" i-amphtml-layout="responsive"><i-amphtml-sizer slot="i-amphtml-svc" style={{paddingTop: '32.0513%'}} /></amp-img>
              <img decoding="async" alt="Download Android App" src="https://d13ir53smqqeyp.cloudfront.net/d11-static-pages/images/d11_playstore.webp" className="i-amphtml-fill-content i-amphtml-replaced-content" /></amp-img>
          </a>
        </li>
        <li >
          <a id="ios_button" href="https://ioair.link/9mybdk">
            <amp-img src="https://d13ir53smqqeyp.cloudfront.net/d11-static-pages/images/d11_appstore.webp" width={156} height={50} layout="responsive" alt="Download iOS app" className="i-amphtml-element i-amphtml-layout-responsive i-amphtml-layout-size-defined i-amphtml-layout" i-amphtml-layout="responsive"><i-amphtml-sizer slot="i-amphtml-svc" style={{paddingTop: '32.0513%'}} />
              <amp-img fallback src="https://d13ir53smqqeyp.cloudfront.net/d11-static-pages/images/d11_appstore.png" width={156} height={50} layout="responsive" alt="Download iOS app" className="i-amphtml-element i-amphtml-layout-responsive i-amphtml-layout-size-defined" i-amphtml-layout="responsive"><i-amphtml-sizer slot="i-amphtml-svc" style={{paddingTop: '32.0513%'}} /></amp-img>
              <img stye={{objectFit:"contain"}}decoding="async" alt="Download iOS app" src="https://d13ir53smqqeyp.cloudfront.net/d11-static-pages/images/d11_appstore.webp" className="i-amphtml-fill-content i-amphtml-replaced-content" /></amp-img>
          </a>
        </li>
      </ul>
        </section>
        <section className="aboutusboxes">
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <div className="headingbox">
                  <h2>About </h2>
                  <hr />
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-12 col-sm-12 col-md-7 col-lg-6">
                <div className="about-S-content">
                  <p>Winner007 allows millions of cricket fan to have their own selected team to play against the rest of the world. Its a “game of skill”. You have to move every steps smartly to be in THE TOP.</p>
                  <p>You just have to select the perfect players at right time knowing the pitch conditions, opponent team, their performance, availabilities, etc.. and one of the most important part is to select A Captain and Vice-Captain very smartly.</p>
                  <p>PlayStocks11 allows millions of cricket fan to have their own selected team to play against the rest of the world. Its a “game of skill”. You have to move every steps smartly to be in THE TOP.</p>
                  <p>You just have to select the perfect players at right time knowing the pitch conditions, opponent team, their performance, availabilities, etc.. and one of the most important part is to select A Captain and Vice-Captain very smartly.</p>
                </div>
              </div>
              <div className="col-12 col-sm-12 col-md-5 col-lg-6">
                <div className="play-stocks-img">
                  <img src={require("../../assets/img/aboutright.png")} alt="" />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
}
 
export default home;