import React, {Component} from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import "../../styled/Layouts.css"

class Layouts extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {pagename} = this.props;
        const user = this.props.user;
        return (
            <>
                <Header pagename={pagename} user={user}/>
                <div className="container-content">
                    {user !== "user" && <Sidebar userathority={user.userathority} pagename={pagename}/>}
                    <div className="container-main">{this.props.children}</div>
                </div>
            </>
        )
    }
}

export default Layouts;