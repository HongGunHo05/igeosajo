import React, {Component} from 'react';
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import all from "../../img/allicon.png";
import parchase from "../../img/iconsparchase.png";



class OrderReqSearch extends Component {

    constructor(props) {
        super(props);
        this.state = {
            allcnt:0,
            parchasecnt: 0,
            prevparchasecnt: 0,
            reqterm: this.props.reqterm
        }
        this.statechange = this.statechange.bind(this);
    }

    statechange = (e,state) => {
        this.props.orderdocsearchstate(state);
    }
    componentDidMount() {
         fetch('http://127.0.0.1:8000/api/order?func=orderreqcount&&termyearmonth=' + this.state.reqterm+'&&state=parchase')
            .then(res => res.json())
            .then(data => {
                    this.setState({allcnt:data[0],prevparchasecnt:data[1],parchasecnt:data[2],})
            })
    }

    render() {
        const {allcnt,prevparchasecnt,parchasecnt} = this.state
        return (
            <div>
                <Row style={{width: '100%'}}>
                    <Col>
                        <div className="cardcontain">
                            <Card style={{width: '95%'}}>
                                <Card.Body   onClick={(e) => {this.statechange(e,"all")}}>
                                    <Card.Text className=" cardtitletext">전체</Card.Text>
                                        <Container>
                                            <Row>
                                                <Col className="cardtext"><span>{allcnt}</span><span>{" "}</span><span style={{fontSize:"17px",fontWeight:"bold"}}>건</span></Col>
                                                <Col> <img src={all} alt="logo"/></Col>
                                            </Row>
                                        </Container>
                                </Card.Body>
                            </Card>
                        </div>
                    </Col>
                    <Col>
                        <div className="cardcontain">
                            <Card style={{width: '95%'}}>
                                <Card.Body  onClick={(e) => {this.statechange(e,"prevparchase")}}>
                                    <Card.Text className="cardtitletext">구매전</Card.Text>

                                        <Container>
                                            <Row>
                                                <Col className="cardtext"><span>{prevparchasecnt}</span><span>{" "}</span><span style={{fontSize:"17px",fontWeight:"bold"}}>건</span></Col>
                                                <Col> <img src={parchase} alt="logo"/></Col>
                                            </Row>
                                        </Container>
                                </Card.Body>
                            </Card>
                        </div>
                    </Col>
                    <Col>
                        <div className="cardcontain">
                            <Card style={{width: '95%'}}>
                                <Card.Body  onClick={(e) => {this.statechange(e,"parchase")}}>
                                    <Card.Text className="cardtitletext">구매완료</Card.Text>
                                        <Container>
                                            <Row>
                                                <Col className="cardtext"><span>{parchasecnt}</span><span>{" "}</span><span style={{fontSize:"17px",fontWeight:"bold"}}>건</span></Col>
                                                <Col> <img src={parchase} alt="logo"/></Col>
                                            </Row>
                                        </Container>
                                </Card.Body>
                            </Card>
                        </div>
                    </Col>
                </Row>

            </div>
        )
    }
}

export default OrderReqSearch;