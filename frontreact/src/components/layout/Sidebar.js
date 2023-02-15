import React, {Component} from "react";
import "../../styled/Layouts.css";
import {Link, withRouter} from "react-router-dom";
import Menu from "../../storage/Menu";

class Sidebar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            menus: [
                {
                    index: "depth1",
                    name: "",
                    path: "",
                },
            ],
            currentMainMenu: null,
            currentSubMenu: null,
        };
    }

    componentDidMount() {
        try {
            this.setMenu(this.props.userathority);
        } catch (e) {
            console.error(e);
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.userathority !== this.props.userathority) {
            this.setMenu(this.props.userathority);
        }
    }

    setMenu = (userAuthority) => {
        if (userAuthority === 0) {
            this.setState({
                menus: new Menu().user0menu,
            });
        } else if (userAuthority === 1) {
            this.setState({
                menus: new Menu().user1menu,
            });
        } else if (userAuthority === 2) {
            this.setState({
                menus: new Menu().user2menu,
            });
        }
    }

    handleMainMenuClick = (index, index2) => {
        this.setState({currentMainMenu: index, currentSubMenu: index2});
    };

    handleSubMenuClick = (index, index2) => {
        this.setState({currentMainMenu: index, currentSubMenu: index2});
    };

    render() {
        const {menus, currentMainMenu, currentSubMenu} = this.state;

        return (
            <div className="sidebar-wrapper">
                <div className="sidebar">
                    <div className="menu-wrapper">
                        {menus.map((menu) => {
                            return (
                                <div key={menu.index}>
                                    <Link to={menu.path}>
                                        <div
                                            className={
                                                menu.index === currentMainMenu
                                                    ? "menu1 selected"
                                                    : "menu1 unselected"
                                            }
                                            value={menu.index}
                                            onClick={() => this.handleMainMenuClick(menu.index, menu.menu2[0].index)}
                                        >
                                            {menu.name}
                                        </div>
                                    </Link>
                                    {
                                        // index === currentMainMenu &&
                                        menu.menu2 &&
                                        menu.menu2.map((submenu) => {
                                            return (
                                                <div key={submenu.index}>
                                                    <Link to={submenu.path}>
                                                        <div
                                                            className={
                                                                submenu.index === currentSubMenu
                                                                    ? "menu2 selected"
                                                                    : "menu2 unselected"
                                                            }
                                                            onClick={() => this.handleSubMenuClick(menu.index, submenu.index)}
                                                        >
                                                            {submenu.name}
                                                        </div>
                                                    </Link>
                                                </div>
                                            );
                                        })
                                    }
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(Sidebar);
