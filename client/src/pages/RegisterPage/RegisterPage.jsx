import './RegisterPage.scss';

import { Component } from 'react';
import axios from 'axios';

import loginIllustration from '../../assets/images/login-page-illustration.png';

const baseUrl = 'http://localhost:5000/api';

class RegisterPage extends Component {
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

    register = (e) => {
        e.preventDefault();

        const {
            firstName,
            lastName,
            email,
            phone,
            password
        } = e.target;

        axios.post(`${baseUrl}/register`, {
            firstName: firstName.value,
            lastName: lastName.value,
            email: email.value,
            phone: phone.value,
            password: password.value
        }).then(res => {
            sessionStorage.setItem('authToken', res.data.authToken);
            this.setState({
                isLoggedIn: true,
                errorMessage: ''
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
            <article className="register-page">
                {!isLoggedIn &&
                    <section className="register-page__info">
                        <section className="register-page__illustration">
                            <img className="register-page__img" src={loginIllustration} alt="Login Page Illustration" />
                        </section>
                        <h1 className="register-page__title">Register</h1>
                        <form className="register-form" onSubmit={(e) => this.register(e)}>
                            {/* First Name */}
                            <input
                                className="register-form__input"
                                // className={
                                //     this.state.emergencyContactsIsValid === false
                                //         ? "form__input-invalid"
                                //         : "form__input-initial"
                                // }
                                type="text"
                                name="firstName"
                                placeholder="First Name"
                                // onChange={this.handleChange}
                            // autoComplete="new-password"
                            // onBlur={this.validateEmergencyContacts}
                            ></input>

                            {/* Last Name */}
                            <input
                                className="register-form__input"
                                // className={
                                //     this.state.emergencyContactsIsValid === false
                                //         ? "form__input-invalid"
                                //         : "form__input-initial"
                                // }
                                type="text"
                                name="lastName"
                                placeholder="Last Name"
                                // onChange={this.handleChange}
                            // autoComplete="new-password"
                            // onBlur={this.validateEmergencyContacts}
                            ></input>

                            {/* Email */}
                            <input
                                className="register-form__input"
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

                            {/* Phone */}
                            <input
                                className="register-form__input"
                                // className={
                                //     this.state.emergencyContactsIsValid === false
                                //         ? "form__input-invalid"
                                //         : "form__input-initial"
                                // }
                                type="text"
                                name="phone"
                                placeholder="Phone"
                                // onChange={this.handleChange}
                            // autoComplete="new-password"
                            // onBlur={this.validateEmergencyContacts}
                            ></input>

                            {/* Password */}
                            <input
                                className="register-form__input"
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

                            {/* Confirm Password */}
                            <input
                                className="register-form__input"
                                // className={
                                //     this.state.emergencyContactsIsValid === false
                                //         ? "form__input-invalid"
                                //         : "form__input-initial"
                                // }
                                type="password"
                                name="confirmPassword"
                                placeholder="Confirm Password"
                                // onChange={this.handleChange}
                            // autoComplete="new-password"
                            // onBlur={this.validateEmergencyContacts}
                            ></input>

                            {errorMessage && 
                                <div className="register-form__error-message">
                                    <svg className="register-form__error-message-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path className="register-form__error-message-icon-path" d="M1 21H23L12 2L1 21ZM13 18H11V16H13V18ZM13 14H11V10H13V14Z" fill="#191D21"/>
                                    </svg>
                                    {errorMessage}
                                </div>
                            }
                            <section className="register-form__buttons">
                                <button type="submit" className="register-form__btn">
                                    Register
                                    <svg className="register-form__btn-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path className="register-form__btn-icon-path" d="M12 4L10.59 5.41L16.17 11H4V13H16.17L10.59 18.59L12 20L20 12L12 4Z" fill="#191D21"/>
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

export default RegisterPage;
