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
                <h1 className="profile-page__title">Your Profile</h1>
                {/* Profile Info Component */}
                <article className="profile-info">
                    <section className="profile-info__header">
                        <h2 className="profile-info__name">{userInfo.firstName} {userInfo.lastName}</h2>
                        <div className="profile-info__buttons">
                            <button className="profile-info__btn">Edit</button>
                            <button className="profile-info__btn" onClick={() => this.handleAuthFail()}>Logout</button>
                        </div>
                    </section>
                    <p className="profile-info__email">{userInfo.email}</p>
                    <p className="profile-info__phone">{userInfo.phone}</p>
                </article>

                {/* Trips Info Component */}
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