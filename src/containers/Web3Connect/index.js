import React, { Component } from 'react';
import { connect } from 'react-redux';

import { initialize } from './actions';

class Web3Connect extends Component {
    componentDidMount() {
        this.props.initialize();
    }

    render() {
        if (!this.props.initialized) {
            return <span>Loading...</span>;
        }
        return this.props.children;
    }
}

export default connect(
    state => ({
        initialized: state.web3connect.initialized,
    }),
    { initialize }
)(Web3Connect);
