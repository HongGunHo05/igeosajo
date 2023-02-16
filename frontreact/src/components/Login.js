import React, {Component} from 'react';
import {Container, Row, Col, Button, Form} from "react-bootstrap";
import "../styled/LoginCss.css"
import {withRouter} from "react-router-dom";

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userId: "",
            userPwd: "",
            logined: 'N',
        };
    }

    loginClick = () => {
        let data;
        if (!this.state.userId) {
            alert("아이디를 입력하세요")
        } else if (!this.state.userPwd) {
            alert("비밀번호를 입력하세요")
        } else {
            fetch("http://127.0.0.1:8000/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userid: this.state.userId,
                    userpwd: this.state.userPwd
                }),
            }).then((response) => {
                return response.json()
            }).then((response) => {
                let data = response["secretcode"];
                if (data === "0") {
                    alert("아이디 또는 비밀번호가 맞지 않습니다.")
                } else {
                    localStorage.setItem("secretcode", data);
                    this.setState({
                        logined: 'Y',
                    })
                }
            });
        }
    }

    componentDidMount() {
        this.props.setpagename("로그인");
    }

    componentDidUpdate(preState) {
        if (preState.logined !== this.state.logined && this.state.logined === 'Y') {
            this.props.changeLogined('Y');
            this.props.history.push('/main');
        }
    }

    handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            this.loginClick();
        }
    }

    render() {
        return (
            <div className={"loginDiv"}>
                <img src={"/img/user.png"}/>
                <Container className="panel">

                    <Form>
                        <Form.Group as={Row} className="mb-3" controlId="formPlaintextId">
                            <Col sm>
                                <Form.Control className={"userid"} type="text" placeholder="UserID"
                                              onChange={(e) => {
                                                  this.setState({userId: e.target.value});
                                              }}/>
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} className="mb-3" controlId="formPlaintextPassword">
                            <Col sm>
                                <Form.Control className={"userpwd"} type="password" placeholder="Password"
                                              onChange={(e) => {
                                                  this.setState({userPwd: e.target.value});
                                              }}
                                              onKeyUp={(e) => {
                                                  this.handleKeyDown(e);
                                              }}
                                />
                            </Col>
                        </Form.Group>
                        <br/>

                        <div className="d-grid gap-1">
                            <Button style={{backgroundColor: "rgb(82, 150, 213)", border: "none"}}
                                    onClick={(e) => {
                                        this.loginClick();

                                    }}
                            >
                                Sign In
                            </Button>
                        </div>
                    </Form>
                </Container>
            </div>
        );
    }
}

export default withRouter(Login);