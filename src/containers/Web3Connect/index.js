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
      transactionsLoading,
      children,
    } = this.props;
    if (!web3Initialized || !multisigInitialized || transactionsLoading) {
      return <Spin size="large" className="spin" />;
    }
    return children;
  }
}

export default connect(
  state => ({
    web3Initialized: state.web3connect.initialized,
    multisigInitialized: state.multisig.initialized,
    transactionsLoading: state.multisig.loading,
  }),
  { initialize }
)(Web3Connect);
