import "./TripDetailsPage.scss";
import { Component } from "react";
import { Link } from "react-router-dom";
// import { Formik, Form, Field, ErrorMessage, FieldArray } from 'formik';
// import * as Yup from 'yup';
import axios from 'axios';

import NavBar from "../../components/NavBar/NavBar";

const baseUrl = 'http://localhost:5000/api';

class TripDetailsPage extends Component {
    state = {
        isLoggedIn: false,
        isLoading: true,

        tripDetails: {
            id: null,
            name: null,
            participants: [],
            emergency_contacts: [],
            departure_date: null,
            return_date: null,
            location: null,
            purpose: null,
            activities: [],
            supplies: [],
            add_info: null,
            trip_status: "inactive",
            updated_at: null,
            comments: null
        }
    }

    handleAuthFail = () => {
        sessionStorage.removeItem('authToken');
        this.props.history.push(`/`);
    }

    getTripInfo = (tripId) => {
        axios.get(`${baseUrl}/trips/${tripId}`)
            .then(res => {
                this.setState({
                    isLoading: false,

                    tripDetails: {
                            id: res.data.id,
                            name: res.data.name,
                            participants: JSON.parse(res.data.participants),
                            emergency_contacts: JSON.parse(res.data.emergency_contacts),
                            departure_date: res.data.departure_date,
                            return_date: res.data.return_date,
                            location: res.data.location,
                            purpose: res.data.purpose,
                            activities: JSON.parse(res.data.activities),
                            supplies: JSON.parse(res.data.supplies),
                            add_info: res.data.add_info,
                            trip_status: res.data.trip_status,
                            updated_at: res.data.updated_at,
                            comments: res.data.comments
                        }
                });
            })
            .catch((err) => console.log("Couldn't retrieve trip information", err));
    }

    setStatus = (tripId, value) => {
        const authToken = sessionStorage.getItem('authToken');

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
            trip_status,
            updated_at,
            comments } = tripDetails;

        const dateToLocale = (date) => {
            // if (!date) {
            //     return
            // }
            const dateTime = new Date(date);
            return dateTime.toLocaleDateString();
        }

        const timeToLocale = (date) => {
            // if (!date) {
            //     return
            // }
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
                        {isLoggedIn &&
                            <Link to={`/trips/${id}/edit`} className="trip-details__edit-link">
                                Edit
                            </Link>
                        }
                        {!isLoading && isLoggedIn &&
                            <div className="trip-details__buttons">
                                <div className="trip-details__status">Mark as:
                                    {statusList.filter(status => status !== trip_status).map((status, index) => {
                                        return (
                                            <span
                                                key={index}
                                                onClick={() => this.setStatus(id, status)}
                                                className={`trip-details__status-${status}`}
                                            >
                                                {status}
                                            </span>
                                        )
                                    })
                                    }
                                </div>
                            </div>
                        }
                    </section>

                    <article className="trip-details">
                        {isLoading &&
                            // Loading
                            <h2 className="trip-details__loading">Loading...</h2>
                        }

                        {/* Single Trip Component */}
                        {!isLoading &&
                            <>
                                <div className="trip-details__info">
                                    <div className="trip-details__header">
                                        <div className="trip-details__status">{trip_status}</div>
                                        <h3 className="trip-details__title">{name}</h3>
                                        <p className="trip-details__date">Last Updated: {dateToLocale(updated_at) + " " + timeToLocale(updated_at)}</p>
                                        
                                    </div>
                                    <div className="trip-details__part-one">
                                        <h4 className="trip-details__title">Participants</h4>
                                        {participants.map((participant, index) => {
                                            return (
                                                <div className="trip-details__" key={index}>
                                                    <p>{participant.firstName}</p>
                                                    <p>{participant.lastName}</p>
                                                    <p>{participant.email}</p>
                                                    <p>{participant.phone}</p>
                                                </div>
                                            )
                                        })}
                                    </div>
                                    <div className="trip-details__part-two">
                                        <h4 className="trip-details__title">Emergency Contacts</h4>
                                        {emergency_contacts.map((emergency_contact, index) => {
                                            return (
                                                <div className="trip-details__" key={index}>
                                                    <p>{emergency_contact.firstName}</p>
                                                    <p>{emergency_contact.lastName}</p>
                                                    <p>{emergency_contact.email}</p>
                                                    <p>{emergency_contact.phone}</p>
                                                </div>
                                            )
                                        })}
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
                                        {activities.map((activity, index) => {
                                            return (
                                                <div className="trip-details__" key={index}>
                                                    {activity}
                                                </div>
                                            )
                                        })}
                                    </div>
                                    <div className="trip-details__part-eight">
                                        <h4 className="trip-details__title">Supplies</h4>
                                        {supplies.map((supply, index) => {
                                            return (
                                                <div className="trip-details__" key={index}>
                                                    {supply}
                                                </div>
                                            )
                                        })}
                                    </div>
                                    <div className="trip-details__part-nine">
                                        <h4 className="trip-details__title">Additional Information</h4>
                                        <p className="trip-details__add-info">{add_info}</p>
                                    </div>
                                    
                                </div>
                                <div className="trip-details__comments-list">
                                    <h4 className="trip-details__title">Comments</h4>
                                    <div className="trip-details__comments">
                                    {comments.map(comment => {
                                            return (
                                                <div className="trip-details__" key={comment.id}>
                                                    <p>{comment.username}</p>
                                                    <p>{comment.comment}</p>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            </>
                        }
                    </article>
                </main>
            </>
        )
    }
}

export default TripDetailsPage;