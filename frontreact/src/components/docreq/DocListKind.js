import React, {Component} from 'react';
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import all from "../../img/allicon.png";
import parchase from "../../img/iconsparchase.png";
import deliver from "../../img/iconsdeliver.png";
import finish from "../../img/iconsfinish.png";

class DocListKind extends Component {

    constructor(props) {
        super(props);
        this.state = {
            allcnt: 0,
            approvalcnt: 0,
            rejectcnt: 0,
            waitcnt: 0
        }
        this.statechange = this.statechange.bind(this);
    }

    statechange = (e) => {
        this.props.statechange(e);
    }

    componentDidMount() {
        fetch('http://127.0.0.1:8000/api/document?checkDetail=1')
            .then(res => res.json())
            .then(data => {
                this.setState({allcnt: data.length})
            })
        fetch('http://127.0.0.1:8000/api/document?state=승인&checkDetail=1')
            .then(res => res.json())
            .then(data => {
                this.setState({approvalcnt: data.length})
            })
        fetch('http://127.0.0.1:8000/api/document?state=반려&checkDetail=1')
            .then(res => res.json())
            .then(data => {
                this.setState({rejectcnt: data.length})
            });
        fetch('http://127.0.0.1:8000/api/document?state=대기&checkDetail=1')
            .then(res => res.json())
            .then(data => {
                this.setState({waitcnt: data.length})
            });
    }

    render() {
        const {allcnt, approvalcnt, rejectcnt, waitcnt} = this.state
        return (
            <div className="containermargin">

                <Row style={{width: '100%', marginTop:'3rem'}}>
                    <Col>
                        <div className="cardcontain">
                            <Card style={{width: '95%'}}>
                                <Card.Body onClick={(e) => {
                                    this.statechange("allselect")
                                }}>
                                    <Card.Text className=" cardtitletext">전체</Card.Text>
                                    <Row>
                                        <Col className="cardtext">{allcnt}</Col>
                                        <Col> <img src={all} alt="logo"/></Col>
                                    </Row>
                                </Card.Body>
                            </Card>
                        </div>
                    </Col>

                    <Col>
                        <div className="cardcontain">
                            <Card style={{width: '95%'}}>
                                <Card.Body onClick={(e) => {
                                    this.statechange("승인")
                                }}>
                                    <Card.Text className="cardtitletext">승인</Card.Text>
                                    <Row>
                                        <Col className="cardtext">{approvalcnt}</Col>
                                        <Col> <img src={parchase} alt="logo"/></Col>
                                    </Row>

                                </Card.Body>
                            </Card>
                        </div>
                    </Col>

                    <Col>
                        <div className="cardcontain">
                            <Card style={{width: '95%'}}>
                                <Card.Body onClick={(e) => {
                                    this.statechange("반려")
                                }}>
                                    <Card.Text className="cardtitletext">반려</Card.Text>
                                    <Row>
                                        <Col className="cardtext">{rejectcnt}</Col>
                                        <Col> <img src={deliver} alt="logo"/></Col>
                                    </Row>

                                </Card.Body>
                            </Card>
                        </div>
                    </Col>

                    <Col>
                        <div className="cardcontain">
                            <Card style={{width: '95%'}}>
                                <Card.Body onClick={(e) => {
                                    this.statechange("대기")
                                }}>
                                    <Card.Text className="cardtitletext">대기</Card.Text>
                                    <Row>
                                        <Col className="cardtext">{waitcnt}</Col>
                                        <Col> <img src={finish} alt="logo"/></Col>
                                    </Row>
                                </Card.Body>
                            </Card>
                        </div>
                    </Col>

                </Row>

            </div>
        )
    }
}

export default DocListKind;