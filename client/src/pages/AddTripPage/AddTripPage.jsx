import "./AddTripPage.scss";
import { Component } from "react";
// import { Link } from "react-router-dom";
import axios from 'axios';
const baseUrl = 'http://localhost:5000/api';

class AddTripPage extends Component {
    state = {
        isLoading: true,
        userInfo: {},

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
        })
            .then(res => {
                this.setState({
                    isLoading: false,
                    userInfo: res.data
                });
            })
            .catch(() => this.handleAuthFail());
    }

    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value,
        });
    };

    handleParticipantsChange = (event) => {
        const updatedParticipants = [...this.state.participants];
        updatedParticipants[event.target.dataset.index][event.target.className] = event.target.value;
        this.setState({
            participants: updatedParticipants
        })
    };


    addParticipant = () => {
        this.setState({
            participants: [...this.state.participants, { firstName: "", lastName: "", email: "", phone: "" }]
        })
    }

    removeParticipant = index => {
        const updatedParticipants = [...this.state.participants];
        updatedParticipants.splice(index, 1);
        this.setState({
            participants: updatedParticipants
        })
    };

    postTripInfo = () => {
        console.log('Axios call to post a new trip')
        // axios.post(`${baseUrl}/trips`, {
        //     headers: {
        //         authorization: `Bearer ${authToken}`
        //     }
        // }).then(res => {
        //     });
        // }).catch(() => this.handleAuthFail());
    }

    componentDidMount() {
        const authToken = sessionStorage.getItem('authToken');

        this.getUserInfo(authToken);
    }

    render() {
        const { isLoading, userInfo } = this.state;

        if (isLoading) {
            return (
                <h1>Loading...</h1>
            )
        }

        return (
            <main className="profile-page">
                {/* User Profile if LoggedIn */}
                {!isLoading &&
                    <>
                        <article>
                            <h3>Hi, {userInfo.firstName}</h3>
                        </article>
                    </>
                }
                <form
                    className="form"
                    onSubmit={(event) => this.handleSubmit(event)}
                    id="trip-form"
                >
                    <h3 className="form__title">Let's add a trip!</h3>
                    <label className="form__label" htmlFor="name">
                        Trip Name
                    </label>
                    <input
                        // className={
                        //     this.state.tripNameIsValid === false
                        //         ? "form__input-invalid"
                        //         : "form__input-initial"
                        // }
                        name="name"
                        placeholder="Trip Name"
                        value={this.state.name}
                        onChange={this.handleChange}
                    // autoComplete="new-password"
                    // onBlur={this.validateTripName}
                    ></input>
                    {/* {this.state.tripNameIsValid === false && <InputError />} */}

                    {/* ==================== Participants ==================== */}
                    <h4 className="form__label">
                        Participants
                    </h4>
                    {
                        this.state.participants.map((val, i) => {
                            const firstNameId = `firstName-${i}`;
                            const lastNameId = `lastName-${i}`;
                            const emailId = `email-${i}`;
                            const phoneId = `phone-${i}`;
                            return (
                                <div key={`participant-${i}`}>
                                    <label htmlFor={firstNameId}>{`Participant #${i + 1}`}</label>
                                    <input
                                        type="text"
                                        name={firstNameId}
                                        data-index={i}
                                        id={firstNameId}
                                        placeholder="First Name"
                                        className="firstName"
                                        value={this.state.participants[i].firstName}
                                        onChange={this.handleParticipantsChange}
                                    />
                                    <label htmlFor={lastNameId}>Last Name</label>
                                    <input
                                        type="text"
                                        name={lastNameId}
                                        data-index={i}
                                        id={lastNameId}
                                        placeholder="Last Name"
                                        className="lastName"
                                        value={this.state.participants[i].lastName}
                                        onChange={this.handleParticipantsChange}
                                    />
                                    <label htmlFor={emailId}>Email</label>
                                    <input
                                        type="text"
                                        name={emailId}
                                        data-index={i}
                                        id={emailId}
                                        placeholder="Email"
                                        className="email"
                                        value={this.state.participants[i].email}
                                        onChange={this.handleParticipantsChange}
                                    />
                                    <label htmlFor={phoneId}>Phone Number</label>
                                    <input
                                        type="text"
                                        name={phoneId}
                                        data-index={i}
                                        id={phoneId}
                                        placeholder="Phone Number"
                                        className="phone"
                                        value={this.state.participants[i].phone}
                                        onChange={this.handleParticipantsChange}
                                    />
                                    <div className="btn-box">
                                        {this.state.participants.length !== 1 &&
                                            <button onClick={() => this.removeParticipant(i)}>Remove</button>
                                        }
                                        {this.state.participants.length - 1 === i &&
                                            <button onClick={() => this.addParticipant()}>Add</button>                                        }
                                    </div>
                                </div>
                            );
                        })
                    }

                    {/* ==================== Emergency Contacts ==================== */}
                    <label className="form__label" htmlFor="emergency_contacts">
                        Emergency Contacts
                    </label>
                    <input
                        // className={
                        //     this.state.emergencyContactsIsValid === false
                        //         ? "form__input-invalid"
                        //         : "form__input-initial"
                        // }
                        name="emergency_contacts"
                        placeholder="Emergency Contacts"
                        onChange={this.handleChange}
                    // autoComplete="new-password"
                    // onBlur={this.validateEmergencyContacts}
                    ></input>
                    {/* {this.state.demergencyContactsIsValid === false && <InputError />} */}
                    

                    <label className="form__label" htmlFor="departure_date">
                        Departure Date
                    </label>
                    <input
                        // className={
                        //     this.state.departureDateIsValid === false
                        //         ? "form__input-invalid"
                        //         : "form__input-initial"
                        // }
                        name="departure_date"
                        placeholder="Departure Date"
                        onChange={this.handleChange}
                    // autoComplete="new-password"
                    // onBlur={this.validateDepartureDate}
                    ></input>
                    {/* {this.state.departureDateIsValid === false && <InputError />} */}

                    <label className="form__label" htmlFor="return_date">
                        Return Date
                    </label>
                    <input
                        // className={
                        //     this.state.returnDateIsValid === false
                        //         ? "form__input-invalid"
                        //         : "form__input-initial"
                        // }
                        name="return_date"
                        placeholder="Return Date"
                        onChange={this.handleChange}
                    // autoComplete="new-password"
                    // onBlur={this.validateReturnDate}
                    ></input>
                    {/* {this.state.returnDateIsValid === false && <InputError />} */}

                    <label className="form__label" htmlFor="location">
                        Location
                    </label>
                    <input
                        // className={
                        //     this.state.locationIsValid === false
                        //         ? "form__input-invalid"
                        //         : "form__input-initial"
                        // }
                        name="location"
                        placeholder="Location"
                        onChange={this.handleChange}
                    // autoComplete="new-password"
                    // onBlur={this.validateLocation}
                    ></input>
                    {/* {this.state.locationIsValid === false && <InputError />} */}

                    <label className="form__label" htmlFor="purpose">
                        Purpose
                    </label>
                    <input
                        // className={
                        //     this.state.purposeIsValid === false
                        //         ? "form__input-invalid"
                        //         : "form__input-initial"
                        // }
                        name="purpose"
                        placeholder="Purpose"
                        onChange={this.handleChange}
                    // autoComplete="new-password"
                    // onBlur={this.validatePurpose}
                    ></input>
                    {/* {this.state.purposeIsValid === false && <InputError />} */}

                    <label className="form__label" htmlFor="activities">
                        Activities
                    </label>
                    <input
                        // className={
                        //     this.state.activitiesIsValid === false
                        //         ? "form__input-invalid"
                        //         : "form__input-initial"
                        // }
                        name="activities"
                        placeholder="Activities"
                        onChange={this.handleChange}
                    // autoComplete="new-password"
                    // onBlur={this.validateActivities}
                    ></input>
                    {/* {this.state.activitiesIsValid === false && <InputError />} */}

                    <label className="form__label" htmlFor="supplies">
                        Supplies
                    </label>
                    <input
                        // className={
                        //     this.state.suppliesIsValid === false
                        //         ? "form__input-invalid"
                        //         : "form__input-initial"
                        // }
                        name="supplies"
                        placeholder="Supplies"
                        onChange={this.handleChange}
                    // autoComplete="new-password"
                    // onBlur={this.validateSupplies}
                    ></input>
                    {/* {this.state.suppliesIsValid === false && <InputError />} */}

                    <label className="form__label" htmlFor="add_info">
                        Additional Information
                    </label>
                    <input
                        // className={
                        //     this.state.add_infoIsValid === false
                        //         ? "form__input-invalid"
                        //         : "form__input-initial"
                        // }
                        name="add_info"
                        placeholder="Additional Information"
                        onChange={this.handleChange}
                    // autoComplete="new-password"
                    // onBlur={this.validateAdd_info}
                    ></input>
                    {/* {this.state.add_infoIsValid === false && <InputError />} */}

                    {/* BUTTONS */}
                    <div className="form__buttons">
                        <button
                            className="form__btn form__btn--gray"
                        // onClick={this.goBack}
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
                    </div>
                </form>
            </main>
        )
    }
}

export default AddTripPage;