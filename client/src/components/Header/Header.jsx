import "./Header.scss";
import { NavLink } from 'react-router-dom';

import compassIcon from '../../assets/icons/compass-icon.svg'

function Header() {
    return (
        <header className="header">
            <div className="header__logo">
                <img className="header__logo-icon" src={compassIcon} alt="Compass Icon" />
                <h2 className="header__logo-text">Smart Adventures</h2>
            </div>
        </header>
    )
}

export default Header;