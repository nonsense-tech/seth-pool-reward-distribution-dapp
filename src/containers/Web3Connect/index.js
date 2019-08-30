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
    const {
      web3Initialized,
      multisigInitialized,
      globalLoading,
      children,
    } = this.props;
    if (!web3Initialized || !multisigInitialized || globalLoading) {
      return <Spin size="large" className="spin" />;
    }
    return children;
  }
}

export default connect(
  state => ({
    web3Initialized: state.web3connect.initialized,
    multisigInitialized: state.multisig.initialized,
    globalLoading: state.web3connect.globalLoading,
  }),
  { initialize }
)(Web3Connect);
