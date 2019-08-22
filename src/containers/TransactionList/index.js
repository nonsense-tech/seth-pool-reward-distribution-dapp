import React, { Component } from 'react';
import { connect } from 'react-redux';

class TransactionList extends Component {
  render() {
    const { owners, account, history } = this.props;
    const isOwner = owners.includes(account);
    return (
      <div>
        <span>You are {!isOwner && 'not'} an owner</span>
        <br />
        <br />
        {isOwner && <button onClick={() => history.push('/transaction')}>Create a new transaction</button>}
      </div>
    );
  }
}

export default connect(
  state => ({
    owners: state.multisig.owners,
    account: state.web3connect.account,
  })
)(TransactionList);
