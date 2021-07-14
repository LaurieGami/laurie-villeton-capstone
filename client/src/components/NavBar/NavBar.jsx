import "./NavBar.scss";
import { NavLink } from 'react-router-dom';

import avatarIcon from '../../assets/icons/avatar-user-face.svg';
import locationIcon from '../../assets/icons/location-icon.svg';
// import settingsIcon from '../../assets/icons/settings.svg';

function NavBar() {
    return (
        <nav className="navbar">
            <NavLink to="/trips" className="navbar__link" activeClassName="navbar__link--active">
                <div className="navbar__icon-container">
                    <img src={locationIcon} alt="Location Icon" className="navbar__icon" />
                </div>
                <p className="navbar__text">Trips</p>
            </NavLink>
            <NavLink to="/profile" className="navbar__link" activeClassName="navbar__link--active">
                <div className="navbar__icon-container">
                    <img src={avatarIcon} alt="Avatar Icon" className="navbar__icon" />
                </div>
                <p className="navbar__text">Profile</p>
            </NavLink>
            {/* <NavLink to="/settings" className="navbar__link" activeClassName="navbar__link--active">
                <div className="navbar__icon-container">
                    <img src={settingsIcon} alt="Settings Icon" className="navbar__icon" />
                </div>
                <p className="navbar__text">Settings</p>
            </NavLink> */}
        </nav>
    )
}

export default NavBar;