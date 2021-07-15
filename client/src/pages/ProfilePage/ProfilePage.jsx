import "./ProfilePage.scss";
import { Component } from "react";
import axios from 'axios';
import NavBar from "../../components/NavBar/NavBar";

const baseUrl = 'http://localhost:5000/api';

class ProfilePage extends Component {
    state = {
        isLoading: true,
        userInfo: {}
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
        }).then(res => {
            this.setState({
                isLoading: false,
                userInfo: res.data
            });
        }).catch(() => this.handleAuthFail());
    }

    componentDidMount() {
        const authToken = sessionStorage.getItem('authToken');

        this.getUserInfo(authToken);
    }

    render() {
        const { isLoading, userInfo } = this.state;

        if (isLoading) {
            <h1>Loading...</h1>
        }

        return (
            <>
            <NavBar />
            <main className="profile-page">
                {/* Profile Info Component */}
                <article className="profile-info">
                    <h3 className="profile-page__title">Your Profile</h3>
                    <section className="profile-info__header">
                        <h2 className="profile-info__name">{userInfo.firstName} {userInfo.lastName}</h2>
                        <div className="profile-info__buttons">
                            <button className="profile-info__btn">Edit</button>
                            <svg onClick={() => this.handleAuthFail()} className="profile-info__logout-icon" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
                                <path className="profile-info__logout-icon-path" id="Shape" d="m7.1,12.6l1.4,1.4l5,-5l-5,-5l-1.4,1.4l2.6,2.6l-9.7,0l0,2l9.7,0l-2.6,2.6l0,0zm8.9,-12.6l-14,0c-1.1,0 -2,0.9 -2,2l0,4l2,0l0,-4l14,0l0,14l-14,0l0,-4l-2,0l0,4c0,1.1 0.9,2 2,2l14,0c1.1,0 2,-0.9 2,-2l0,-14c0,-1.1 -0.9,-2 -2,-2l0,0z" />
                            </svg>
                        </div>
                    </section>
                    <p className="profile-info__email">{userInfo.email}</p>
                    <p className="profile-info__phone">{userInfo.phone}</p>
                </article>
            </main>
            </>
        )
    }
}

export default ProfilePage;