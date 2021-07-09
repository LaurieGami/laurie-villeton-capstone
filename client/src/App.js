import './App.scss';

import { BrowserRouter, Switch, Route } from "react-router-dom";

import HomePage from './pages/HomePage/HomePage';
import ProfilePage from './pages/ProfilePage/ProfilePage';

function App() {
    return (
      <BrowserRouter>
        {/* <Header /> */}
        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route path="/profile" component={ProfilePage} />
        </Switch>
      </BrowserRouter>
    )
}

export default App;
