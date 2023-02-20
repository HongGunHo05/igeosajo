import React, {Component} from 'react';
import "../../styled/Product.css"
import myImage from "../../img/search.png";

class Search extends Component {
    constructor(props) {
        super(props);
        this.state = {
            prodname: ''
        };
    }

    onChange = (e) => {
        this.setState({
            prodname: (e.target.value)
        },()=>this.setSearch())

    }
    sendSearch = () => {
        this.props.callbackSearch(this.state.prodname, 1)
    }

    setSearch = () => {
        if (this.state.prodname === '') {
            console.log('search')
            this.sendSearch()
        }
    }
    activeEnter = (e) => {
        if (e.key === "Enter") {
            this.sendSearch();
        }
    }

    render() {
        const prodname = this.state.prodname
        return (
            <div className="inline margin1">
                <input className='input1' onChange={this.onChange} onKeyDown={(e) => this.activeEnter(e)}
                       value={prodname} placeholder='상품이름으로 검색'/> &nbsp;
                <button className='btn btn-outline-secondary' style={{width: '45px'}} onClick={this.sendSearch}><img
                    className="img_cart" src={myImage} alt=""/></button>
            </div>


        )
    }
}

export default Search