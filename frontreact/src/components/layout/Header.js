import React, {Component} from "react";
import {Row, Col} from "react-bootstrap";
import {Link} from "react-router-dom";
import Container from "react-bootstrap/Container";

class Header extends Component {
    constructor(props) {
        super(props);
    }

    logout = () => {
        sessionStorage.removeItem('secretcode');
        window.location.assign("http://localhost:3000");
    }

    render() {
        const {username, userdept, userposition} = this.props.user;
        const user = this.props.user;
        const {pagename} = this.props;
        return (
            <div className="header">
                <Container fluid style={{minWidth:"1080px", padding:0}}>
                    <Row className="header-wrapper">
                        <Col xs="9" className="logo-wrapper">
                            {user !== "user" && <Link to="/main"><img src={"/logo.png"} className="logo"></img></Link>}
                            {user === "user" && <Link to="/"><img src={"/logo.png"} className="logo"></img></Link>}
                        </Col>
                        <Col xs="2" className="profile">
                            <Row>
                                <Col xs="3" className="photo">
                                    {user !== "user" && <div>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30"
                                             fill="rgb(150, 150, 150)"
                                             className="bi bi-person-circle" viewBox="0 0 16 16">
                                            <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
                                            <path fillRule="evenodd"
                                                  d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"/>
                                        </svg>
                                    </div>}
                                    {user === "user" && <div className="photo"></div>}
                                </Col>
                                <Col xs="9" className="info">
                                    <Row>
                                        <Col>
                                            {user !== "user" && <div className="name">{username}</div>}
                                            {user === "user" && <div className="name"></div>}
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            {user !== "user" && <div className="dept">
                                                {userdept} {userposition}
                                            </div>}
                                            {user === "user" && <div className="dept">
                                            </div>}
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </Col>
                        <Col xs="1" className="logout">
                            {user !== "user" && <div className="name">
                                <div onClick={this.logout}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30"
                                         fill="rgb(150, 150, 150)"
                                         className="bi bi-power" viewBox="0 0 16 16">
                                        <path d="M7.5 1v7h1V1h-1z"/>
                                        <path
                                            d="M3 8.812a4.999 4.999 0 0 1 2.578-4.375l-.485-.874A6 6 0 1 0 11 3.616l-.501.865A5 5 0 1 1 3 8.812z"/>
                                    </svg>
                                </div>
                            </div>}
                            {user === "user" && <div></div>}
                        </Col>
                    </Row>
                    <Row className="bar-wrapper">
                        <div className="bar">{pagename}</div>
                    </Row>
                </Container>
            </div>
        );
    }
}

export default Header;
