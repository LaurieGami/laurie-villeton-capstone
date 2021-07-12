import './LoginPage.scss';

import { Component } from 'react';
import axios from 'axios';

import loginIllustration from '../../assets/images/login-page-illustration.png';

const baseUrl = 'http://localhost:5000/api';

class LoginPage extends Component {
    state = {
        isLoggedIn: false,
        errorMessage: ''
    }

    componentDidMount() {
        const authToken = sessionStorage.getItem('authToken');

        if (authToken) {
            this.setState({
                isLoggedIn: true
            }, () => this.props.history.push(`/profile`));
        }
    }

    login = e => {
        e.preventDefault();

        const { email, password } = e.target;

        axios.post(`${baseUrl}/login`, {
            email: email.value,
            password: password.value
        }).then(res => {
            sessionStorage.setItem('authToken', res.data.authToken);
            this.setState({
                isLoggedIn: true,
                errorMessage: '',
            }, () => this.props.history.push(`/profile`));
        }).catch((err) => {
            this.setState({
                errorMessage: err.response.data.message
            });
        });
    }

    render() {
        const { isLoggedIn, errorMessage } = this.state;

        return (
            <article className="login-page">
                {!isLoggedIn &&
                    <section className="login-page__info">
                        <section className="login-page__illustration">
                            <img className="login-page__img" src={loginIllustration} alt="Login Page Illustration" />
                        </section>
                        <h1 className="login-page__title">Login</h1>
                        <form className="login-form" onSubmit={(e) => this.login(e)}>
                            {/* Email */}
                            <input
                                className="login-form__input"
                                // className={
                                //     this.state.emergencyContactsIsValid === false
                                //         ? "form__input-invalid"
                                //         : "form__input-initial"
                                // }
                                type="text"
                                name="email"
                                placeholder="Email"
                                // onChange={this.handleChange}
                            // autoComplete="new-password"
                            // onBlur={this.validateEmergencyContacts}
                            ></input>
                            
                            {/* Password */}
                            <input
                                className="login-form__input"
                                // className={
                                //     this.state.emergencyContactsIsValid === false
                                //         ? "form__input-invalid"
                                //         : "form__input-initial"
                                // }
                                type="password"
                                name="password"
                                placeholder="Password"
                                // onChange={this.handleChange}
                            // autoComplete="new-password"
                            // onBlur={this.validateEmergencyContacts}
                            ></input>
                            {errorMessage && 
                                <div className="login-form__error-message">
                                    <svg className="login-form__error-message-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path className="login-form__error-message-icon-path" d="M1 21H23L12 2L1 21ZM13 18H11V16H13V18ZM13 14H11V10H13V14Z" fill="#191D21"/>
                                    </svg>
                                    {errorMessage}
                                </div>
                            }
                            <section className="login-form__buttons">
                                <button type="submit" className="login-form__btn">
                                    Login
                                    <svg className="login-form__btn-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path className="login-form__btn-icon-path" d="M12 4L10.59 5.41L16.17 11H4V13H16.17L10.59 18.59L12 20L20 12L12 4Z" fill="#191D21"/>
                                    </svg>
                                </button>
                            </section>
                        </form>
                    </section>
                }
                
            </article>
        )
    }
}

export default LoginPage;
