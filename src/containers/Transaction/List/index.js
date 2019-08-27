import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Table, Icon, Button } from 'antd';

import './index.scss';

const { Column } = Table;

class TransactionList extends Component {
  render() {
    const { owners, account, history, transactions, requiredConfirmationCount } = this.props;
    const isOwner = owners.includes(account);
    return (
      <div>
        {isOwner && (
          <Button
            className="create-button"
            type="primary"
            onClick={() => history.push('/transactions/create')}
          >
            Create a new transaction
          </Button>
        )}
        <Table
          rowClassName="table-row"
          dataSource={transactions.map((item, index) => ({
            key: index,
            index,
            transactionId: item.index,
            confirmations: `${item.confirmationCount}/${requiredConfirmationCount}`,
            executed: (
              <Icon
                type={item.executed ? 'check' : 'close'}
                style={{ color: item.executed ? 'green' : 'red' }}
              />
            ),
          }))}
          onRow={(item) => ({ onClick: () => history.push(`/transactions/${item.transactionId}`) })}
        >
          <Column title="Index" dataIndex="index" align="center" />
          <Column title="Confirmations" dataIndex="confirmations" align="center" />
          <Column title="Executed" dataIndex="executed" align="center" />
        </Table>
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
