import React, { Component } from 'react';
import { connect } from 'react-redux';

import { confirm } from '../../../store/multisig/actions';

class TransactionCreation extends Component {
  render() {
    const { owners, account, history, confirm, match } = this.props;
    
    const isOwner = owners.includes(account);
    if (!isOwner) {
      history.push('/');
    }
    
    return (
      <div>
        <button onClick={() => confirm(match.params.id)}>Confirm transaction</button>
      </div>
    );
  }
}

export default connect(
  state => ({
    ...state.multisig,
    account: state.web3connect.account,
  }),
  { confirm }
)(TransactionCreation);
