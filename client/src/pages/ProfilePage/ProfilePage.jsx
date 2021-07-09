import "./ProfilePage.scss";
import { Component } from "react";
import axios from 'axios';
const baseUrl = 'http://localhost:5000/api';

class ProfilePage extends Component {
    state = {
        isLoading: true,
        userInfo: {},
        userTrips: []
    }

    handleAuthFail = () => {
        sessionStorage.removeItem('authToken');
        this.props.history.push(`/`);
    }

    getUserInfo = (authToken) => {
        axios.get(`${baseUrl}/profile`, {
            headers: {
                authorization: `Bearer ${authToken}`
            }
        }).then(res => {
            this.setState({
                isLoading: false,
                userInfo: res.data
            });
        }).catch(() => this.handleAuthFail());
    }

    getUserTrips = (authToken) => {
        axios.get(`${baseUrl}/trips`, {
            headers: {
                authorization: `Bearer ${authToken}`
            }
        }).then(res => {
            this.setState({
                isLoading: false,
                userTrips: res.data
            });
        }).catch(() => this.handleAuthFail());
    }

    componentDidMount() {
        const authToken = sessionStorage.getItem('authToken');

        this.getUserInfo(authToken);
        this.getUserTrips(authToken);
    }

    render() {
        const { isLoading, userInfo } = this.state;

        return (
            isLoading
                ? <h1>Loading...</h1>
                : <>
                    <h1>Hi, {userInfo.firstName}!</h1>
                    <h2>User Profile:</h2>
                    <p><strong>Name:</strong> {userInfo.firstName} {userInfo.lastName}</p>
                    <p><strong>Email:</strong> {userInfo.email}</p>
                    <p><strong>Phone: </strong>{userInfo.phone}</p>
                </>
        )
    }
}

export default ProfilePage;