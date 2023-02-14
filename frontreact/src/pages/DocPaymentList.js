import React, {Component} from 'react';
import DocListKind from "../components/docreq/DocListKind";

import "../styled/DocRequestCss.css"
import DocList from "../components/docreq/DocList";
import Goal from "../components/Goal";
import Paging from "../components/layout/Paging";
import {withRouter} from "react-router-dom";

let select = "allselect";

class DocPaymentList extends Component {

    constructor(props) {
        super(props);
        this.props.setpagename("전자 결재");

        try {
            if(this.props.location.state.docstate != null) {
                select = this.props.location.state.docstate;
            }
        } catch (e) {
            select = "allselect";
        }

        this.state = {
            listState: select,
            doclist: [],
            allcnt: 0,
            approvalcnt: 0,
            rejectcnt: 0,
            waitcnt: 0,
            pageNum: 1,
            pageCount: 1
        };
    }

    async componentDidMount() {

        if(this.state.listState === "allselect"){
            fetch('http://127.0.0.1:8000/api/document?checkDetail=1&pagenum=1')
                .then(response => response.json())
                .then(response => {
                    this.setState({doclist: response, pageCount: this.state.allcnt})
                })
        }else{
            fetch('http://127.0.0.1:8000/api/document?state=' + this.state.listState + '&checkDetail=1&pagenum=1')
                .then(response => response.json())
                .then(response => {
                    this.setState({doclist: response})
                })
        }

        //  각각 수량
        fetch('http://127.0.0.1:8000/api/document?checkDetail=1')
            .then(res => res.json())
            .then(data => {
                this.setState({allcnt: data.length, pageCount: data.length})
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


    statechange = (e) => {
        this.setState({listState: e, pageNum: 1})
        if (e === "allselect") {
            fetch('http://127.0.0.1:8000/api/document?checkDetail=1&pagenum=' + String(1))
                .then(response => response.json())
                .then(response => {
                    this.setState({doclist: response, pageCount: this.state.allcnt})
                })

        } else {
            let word;
            switch (e) {
                case "승인":
                    word = this.state.approvalcnt
                    break;
                case "대기":
                    word = this.state.waitcnt
                    break;
                case "반려":
                    word = this.state.rejectcnt
                    break;
            }

            fetch('http://127.0.0.1:8000/api/document?state=' + e + '&checkDetail=1&pagenum=' + String(1))
                .then(response => response.json())
                .then(response => {
                    this.setState({doclist: response, pageCount: word})
                })
        }
    }

    setPageNum = (e) => {
        this.setState({pageNum: e})

        if (this.state.listState === "allselect") {
            fetch('http://127.0.0.1:8000/api/document?checkDetail=1&pagenum=' + String(e))
                .then(response => response.json())
                .then(response => {
                    this.setState({doclist: response})
                })

        } else {
            fetch('http://127.0.0.1:8000/api/document?state=' + this.state.listState + '&checkDetail=1&pagenum=' + String(e))
                .then(response => response.json())
                .then(response => {
                    this.setState({doclist: response})
                })
        }
    }


    render() {
        return (
            <>
                <Goal comment={"전자 결재 목록"}/>
                <DocListKind
                    listState={this.state.listState}
                    statechange={this.statechange}
                    allcnt={this.state.allcnt}
                    approvalcnt={this.state.approvalcnt}
                    rejectcnt={this.state.rejectcnt}
                    waitcnt={this.state.waitcnt}
                    setPageNum={this.setPageNum}/>
                <DocList
                    doclist={this.state.doclist}
                    statechange={this.statechange}
                    pageNum={this.state.pageNum}/>
                <Paging
                    pageNum={this.state.pageNum}
                    setPageNum={this.setPageNum}
                    pageCount={this.state.pageCount}/>
            </>
        );
    }
}

export default withRouter(DocPaymentList);