import React, { Component } from 'react';

class Navbar extends Component {
    
    constructor(props){
        super(props);
    }

    render() {
        return(
            <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
                <a
                    className="navbar-brand col-sm-3 col-md-2 mr-0"
                    href="/"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Gozlite Market Place
                </a>
                <ul className="navbar-nav px-3">
                    <li className="nav-item active">
                    <a className="nav-link" href="#"><span className="text-white">{ this.props.account }</span></a>
                    </li>
                </ul>
            </nav>
        );
    }
}

export default Navbar;
