import React, { Component } from 'react';
import { connect } from 'react-redux';

import { create } from '../../store/multisig/actions';

class TransactionPage extends Component {
  render() {
    const { owners, account, history, create } = this.props;
    const isOwner = owners.includes(account);
    if (!isOwner) {
      history.push('/');
    }
    return (
      <div>
        <textarea style={{ width: 500, height: 200 }}></textarea>
        <br />
        <br />
        <button onClick={create}>Send transaction</button>
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
)(TransactionPage);
