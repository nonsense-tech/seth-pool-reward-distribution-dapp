import React, { Component } from 'react';
import { connect } from 'react-redux';

import { create } from '../../../store/multisig/actions';

const defaultRecipientsData = `0x79DF43B54c31c72a3d93465bdf72317C751822B3,1000000000000000000\n0x9249fE90Ed0782729532140a2Da4814b5e6C46f1,2000000000000000000`;
class TransactionCreation extends Component {
  state = {
    recipientsData: defaultRecipientsData,
  }
  onRecipientsDataChange = e => {
    this.setState({
      recipientsData: e.target.value,
    });
  }
  render() {
    const { owners, account, history, create } = this.props;
    const isOwner = owners.includes(account);
    if (!isOwner) {
      history.push('/');
    }
    
    return (
      <div>
        <textarea style={{ width: 500, height: 200 }} value={this.state.recipientsData} onChange={this.onRecipientsDataChange}></textarea>
        <br />
        <br />
        <button onClick={() => create(this.state.recipientsData)}>Send transaction</button>
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
