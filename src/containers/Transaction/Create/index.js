import React, { Component } from 'react';
import { connect } from 'react-redux';

import CsvLoader from '../../../components/CsvLoader';

import { create } from '../../../store/multisig/actions';

class TransactionCreation extends Component {
  state = {
    data: [],
    sending: false,
  }
  setSending = bool => {
    this.setState({ sending: bool });
  }
  onDataLoaded = data => {
      this.setState({ data });
  }
  onCreate = async () => {
    this.setSending(true);
    await this.props.create(this.state.data);
    this.props.history.push('/transactions');
    this.setSending(false);
  }
  render() {
    const { owners, account, history } = this.props;
    const isOwner = owners.includes(account);
    if (!isOwner) {
      history.push('/');
    }

    if (this.state.sending) {
      return <span>Sending...</span>;
    }
    
    return (
      <div>
        <CsvLoader onDataLoaded={this.onDataLoaded} />
        <br />
        <br />
        <button onClick={this.onCreate}>Send transaction</button>
      </div>
    );
  }
}

export default connect(
  state => ({
    owners: state.multisig.owners,
    account: state.web3connect.account,
  }),
  { create }
)(TransactionCreation);
