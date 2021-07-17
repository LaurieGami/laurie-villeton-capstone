import "./AddTripPage.scss";
// import { Link } from "react-router-dom";

import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage, FieldArray } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

import NavBar from "../../components/NavBar/NavBar";
import plusIcon from "../../assets/icons/add-more-plus.svg";

const baseUrl = 'http://localhost:5000/api';

function AddTripPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');

    let history = useHistory();

    useEffect(() => {
        setIsLoading(false);
    }, [history]);

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

    const postTripInfo = (values) => {
        const authToken = sessionStorage.getItem('authToken');

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
            add_info
        } = values;

        // Format date for MySQL Database YYYY-MM-DD HH:MM:SS
        const formatDate = (date) => {
            const aDate = date.replace('T', ' ');
            const newDate = aDate + ':00';
            return newDate;
        };

        axios.post(`${baseUrl}/trips`,
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
                add_info: add_info
            },
            {
                headers: {
                    authorization: `Bearer ${authToken}`
                }
            }
        )
            .then(() => {
                history.push('/trips');
            })
            .catch((err) => setErrorMessage(err.response.data.message));
    }

    return (
        <>
            <NavBar />
            <main className="add-trip-page">
                {isLoading &&
                    <h1>Loading...</h1>
                }
                <h1 className="add-trip-page__title">Let's start a new trip!</h1>
                <p className="add-trip-page__text">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ea, omnis molestias! Eaque quibusdam, suscipit iste sapiente ducimus, soluta aperiam culpa nihil aliquid hic ea sed quaerat consequuntur quod ratione itaque?</p>
                <Formik
                    initialValues={{
                        name: "",
                        participants: [{ firstName: "", lastName: "", email: "", phone: "" }],
                        emergency_contacts: [{ firstName: "", lastName: "", email: "", phone: "" }],
                        departure_date: "",
                        return_date: "",
                        location: "",
                        purpose: "",
                        activities: ['Day Hike', 'Overnight Hike', 'Camping', 'Kayaking'],
                        supplies: ['First Aid Kit', 'Flashlight', 'Map & Compass', 'Firestarter', 'Food & Water'],
                        add_info: ""
                    }}
                    validationSchema={AddTripSchema}
                    onSubmit={values => {
                        postTripInfo(values);
                    }}
                >
                    {({ values, initialValues, errors, touched }) => (
                        <Form className="add-trip-form">

                            <div className="add-trip-form__section">
                                <div className="add-trip-form__info">
                                    <div className="add-trip-form__section-item">
                                        <label className="add-trip-form__label" htmlFor="name">Trip Name</label>
                                        <Field name="name" placeholder="Trip Name" type="text" className="add-trip-form__input" />
                                        {errors.name && touched.name ? (
                                            <div className="add-trip-form__warning-message">
                                                {errors.name}
                                            </div>
                                        ) : null}
                                    </div>
                                </div>
                            </div>

                            <FieldArray name="participants">
                                {({ remove, push }) => (
                                    <div className="add-trip-form__section">
                                        <div className="add-trip-form__info">
                                            {values.participants.length > 0 &&
                                                values.participants.map((participant, index) => (
                                                    <div className="add-trip-form__section-item" key={index}>
                                                        <h4 className="add-trip-form__label">{`Participant ${index + 1}`}</h4>
                                                        <div className="col">
                                                            {/* <label htmlFor={`participants.${index}.firstName`}>First Name</label> */}
                                                            <Field
                                                                name={`participants.${index}.firstName`}
                                                                placeholder={`#${index + 1} Participant's First Name`}
                                                                type="text"
                                                                className="add-trip-form__input"
                                                            />
                                                            <ErrorMessage
                                                                name={`participants.${index}.firstName`}
                                                                component="div"
                                                                className="add-trip-form__warning-message"
                                                            />
                                                        </div>
                                                        <div className="col">
                                                            {/* <label htmlFor={`participants.${index}.lastName`}>Last Name</label> */}
                                                            <Field
                                                                name={`participants.${index}.lastName`}
                                                                placeholder={`#${index + 1} Participant's Last Name`}
                                                                type="text"
                                                                className="add-trip-form__input"
                                                            />
                                                            <ErrorMessage
                                                                name={`participants.${index}.lastName`}
                                                                component="div"
                                                                className="add-trip-form__warning-message"
                                                            />
                                                        </div>
                                                        <div className="col">
                                                            {/* <label htmlFor={`participants.${index}.email`}>Email</label> */}
                                                            <Field
                                                                name={`participants.${index}.email`}
                                                                placeholder={`#${index + 1} Participant's Email`}
                                                                type="email"
                                                                className="add-trip-form__input"
                                                            />
                                                            <ErrorMessage
                                                                name={`participants.${index}.email`}
                                                                component="div"
                                                                className="add-trip-form__warning-message"
                                                            />
                                                        </div>
                                                        <div className="col">
                                                            {/* <label htmlFor={`participants.${index}.phone`}>Phone</label> */}
                                                            <Field
                                                                name={`participants.${index}.phone`}
                                                                placeholder={`#${index + 1} Participant's Phone Number`}
                                                                type="text"
                                                                className="add-trip-form__input"
                                                            />
                                                            <ErrorMessage
                                                                name={`participants.${index}.phone`}
                                                                component="div"
                                                                className="add-trip-form__warning-message"
                                                            />
                                                        </div>
                                                        <div className="col">
                                                            <button
                                                                type="button"
                                                                className="add-trip-form__delete-btn"
                                                                onClick={() => remove(index)}
                                                            >
                                                                Delete
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                        </div>
                                        <div className="add-trip-form__section-buttons">
                                            <button
                                                type="button"
                                                className="add-trip-form__add-btn"
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
                                    <div className="add-trip-form__section">
                                        <div className="add-trip-form__info">
                                            {values.emergency_contacts.length > 0 &&
                                                values.emergency_contacts.map((emergency_contacts, index) => (
                                                    <div className="add-trip-form__section-item" key={index}>
                                                        <h4 className="add-trip-form__label">{`Emergency Contact ${index + 1}`}</h4>
                                                        <div className="col">
                                                            <Field
                                                                name={`emergency_contacts.${index}.firstName`}
                                                                placeholder={`#${index + 1} Emergency Contact's First Name`}
                                                                type="text"
                                                                className="add-trip-form__input"
                                                            />
                                                            <ErrorMessage
                                                                name={`emergency_contacts.${index}.firstName`}
                                                                component="div"
                                                                className="add-trip-form__warning-message"
                                                            />
                                                        </div>
                                                        <div className="col">
                                                            <Field
                                                                name={`emergency_contacts.${index}.lastName`}
                                                                placeholder={`#${index + 1} Emergency Contact's Last Name`}
                                                                type="text"
                                                                className="add-trip-form__input"
                                                            />
                                                            <ErrorMessage
                                                                name={`emergency_contacts.${index}.lastName`}
                                                                component="div"
                                                                className="add-trip-form__warning-message"
                                                            />
                                                        </div>
                                                        <div className="col">
                                                            <Field
                                                                name={`emergency_contacts.${index}.email`}
                                                                placeholder={`#${index + 1} Emergency Contact's Email`}
                                                                type="email"
                                                                className="add-trip-form__input"
                                                            />
                                                            <ErrorMessage
                                                                name={`emergency_contacts.${index}.email`}
                                                                component="div"
                                                                className="add-trip-form__warning-message"
                                                            />
                                                        </div>
                                                        <div className="col">
                                                            <Field
                                                                name={`emergency_contacts.${index}.phone`}
                                                                placeholder={`#${index + 1} Emergency Contact's Phone`}
                                                                type="text"
                                                                className="add-trip-form__input"
                                                            />
                                                            <ErrorMessage
                                                                name={`emergency_contacts.${index}.phone`}
                                                                component="div"
                                                                className="add-trip-form__warning-message"
                                                            />
                                                        </div>
                                                        <div className="col">
                                                            <button
                                                                type="button"
                                                                className="add-trip-form__delete-btn"
                                                                onClick={() => remove(index)}
                                                            >
                                                                Delete
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                        </div>
                                        <div className="add-trip-form__section-buttons">
                                            <button
                                                type="button"
                                                className="add-trip-form__add-btn"
                                                onClick={() => push({ firstName: "", lastName: "", email: "", phone: "" })}
                                            >
                                                <img src={plusIcon} alt="Plus Icon" />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </FieldArray>

                            <div className="add-trip-form__section">
                                <div className="add-trip-form__info">
                                    <div className="add-trip-form__section-item">
                                        <label className="add-trip-form__label" htmlFor="departure_date">Departure Date & Time</label>
                                        <Field name="departure_date" type="datetime-local" className="add-trip-form__input" />
                                        {errors.departure_date && touched.departure_date ? (
                                            <div className="add-trip-form__warning-message">
                                                {errors.departure_date}
                                            </div>
                                        ) : null}
                                    </div>
                                </div>
                            </div>

                            <div className="add-trip-form__section">
                                <div className="add-trip-form__info">
                                    <div className="add-trip-form__section-item">
                                        <label className="add-trip-form__label" htmlFor="return_date">Return Date & Time</label>
                                        <Field name="return_date" type="datetime-local" className="add-trip-form__input" />
                                        {errors.return_date && touched.return_date ? (
                                            <div className="add-trip-form__warning-message">
                                                {errors.return_date}
                                            </div>
                                        ) : null}
                                    </div>
                                </div>
                            </div>

                            <div className="add-trip-form__section">
                                <div className="add-trip-form__info">
                                    <div className="add-trip-form__section-item">
                                        <label className="add-trip-form__label" htmlFor="location">Location</label>
                                        <Field name="location" placeholder="Location" type="text" className="add-trip-form__input" />
                                        {errors.location && touched.location ? (
                                            <div className="add-trip-form__warning-message">
                                                {errors.location}
                                            </div>
                                        ) : null}
                                    </div>
                                </div>
                            </div>

                            <div className="add-trip-form__section">
                                <div className="add-trip-form__info">
                                    <div className="add-trip-form__section-item">
                                        <label className="add-trip-form__label" htmlFor="purpose">Purpose</label>
                                        <Field name="purpose" placeholder="Purpose" as="textarea" className="add-trip-form__textarea" />
                                        {errors.purpose && touched.purpose ? (
                                            <div className="add-trip-form__warning-message">
                                                {errors.purpose}
                                            </div>
                                        ) : null}
                                    </div>
                                </div>
                            </div>

                            <FieldArray name="activities">
                                {({ remove, push }) => (
                                    <div className="add-trip-form__section">
                                        <div className="add-trip-form__info">
                                            <div className="add-trip-form__section-item">
                                                <label className="add-trip-form__label" id="checkbox-group">Activities</label>
                                                <div className="add-trip-form__checkbox-group" role="group" aria-labelledby="checkbox-group">
                                                    {initialValues.activities.length > 0 &&
                                                        initialValues.activities.map((activity, index) => (
                                                            <label className="add-trip-form__checkbox-item" key={index}>
                                                                <Field
                                                                    className="add-trip-form__checkbox-check"
                                                                    name="activities"
                                                                    type="checkbox"
                                                                    value={activity}
                                                                    onChange={e => {
                                                                        if (e.target.checked) push(activity);
                                                                        else {
                                                                            const idx = values.activities.indexOf(activity);
                                                                            remove(idx);
                                                                        }
                                                                    }}
                                                                />
                                                                <span className="add-trip-form__checkbox-text">{activity}</span>
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
                                {({ remove, push }) => (
                                    <div className="add-trip-form__section">
                                        <div className="add-trip-form__info">
                                            <div className="add-trip-form__section-item">
                                                <label className="add-trip-form__label" id="checkbox-group">Supplies</label>
                                                <div className="add-trip-form__checkbox-group" role="group" aria-labelledby="checkbox-group">
                                                    {initialValues.supplies.length > 0 &&
                                                        initialValues.supplies.map((supply, index) => (
                                                            <label className="add-trip-form__checkbox-item" key={index}>
                                                                <Field
                                                                    className="add-trip-form__checkbox-check"
                                                                    name="supplies"
                                                                    type="checkbox"
                                                                    value={supply}
                                                                    onChange={e => {
                                                                        if (e.target.checked) push(supply);
                                                                        else {
                                                                            const idx = values.supplies.indexOf(supply);
                                                                            remove(idx);
                                                                        }
                                                                    }}
                                                                />
                                                                <span className="add-trip-form__checkbox-text">{supply}</span>
                                                            </label>
                                                        ))
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </FieldArray>

                            <div className="add-trip-form__section">
                                <div className="add-trip-form__info">
                                    <div className="add-trip-form__section-item">
                                        <label className="add-trip-form__label" htmlFor="add_info">Additional Information</label>
                                        <Field name="add_info" placeholder="Additional Information" as="textarea" className="add-trip-form__textarea" />
                                        {errors.add_info && touched.add_info ? (
                                            <div className="add-trip-form__warning-message">
                                                {errors.add_info}
                                            </div>
                                        ) : null}
                                    </div>
                                </div>
                            </div>

                            {errorMessage &&
                                <div className="add-trip-form__error-message">
                                    <svg className="add-trip-form__error-message-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path className="add-trip-form__error-message-icon-path" d="M1 21H23L12 2L1 21ZM13 18H11V16H13V18ZM13 14H11V10H13V14Z" fill="#191D21" />
                                    </svg>
                                    {errorMessage}
                                </div>
                            }

                            <section className="add-trip-form__buttons">
                                <button
                                    type="button"
                                    className="add-trip-form__btn add-trip-form__btn--cancel"
                                    onClick={() => history.goBack()}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="add-trip-form__btn add-trip-form__btn--save"
                                    type="submit"
                                >
                                    Save Trip
                                </button>
                            </section>
                        </Form>
                    )}
                </Formik>
            </main>
        </>
            )
}

            export default AddTripPage;