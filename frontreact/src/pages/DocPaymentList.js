import React, {Component} from 'react';
import DocListKind from "../components/docreq/DocListKind";

import "../styled/DocRequestCss.css"
import DocList from "../components/docreq/DocList";
import Goal from "../components/Goal";

class DocPaymentList extends Component {

    constructor(props) {
        super(props);
        this.props.setpagename("전자 결재");
        this.state = {
            listState: "allselect",
            doclist: [],
            allcnt: 0,
            approvalcnt: 0,
            rejectcnt: 0,
            waitcnt: 0
        };
    }

    async componentDidMount() {
        fetch('http://127.0.0.1:8000/api/document?checkDetail=1')
            .then(response => response.json())
            .then(response => {
                this.setState({doclist: response})
            })

        //  각각 수량
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


    statechange = (e) => {

        if (e === "allselect") {
            fetch('http://127.0.0.1:8000/api/document?checkDetail=1')
                .then(response => response.json())
                .then(response => {
                    this.setState({doclist: response})
                })

        } else {
            fetch('http://127.0.0.1:8000/api/document?state=' + e + '&checkDetail=1')
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
                    waitcnt={this.state.waitcnt}/>
                <DocList
                    doclist={this.state.doclist}
                    statechange={this.statechange}/>

            </>
        );
    }
}

export default DocPaymentList;