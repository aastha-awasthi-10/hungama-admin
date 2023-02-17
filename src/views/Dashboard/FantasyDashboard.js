import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardBody, CardHeader, Col, Row, } from 'reactstrap';
import Helper from '../../constants/helper';
import apiUrl from '../../constants/apiPath';
import Swal from 'sweetalert2';
import Loaders from '../CommanPage/Loader'
import useSession from "react-session-hook";
import { PieChart } from 'react-minimal-pie-chart';

const EarningGraph = React.lazy(() => import('./earningGraph'));


const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000
});

const FantasyDashboard = () => {
  const session = useSession();
  const [dashboard, setDashBoard] = useState({});
  const [visible, setVisibale] = useState(false);
  const [token] = useState(session.token);
  const [tab, setTab] = useState('week');

  const handleTabChange = (e) => {
    setTab(e.target.name);
  }

  const getData = async () => {
    setVisibale(true);
    let path = apiUrl.get_dashBoard_data;
    const fr = await Helper.get(path, token);
    const res = await fr.response.json();
    if (fr.status === 200) {
      if (res.success) {
        setDashBoard(res.results);
        setVisibale(false);
      } else {
        Toast.fire({
          type: "error",
          title: res.msg,
        });
        setVisibale(false);
      }
    } else {
      Toast.fire({
        type: "error",
        title: res.error,
      });
      setVisibale(false);
    }

  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="animated fadeIn loader-outer">
      <Loaders className="overlay-loader" visible={visible} />
      <Row>
        <div className="col-sm-6 col-md-3">
          <Link to={"/users"}>
            <div className="text-white dsboard_box1 card border-0 value_custome_card">
              <div className="card-body">
                <div className="h4 text-muted text-right mb-2"><i className="icon-people"></i></div>
                <div className="h1 mb-0">{dashboard.alldUser}</div>
                <small className="text-muted text-uppercase font-weight-bold">All Users</small>
                <div className="progress-xs mt-3 mb-0 progress-white progress">
                  <div className="progress-bar" role="progressbar" aria-valuenow="25" aria-valuemin="0"
                    aria-valuemax="100" style={{ width: '100%' }}>100</div>
                </div>
              </div>
            </div>
          </Link>
        </div>
        <div className="col-sm-6 col-md-3">
          
            <div className="text-white dsboard_box1 card border-0 value_custome_card">
              <div className="card-body">
                <div className="h4 text-muted text-right mb-2"><i className="icon-people"></i></div>
                <div className="h1 mb-0">{dashboard.unverifiedUser}</div>
                <small className="text-muted text-uppercase font-weight-bold">Unverified Users</small>
                <div className="progress-xs mt-3 mb-0 progress-white progress">
                  <div className="progress-bar" role="progressbar" aria-valuenow="25" aria-valuemin="0"
                    aria-valuemax="100" style={{ width: '100%' }}>10</div>
                </div>
              </div>
            </div>
         
        </div>
        <div className="col-sm-6 col-md-3">
          <Link to={"/users"}>
            <div className="text-white dsboard_box1 card border-0 value_custome_card">
              <div className="card-body">
                <div className="h4 text-muted text-right mb-2"><i className="icon-people"></i></div>
                <div className="h1 mb-0">{dashboard.todayUser}</div>
                <small className=" text-muted text-uppercase font-weight-bold">Today's Registration</small>
                <div className="progress-xs mt-3 mb-0 progress-white progress">
                  <div className="progress-bar" role="progressbar" aria-valuenow="25" aria-valuemin="0"
                    aria-valuemax="100" style={{ width: '100%' }}>15</div>
                </div>
              </div>
            </div>
          </Link>
        </div>
     
        <div className="col-sm-6 col-md-3">
          <Link to={"/withdarwals"}>
            <div className="text-white dsboard_box2 card border-0 value_custome_card">
              <div className="card-body">
                <div className="h4 text-muted text-right mb-2"><i className="icon-notebook"></i></div>
                <div className="h1 mb-0">{dashboard.pendingWithdarw}</div>
                <small className="text-muted text-uppercase font-weight-bold">Total Pending Withdraw</small>
                <div className="progress-xs mt-3 mb-0 progress-white progress">
                  <div className="progress-bar" role="progressbar" aria-valuenow="25" aria-valuemin="0"
                    aria-valuemax="100" style={{ width: '100%' }}></div>
                </div>
              </div>
            </div>
          </Link>
        </div>
        <div className="col-sm-6 col-md-3">
          <Link to={"/withdarwals"}>
            <div className="text-white dsboard_box2 card border-0 value_custome_card">
              <div className="card-body">
                <div className="h4 text-muted text-right mb-2"><i className="icon-notebook"></i></div>
                <div className="h1 mb-0">{dashboard.TodayWithdarw}</div>
                <small className="text-muted text-uppercase font-weight-bold">Today Withdraws</small>
                <div className="progress-xs mt-3 mb-0 progress-white progress">
                  <div className="progress-bar" role="progressbar" aria-valuenow="25" aria-valuemin="0"
                    aria-valuemax="100" style={{ width: '100%' }}></div>
                </div>
              </div>
            </div>
          </Link>
        </div>
        <div className="col-sm-6 col-md-3">
          <Link to={"/withdarwals"}>
            <div className="text-white dsboard_box2 card border-0 value_custome_card">
              <div className="card-body">
                <div className="h4 text-muted text-right mb-2"><i className="icon-notebook"></i></div>
                <div className="h1 mb-0">{dashboard.monthWithdarwAmount} / {dashboard.monthWithdarw}</div>
                <small className="text-muted text-uppercase font-weight-bold">Current Month Withdraws (Amount / Request)</small>
                <div className="progress-xs mt-3 mb-0 progress-white progress">
                  <div className="progress-bar" role="progressbar" aria-valuenow="25" aria-valuemin="0"
                    aria-valuemax="100" style={{ width: '100%' }}></div>
                </div>
              </div>
            </div>
          </Link>
        </div>
        <div className="col-sm-6 col-md-3">
          <Link to={"/statements"}>
            <div className="text-white dsboard_box2 card border-0 value_custome_card">
              <div className="card-body">
                <div className="h4 text-muted text-right mb-2"><i className="icon-notebook"></i></div>
                <div className="h1 mb-0">{dashboard.monthDepositAmount} / {dashboard.monthDepositCount} </div>
                <small className="text-muted text-uppercase font-weight-bold">Current Month Deposit (Amount / Request)</small>
                <div className="progress-xs mt-3 mb-0 progress-white progress">
                  <div className="progress-bar" role="progressbar" aria-valuenow="25" aria-valuemin="0"
                    aria-valuemax="100" style={{ width: '100%' }}></div>
                </div>
              </div>
            </div>
          </Link>
        </div>
       
        <div className="col-sm-6 col-md-3">
          <Link to={"/cricket/contests"}>
            <div className="text-white dsboard_box4 card border-0 value_custome_card">
              <div className="card-body">
                <div className="h4 text-muted text-right mb-2"><i className="icon-tag"></i></div>
                <div className="h1 mb-0">{dashboard.fantasy_active_contests}</div>
                <small className="text-muted text-uppercase font-weight-bold">Active Fantasy Contest</small>
                <div className="progress-xs mt-3 mb-0 progress-white progress">
                  <div className="progress-bar" role="progressbar" aria-valuenow="25" aria-valuemin="0"
                    aria-valuemax="100" style={{ width: '100%' }}></div>
                </div>
              </div>
            </div>
          </Link>
        </div>
        <div className="col-sm-6 col-md-3">
          <Link to={"/cricket/contests"}>
            <div className="text-white dsboard_box4 card border-0 value_custome_card">
              <div className="card-body">
                <div className="h4 text-muted text-right mb-2"><i className="icon-tag"></i></div>
                <div className="h1 mb-0">{dashboard.fantasy_todays_joined_contest > 0 ? dashboard.fantasy_todays_joined_contest : 0}</div>
                <small className="text-muted text-uppercase font-weight-bold">Fantasy Total Joined Contest</small>
                <div className="progress-xs mt-3 mb-0 progress-white progress">
                  <div className="progress-bar" role="progressbar" aria-valuenow="25" aria-valuemin="0"
                    aria-valuemax="100" style={{ width: '100%' }}></div>
                </div>
              </div>
            </div>
          </Link>
        </div>
      
        <div className="col-sm-6 col-md-3">
          <Link to={"/earning"}>
            <div className="text-white dsboard_box5 card border-0 value_custome_card">
              <div className="card-body">
                <div className="h4 text-muted text-right mb-2"><i className="icon-calculator"></i></div>
                <div className="h1 mb-0">{dashboard.TotalEarning}</div>
                <small className="text-muted text-uppercase font-weight-bold">Admin Total Profit</small>
                <div className="progress-xs mt-3 mb-0 progress-white progress">
                  <div className="progress-bar" role="progressbar" aria-valuenow="25" aria-valuemin="0"
                    aria-valuemax="100" style={{ width: '100%' }}></div>
                </div>
              </div>
            </div>
          </Link>
        </div>
     
        <Col md={12}>
          <Card>
            <CardBody>
              <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <Link to='#' className="navbar-brand">Earning Graph</Link>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                  <ul className="navbar-nav mr-auto">
                    <li className="nav-item">
                      <Link to='#' name="week" onClick={handleTabChange} className={tab == 'week' ? 'nav-link ' + tab : 'nav-link'}
                      >Weekly</Link>
                    </li>
                    <li className="nav-item">
                      <Link to='#' name="month" onClick={handleTabChange} className={tab == 'month' ? 'nav-link ' + tab : 'nav-link'}>Monthly</Link>
                    </li>
                    <li className="nav-item">
                      <Link to='#' name="year" onClick={handleTabChange} className={tab == 'year' ? 'nav-link ' + tab : 'nav-link'}>Yearly</Link>
                    </li>
                  </ul>
                </div>
              </nav> <br />
              {tab === 'week' ? (
                <EarningGraph value={'week'} />
              ) : null}
              {tab === 'month' ? (
                <EarningGraph value={'month'} />
              ) : null}
              {tab === 'year' ? (
                <EarningGraph value={'year'} />
              ) : null}
            </CardBody>
          </Card>
        </Col>
      </Row>
      {/* <Row>
        <div className="col-sm-6 col-md-3">
          <PieChart
            animation
            animationDuration={500}
            animationEasing="ease-out"
            center={[50, 50]}
            labelPosition={50}
            lengthAngle={360}
            lineWidth={15}
            paddingAngle={0}
            radius={50}
            rounded
            startAngle={0}
            viewBoxSize={[100, 100]}
            data={[
              {
                color: "#E38627",
                title: "One",
                value: 10,
              },
              {
                color: "#C13C37",
                title: "Two",
                value: 15,
              },
              {
                color: "#6A2135",
                title: "Three",
                value: 20,
              },
            ]}
          />;
        </div>
      </Row> */}
    </div>
  );
};

export default FantasyDashboard;
