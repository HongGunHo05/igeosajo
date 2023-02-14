import React, {Component} from "react";
import {Form, Table} from "react-bootstrap";
import ConfirmModal from "./ConfirmModal";

class ReqList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            requestList: null,
            allChecked: false,
            checkedRequest: null,
            showRejectReasonModal: 0,
        };
    }

    handleCheckboxChange = (event) => {
        const {name, checked} = event.target;
        this.setState((prevState, prevProps) => {
            let newState;
            if (name === "allChecked") {
                let prevRequestList = prevProps.requestList;
                let pageCount = Math.ceil(prevRequestList.length / 10);
                let pages = [];
                for (let i = 0; i < pageCount; i++) {
                    pages.push(prevRequestList.slice(i * 10, (i + 1) * 10));
                }

                let checkInPage = pages[this.props.pageNum - 1].filter((page) => (page.reqstate === "대기"));
                newState = {
                    ...prevState,
                    requestList: prevProps.requestList.map((request) => {
                        let checked = !request.checked;
                        pages.forEach((page) => {
                            if (page.includes(request)) {
                                checked = !prevProps.allChecked;
                            }
                        });
                        return {
                            ...request,
                            checked: checked,
                        };
                    }),
                    allChecked: checked,
                    checkedRequest: checked
                        ? checkInPage : [],
                };
            } else {
                let index = parseInt(name.slice(7), 10);
                let newRequestList = [...prevProps.requestList];
                const indexOfRequest = newRequestList.findIndex((request) => request.reqnum === index);
                newRequestList[indexOfRequest].checked = checked;

                newState = {
                    ...prevState,
                    requestList: newRequestList,
                };

                let allChecked = newRequestList.every((request) => request.checked);

                newState = {
                    ...newState,
                    allChecked: allChecked,
                };

                let checkedRequest = prevProps.checkedRequest.filter(
                    (request) => request.reqnum !== newRequestList[indexOfRequest].reqnum
                );

                if (checked) {
                    checkedRequest = [...checkedRequest, newRequestList[indexOfRequest]];
                }

                newState = {
                    ...newState,
                    checkedRequest: checkedRequest,
                };
            }
            this.props.updateState({
                requestFilteredList: newState.requestList,
                allChecked: newState.allChecked,
                checkedRequest: newState.checkedRequest,
            })
            return newState
        });
    };

    handleShowReajectReason = (reqrejectreason) => {
        this.setState({
            showRejectReasonModal: reqrejectreason
        })
    }
updateState = (newValues) => {
        this.setState(newValues);
    };

    render() {
        const {requestList, allChecked} = this.props;
        const {showRejectReasonModal} = this.state;
        let pageCount = requestList && Math.ceil(requestList.length / 10);
        let pages = [];
        for (let i = 0; i < pageCount; i++) {
            pages.push(requestList.slice(i * 10, (i + 1) * 10));
        }


        let showConfirmModal;
        let modalType;
        let modalMessage;
        let confirmText;

        if (showRejectReasonModal !== 0) {
            showConfirmModal = true;
            modalType = "반려이유확인";
            modalMessage = showRejectReasonModal;
            confirmText = "확인";
        } else {
            showConfirmModal = false;
        }

        return (
            <>
                <div className="request-list-wrapper">
                    <Table bordered hover>
                        <thead className="request-list-table-head">
                        <tr>
                            <th className="request-list-table-col check">
                                <Form.Check
                                    name="allChecked"
                                    checked={allChecked}
                                    onChange={this.handleCheckboxChange}
                                />
                            </th>
                            <th className="request-list-table-col num">번호</th>
                            <th className="request-list-table-col name">품목명</th>
                            <th className="request-list-table-col count">수량</th>
                            <th className="request-list-table-col date">요청일자</th>
                            <th className="request-list-table-col writer">요청자</th>
                            <th className="request-list-table-col state">상태</th>
                        </tr>
                        </thead>
                        <tbody>
                        {pages[this.props.pageNum - 1].map((request, i) => {
                            return (
                                <tr key={request.reqnum}
                                    value={request.reqrejectreason}
                                    onClick={(e) => {
                                        this.handleShowReajectReason(request.reqrejectreason)
                                    }}
                                    className={request.reqstate === '반려' ? "request-list-click-able" : "request-list-click-disable"}>
                                    <td>
                                        <Form.Check
                                            name={`request${request.reqnum}`}
                                            checked={request.checked}
                                            hidden={request.reqstate !== '대기'}
                                            onChange={e => this.handleCheckboxChange(e)}
                                        />
                                    </td>
                                    <td>{i + 1 + (this.props.pageNum - 1) * 10}</td>
                                    <td>{request.prodname}</td>
                                    <td>{request.reqcount}</td>
                                    <td>{request.reqdate}</td>
                                    <td>{request.username}</td>
                                    <td>{request.reqstate}</td>
                                </tr>
                            );
                        })}
                        </tbody>
                    </Table>
                </div>
                <ConfirmModal
                            show={showConfirmModal}
                            text={modalMessage}
                            confirm={confirmText}
                            modalType={modalType}
                            updateState={this.updateState}/>
            </>
        );
    }
}

export default ReqList;