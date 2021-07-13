import './LoginPage.scss';

import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

import loginIllustration from '../../assets/images/login-page-illustration.png';

const baseUrl = 'http://localhost:5000/api';

function LoginPage() {
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

    const LoginSchema = Yup.object().shape({
        email: Yup.string()
            .email('Invalid email')
            .required('Required'),
        password: Yup.string()
            .required('Required')
    });

    const login = (values) => {
        const { email, password } = values;

        axios.post(`${baseUrl}/login`, {
            email: email,
            password: password
        }).then(res => {
            sessionStorage.setItem('authToken', res.data.authToken);
            setIsLoggedIn(true);
            history.push(`/profile`);
        }).catch((err) => {
            setErrorMessage(err.response.data.message);
        });
    }

    return (
        <article className="login-page">
            {!isLoggedIn &&
                <section className="login-page__info">
                    <section className="login-page__illustration">
                        <img className="login-page__img" src={loginIllustration} alt="Login Page Illustration" />
                    </section>
                    <h1 className="login-page__title">Login</h1>
                    <Formik
                        initialValues={{
                            email: '',
                            password: ''
                        }}
                        validationSchema={LoginSchema}
                        onSubmit={values => {
                            login(values);
                        }}
                    >
                        {({ errors, touched }) => (
                            <Form className="login-form">
                                <Field name="email" placeholder="Email" type="email" className="login-form__input" />
                                {errors.email && touched.email ? (
                                    <div className="login-form__warning-message">
                                        {errors.email}
                                    </div>
                                ) : null}

                                <Field name="password" placeholder="Password" type="password" className="login-form__input" />
                                {errors.password && touched.password ? (
                                    <div className="login-form__warning-message">
                                        {errors.password}
                                    </div>
                                ) : null}

                                {errorMessage &&
                                    <div className="login-form__error-message">
                                        <svg className="login-form__error-message-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path className="login-form__error-message-icon-path" d="M1 21H23L12 2L1 21ZM13 18H11V16H13V18ZM13 14H11V10H13V14Z" fill="#191D21" />
                                        </svg>
                                        {errorMessage}
                                    </div>
                                }

                                <section className="login-form__buttons">
                                    <button type="submit" className="login-form__btn">
                                        Login
                                        <svg className="login-form__btn-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path className="login-form__btn-icon-path" d="M12 4L10.59 5.41L16.17 11H4V13H16.17L10.59 18.59L12 20L20 12L12 4Z" fill="#191D21" />
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

export default LoginPage;
