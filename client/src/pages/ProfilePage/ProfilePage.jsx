import "./ProfilePage.scss";
import { Component } from "react";
import axios from 'axios';

const baseUrl = 'http://localhost:5000/api';

class ProfilePage extends Component {
    state = {
        isLoading: true,
        userInfo: {}
    }

    logOut = () => {
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
        }).catch(() => this.logOut());
    }

    componentDidMount() {
        const authToken = sessionStorage.getItem('authToken');

        this.getUserInfo(authToken);
    }

    render() {
        const { isLoading, userInfo } = this.state;

        return (
            <>
            <main className="profile-page">

                <section className="profile-page__header">
                    <h1 className="profile-page__title">My Profile</h1>
                    <button onClick={() => this.logOut()} className="profile-page__btn">Logout</button>
                </section>

                {/* Profile Info Component */}
                <article className="profile-info-container">
                    {isLoading &&
                        <h1>Loading...</h1>
                    }
                    {!isLoading && 
                        <article className="profile-info">
                            <section className="profile-info__header">
                                <h2 className="profile-info__name">{userInfo.firstName} {userInfo.lastName}</h2>
                                {/* <div className="profile-info__buttons">
                                    <button onClick={() => this.logOut()} className="profile-info__btn">Logout</button>
                                </div> */}
                            </section>
                            <p className="profile-info__email">{userInfo.email}</p>
                            <p className="profile-info__phone">{userInfo.phone}</p>
                        </article>
                    }
                </article>
            </main>
            </>
        )
    }
}

export default ProfilePage;