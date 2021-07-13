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
    // const [name, setName] = useState("");
    // const [participants, setParticipants] = useState([{ firstName: "", lastName: "", email: "", phone: "" }]);
    // const [emergency_contacts, setEmergencyContacts] = useState([{ firstName: "", lastName: "", email: "", phone: "" }]);
    // const [departure_date, setDepartureDate] = useState("");
    // const [return_date, setReturnDate] = useState("");
    // const [location, setLocation] = useState("");
    // const [purpose, setPurpose] = useState("");
    // const [activities, setActivities] = useState([]);
    // const [supplies, setSupplies] = useState([]);
    // const [add_info, setAddInfo] = useState("");

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


    // const handleParticipantsChange = (event) => {
    //     const updatedParticipants = [...participants];
    //     updatedParticipants[event.target.dataset.index][event.target.className] = event.target.value;
    //     setParticipants(updatedParticipants);
    // };


    // const addParticipant = () => {
    //     setParticipants([...participants, { firstName: "", lastName: "", email: "", phone: "" }]);
    // }

    // const removeParticipant = index => {
    //     const updatedParticipants = [...participants];
    //     updatedParticipants.splice(index, 1);
    //     setParticipants(updatedParticipants);
    // };

    const AddTripSchema = Yup.object().shape({
        email: Yup.string()
            .email('Invalid email')
            .required('Required'),
        password: Yup.string()
            .required('Required')
    });

    const postTripInfo = () => {
        console.log('Axios call to post a new trip')
        // axios.post(`${baseUrl}/trips`, {
        //     headers: {
        //         authorization: `Bearer ${authToken}`
        //     }
        // }).then(res => {
        //     });
        // }).catch(() => setErrorMessage(err.response.data.message));
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
                    <Form className="trip-form">

                        <label htmlFor="name">Trip Name</label>
                        <Field name="name" placeholder="Name" type="text" className="trip-form__input" />
                        {errors.name && touched.name ? (
                            <div className="trip-form__warning-message">
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
                                                    <label htmlFor={`participants.${index}.firstName`}>First Name</label>
                                                    <Field
                                                        name={`participants.${index}.firstName`}
                                                        placeholder="First Name"
                                                        type="text"
                                                    />
                                                    <ErrorMessage
                                                        name={`participants.${index}.firstName`}
                                                        component="div"
                                                        className="field-error"
                                                    />
                                                </div>
                                                <div className="col">
                                                    <label htmlFor={`participants.${index}.lastName`}>Last Name</label>
                                                    <Field
                                                        name={`participants.${index}.lastName`}
                                                        placeholder="Last Name"
                                                        type="text"
                                                    />
                                                    <ErrorMessage
                                                        name={`participants.${index}.lastName`}
                                                        component="div"
                                                        className="field-error"
                                                    />
                                                </div>
                                                <div className="col">
                                                    <label htmlFor={`participants.${index}.email`}>Email</label>
                                                    <Field
                                                        name={`participants.${index}.email`}
                                                        placeholder="Email"
                                                        type="email"
                                                    />
                                                    <ErrorMessage
                                                        name={`participants.${index}.email`}
                                                        component="div"
                                                        className="field-error"
                                                    />
                                                </div>
                                                <div className="col">
                                                    <label htmlFor={`participants.${index}.phone`}>Phone</label>
                                                    <Field
                                                        name={`participants.${index}.phone`}
                                                        placeholder="Phone"
                                                        type="text"
                                                    />
                                                    <ErrorMessage
                                                        name={`participants.${index}.phone`}
                                                        component="div"
                                                        className="field-error"
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
                                                    />
                                                    <ErrorMessage
                                                        name={`emergency_contacts.${index}.firstName`}
                                                        component="div"
                                                        className="field-error"
                                                    />
                                                </div>
                                                <div className="col">
                                                    <label htmlFor={`emergency_contacts.${index}.lastName`}>Last Name</label>
                                                    <Field
                                                        name={`emergency_contacts.${index}.lastName`}
                                                        placeholder="Last Name"
                                                        type="text"
                                                    />
                                                    <ErrorMessage
                                                        name={`emergency_contacts.${index}.lastName`}
                                                        component="div"
                                                        className="field-error"
                                                    />
                                                </div>
                                                <div className="col">
                                                    <label htmlFor={`emergency_contacts.${index}.email`}>Email</label>
                                                    <Field
                                                        name={`emergency_contacts.${index}.email`}
                                                        placeholder="Email"
                                                        type="email"
                                                    />
                                                    <ErrorMessage
                                                        name={`emergency_contacts.${index}.email`}
                                                        component="div"
                                                        className="field-error"
                                                    />
                                                </div>
                                                <div className="col">
                                                    <label htmlFor={`emergency_contacts.${index}.phone`}>Phone</label>
                                                    <Field
                                                        name={`emergency_contacts.${index}.phone`}
                                                        placeholder="Phone"
                                                        type="text"
                                                    />
                                                    <ErrorMessage
                                                        name={`emergency_contacts.${index}.phone`}
                                                        component="div"
                                                        className="field-error"
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
                        <Field name="departure_date" type="datetime-local" className="trip-form__input" />
                        {errors.departure_date && touched.departure_date ? (
                            <div className="trip-form__warning-message">
                                {errors.departure_date}
                            </div>
                        ) : null}

                        <label htmlFor="return_date">Return Date & Time</label>
                        <Field name="return_date" type="datetime-local" className="trip-form__input" />
                        {errors.return_date && touched.return_date ? (
                            <div className="trip-form__warning-message">
                                {errors.return_date}
                            </div>
                        ) : null}

                        <label htmlFor="location">Location</label>
                        <Field name="location" placeholder="Location" type="text" className="trip-form__input" />
                        {errors.location && touched.location ? (
                            <div className="trip-form__warning-message">
                                {errors.location}
                            </div>
                        ) : null}

                        {errorMessage &&
                            <div className="trip-form__error-message">
                                <svg className="trip-form__error-message-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path className="trip-form__error-message-icon-path" d="M1 21H23L12 2L1 21ZM13 18H11V16H13V18ZM13 14H11V10H13V14Z" fill="#191D21" />
                                </svg>
                                {errorMessage}
                            </div>
                        }

                        <section className="trip-form__buttons">
                            <button
                                className="form__btn form__btn--gray"
                            // onClick={goBack}
                            >
                                Cancel
                            </button>
                            <button
                                className="form__btn form__btn--blue"
                                type="submit"
                                form="form"
                            >
                                Add this Trip
                            </button>
                        </section>
                    </Form>
                )}
            </Formik>
        </main>
    )
}

export default AddTripPage;