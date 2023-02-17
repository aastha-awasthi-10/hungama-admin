import React, { Suspense, useState, useEffect } from 'react';
import * as router from 'react-router-dom';
import { Redirect, Route, Switch } from 'react-router-dom';
import { Container } from 'reactstrap';
import _, { trim } from 'lodash';
import apiUrl from '../../constants/apiPath';
import Helper from '../../constants/helper';
import {
  AppAside,
  AppBreadcrumb2 as AppBreadcrumb,
  AppFooter,
  AppHeader,
  AppSidebar,
  AppSidebarFooter,
  AppSidebarForm,
  AppSidebarHeader,
  AppSidebarMinimizer,
  AppAsideToggler,
  AppSidebarToggler,
  AppSidebarNav2 as AppSidebarNav,
} from '@coreui/react';
// sidebar nav config
import navLinks from '../../nav/_nav';
import fantasynav from '../../nav/fantasynav';
import adminNavLinks from '../../nav/adminnav';
// routes config
import routesAdmin from '../../routes/adminroutes';
import fantasyRoutes from '../../routes/fantasyroutes';
import Swal from 'sweetalert2';
import useSession from 'react-session-hook';
import { useAlert } from 'react-alert';

const DefaultAside = React.lazy(() => import('./DefaultAside'));
const DefaultFooter = React.lazy(() => import('./DefaultFooter'));
const DefaultHeader = React.lazy(() => import('./DefaultHeader'));

const DefaultLayout = (props) => {

  const session = useSession();
  const alert = useAlert();
  const [token] = useState(session.token);
  // const [localArr, setLocalArr] = useState([]);
  //const [changeviewvar, setChangeviewvar] = useState(localStorage.getItem('switchItem') == 'quiz'?"fantasy":"fantasy");
  // permissions
  // console.log(localStorage.getItem('switchItem'));

  
  

  const loading = () => <div className="animated fadeIn pt-1 text-center">Loading...</div>
  let n; let r; let rouetsIncluded; let navIncluded;

  var allModules = localStorage.getItem('modules');
  if (session.profile) {
    switch (session.profile.user_type) {
      case "root":
        n = adminNavLinks;
        r = routesAdmin;
        break;

      default:
        let all_nav_inks = navLinks.items;
        let all_routes = routesAdmin;
        n = { items: all_nav_inks };
        r = all_routes;

        //if(localStorage.getItem('switchItem') == 'fantasy'){
        n = fantasynav;
        r = fantasyRoutes;
      //}
    }
    
    if (session.profile.user_type === "editor") {
      const modules = session.profile.user_type === "editor" ? session.profile.permissions.map((e) => trim(e.manager)) : []
      r = session.profile.user_type === "editor" && r.filter((e) => {        
        return modules.includes(e.module) && e
      })
      n.items = session.profile.user_type === "editor" && n.items.filter((e) => {
        return modules.includes(e.name) && e
      })
      
    }
  }

  const signOut = (e) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You want to Logout",
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      reverseButtons: true
    }).then((result) => {
      if (result.value) {
        session.removeSession();
        localStorage.clear();
        alert.success("Successfully Logout");
        document.cookie = "token" + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      }
    })
  };

  if (!session.isAuthenticated) {
    let user_type = localStorage.getItem("user_type") || null;
    if (user_type) {
      localStorage.removeItem('user_type');
      document.cookie = "token" + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      return (
        <Redirect to={_.includes(['admin', 'editor'], user_type) ? "/login" : "/login"} />
      )
    } else {
      localStorage.removeItem('user_type');
      document.cookie = "token" + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      return (
        <Redirect to={window.location.pathname === "/login" ? "/login" : "/login"} />
      )
    }
  }

  
  
  // const getAdminData = async () => {
    
  //   session.removeSession();
  //   localStorage.clear();
  //   <Redirect to={window.location.pathname === "/admin" ? "/admin" : "/admin"} />
  // }





  if (session.isAuthenticated) {
    return (
      <div className="app">
        <AppHeader fixed>
          <Suspense fallback={loading()}>
            <DefaultHeader onLogout={signOut} />
          </Suspense>
        </AppHeader>
        <div className="app-body">
          <AppSidebar fixed display="lg">
            <AppSidebarHeader />
            <AppSidebarForm />
            <Suspense>
              <AppSidebarNav navConfig={n} {...props} router={router} />
            </Suspense>
            <AppSidebarFooter />
            <AppSidebarMinimizer/>
            {/* <AppSidebarToggler /> */}
          </AppSidebar>
          <main className="main">
            <AppBreadcrumb appRoutes={r} router={router} />
            <Container fluid>
              <Suspense fallback={loading()}>
                <Switch>
                  {r && r.map((route, idx) => {
                    return route.component ? (
                      // {route.Module}
                      <Route
                        key={idx}
                        path={route.path}
                        exact={route.exact || true}
                        name={route.name}
                        render={props => (
                          <route.component {...props} />
                        )} />
                    ) : (null);
                  })}
                  {console.log("localStorage.getItem('switchItem')",localStorage.getItem('switchItem'))}
                  {localStorage.getItem('switchItem') == 'quiz' || localStorage.getItem('switchItem') == null ? <Redirect from="/" to="/fantasy-dashboard" /> : <Redirect from="/" to="/fantasy-dashboard" />}

                  {/*{this.type === "root" ? <Redirect to="/dashboard" /> : <Redirect to="/login" />}*/}
                  {/*{this.type === "super_super_master" ? <Redirect to="/supermasters" /> : <Redirect to="/login" />}*/}
                  {/*{this.type === "super_master" ? <Redirect to="/masters" /> : <Redirect to="/login" />}*/}
                  {/*{this.type === "master" ? <Redirect to="/clients" /> : <Redirect to="/login" />}*/}
                  {/*<Redirect to="/cricket" /> : <Redirect to="/login" />*/}
                </Switch>
              </Suspense>
            </Container>
          </main>
          {/* <AppAside fixed>
            <Suspense fallback={loading()}>
              <DefaultAside />
            </Suspense>
          </AppAside> */}
        </div>
        <AppFooter>
          <Suspense fallback={loading()}>
            <DefaultFooter />
          </Suspense>
        </AppFooter>
      </div>
    );
  }


}
export default DefaultLayout;
