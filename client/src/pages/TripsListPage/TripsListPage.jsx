import "./TripsListPage.scss";
import { Component } from "react";
import { Link } from "react-router-dom";
import axios from 'axios';

import { dateToLocale } from '../../utils/date';

const baseUrl = 'http://localhost:5000/api';

class TripsListPage extends Component {
    state = {
        isLoading: true,
        userTrips: [],
        selectedTrips: ""
    }

    handleAuthFail = () => {
        sessionStorage.removeItem('authToken');
        this.props.history.push(`/`);
    }

    getUserTrips = (authToken) => {
        axios.get(`${baseUrl}/trips`, {
            headers: {
                authorization: `Bearer ${authToken}`
            }
        }).then(res => {
            this.setState({
                isLoading: false,
                selectedTrips: "all",
                userTrips: res.data
            });
        }).catch(() => this.handleAuthFail());
    }

    deleteUserTrip = (tripId) => {
        const authToken = sessionStorage.getItem('authToken');

        axios
            .delete(`${baseUrl}/trips/${tripId}`,
                {
                    headers: {
                        authorization: `Bearer ${authToken}`
                    }
                })
            .then(() => {
                this.getUserTrips(authToken);
            })
            .catch((err) => console.log("Oops", err));
    }

    filteredTrips = (filter) => {
        if (filter === "all") {
            return this.state.userTrips;
        } else {
            return this.state.userTrips.filter(trip => trip.trip_status === filter);
        }
    }

    componentDidMount() {
        const authToken = sessionStorage.getItem('authToken');

        this.getUserTrips(authToken);
    }

    render() {
        const { isLoading, selectedTrips } = this.state;

        return (
            <>
                <main className="trips-list-page">
                    {/* Trips Info Component */}
                    <section className="trips-list-page__header">
                        <h1 className="trips-list-page__title">My Trips</h1>
                        <Link to="/trips/add" className="trips-list-page__btn">Add New Trip</Link>
                    </section>
                    {!isLoading &&
                            <section className="trips-list-page__filter">
                                <button className="trips-list-page__filter-btn" onClick={() => this.setState({selectedTrips: "all"})}>All</button>
                                <button className="trips-list-page__filter-btn" onClick={() => this.setState({selectedTrips: "active"})}>Active</button>
                                <button className="trips-list-page__filter-btn" onClick={() => this.setState({selectedTrips: "completed"})}>Completed</button>
                                <button className="trips-list-page__filter-btn" onClick={() => this.setState({selectedTrips: "inactive"})}>Inactive</button>
                            </section>
                        }
                    {/* TripList Component */}
                    <section className="trip-list">
                        {isLoading &&
                            <h1>Loading...</h1>
                        }
                        {!isLoading &&
                            this.filteredTrips(selectedTrips)
                            .sort((a, b) => {
                                return new Date(a.departure_date) - new Date (b.departure_date);
                            })
                            .map(trip => {
                                return (
                                    <div key={trip.id} className="trip-list__item">
                                        <div className="trip-list__info">
                                            <div className="trip-list__header">
                                                <Link to={`/trips/${trip.id}`} className="trip-list__link">
                                                    <p className="trip-list__name">{trip.name}</p>
                                                </Link>
                                                <div className={`trip-list__status--${trip.trip_status}`}>{trip.trip_status}</div>
                                            </div>
                                            <div className="trip-list__section">
                                                <h4 className="trip-list__title">Departure Date</h4>
                                                <p className="trip-list__departure">{dateToLocale(trip.departure_date)}</p>
                                            </div>
                                            <div className="trip-list__section">
                                                <h4 className="trip-list__title">Return Date</h4>
                                                <p className="trip-list__return">{dateToLocale(trip.return_date)}</p>
                                            </div>
                                        </div>
                                        <div className="trip-list__buttons">
                                            <Link to={`/trips/${trip.id}/edit`} className="trip-list__edit-link">
                                                Edit
                                            </Link>
                                            <button className="trip-list__delete" onClick={() => this.deleteUserTrip(trip.id)}>
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </section>
                </main>
            </>
        )
    }
}

export default TripsListPage;