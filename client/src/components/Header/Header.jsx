import "./Header.scss";

import { Link } from 'react-router-dom';

import NavBar from "../NavBar/NavBar";

import compassIcon from '../../assets/icons/compass-icon.svg';

function Header(props) {
    const { authToken } = props;

    return (
        <>
            <header className="header">
                <Link to="/" className="header__link">
                    <div className="header__logo">
                        <img className="header__logo-icon" src={compassIcon} alt="Compass Icon" />
                        <h2 className="header__logo-text">Smart Adventures</h2>
                    </div>
                </Link>
                {!!authToken &&
                    <NavBar />
                }
            </header>
        </>
    )
}

export default Header;