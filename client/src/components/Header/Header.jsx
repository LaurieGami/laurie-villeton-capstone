import "./Header.scss";

import NavBar from "../NavBar/NavBar";

import compassIcon from '../../assets/icons/compass-icon.svg';

function Header(props) {
    const { isLoggedIn } = props;

    return (
        <>
            <header className="header">
                <div className="header__logo">
                    <img className="header__logo-icon" src={compassIcon} alt="Compass Icon" />
                    <h2 className="header__logo-text">Smart Adventures</h2>
                </div>
            </header>
            {isLoggedIn &&
                <NavBar />
            }
        </>
    )
}

export default Header;