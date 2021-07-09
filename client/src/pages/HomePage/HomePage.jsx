import './HomePage.scss';

import { Component } from 'react';
import axios from 'axios';

const baseUrl = 'http://localhost:5000/api';

class HomePage extends Component {
    state = {
        isLoggedIn: false,
        activePage: null,
        errorMessage: ''
    }

    componentDidMount() {
        const authToken = sessionStorage.getItem('authToken');

        if (authToken) {
            this.setState({
                isLoggedIn: true
            });
        }
    }

    login = (e) => {
        e.preventDefault();

        const { email, password } = e.target;

        axios.post(`${baseUrl}/login`, {
            email: email.value,
            password: password.value
        }).then(res => {
            sessionStorage.setItem('authToken', res.data.authToken);
            this.setState({
                isLoggedIn: true,
                errorMessage: ''
            });
        }).catch((err) => {
            this.setState({
                errorMessage: err.response.data.message
            });
        });
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
            });
        }).catch((err) => {
            this.setState({
                errorMessage: err.response.data.message
            });
        });
    }

    renderRegister() {
        return (
            <div>
                <h1>Register</h1>
                <form onSubmit={this.register}>
                    <div className='form-group'>
                        *First Name: <input type='text' name='firstName' />
                    </div>
                    <div className='form-group'>
                        *Last Name: <input type='text' name='lastName' />
                    </div>
                    <div className='form-group'>
                        *Email: <input type='text' name='email' />
                    </div>
                    <div className='form-group'>
                        *Phone: <input type='text' name='phone' />
                    </div>
                    <div className='form-group'>
                        *Password: <input type='password' name='password' />
                    </div>
                    <button type="submit" className='btn btn-primary'>
                        Signup
                    </button>
                </form>
            </div>
        )
    }

    renderLogin = () => {
        return (
            <div>
                <h1>Login</h1>
                <form onSubmit={this.login}>
                    <div className='form-group'>
                        Email: <input type='text' name='email' />
                    </div>
                    <div className='form-group'>
                        Password: <input type='password' name='password' />
                    </div>
                    <button type="submit" className='btn btn-primary'>
                        Login
                    </button>
                </form>
            </div>
        )
    }

    render() {
        const { isLoggedIn, activePage, errorMessage } = this.state;

        return (
            <div className='HomePage'>
                {!isLoggedIn && !activePage &&
                    <div className="auth-container">
                        <button onClick={() => this.setState({ activePage: "login" })}>Login</button>
                        <button onClick={() => this.setState({ activePage: "register" })}>Register</button>
                    </div>}

                {!isLoggedIn && !!activePage &&
                    <div className="auth-container">
                        {activePage === "login" ? this.renderLogin() : this.renderRegister()}
                        {errorMessage && <label className="error-message">{errorMessage}</label>}
                    </div>}

                {!!isLoggedIn && this.props.history.push(`/profile`)}
            </div>
        )
    }
}

export default HomePage;
