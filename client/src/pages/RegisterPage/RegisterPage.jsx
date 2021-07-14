import './RegisterPage.scss';

import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

import loginIllustration from '../../assets/images/login-page-illustration.png';

const baseUrl = 'http://localhost:5000/api';

function RegisterPage() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    let history = useHistory();
    const authToken = sessionStorage.getItem('authToken');

    useEffect(() => {
        if (authToken) {
            setIsLoggedIn(true);
            return () => history.push(`/profile`);
        }
    }, [authToken, history]);

    const RegisterSchema = Yup.object().shape({
        firstName: Yup.string()
            .min(2, 'Too short')
            .max(50, 'Too long')
            .required('Required'),
        lastName: Yup.string()
            .min(2, 'Too short')
            .max(50, 'Too long')
            .required('Required'),
        email: Yup.string()
            .email('Invalid email')
            .required('Required'),
        phone: Yup.string()
            .matches(/^[0-9]{10}$/, 'Phone number must be 10 digits')
            .required('Required'),
        password: Yup.string()
            .min(8, 'Password must be at least 8 characters')
            .required('Required'),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref('password'), null], 'Passwords must match')
            .required('Required')
    });

    const register = (values) => {
        const {
            firstName,
            lastName,
            email,
            phone,
            password
        } = values;

        const formattedPhone = phone.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");

        console.log(firstName,
            lastName,
            email,
            formattedPhone);

        axios.post(`${baseUrl}/register`, {
            firstName: firstName,
            lastName: lastName,
            email: email,
            phone: formattedPhone,
            password: password
        }).then(res => {
            sessionStorage.setItem('authToken', res.data.authToken);
            setIsLoggedIn(true);
            history.push(`/profile`);
        }).catch((err) => {
            setErrorMessage(err.response.data.message);
        });
    };

    return (
        <article className="register-page">
            {!isLoggedIn &&
                <section className="register-page__info">
                    <section className="register-page__illustration">
                        <img className="register-page__img" src={loginIllustration} alt="Login Page Illustration" />
                    </section>
                    <h1 className="register-page__title">Register</h1>
                    <Formik
                        initialValues={{
                            firstName: '',
                            lastName: '',
                            email: '',
                            phone: '',
                            password: '',
                            confirmPassword: ''
                        }}
                        validationSchema={RegisterSchema}
                        onSubmit={values => {
                            register(values);
                        }}
                    >
                        {({ errors, touched }) => (
                            <Form className="register-form">
                                <Field name="firstName" placeholder="First Name" type="text" className="register-form__input" />
                                {errors.firstName && touched.firstName ? (
                                    <div className="register-form__warning-message">
                                        {errors.firstName}
                                    </div>
                                ) : null}

                                <Field name="lastName" placeholder="Last Name" type="text" className="register-form__input" />
                                {errors.lastName && touched.lastName ? (
                                    <div className="register-form__warning-message">
                                        {errors.lastName}
                                    </div>
                                ) : null}

                                <Field name="email" placeholder="Email" type="email" className="register-form__input" />
                                {errors.email && touched.email ? (
                                    <div className="register-form__warning-message">
                                        {errors.email}
                                    </div>
                                ) : null}

                                <Field name="phone" placeholder="Phone 10-digit" type="text" className="register-form__input" />
                                {errors.phone && touched.phone ? (
                                    <div className="register-form__warning-message">
                                        {errors.phone}
                                    </div>
                                ) : null}

                                <Field name="password" placeholder="Password" type="password" className="register-form__input" />
                                {errors.password && touched.password ? (
                                    <div className="register-form__warning-message">
                                        {errors.password}
                                    </div>
                                ) : null}

                                <Field name="confirmPassword" placeholder="Confirm Password" type="password" className="register-form__input" />
                                {errors.confirmPassword && touched.confirmPassword ? (
                                    <div className="register-form__warning-message">
                                        {errors.confirmPassword}
                                    </div>
                                ) : null}

                                {errorMessage &&
                                    <div className="register-form__error-message">
                                        <svg className="register-form__error-message-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path className="register-form__error-message-icon-path" d="M1 21H23L12 2L1 21ZM13 18H11V16H13V18ZM13 14H11V10H13V14Z" fill="#191D21" />
                                        </svg>
                                        {errorMessage}
                                    </div>
                                }

                                <section className="register-form__buttons">
                                    <button type="submit" className="register-form__btn">
                                        Register
                                        <svg className="register-form__btn-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path className="register-form__btn-icon-path" d="M12 4L10.59 5.41L16.17 11H4V13H16.17L10.59 18.59L12 20L20 12L12 4Z" fill="#191D21" />
                                        </svg>
                                    </button>
                                </section>
                            </Form>
                        )}
                    </Formik>
                </section>
            }
        </article>
    )
}

export default RegisterPage;