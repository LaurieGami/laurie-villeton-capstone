import "./TripDetailsPage.scss";
import { Component } from "react";
import { Link } from "react-router-dom";
import axios from 'axios';
const baseUrl = 'http://localhost:5000/api';

class TripDetailsPage extends Component {
    state = {
        isLoggedIn: false,
        isLoading: true,
        userInfo: {},
        tripDetails: {}
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
                isLoggedIn: true,
                isLoading: false,
                userInfo: res.data
            });
        })
        .catch(() => this.handleAuthFail());
    }

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

    componentDidMount() {
        const authToken = sessionStorage.getItem('authToken');

        if (authToken) {
            this.getUserInfo(authToken);
        }

        this.getTripInfo(this.props.match.params.tripId);
    }

    render() {
        const { isLoggedIn, isLoading, userInfo, tripDetails } = this.state;
        const { name,
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
            updated_at } = tripDetails;

        if (isLoading) {
            return (
            <h1>Loading...</h1>
            )
        }

        return (
            <main className="profile-page">
                {/* User Profile if LoggedIn */}
                {isLoggedIn && !isLoading &&
                    <>
                        <article>
                            <h3>Hi, {userInfo.firstName}</h3>
                        </article>
                        <div>
                            <Link to={`/trips/${tripDetails.id}/edit`}>Edit</Link>
                        </div>
                    </>
                    }
                
                {/* User Profile if NOT LoggedIn */}
                {!isLoggedIn && !isLoading &&
                    <article>
                        <h3>Hi, stranger!</h3>
                    </article>}

                {/* Single Trip Component */}
                {!isLoading && 
                <article>
                    <h3>Trip: {name}</h3>
                    <p>{updated_at}</p>
                    <p>{participants}</p>
                    <p>{emergency_contacts}</p>
                    <p>{activities}</p>
                    <p>{departure_date}</p>
                    <p>{return_date}</p>
                    <p>{location}</p>
                    <p>{purpose}</p>
                    <p>{supplies}</p>
                    <p>{add_info}</p>
                    <p>Comments: {comments ? comments : "(no comments yet)"}</p>
                </article>}
            </main>
        )
    }
}

export default TripDetailsPage;