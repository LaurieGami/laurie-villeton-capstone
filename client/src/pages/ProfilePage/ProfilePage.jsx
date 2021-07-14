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

        const dateToLocale = (date) => {
            if (!date) {
                return
            }

            const isoDateTime = new Date(date);
            console.log(date);
            console.log(isoDateTime);
            return isoDateTime.toLocaleDateString() + " " + isoDateTime.toLocaleTimeString();
        }

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
                            <svg onClick={() => this.handleAuthFail()} className="profile-info__logout-icon" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
                                <path className="profile-info__logout-icon-path" id="Shape" d="m7.1,12.6l1.4,1.4l5,-5l-5,-5l-1.4,1.4l2.6,2.6l-9.7,0l0,2l9.7,0l-2.6,2.6l0,0zm8.9,-12.6l-14,0c-1.1,0 -2,0.9 -2,2l0,4l2,0l0,-4l14,0l0,14l-14,0l0,-4l-2,0l0,4c0,1.1 0.9,2 2,2l14,0c1.1,0 2,-0.9 2,-2l0,-14c0,-1.1 -0.9,-2 -2,-2l0,0z" />
                            </svg>
                        </div>
                    </section>
                    <p className="profile-info__email">{userInfo.email}</p>
                    <p className="profile-info__phone">{userInfo.phone}</p>
                </article>

                {/* Trips Info Component */}
                <article className="profile-trips">
                    <section className="profile-trips__header">
                        <h3 className="profile-trips__title">My Trips</h3>
                        <Link to="/trips/add" className="profile-trips__btn">Add New Trip</Link>
                    </section>

                    {/* TripList Component */}
                    <section className="trip-list">
                        {userTrips.map(trip => {
                            return (
                                <div key={trip.id} className="trip-list__item">
                                    <div className="trip-list__part-one">
                                        <h4 className="trip-list__title">Trip Name</h4>
                                        <Link to={`/trips/${trip.id}`} className="trip-list__link">
                                            <p className="trip-list__name">{trip.name}</p>
                                        </Link>
                                    </div>
                                    <div className="trip-list__part-two">
                                        <h4 className="trip-list__title">Departure Date</h4>
                                        <p className="trip-list__departure">{dateToLocale(trip.departure_date)}</p>
                                    </div>
                                    <div className="trip-list__part-three">
                                        <h4 className="trip-list__title">Return Date</h4>
                                        <p className="trip-list__return">{dateToLocale(trip.return_date)}</p>
                                    </div>
                                    <div className="trip-list__part-four">
                                        <h4 className="trip-list__title">Location</h4>
                                        <p className="trip-list__location">{trip.location}</p>
                                    </div>
                                    <div className="trip-list__buttons">
                                        <Link to={`/trips/${trip.id}/edit`} className="trip-list__edit-link">
                                            Edit
                                        </Link>
                                        <button className="trip-list__delete">
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            )
                        })}
                    </section>
                </article>
            </main>
        )
    }
}

export default ProfilePage;