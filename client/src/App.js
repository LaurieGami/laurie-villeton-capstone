import './App.scss';

import { BrowserRouter, Switch, Route } from "react-router-dom";
import { useState } from 'react';

import Header from './components/Header/Header';
import HomePage from './pages/HomePage/HomePage';
import RegisterPage from './pages/RegisterPage/RegisterPage';
import LoginPage from './pages/LoginPage/LoginPage';
import ProfilePage from './pages/ProfilePage/ProfilePage';
import TripsListPage from './pages/TripsListPage/TripsListPage';
import TripDetailsPage from './pages/TripDetailsPage/TripDetailsPage';
import AddTripPage from './pages/AddTripPage/AddTripPage';
import EditTripPage from './pages/EditTripPage/EditTripPage';

function App() {
  const [authToken, setAuthToken] = useState(sessionStorage.getItem('authToken'));

  return (
    <BrowserRouter>
      <Header authToken={authToken} />
      <Switch>
        <Route exact path="/" render={(props) => <HomePage authToken={authToken} {...props} />} />
        <Route path="/register" render={(props) => <RegisterPage authToken={authToken} setAuthToken={setAuthToken} {...props} />} />
        <Route path="/login" render={(props) => <LoginPage authToken={authToken} setAuthToken={setAuthToken} {...props} />} />
        <Route path="/profile" render={(props) => <ProfilePage authToken={authToken} setAuthToken={setAuthToken} {...props} />} />
        <Route exact path="/trips" render={(props) => <TripsListPage authToken={authToken} setAuthToken={setAuthToken} {...props} />} />
        <Route exact path="/trips/add" render={(props) => <AddTripPage authToken={authToken} {...props} />} />
        <Route exact path="/trips/:tripId" render={(props) => <TripDetailsPage authToken={authToken} {...props} />} />
        <Route exact path="/trips/:tripId/edit" render={(props) => <EditTripPage authToken={authToken} {...props} />} />
      </Switch>
    </BrowserRouter>
  )
}

export default App;
