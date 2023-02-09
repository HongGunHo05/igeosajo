import React, {Component} from 'react';
import Table from 'react-bootstrap/Table';

import "../../styled/DocRequestCss.css"
import Modal1 from "../layout/Modal1";
import {withRouter} from "react-router-dom";

class DocPayment extends Component {

    constructor(props) {
        super(props);
        this.state = {
            outcomeState: null,
            docNum: 0
        };
    }

    reqSendClick = (e) => {
        this.setState({reqSend: e});
    }

    outcomeState = (e) => {

        this.setState({outcomeState: e})

        if (e === 2) {
            // 확인 버튼 눌렀을 시

            fetch('http://127.0.0.1:8000/api/document?docNum=' + this.props.reqnum[0].toString())
                .then(response => response.json())
                .then(response => {
                    this.props.history.push({
                        pathname: '/docpaydetail',
                        document: {detailDocNum: response[0].docnum},
                    })
                }
            )

            this.reqSendClick(null)
            this.props.openModal(false)

        } else if (e === 1) {
            // 취소 버튼 누른 후 확인 눌렀을 시
            fetch("http://127.0.0.1:8000/api/document", {
                method: "DELETE",
            })

            this.reqSendClick(null)
            this.props.openModal(false)

            window.location.assign("http://localhost:3000/docrequest");

        } else if(e === 0) {
            console.log(123)
            this.reqSendClick(null)
            this.props.openModal(false)
        }

    }

    render() {

        let checkState = this.props.checkState
        let modalOpen = this.props.modalOpen
        let items = this.props.items
        let reqnum = this.props.reqnum
        let words = this.props.words

        return (
            <div className={"docPaymentTable"}>
                <Table striped="columns">
                    <tbody>
                    <tr>
                        <td>제목</td>
                        <td>비품 구매 결재 요청</td>
                    </tr>
                    <tr>
                        <td>기안자</td>
                        <td>성은 기 이름은 안자 이름하여 기안자</td>
                    </tr>
                    <tr>
                        <td>결재자</td>
                        <td>김해 결씨 재자 돌림으로 재자 이름하여 결재자</td>
                    </tr>
                    <tr>
                        <td>작성일자</td>
                        <td>{items["wdate"]}</td>
                    </tr>

                    <tr>
                        <td>상품명</td>
                        <td>{words}</td>
                    </tr>
                    <tr>
                        <td>금액 총합</td>
                        <td>{items["sum"]}원</td>
                    </tr>
                    </tbody>
                </Table>

                {
                    checkState
                        ? <Modal1 open={modalOpen} ment={"결재신청이 완료 되었습니다."}
                                  outcomeState={this.outcomeState}
                                  modalKind={false}></Modal1>
                        : <Modal1 open={modalOpen} ment={"취소 하시겠습니까?"}
                                  outcomeState={this.outcomeState}
                                  modalKind={true}></Modal1>
                }
            </div>
        );
    }
}

export default withRouter(DocPayment);