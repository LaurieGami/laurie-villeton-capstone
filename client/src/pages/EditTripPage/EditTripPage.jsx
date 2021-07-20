import "./EditTripPage.scss";
// import { Link } from "react-router-dom";

import { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage, FieldArray } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

import plusIcon from "../../assets/icons/add-more-plus.svg";

const baseUrl = 'http://localhost:5000/api';

function EditTripPage(props) {
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const [tripDetails, setTripDetails] = useState({
            name: "",
            participants: [],
            emergency_contacts: [],
            departure_date: "",
            return_date: "",
            location: "",
            purpose: "",
            activities: [],
            supplies: [],
            add_info: "",
            trip_status: "",
    });

    let history = useHistory();
    let params = useParams();
    const { authToken } = props;

    useEffect(() => {
        getTripInfo(params.tripId)
    }, [params.tripId]);

    const getTripInfo = (tripId) => {
        const unformatDate = (date) => {
            const newDate = date.replace(':00.000Z', '');
            return newDate;
        };

        axios.get(`${baseUrl}/trips/${tripId}`)
            .then(res => {
                setIsLoading(false);
                setTripDetails(
                    {
                        id: res.data.id,
                        name: res.data.name,
                        participants: JSON.parse(res.data.participants),
                        emergency_contacts: JSON.parse(res.data.emergency_contacts),
                        departure_date: unformatDate(res.data.departure_date),
                        return_date: unformatDate(res.data.return_date),
                        location: res.data.location,
                        purpose: res.data.purpose,
                        activities: JSON.parse(res.data.activities),
                        supplies: JSON.parse(res.data.supplies),
                        add_info: res.data.add_info,
                        trip_status: res.data.trip_status,
                        updated_at: res.data.updated_at,
                        comments: res.data.comments
                    }
                );
            })
            .catch((err) => setErrorMessage(err.response.data.message));
    }

    const AddTripSchema = Yup.object().shape({
        name: Yup.string()
            .min(8, 'Trip Name must be at least 8 characters')
            .max(50, 'Trip Name must not belonger than 50 characters')
            .required('Required'),
        participants: Yup.array()
            .of(
                Yup.object().shape({
                    firstName: Yup.string().min(2, 'Too short').max(50, 'Too long'),
                    lastName: Yup.string().min(2, 'Too short').max(50, 'Too long'),
                    email: Yup.string().email('Invalid email'),
                    phone: Yup.string().matches(/^[0-9]{10}$/, 'Phone number must be 10 digits')
                })
            ),
        emergency_contacts: Yup.array()
            .of(
                Yup.object().shape({
                    firstName: Yup.string().min(2, 'Too short').max(50, 'Too long'),
                    lastName: Yup.string().min(2, 'Too short').max(50, 'Too long'),
                    email: Yup.string().email('Invalid email'),
                    phone: Yup.string().matches(/^[0-9]{10}$/, 'Phone number must be 10 digits')
                })
            ),
        departure_date: Yup.date()
            .min(new Date(), 'Departure Date must be in the future')
            .required('Required'),
        return_date: Yup.date()
            .min(Yup.ref('departure_date'), 'Return Date must be later than Departure Date')
            .required('Required'),
        add_info: Yup.string()
            .min(2, 'Additional Info must be at least 2 characters')
            .max(255, 'Additional Info not belonger than 255 characters')
    });

    const activitiesList = ['Day Hike', 'Overnight Hike', 'Camping', 'Kayaking'];
    const suppliesList = ['First Aid Kit', 'Flashlight', 'Map & Compass', 'Firestarter', 'Food & Water'];
    const statusList = ['inactive', 'active', 'completed'];

    const editTripInfo = (values, tripId) => {
        const {
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
            trip_status
        } = values;

        // Format date for MySQL Database YYYY-MM-DD HH:MM:SS
        const formatDate = (date) => {
            const aDate = date.replace('T', ' ');
            const newDate = aDate + ':00';
            return newDate;
        };

        axios.put(`${baseUrl}/trips/${tripId}`,
            {
                name: name,
                participants: participants,
                emergency_contacts: emergency_contacts,
                departure_date: (departure_date ? formatDate(departure_date) : ""),
                return_date: (return_date ? formatDate(return_date) : ""),
                location: location,
                purpose: purpose,
                activities: activities,
                supplies: supplies,
                add_info: add_info,
                trip_status: trip_status
            },
            {
                headers: {
                    authorization: `Bearer ${authToken}`
                }
            }
        )
            .then(() => {
                history.push(`/trips/${tripId}`);
            })
            .catch((err) => setErrorMessage(err.response.data.message));
    }

    return (
        <>
            <main className="edit-trip-page">
                {isLoading &&
                    <h2>Loading...</h2>
                }
                <h1 className="edit-trip-page__title">Edit your trip</h1>
                <p className="edit-trip-page__text">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ea, omnis molestias! Eaque quibusdam, suscipit iste sapiente ducimus, soluta aperiam culpa nihil aliquid hic ea sed quaerat consequuntur quod ratione itaque?</p>
                <Formik
                    initialValues={tripDetails}
                    enableReinitialize={true}
                    validationSchema={AddTripSchema}
                    onSubmit={values => {
                        editTripInfo(values, params.tripId);
                    }}
                >
                    {({ values, errors, touched }) => (
                        <Form className="edit-trip-form">

                            <div className="edit-trip-form__section">
                                <div className="edit-trip-form__info">
                                    <div className="edit-trip-form__section-item">
                                        <label className="edit-trip-form__label" htmlFor="name">Trip Name</label>
                                        <Field name="name" placeholder="Trip Name" type="text" className="edit-trip-form__input" />
                                        {errors.name && touched.name ? (
                                            <div className="edit-trip-form__warning-message">
                                                {errors.name}
                                            </div>
                                        ) : null}
                                    </div>
                                </div>
                            </div>

                            <div className="edit-trip-form__section">
                                <div className="edit-trip-form__info">
                                    <div className="edit-trip-form__section-item">
                                        <label className="edit-trip-form__label" htmlFor="trip_status">Trip Status</label>
                                        <Field name="trip_status" as="select" className="edit-trip-form__input">
                                            {statusList.map((status, index) => {
                                                return (
                                                <option key={index} value={status}>{status}</option>
                                                )
                                            })}
                                        </Field>
                                        {errors.trip_status && touched.trip_status ? (
                                            <div className="edit-trip-form__warning-message">
                                                {errors.trip_status}
                                            </div>
                                        ) : null}
                                    </div>
                                </div>
                            </div>

                            <FieldArray name="participants">
                                {({ remove, push }) => (
                                    <div className="edit-trip-form__section">
                                        <div className="edit-trip-form__info">
                                            {values.participants.length > 0 &&
                                                values.participants.map((participant, index) => (
                                                    <div className="edit-trip-form__section-item" key={index}>
                                                        <h4 className="edit-trip-form__label">{`Participant ${index + 1}`}</h4>
                                                        <div className="col">
                                                            {/* <label htmlFor={`participants.${index}.firstName`}>First Name</label> */}
                                                            <Field
                                                                name={`participants.${index}.firstName`}
                                                                placeholder={`#${index + 1} Participant's First Name`}
                                                                type="text"
                                                                className="edit-trip-form__input"
                                                            />
                                                            <ErrorMessage
                                                                name={`participants.${index}.firstName`}
                                                                component="div"
                                                                className="edit-trip-form__warning-message"
                                                            />
                                                        </div>
                                                        <div className="col">
                                                            {/* <label htmlFor={`participants.${index}.lastName`}>Last Name</label> */}
                                                            <Field
                                                                name={`participants.${index}.lastName`}
                                                                placeholder={`#${index + 1} Participant's Last Name`}
                                                                type="text"
                                                                className="edit-trip-form__input"
                                                            />
                                                            <ErrorMessage
                                                                name={`participants.${index}.lastName`}
                                                                component="div"
                                                                className="edit-trip-form__warning-message"
                                                            />
                                                        </div>
                                                        <div className="col">
                                                            {/* <label htmlFor={`participants.${index}.email`}>Email</label> */}
                                                            <Field
                                                                name={`participants.${index}.email`}
                                                                placeholder={`#${index + 1} Participant's Email`}
                                                                type="email"
                                                                className="edit-trip-form__input"
                                                            />
                                                            <ErrorMessage
                                                                name={`participants.${index}.email`}
                                                                component="div"
                                                                className="edit-trip-form__warning-message"
                                                            />
                                                        </div>
                                                        <div className="col">
                                                            {/* <label htmlFor={`participants.${index}.phone`}>Phone</label> */}
                                                            <Field
                                                                name={`participants.${index}.phone`}
                                                                placeholder={`#${index + 1} Participant's Phone Number`}
                                                                type="text"
                                                                className="edit-trip-form__input"
                                                            />
                                                            <ErrorMessage
                                                                name={`participants.${index}.phone`}
                                                                component="div"
                                                                className="edit-trip-form__warning-message"
                                                            />
                                                        </div>
                                                        <div className="col">
                                                            <button
                                                                type="button"
                                                                className="edit-trip-form__delete-btn"
                                                                onClick={() => remove(index)}
                                                            >
                                                                Delete
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                        </div>
                                        <div className="edit-trip-form__section-buttons">
                                            <button
                                                type="button"
                                                className="edit-trip-form__add-btn"
                                                onClick={() => push({ firstName: "", lastName: "", email: "", phone: "" })}
                                            >
                                                <img src={plusIcon} alt="Plus Icon" />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </FieldArray>

                            <FieldArray name="emergency_contacts">
                                {({ remove, push }) => (
                                    <div className="edit-trip-form__section">
                                        <div className="edit-trip-form__info">
                                            {values.emergency_contacts.length > 0 &&
                                                values.emergency_contacts.map((emergency_contacts, index) => (
                                                    <div className="edit-trip-form__section-item" key={index}>
                                                        <h4 className="edit-trip-form__label">{`Emergency Contact ${index + 1}`}</h4>
                                                        <div className="col">
                                                            <Field
                                                                name={`emergency_contacts.${index}.firstName`}
                                                                placeholder={`#${index + 1} Emergency Contact's First Name`}
                                                                type="text"
                                                                className="edit-trip-form__input"
                                                            />
                                                            <ErrorMessage
                                                                name={`emergency_contacts.${index}.firstName`}
                                                                component="div"
                                                                className="edit-trip-form__warning-message"
                                                            />
                                                        </div>
                                                        <div className="col">
                                                            <Field
                                                                name={`emergency_contacts.${index}.lastName`}
                                                                placeholder={`#${index + 1} Emergency Contact's Last Name`}
                                                                type="text"
                                                                className="edit-trip-form__input"
                                                            />
                                                            <ErrorMessage
                                                                name={`emergency_contacts.${index}.lastName`}
                                                                component="div"
                                                                className="edit-trip-form__warning-message"
                                                            />
                                                        </div>
                                                        <div className="col">
                                                            <Field
                                                                name={`emergency_contacts.${index}.email`}
                                                                placeholder={`#${index + 1} Emergency Contact's Email`}
                                                                type="email"
                                                                className="edit-trip-form__input"
                                                            />
                                                            <ErrorMessage
                                                                name={`emergency_contacts.${index}.email`}
                                                                component="div"
                                                                className="edit-trip-form__warning-message"
                                                            />
                                                        </div>
                                                        <div className="col">
                                                            <Field
                                                                name={`emergency_contacts.${index}.phone`}
                                                                placeholder={`#${index + 1} Emergency Contact's Phone`}
                                                                type="text"
                                                                className="edit-trip-form__input"
                                                            />
                                                            <ErrorMessage
                                                                name={`emergency_contacts.${index}.phone`}
                                                                component="div"
                                                                className="edit-trip-form__warning-message"
                                                            />
                                                        </div>
                                                        <div className="col">
                                                            <button
                                                                type="button"
                                                                className="edit-trip-form__delete-btn"
                                                                onClick={() => remove(index)}
                                                            >
                                                                Delete
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                        </div>
                                        <div className="edit-trip-form__section-buttons">
                                            <button
                                                type="button"
                                                className="edit-trip-form__add-btn"
                                                onClick={() => push({ firstName: "", lastName: "", email: "", phone: "" })}
                                            >
                                                <img src={plusIcon} alt="Plus Icon" />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </FieldArray>

                            <div className="edit-trip-form__section">
                                <div className="edit-trip-form__info">
                                    <div className="edit-trip-form__section-item">
                                        <label className="edit-trip-form__label" htmlFor="departure_date">Departure Date & Time</label>
                                        <Field name="departure_date" type="datetime-local" className="edit-trip-form__input" />
                                        {errors.departure_date && touched.departure_date ? (
                                            <div className="edit-trip-form__warning-message">
                                                {errors.departure_date}
                                            </div>
                                        ) : null}
                                    </div>
                                </div>
                            </div>

                            <div className="edit-trip-form__section">
                                <div className="edit-trip-form__info">
                                    <div className="edit-trip-form__section-item">
                                        <label className="edit-trip-form__label" htmlFor="return_date">Return Date & Time</label>
                                        <Field name="return_date" type="datetime-local" className="edit-trip-form__input" />
                                        {errors.return_date && touched.return_date ? (
                                            <div className="edit-trip-form__warning-message">
                                                {errors.return_date}
                                            </div>
                                        ) : null}
                                    </div>
                                </div>
                            </div>

                            <div className="edit-trip-form__section">
                                <div className="edit-trip-form__info">
                                    <div className="edit-trip-form__section-item">
                                        <label className="edit-trip-form__label" htmlFor="location">Location</label>
                                        <Field name="location" placeholder="Location" type="text" className="edit-trip-form__input" />
                                        {errors.location && touched.location ? (
                                            <div className="edit-trip-form__warning-message">
                                                {errors.location}
                                            </div>
                                        ) : null}
                                    </div>
                                </div>
                            </div>

                            <div className="edit-trip-form__section">
                                <div className="edit-trip-form__info">
                                    <div className="edit-trip-form__section-item">
                                        <label className="edit-trip-form__label" htmlFor="purpose">Purpose</label>
                                        <Field name="purpose" placeholder="Purpose" as="textarea" className="edit-trip-form__textarea" />
                                        {errors.purpose && touched.purpose ? (
                                            <div className="edit-trip-form__warning-message">
                                                {errors.purpose}
                                            </div>
                                        ) : null}
                                    </div>
                                </div>
                            </div>

                            <FieldArray name="activities">
                                {() => (
                                    <div className="edit-trip-form__section">
                                        <div className="edit-trip-form__info">
                                            <div className="edit-trip-form__section-item">
                                                <label className="edit-trip-form__label" id="checkbox-group">Activities</label>
                                                <div className="edit-trip-form__checkbox-group" role="group" aria-labelledby="checkbox-group">
                                                    {activitiesList.length > 0 &&
                                                        activitiesList.map((activity, index) => (
                                                            <label className="edit-trip-form__checkbox-item" key={index}>
                                                                <Field
                                                                    className="edit-trip-form__checkbox-check"
                                                                    name="activities"
                                                                    type="checkbox"
                                                                    value={activity}
                                                                />
                                                                <span className="edit-trip-form__checkbox-text">{activity}</span>
                                                            </label>
                                                        ))
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </FieldArray>

                            <FieldArray name="supplies">
                                {() => (
                                    <div className="edit-trip-form__section">
                                        <div className="edit-trip-form__info">
                                            <div className="edit-trip-form__section-item">
                                                <label className="edit-trip-form__label" id="checkbox-group">Supplies</label>
                                                <div className="edit-trip-form__checkbox-group" role="group" aria-labelledby="checkbox-group">
                                                    {suppliesList.length > 0 &&
                                                        suppliesList.map((supply, index) => (
                                                            <label className="edit-trip-form__checkbox-item" key={index}>
                                                                <Field
                                                                    className="edit-trip-form__checkbox-check"
                                                                    name="supplies"
                                                                    type="checkbox"
                                                                    value={supply}
                                                                />
                                                                <span className="edit-trip-form__checkbox-text">{supply}</span>
                                                            </label>
                                                        ))
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </FieldArray>

                            <div className="edit-trip-form__section">
                                <div className="edit-trip-form__info">
                                    <div className="edit-trip-form__section-item">
                                        <label className="edit-trip-form__label" htmlFor="add_info">Additional Information</label>
                                        <Field name="add_info" placeholder="Additional Information" as="textarea" className="edit-trip-form__textarea" />
                                        {errors.add_info && touched.add_info ? (
                                            <div className="edit-trip-form__warning-message">
                                                {errors.add_info}
                                            </div>
                                        ) : null}
                                    </div>
                                </div>
                            </div>

                            {errorMessage &&
                                <div className="edit-trip-form__error-message">
                                    <svg className="edit-trip-form__error-message-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path className="edit-trip-form__error-message-icon-path" d="M1 21H23L12 2L1 21ZM13 18H11V16H13V18ZM13 14H11V10H13V14Z" fill="#191D21" />
                                    </svg>
                                    {errorMessage}
                                </div>
                            }

                            <section className="edit-trip-form__buttons">
                                <button
                                    type="button"
                                    className="edit-trip-form__btn edit-trip-form__btn--cancel"
                                    onClick={() => history.goBack()}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="edit-trip-form__btn edit-trip-form__btn--save"
                                    type="submit"
                                >
                                    Edit Trip
                                </button>
                            </section>
                        </Form>
                    )}
                </Formik>
            </main>
        </>
    )
}

export default EditTripPage;