import './App.scss';

import { BrowserRouter, Switch, Route } from "react-router-dom";

import HomePage from './pages/HomePage/HomePage';
import RegisterPage from './pages/RegisterPage/RegisterPage';
import LoginPage from './pages/LoginPage/LoginPage';
import ProfilePage from './pages/ProfilePage/ProfilePage';
import TripsListPage from './pages/TripsListPage/TripsListPage';
import TripDetailsPage from './pages/TripDetailsPage/TripDetailsPage';
import AddTripPage from './pages/AddTripPage/AddTripPage';

function App() {
    return (
      <BrowserRouter>
        {/* <Header /> */}
        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route path="/register" component={RegisterPage} />
          <Route path="/login" component={LoginPage} />
          <Route path="/profile" component={ProfilePage} />
          <Route exact path="/trips" component={TripsListPage} />
          <Route exact path="/trips/add" component={AddTripPage} />
          <Route path="/trips/:tripId" component={TripDetailsPage} />
        </Switch>
      </BrowserRouter>
    )
}

export default App;
