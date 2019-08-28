import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Table } from 'antd';

import CsvLoader from '../../../components/CsvLoader';
import DataTable from '../../../components/DataTable';

import { create } from '../../../store/multisig/actions';

import './index.scss';

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
  create = async () => {
    this.setSending(true);
    try {
      await this.props.create(this.state.data);
      this.props.history.push('/transactions');
    } catch (error) {
      console.log(error);
    }
    this.setSending(false);
  }
  render() {
    const { owners, account, history } = this.props;
    const { sending, data } = this.state;
    const isOwner = owners.includes(account);
    if (!isOwner) {
      history.push('/');
    }
    
    return (
      <div>
        <CsvLoader onDataLoaded={this.onDataLoaded} disabled={sending} />
        {data.length > 0 && (
          <Button
            className="create-button"
            type="primary"
            onClick={this.create}
            loading={sending}
          >
            Send transaction
          </Button>
        )}
        {data.length > 0 && <DataTable data={data} />}
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
