import React, {Component} from "react";
import "../styled/Layouts.css"

class Main extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.setpagename("메인");
    }

    render() {
        return (
            <>
                <div className="page-top">
                    <div>메인페이지 최상위 컴포넌트</div>
                </div>
            </>
        );
    }
}

export default Main;
