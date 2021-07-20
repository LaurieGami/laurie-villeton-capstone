import './App.scss';

import { BrowserRouter, Switch, Route } from "react-router-dom";
import { useState, useEffect } from 'react';

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
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authToken, setAuthToken] = useState(sessionStorage.getItem('authToken'));

  useEffect(() => {
      if (authToken) {
        setIsLoggedIn(true);
      }
    }, [authToken]);


  return (
    <BrowserRouter>
      <Header isLoggedIn={isLoggedIn}/>
      <Switch>
        <Route exact path="/" render={(props) => <HomePage isLoggedIn={isLoggedIn} {...props} />} />
        <Route path="/register" render={(props) => <RegisterPage isLoggedIn={isLoggedIn} setAuthToken={setAuthToken} {...props} />} />
        <Route path="/login" render={(props) => <LoginPage isLoggedIn={isLoggedIn} setAuthToken={setAuthToken} {...props} />} />
        <Route path="/profile" render={(props) => <ProfilePage authToken={authToken} setIsLoggedIn={setIsLoggedIn} {...props} />} />
        <Route exact path="/trips" render={(props) => <TripsListPage authToken={authToken} setIsLoggedIn={setIsLoggedIn} {...props} />} />
        <Route exact path="/trips/add" render={(props) => <AddTripPage authToken={authToken} {...props} />} />
        <Route exact path="/trips/:tripId" render={(props) => <TripDetailsPage isLoggedIn={isLoggedIn} {...props} />} />
        <Route exact path="/trips/:tripId/edit" render={(props) => <EditTripPage authToken={authToken} {...props} />} />
      </Switch>
    </BrowserRouter>
  )
}

export default App;
