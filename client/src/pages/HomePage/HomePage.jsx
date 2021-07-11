import './HomePage.scss';

import { Component } from 'react';
import { Link } from "react-router-dom";

import illustration from '../../assets/images/home-page-illustration.png';

class HomePage extends Component {
    state = {
        isLoggedIn: false
    }

    componentDidMount() {
        const authToken = sessionStorage.getItem('authToken');

        if (authToken) {
            this.setState({
                isLoggedIn: true
            }, () => this.props.history.push(`/profile`));
        }
    }

    render() {
        const { isLoggedIn } = this.state;

        return (
            <article className="home-page">
                {!isLoggedIn &&
                    <>
                        <section className="home-page__info">
                            <h2 className="home-page__subtitle">Heading Outdoors?</h2>
                            <h1 className="home-page__title">Leave a Trip Plan.</h1>
                            <p className="home-page__text">No one ever expects to get into trouble outdoors. But, a turn in the weather, mistake in judgment, unexpected injury, equipment failure, or sudden nightfall can quickly change any recreational outing into a crisis.</p>
                            <p className="home-page__text home-page__text--bold">Does anyone know where you have gone and when you expect to return?</p>
                        </section>

                        <section className="home-page__buttons">
                            <Link to="/login" className="home-page__btn home-page__btn--login">Login</Link>
                            <Link to="/register" className="home-page__btn home-page__btn--register">Register</Link>
                        </section>
                        <section className="home-page__illustration">
                            <img className="home-page__img" src={illustration} alt="Home Page Illustration"/>
                        </section>
                    </>
                }
            </article>
        )
    }
}

export default HomePage;
