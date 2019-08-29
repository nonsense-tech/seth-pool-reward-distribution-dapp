import React, { Component } from 'react';
import { connect } from 'react-redux';
import InputDataDecoder from 'ethereum-input-data-decoder';
import { Button, Typography, Row, Col, Tag } from 'antd';
import { toWei, fromWei } from 'web3-utils';

import CsvLoader from '../../../components/CsvLoader';
import DataTable from '../../../components/DataTable';

import AirdropperABI from '../../../contracts/ABIs/airdropper.json';
import { confirm, execute } from '../../../store/multisig/actions';

import './index.scss';

const { Text } = Typography;

const decoder = new InputDataDecoder(AirdropperABI);

function compare(array1, array2) {
  const sameSize = array1.length === array2.length;
  return sameSize && array1.slice().sort().every((value, index) =>
    value === array2.slice().sort()[index]
  );
}
class TransactionCreation extends Component {
  state = {
    match: false,
    csvData: [],
    sending: false,
    tx: {},
    txData: {
      addresses: [],
      values: [],
    },
  }
  componentDidMount() {
    const { match, transactions } = this.props;
    const id = match.params.id;
    const tx = transactions.find(item => item.id === Number(id));
    const data = decoder.decodeData(tx && tx.data);
    let addresses = [];
    let values = [];
    if (data.inputs[1]) {
      addresses = data.inputs[1].map(item => '0x' + item.toLowerCase());
      values = data.inputs[2].map(item => item.toString());
    }
    this.setState({
      tx,
      txData: { addresses, values },
    });
  }
  setSending = bool => {
    this.setState({ sending: bool });
  }
  onDataLoaded = data => {
    this.setState({ csvData: data });
  }
  match = () => {
    const { addresses, values } = this.state.txData;
    const recipientsAddresses = [];
    const recipientsShares = [];
    this.state.csvData.forEach(item => {
      recipientsAddresses.push(item[0].toLowerCase());
      recipientsShares.push(toWei(Number(item[1]).toFixed(6), 'ether'));
    });    

    return compare(addresses, recipientsAddresses) && compare(values, recipientsShares);
  }
  call = async promise => {
    this.setSending(true);
    try {
      await promise;
      this.props.history.push('/transactions');
    } catch (error) {
      console.log(error);
    }
    this.setSending(false);
  }
  confirm = () => {
    const promise = this.props.confirm(this.props.match.params.id, this.state.txData);
    this.call(promise);
  }
  execute = () => {
    const promise = this.props.execute(this.props.match.params.id, this.state.txData);
    this.call(promise);
  }
  render() {
    const { owners, account } = this.props;
    const { tx, sending, txData } = this.state;
    const isOwner = owners.includes(account);
    
    const match = this.match();
    const csvLoaded = this.state.csvData.length > 0;
    let controls = null;

    if (!tx.executed && isOwner) {
      if (tx.youConfirmed) {
        let executeButton = null;
        if (tx.confirmationCount >= this.props.requiredConfirmationCount) {
          executeButton = (
            <Button
              className="execute-button"
              type="primary"
              onClick={this.execute}
              loading={sending}
            >
              Execute transaction
            </Button>
          );
        }
        controls = (
          <Row className="button-row" align="middle" type="flex" justify="space-between">
            <Text>You have already confirmed the transaction</Text>
            {executeButton}
          </Row>
          
        );
      } else {
        controls = (
          <Col>
            <Text>Upload your CSV to compare with transaction data</Text>
            <Row className="button-row" align="middle" type="flex" justify="space-between">
              <Row align="middle" type="flex">
                <CsvLoader onDataLoaded={this.onDataLoaded} disabled={sending} />
                <div className="status-badge">
                  {csvLoaded ? (
                    match ? (
                      <Tag color="green">MATCH</Tag>
                    ) : (
                      <Tag color="red">NOT MATCH</Tag>
                    )
                  ) : (
                    <Tag>NOT COMPARED</Tag>
                  )}
                </div>
              </Row>
              <Button
                type="primary"
                onClick={this.confirm}
                loading={sending}
              >
                Confirm transaction
              </Button>
            </Row>
          </Col>
        );
      }
    }

    return (
      <Col>
        {controls}
        <DataTable data={txData.addresses.map((item, index) => [item, fromWei(txData.values[index])])} />
      </Col>
    );
  }
}

export default connect(
  state => ({
    ...state.multisig,
    account: state.web3connect.account,
  }),
  { confirm, execute }
)(TransactionCreation);
