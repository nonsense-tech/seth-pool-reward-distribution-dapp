import React, { Component } from 'react';
import { connect } from 'react-redux';

import './index.scss';
class TransactionList extends Component {
  render() {
    const { owners, account, history, transactions, requiredConfirmationCount } = this.props;
    const isOwner = owners.includes(account);
    return (
      <div>
        <span>You are {!isOwner && 'not'} an owner</span>
        <br />
        <br />
        {isOwner && <button onClick={() => history.push('/transactions/create')}>Create a new transaction</button>}
        <br />
        <br />
        <table className="table">
          <thead>
            <tr>
              <th>Index</th>
              <th>Confirmations</th>
              <th>Executed</th> 
            </tr>
          </thead>
          <tbody>
            {transactions.map((item, index) => 
              <tr
                key={index}
                className="table-item"
                onClick={() => history.push(`/transactions/${item.index}`)}
              >
                <td>{index + 1}</td>
                <td>{item.confirmationCount}/{requiredConfirmationCount}</td>
                <td>{item.executed ? 'Yes' : 'No'}</td> 
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  }
}

export default connect(
  state => ({
    ...state.multisig,
    account: state.web3connect.account,
  })
)(TransactionList);
