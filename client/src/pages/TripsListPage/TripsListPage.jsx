import "./TripsListPage.scss";
import { Component } from "react";
import { Link } from "react-router-dom";
import axios from 'axios';

import { dateToLocale } from '../../utils/date';

class TripsListPage extends Component {
    state = {
        isLoading: true,
        userTrips: [],
        selectedTrips: "",
        errorMessage: ''
    }

    // logOut = () => {
    //     sessionStorage.removeItem('authToken');
    //     this.props.setAuthToken('');
    //     this.props.history.push(`/`);
    // }

    getUserTrips = (authToken) => {
        axios
        .get(`/trips`, {
            headers: {
                authorization: `Bearer ${authToken}`
            }
        }).then(res => {
            this.setState({
                isLoading: false,
                selectedTrips: "all",
                userTrips: res.data
            });
        }).catch(err => {
            this.setState({
                errorMessage: err.response.data.message
            })
        });
    }

    deleteUserTrip = (tripId) => {
        axios
        .delete(`/trips/${tripId}`,
            {
                headers: {
                    authorization: `Bearer ${this.props.authToken}`
                }
            })
        .then(() => {
            this.getUserTrips(this.props.authToken);
        })
        .catch(err => {
            this.setState({
                errorMessage: err.response.data.message
            })
        });
    }

    filteredTrips = (filter) => {
        if (filter === "all") {
            return this.state.userTrips;
        } else {
            return this.state.userTrips.filter(trip => trip.trip_status === filter);
        }
    }

    componentDidMount() {
        this.getUserTrips(this.props.authToken);
    }

    render() {
        const { isLoading, selectedTrips, errorMessage } = this.state;

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
                            <h2>Loading...</h2>
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
                        {errorMessage &&
                            <div className="trips-list-page__error-message">
                                <svg className="trips-list-page__error-message-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path className="trips-list-page__error-message-icon-path" d="M1 21H23L12 2L1 21ZM13 18H11V16H13V18ZM13 14H11V10H13V14Z" fill="#191D21" />
                                </svg>
                                {errorMessage}
                            </div>
                        }
                    </section>
                </main>
            </>
        )
    }
}

export default TripsListPage;