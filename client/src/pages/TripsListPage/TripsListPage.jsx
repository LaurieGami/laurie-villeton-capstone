import "./TripsListPage.scss";
import { Component } from "react";
import { Link } from "react-router-dom";
import axios from 'axios';

import NavBar from "../../components/NavBar/NavBar";

const baseUrl = 'http://localhost:5000/api';

class TripsListPage extends Component {
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
            const dateTime = new Date(date);
            // return dateTime.toLocaleDateString() + " " + dateTime.toLocaleTimeString();
            return dateTime.toLocaleDateString();
        }

        if (isLoading) {
            <h1>Loading...</h1>
        }

        return (
            <>
            <NavBar />
            <main className="trips-list-page">
                {/* Trips Info Component */}
                <section className="trips-list-page__header">
                    <h1 className="trips-list-page__title">My Trips</h1>
                    <Link to="/trips/add" className="trips-list-page__btn">Add New Trip</Link>
                </section>

                {/* TripList Component */}
                <section className="trip-list">
                    {userTrips.map(trip => {
                        return (
                            <div key={trip.id} className="trip-list__item">
                                <div className="trip-list__info">
                                    <div className="trip-list__part-one">
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
            </main>
            </>
        )
    }
}

export default TripsListPage;