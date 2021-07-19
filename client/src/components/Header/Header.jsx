import "./Header.scss";

import { useState, useEffect } from 'react';

import NavBar from "../NavBar/NavBar";

import compassIcon from '../../assets/icons/compass-icon.svg';

function Header() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    
    // const authToken = sessionStorage.getItem('authToken');
    
    useEffect(() => {
        // if (authToken) {
            setIsLoggedIn(true);
        // }
    }, [isLoggedIn]);

    return (
        <>
            <header className="header">
                <div className="header__logo">
                    <img className="header__logo-icon" src={compassIcon} alt="Compass Icon" />
                    <h2 className="header__logo-text">Smart Adventures</h2>
                </div>
            </header>
            {!!isLoggedIn &&
                <NavBar />
            }
        </>
    )
}

export default Header;