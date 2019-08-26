import React, { Component } from 'react';
import { connect } from 'react-redux';
import InputDataDecoder from 'ethereum-input-data-decoder';

import CsvLoader from '../../../components/CsvLoader';

import AirdropperABI from '../../../contracts/ABIs/airdropper.json';
import { confirm } from '../../../store/multisig/actions';

const decoder = new InputDataDecoder(AirdropperABI);

function compare(array1, array2) {
  const sameSize = array1.length === array2.length;
  return sameSize && array1.sort().every((value, index) => value === array2.sort()[index]);
}
class TransactionCreation extends Component {
  state = {
    match: false,
    csvData: [],
    sending: false,
    tx: {},
  }
  componentDidMount() {
    const { match, transactions } = this.props;
    const id = match.params.id;
    const tx = transactions.find(item => item.index === Number(id));
    this.setState({ tx });
  }
  setSending = bool => {
    this.setState({ sending: bool });
  }
  onDataLoaded = data => {
    this.setState({ csvData: data });
  }
  match = () => {
    const transactionData = decoder.decodeData(this.state.tx && this.state.tx.data);
    if (!transactionData.inputs[1]) return null;
    const addresses = transactionData.inputs[1].map(item => '0x' + item.toLowerCase());
    const values = transactionData.inputs[2].map(item => item.toString());

    const recipientsAddresses = [];
    const recipientsShares = [];
    this.state.csvData.forEach(item => {
      recipientsAddresses.push(item[0].toLowerCase());
      recipientsShares.push(item[1]);
    });    

    return compare(addresses, recipientsAddresses) && compare(values, recipientsShares);
  }
  onConfirm = async () => {
    this.setSending(true);
    await this.props.confirm(this.props.match.params.id);
    this.props.history.push('/transactions');
    this.setSending(false);
  }
  render() {
    const { owners, account, history } = this.props;
    const isOwner = owners.includes(account);
    if (!isOwner) {
      history.push('/');
    }

    if (this.state.sending) {
      return <span>Sending...</span>;
    }

    if (this.state.tx.youConfirmed) {
      return <span>You have already confirmed the transaction</span>;
    }
    
    return (
      <div>
        <CsvLoader onDataLoaded={this.onDataLoaded} />
        <br />
        <br />
        <span>{this.match() ? 'Match' : 'Not match'}</span>
        <br />
        <br />
        <button onClick={this.onConfirm}>Confirm transaction</button>
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
