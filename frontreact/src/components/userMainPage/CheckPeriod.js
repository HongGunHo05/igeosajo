import React, {Component} from "react";

import "../../styled/UserMain.css"

class CheckPeriod extends Component {
    constructor(props) {
        super(props);
    }

    renderContent = (items) => {

        if (items.length === 0) {
            return (
                <div>
                    <div><img src={"/img/alert2.png"}/> 사무용품 신청 마감</div>
                    <div></div>
                </div>
            );
        } else {
            return items[0].termavailable === 1 ?
                <div>
                    <div><img src={"/img/alert.png"}/> 사무용품 신청 중</div>
                    <div>
                        신청기간 : {items[0].termstartdate} ~ {items[0].termenddate}
                    </div>
                </div>
                :
                <div>
                    <div><img src={"/img/alert2.png"}/> 사무용품 신청 마감</div>
                    <div></div>
                </div>
        }
    }

    render() {

        let items = this.props.items;

        return (
            <div className={"checkPeriodDiv"}>
                {this.renderContent(items)}
            </div>
        );
    }
}

export default CheckPeriod;
