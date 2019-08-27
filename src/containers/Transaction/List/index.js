import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Table, Icon, Button, Typography } from 'antd';

import './index.scss';

const { Column } = Table;
const { Text } = Typography;

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
            transactionId: item.id,
            confirmations: (
              item.confirmationCount >= requiredConfirmationCount
              ? <Icon type="check" style={{ color: 'green' }} />
              : `${item.confirmationCount}/${requiredConfirmationCount}`
            ),
            executed: (
              <Icon
                type={item.executed ? 'check' : 'close'}
                style={{ color: item.executed ? 'green' : 'red' }}
              />
            ),
            yourConfirmation: (
              <Icon
                type={item.youConfirmed ? 'check' : 'close'}
                style={{ color: item.youConfirmed ? 'green' : 'red' }}
              />
            ),
          }))}
          onRow={(item) => ({ onClick: () => history.push(`/transactions/${item.transactionId}`) })}
        >
          <Column title="ID" dataIndex="transactionId" align="center" />
          <Column title="Confirmations" dataIndex="confirmations" align="center" />
          <Column title="Your confirmation" dataIndex="yourConfirmation" align="center" />
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
