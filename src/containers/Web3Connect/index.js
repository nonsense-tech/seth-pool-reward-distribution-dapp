import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Spin } from 'antd';

import { initialize } from '../../store/web3connect/actions';

import './index.scss';

class Web3Connect extends Component {
  componentDidMount() {
    this.props.initialize();
  }

  render() {
    if (!this.props.initialized) {
      return <Spin size="large" className="spin" />;
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
