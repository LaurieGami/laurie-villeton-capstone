import "./TripDetailsPage.scss";
import { Component } from "react";
import { Link } from "react-router-dom";
import { Formik, Form, Field } from 'formik';
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
            trip_status: null,
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

    postComment = (values) => {
        const {
            username,
            comment,
            trip_id
        } = values;

        axios.post(`${baseUrl}/comments/${trip_id}`,
            {
                username: username,
                comment: comment,
                trip_id: trip_id
            }
        )
        .then(() => {
            this.props.history.push(`/trips/${trip_id}`);
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

    componentDidUpdate(_prevProps, prevState) {
        if (this.state.tripDetails.comments !== prevState.tripDetails.comments) {
            this.getTripInfo(this.props.match.params.tripId);
        }
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
            // updated_at,
            comments } = tripDetails;

        const dateToLocale = (date) => {
            const dateTime = new Date(date);
            return dateTime.toLocaleDateString();
        }

        const timeToLocale = (date) => {
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
                            <Link to={`/trips/${id}/edit`} className="trip-details-page__btn">
                                Edit
                            </Link>
                        }
                        {!isLoading && isLoggedIn &&
                            <div className="trip-details-page__status">
                                <h3 className="trip-details-page__status-title">Mark as:</h3>
                                <div className="trip-details-page__status-buttons">
                                    {statusList.filter(status => status !== trip_status).map((status, index) => {
                                        return (
                                            <div
                                                key={index}
                                                onClick={() => this.setStatus(id, status)}
                                                className={`trip-details-page__status--${status}`}
                                            >
                                                {status}
                                            </div>
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

                                    <div className="trip-details__section">
                                        <div className="trip-details__header">
                                            <h3 className="trip-details__name">{name}</h3>
                                            <div className="trip-details__status-group">
                                                <div className={`trip-details__status--${trip_status}`}>{trip_status}</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="trip-details__section">
                                        <div className="trip-details__part-one">
                                            <h3 className="trip-details__title">Participants</h3>
                                            {participants.map((participant, index) => {
                                                return (
                                                    <div className="trip-details__" key={`participants-${index}`}>
                                                        <h4 className="trip-details__subtitle">Participant {index + 1}</h4>
                                                        <p>{participant.firstName}</p>
                                                        <p>{participant.lastName}</p>
                                                        <p>{participant.email}</p>
                                                        <p>{participant.phone}</p>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                    <div className="trip-details__section">
                                        <div className="trip-details__part-two">
                                            <h3 className="trip-details__title">Emergency Contacts</h3>
                                            {emergency_contacts.map((emergency_contact, index) => {
                                                return (
                                                    <div className="trip-details__" key={`emergency_contacts-${index}`}>
                                                        <p>{emergency_contact.firstName}</p>
                                                        <p>{emergency_contact.lastName}</p>
                                                        <p>{emergency_contact.email}</p>
                                                        <p>{emergency_contact.phone}</p>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                    <div className="trip-details__section">
                                        <div className="trip-details__part-three">
                                            <h3 className="trip-details__title">Departure Date</h3>
                                            <p className="trip-details__departure">{dateToLocale(departure_date)}</p>
                                            <p className="trip-details__departure">{timeToLocale(departure_date)}</p>
                                        </div>
                                    </div>
                                    <div className="trip-details__section">
                                        <div className="trip-details__part-four">
                                            <h3 className="trip-details__title">Return Date</h3>
                                            <p className="trip-details__return">{dateToLocale(return_date)}</p>
                                            <p className="trip-details__departure">{timeToLocale(return_date)}</p>
                                        </div>
                                    </div>
                                    <div className="trip-details__section">
                                        <div className="trip-details__part-five">
                                            <h3 className="trip-details__title">Location</h3>
                                            <p className="trip-details__location">{location}</p>
                                        </div>
                                    </div>
                                    <div className="trip-details__section">
                                        <div className="trip-details__part-six">
                                            <h3 className="trip-details__title">Purpose</h3>
                                            <p className="trip-details__purpose">{purpose}</p>
                                        </div>
                                    </div>
                                    <div className="trip-details__section">
                                        <div className="trip-details__part-seven">
                                            <h3 className="trip-details__title">Activities</h3>
                                            {activities.map((activity, index) => {
                                                return (
                                                    <div className="trip-details__" key={index}>
                                                        {activity}
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                    <div className="trip-details__section">
                                        <div className="trip-details__part-eight">
                                            <h3 className="trip-details__title">Supplies</h3>
                                            {supplies.map((supply, index) => {
                                                return (
                                                    <div className="trip-details__" key={index}>
                                                        {supply}
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                    <div className="trip-details__section">
                                        <div className="trip-details__part-nine">
                                            <h3 className="trip-details__title">Additional Information</h3>
                                            <p className="trip-details__add-info">{add_info}</p>
                                        </div>
                                    </div>
                                </div>
                                <section className="trip-comments">
                                    <h2 className="trip-comments__title">{comments.length} {comments.length > 1 ? "Comments" : "Comment"}</h2>
                                    <Formik
                                        initialValues={{
                                            username: "",
                                            comment: "",
                                            trip_id: id
                                        }}
                                        // validationSchema={AddTripSchema}
                                        onSubmit={(values, actions) => {
                                            this.postComment(values);
                                            actions.resetForm();
                                        }}
                                    >
                                        {({ values, errors, touched }) => (
                                            <Form className="trip-comments-form">
                                                
                                                <label className="trip-comments-form__label" htmlFor="username">Name</label>
                                                <Field name="username" placeholder="Enter your name" type="text" className="trip-comments-form__input" />
                                                {errors.username && touched.username ? (
                                                    <div className="trip-comments-form__warning-message">
                                                        {errors.username}
                                                    </div>
                                                ) : null}
                                            
                                                <label className="trip-comments-form__label" htmlFor="comment">Comment</label>
                                                <Field name="comment" placeholder="Add a new comment" as="textarea" className="trip-comments-form__textarea" />
                                                {errors.comment && touched.comment ? (
                                                    <div className="trip-comments-form__warning-message">
                                                        {errors.comment}
                                                    </div>
                                                ) : null}
                                                    
                                                <section className="trip-comments-form__buttons">
                                                    <button
                                                        className="trip-comments-form__btn"
                                                        type="submit"
                                                    >
                                                        Comment
                                                    </button>
                                                </section>
                                            </Form>
                                        )}
                                    </Formik>
                                </section>
                                {comments.length > 0 && 
                                    <section className="trip-comments-list">
                                        {comments.map(comment => {
                                            return (
                                                <div className="trip-details__" key={comment.id}>
                                                    <p>{comment.username}</p>
                                                    <p>{comment.comment}</p>
                                                    <p>{comment.posted_at}</p>
                                                </div>
                                            )
                                        })}
                                    </section>
                                }
                            </>
                        }
                    </article>
                </main>
            </>
        )
    }
}

export default TripDetailsPage;