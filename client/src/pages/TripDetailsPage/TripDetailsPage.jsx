import "./TripDetailsPage.scss";
import { Component } from "react";
import { Link } from "react-router-dom";
import axios from 'axios';

import NavBar from "../../components/NavBar/NavBar";

const baseUrl = 'http://localhost:5000/api';
const authToken = sessionStorage.getItem('authToken');

class TripDetailsPage extends Component {
    state = {
        isLoggedIn: false,
        isLoading: true,
        // userInfo: {},
        tripDetails: {}
    }

    handleAuthFail = () => {
        sessionStorage.removeItem('authToken');
        this.props.history.push(`/`);
    }

    // getUserInfo = (authToken) => {
    //     axios.get(`${baseUrl}/profile`, {
    //         headers: {
    //             authorization: `Bearer ${authToken}`
    //         }
    //     })
    //     .then(res => {
    //         this.setState({
    //             isLoggedIn: true,
    //             isLoading: false,
    //             userInfo: res.data
    //         });
    //     })
    //     .catch(() => this.handleAuthFail());
    // }

    getTripInfo = (tripId) => {
        axios.get(`${baseUrl}/trips/${tripId}`)
            .then(res => {
                this.setState({
                    isLoading: false,
                    tripDetails: res.data
                });
            })
            .catch((err) => console.log("Couldn't retrieve trip information", err));
    }

    setStatus = (tripId, value) => {
        axios.put(`${baseUrl}/trips/${tripId}`,
            {
                trip_status: value
            },
            {
                headers: {
                    authorization: `Bearer ${authToken}`
                }
            }
        )
            .then(() => {
                this.getTripInfo(tripId);
            })
            .catch((err) => console.log(err.response.data.message));

    }

    componentDidMount() {
        const authToken = sessionStorage.getItem('authToken');

        if (authToken) {
            this.setState({
                isLoggedIn: true
            })
        }

        this.getTripInfo(this.props.match.params.tripId);
    }

    render() {
        const { isLoggedIn, isLoading, tripDetails } = this.state;
        const { id,
            name,
            participants,
            emergency_contacts,
            departure_date,
            return_date,
            location,
            purpose,
            activities,
            supplies,
            add_info,
            comments,
            trip_status,
            updated_at } = tripDetails;

        // const toJson = (value) => {
        //     return JSON.parse(value);
        // }

        const dateToLocale = (date) => {
            if (!date) {
                return
            }
            const dateTime = new Date(date);
            return dateTime.toLocaleDateString();
        }

        const timeToLocale = (date) => {
            if (!date) {
                return
            }
            const dateTime = new Date(date);
            return dateTime.toLocaleTimeString();
        }

        const statusList = ['inactive', 'active', 'completed'];

        return (
            <>
                <NavBar />
                <main className="trip-details-page">
                    <section className="trip-details-page__header">
                        <h1 className="trip-details-page__title">Trip Details</h1>
                        {!isLoading && isLoggedIn &&
                            <>
                                <div>Mark as: {statusList.filter(status => status !== trip_status).map((status, index) => {
                                    return (
                                        <span key={index} onClick={() => this.setStatus(id, status)}> {status} </span>
                                    )
                                })}</div>
                                <div className="trip-details-page__buttons">
                                    <Link to={`/trips/${id}/edit`} className="trip-details-page__edit-link">
                                        Edit
                                    </Link>
                                    <button className="trip-details-page__delete">
                                        Delete
                                    </button>
                                </div>
                            </>
                        }
                    </section>

                    <article className="trip-details">
                        <div className="trip-details__info">
                            {/*  */}
                            {isLoading &&
                                <h2 className="trip-details__loading">Loading...</h2>
                            }

                            {/* Single Trip Component */}
                            {!isLoading &&
                                <>
                                    <div className="trip-details__header">
                                        <div className="trip-details__status">{trip_status}</div>
                                        <h3 className="trip-details__title">{name}</h3>
                                        <p className="trip-details__date">Last Updated: {dateToLocale(updated_at) + " " + timeToLocale(updated_at)}</p>
                                    </div>
                                    <div className="trip-details__part-one">
                                        <h4 className="trip-details__title">Participants</h4>
                                        <p className="trip-details__">{participants}</p>
                                    </div>
                                    <div className="trip-details__part-two">
                                        <h4 className="trip-details__title">Emergency Contacts</h4>
                                        <p className="trip-details__">{emergency_contacts}</p>
                                    </div>
                                    <div className="trip-details__part-three">
                                        <h4 className="trip-details__title">Departure Date</h4>
                                        <p className="trip-details__departure">{dateToLocale(departure_date)}</p>
                                        <p className="trip-details__departure">{timeToLocale(departure_date)}</p>
                                    </div>
                                    <div className="trip-details__part-four">
                                        <h4 className="trip-details__title">Return Date</h4>
                                        <p className="trip-details__return">{dateToLocale(return_date)}</p>
                                        <p className="trip-details__departure">{timeToLocale(return_date)}</p>
                                    </div>
                                    <div className="trip-details__part-five">
                                        <h4 className="trip-details__title">Location</h4>
                                        <p className="trip-details__location">{location}</p>
                                    </div>
                                    <div className="trip-details__part-six">
                                        <h4 className="trip-details__title">Purpose</h4>
                                        <p className="trip-details__purpose">{purpose}</p>
                                    </div>
                                    <div className="trip-details__part-seven">
                                        <h4 className="trip-details__title">Activities</h4>
                                        <p className="trip-details__activities">{activities}</p>
                                    </div>
                                    <div className="trip-details__part-eight">
                                        <h4 className="trip-details__title">Supplies</h4>
                                        <p className="trip-details__supplies">{supplies}</p>
                                    </div>
                                    <div className="trip-details__part-nine">
                                        <h4 className="trip-details__title">Additional Information</h4>
                                        <p className="trip-details__add-info">{add_info}</p>
                                    </div>
                                    <div className="trip-details__comments-list">
                                        <h4 className="trip-details__title">Comments</h4>
                                        <div className="trip-details__comments">
                                            {comments ? comments : "(no comments yet)"}
                                        </div>
                                    </div>
                                </>
                            }
                        </div>
                    </article>
                </main>
            </>
        )
    }
}

export default TripDetailsPage;