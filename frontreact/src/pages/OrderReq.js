import React, {Component} from "react";
import Layouts from "../components/layout/Layouts";
import Requestmain from "../components/reqterm/Requestmain";
import "../styled/Layouts.css"
import OrderRequestList from "./OrderRequestList";

class Order extends Component {
    constructor(props) {
        super(props);
        this.state = {
            usernum: "2",
            /* 페이지명 변경 */
            pagename: "구매 신청 목록",
        };
    }

    render() {
        const {pagename, usernum} = this.state;
        return (
            <div className="page-top">
                {/*전부 고정이고 바뀌는 건 <Requestmain />에 컴포넌트명 변경*/}
                <Layouts pagename={pagename} usernum={usernum}><OrderRequestList /></Layouts>
            </div>
        );
    }
}

export default Order;
