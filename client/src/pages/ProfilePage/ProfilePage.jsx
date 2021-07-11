import "./ProfilePage.scss";
import { Component } from "react";
import { Link } from "react-router-dom";
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
        const { isLoading, userInfo, userTrips } = this.state;

        if (isLoading) {
            <h1>Loading...</h1>
        }

        return (
            <main className="profile-page">
                {/* Profile Overview Component */}
                <article>
                    <h3>My Profile:</h3>
                    <p><strong>Name:</strong> {userInfo.firstName} {userInfo.lastName}</p>
                    <p><strong>Email:</strong> {userInfo.email}</p>
                    <p><strong>Phone: </strong>{userInfo.phone}</p>
                </article>
                <article>
                    <h3>My Trips:</h3>
                    <Link to="/trips/add">Add a trip</Link>
                    {/* TripList Component */}
                    {userTrips.map(trip => {
                        return (
                            <div key={trip.id}>
                                    <h4>{"Trip Name: "}
                                        <Link to={`/trips/${trip.id}`}>
                                            {trip.name}
                                        </Link>
                                    </h4>
                                    <p>Departure Date: {trip.departure_date}</p>
                                    <p>Return Date: {trip.return_date}</p>
                                    <p>Location: {trip.location}</p>
                                    <Link to={`/trips/${trip.id}/edit`}>Edit</Link>
                                    <button>Delete</button>
                            </div>
                        )
                    })}
                </article>
            </main>
        )
    }
}

export default ProfilePage;