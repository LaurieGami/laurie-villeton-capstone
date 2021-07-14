import "./AddTripPage.scss";
// import { Link } from "react-router-dom";

import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage, FieldArray } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
const baseUrl = 'http://localhost:5000/api';

function AddTripPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [userInfo, setUserInfo] = useState({});
    const [errorMessage, setErrorMessage] = useState('');

    let history = useHistory();
    const authToken = sessionStorage.getItem('authToken');

    useEffect(() => {
        if (!authToken) {
            handleAuthFail();
        }

        getUserInfo(authToken);
        setIsLoading(false);
    }, [authToken, history]);

    const handleAuthFail = () => {
        sessionStorage.removeItem('authToken');
        return history.push(`/`);
    }

    const getUserInfo = (authToken) => {
        axios.get(`${baseUrl}/profile`, {
            headers: {
                authorization: `Bearer ${authToken}`
            }
        })
            .then(res => {
                setIsLoading(false);
                setUserInfo(res.data);
            })
            .catch(() => handleAuthFail());
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
            .min(new Date(), 'Departure Date must be in the future'),
        return_date: Yup.date()
            .min(Yup.ref('departure_date'), 'Return Date must be later than Departure Date'),
        // activities: Yup.array()
        //     .min(1, 'Select at least 1 activity'),
        // supplies: Yup.array()
        //     .min(1, 'Select at least 1 supply'),
        add_info: Yup.string()
            .min(2, 'Additional Info must be at least 2 characters')
            .max(255, 'Additional Info not belonger than 255 characters')
    });

    const postTripInfo = (values) => {
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

        // Format date for MySQL Database
        const formatDate = (date) => {
            return new Date(date).toISOString().slice(0, 19).replace('T', ' ');
        };

        // Format phone number to 000-000-0000 for each object of an array for Database storage
        const formatPhone = (peopleArray) => {
            return peopleArray.map(person => {
                person['phone'] = person.phone.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
                return person;
            });
        };

        axios.post(`${baseUrl}/trips`,
            {
                name: name,
                participants: (participants ? formatPhone(participants) : [{ firstName: "", lastName: "", email: "", phone: "" }]),
                emergency_contacts: (emergency_contacts ? formatPhone(emergency_contacts) : [{ firstName: "", lastName: "", email: "", phone: "" }]),
                departure_date: (departure_date ? formatDate(departure_date) : ""),
                return_date: (return_date ? formatDate(return_date) : ""),
                location: location,
                purpose: purpose,
                activities: JSON.stringify(activities),
                supplies: JSON.stringify(supplies),
                add_info: add_info
            },
            {
                headers: {
                    authorization: `Bearer ${authToken}`
                }
            }
        )
        .then(res => {
            console.log(res);
        })
        .catch((err) => setErrorMessage(err.response.data.message));
    }

    return (
        <main className="profile-page">
            {isLoading &&
                <h1>Loading...</h1>
            }
            {/* User Profile if LoggedIn */}
            {!isLoading &&
                <>
                    <article>
                        <h3>Hi, {userInfo.firstName}</h3>
                    </article>
                </>
            }
            <h3 className="form__title">Let's add a trip!</h3>
            <Formik
                initialValues={{
                    name: "",
                    participants: [{ firstName: "", lastName: "", email: "", phone: "" }],
                    emergency_contacts: [{ firstName: "", lastName: "", email: "", phone: "" }],
                    departure_date: "",
                    return_date: "",
                    location: "",
                    purpose: "",
                    activities: [],
                    supplies: [],
                    add_info: ""
                }}
                validationSchema={AddTripSchema}
                onSubmit={values => {
                    postTripInfo(values);
                }}
            >
                {({ values, errors, touched }) => (
                    <Form className="add-add-trip-form">

                        <label htmlFor="name">Trip Name</label>
                        <Field name="name" placeholder="Name" type="text" className="add-trip-form__input" />
                        {errors.name && touched.name ? (
                            <div className="add-trip-form__warning-message">
                                {errors.name}
                            </div>
                        ) : null}

                        <FieldArray name="participants">
                            {({ remove, push }) => (
                                <div>
                                    {values.participants.length > 0 &&
                                        values.participants.map((participant, index) => (
                                            <div className="row" key={index}>
                                                <h4>{`Participant ${index + 1}`}</h4>
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
                                                        className="secondary"
                                                        onClick={() => remove(index)}
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    <button
                                        type="button"
                                        className="secondary"
                                        onClick={() => push({ firstName: "", lastName: "", email: "", phone: "" })}
                                    >
                                        Add Participant
                                    </button>
                                </div>
                            )}
                        </FieldArray>

                        <FieldArray name="emergency_contacts">
                            {({ remove, push }) => (
                                <div>
                                    {values.emergency_contacts.length > 0 &&
                                        values.emergency_contacts.map((emergency_contacts, index) => (
                                            <div className="row" key={index}>
                                                <h4>{`Emergency Contact ${index + 1}`}</h4>
                                                <div className="col">
                                                    <label htmlFor={`emergency_contacts.${index}.firstName`}>First Name</label>
                                                    <Field
                                                        name={`emergency_contacts.${index}.firstName`}
                                                        placeholder="First Name"
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
                                                    <label htmlFor={`emergency_contacts.${index}.lastName`}>Last Name</label>
                                                    <Field
                                                        name={`emergency_contacts.${index}.lastName`}
                                                        placeholder="Last Name"
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
                                                    <label htmlFor={`emergency_contacts.${index}.email`}>Email</label>
                                                    <Field
                                                        name={`emergency_contacts.${index}.email`}
                                                        placeholder="Email"
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
                                                    <label htmlFor={`emergency_contacts.${index}.phone`}>Phone</label>
                                                    <Field
                                                        name={`emergency_contacts.${index}.phone`}
                                                        placeholder="Phone"
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
                                                        className="secondary"
                                                        onClick={() => remove(index)}
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    <button
                                        type="button"
                                        className="secondary"
                                        onClick={() => push({ firstName: "", lastName: "", email: "", phone: "" })}
                                    >
                                        Add Emergency Contact
                                    </button>
                                </div>
                            )}
                        </FieldArray>

                        <label htmlFor="departure_date">Departure Date & Time</label>
                        <Field name="departure_date" type="datetime-local" className="add-trip-form__input" />
                        {errors.departure_date && touched.departure_date ? (
                            <div className="add-trip-form__warning-message">
                                {errors.departure_date}
                            </div>
                        ) : null}

                        <label htmlFor="return_date">Return Date & Time</label>
                        <Field name="return_date" type="datetime-local" className="add-trip-form__input" />
                        {errors.return_date && touched.return_date ? (
                            <div className="add-trip-form__warning-message">
                                {errors.return_date}
                            </div>
                        ) : null}

                        <label htmlFor="location">Location</label>
                        <Field name="location" placeholder="Location" type="text" className="add-trip-form__input" />
                        {errors.location && touched.location ? (
                            <div className="add-trip-form__warning-message">
                                {errors.location}
                            </div>
                        ) : null}

                        <label htmlFor="purpose">Purpose</label>
                        <Field name="purpose" placeholder="Purpose" type="text" className="add-trip-form__input" />
                        {errors.purpose && touched.purpose ? (
                            <div className="add-trip-form__warning-message">
                                {errors.purpose}
                            </div>
                        ) : null}

                        <div id="activities-group">Activities</div>
                        <div role="group" aria-labelledby="activities-group">
                            <label>
                                <Field type="checkbox" name="activities" value="Day Hike" />
                                Day Hike
                            </label>
                            <label>
                                <Field type="checkbox" name="activities" value="Overnight Hike" />
                                Overnight Hike
                            </label>
                            <label>
                                <Field type="checkbox" name="activities" value="Camping" />
                                Camping
                            </label>
                            <label>
                                <Field type="checkbox" name="activities" value="Mountain Biking" />
                                Mountain Biking
                            </label>
                            <label>
                                <Field type="checkbox" name="activities" value="Kayaking" />
                                Kayaking
                            </label>
                        </div>

                        <div id="supplies-group">Supplies</div>
                        <div role="group" aria-labelledby="supplies-group">
                            <label>
                                <Field type="checkbox" name="supplies" value="First Aid Kit" />
                                First Aid Kit
                            </label>
                            <label>
                                <Field type="checkbox" name="supplies" value="Flashlight" />
                                Flashlight
                            </label>
                            <label>
                                <Field type="checkbox" name="supplies" value="Map & Compass" />
                                Map & Compass
                            </label>
                            <label>
                                <Field type="checkbox" name="supplies" value="Firestarter" />
                                Firestarter
                            </label>
                            <label>
                                <Field type="checkbox" name="supplies" value="Food & Water" />
                                Food & Water
                            </label>
                        </div>

                        <label htmlFor="add_info">Additional Information</label>
                        <Field name="add_info" placeholder="Additional Information" type="text" className="add-trip-form__input" />
                        {errors.add_info && touched.add_info ? (
                            <div className="add-trip-form__warning-message">
                                {errors.add_info}
                            </div>
                        ) : null}

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
                                className="add-trip-form__btn add-trip-form__btn--add"
                                type="submit"
                            >
                                Add Trip
                            </button>
                        </section>
                    </Form>
                )}
            </Formik>
        </main>
    )
}

export default AddTripPage;