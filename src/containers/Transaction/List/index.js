import React, { Component } from 'react';
import { connect } from 'react-redux';

class TransactionList extends Component {
  render() {
    const { owners, account, history, transactions } = this.props;
    const isOwner = owners.includes(account);
    return (
      <div>
        <span>You are {!isOwner && 'not'} an owner</span>
        <br />
        <br />
        {isOwner && <button onClick={() => history.push('/transactions/create')}>Create a new transaction</button>}
        <br />
        <br />
        <table>
          <thead>
            <tr>
              <th>Index</th>
              <th>Executed</th> 
            </tr>
          </thead>
          <tbody>
            {transactions.map((item, index) => 
              <tr key={index} onClick={() => history.push(`/transactions/${item.index}`)}>
                <td>{index + 1}</td>
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
