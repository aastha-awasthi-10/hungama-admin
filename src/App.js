import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import './App.scss';
import { UseSessionProvider } from 'react-session-hook';
const loading = () => <div className="animated fadeIn pt-3 text-center">Loading...</div>;

// Containers
const DefaultLayout = React.lazy(() => import('./containers/DefaultLayout'));

// Pages
const Login = React.lazy(() => import('./views/Pages/Login'));
const Home = React.lazy(() => import('./views/Website/Home'));
const AdminLogin = React.lazy(() => import('./views/Pages/Login/AdminLogin'));
class App extends Component {

  render() {
    return (
      <BrowserRouter basename='/admin'>
        <React.Suspense fallback={loading()}>
          <Switch>
            <UseSessionProvider>
            {/* <Route exact path="/home" name="Home Page" render={props => <Home {...props} />} /> */}
            <Route path="/login" name="AdminLogin Page" render={props => <AdminLogin {...props} />} />
            <Route path="/" name="admin" render={props => <DefaultLayout {...props} />} />
            </UseSessionProvider>
          </Switch>
        </React.Suspense>
      </BrowserRouter>
    );
  }
}

export default App;
