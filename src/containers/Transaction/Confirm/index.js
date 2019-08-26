import React, { Component } from 'react';
import { connect } from 'react-redux';
import InputDataDecoder from 'ethereum-input-data-decoder';

import CsvLoader from '../../../components/CsvLoader';

import AirdropperABI from '../../../contracts/ABIs/airdropper.json';
import { confirm } from '../../../store/multisig/actions';

const decoder = new InputDataDecoder(AirdropperABI)

function compare(array1, array2) {
  const sameSize = array1.length === array2.length;
  return sameSize && array1.sort().every((value, index) => value === array2.sort()[index]);
}
class TransactionCreation extends Component {
  state = {
    match: false,
    csvData: [],
  }
  onDataLoaded = data => {
    this.setState({ csvData: data });
  }
  render() {
    const { owners, account, history, confirm, match, transactions } = this.props;
    const isOwner = owners.includes(account);
    if (!isOwner) {
      history.push('/');
    }

    const id = match.params.id;
    const tx = transactions.find(item => item.index === Number(id));
    const transactionData = decoder.decodeData(tx && tx.data);
    if (!transactionData.inputs[1]) return null;
    const addresses = transactionData.inputs[1].map(item => '0x' + item.toLowerCase());
    const values = transactionData.inputs[2].map(item => item.toString());

    const recipientsAddresses = [];
    const recipientsShares = [];
    this.state.csvData.forEach(item => {
      recipientsAddresses.push(item[0].toLowerCase());
      recipientsShares.push(item[1]);
    });    

    const ok = compare(addresses, recipientsAddresses) && compare(values, recipientsShares);
    
    return (
      <div>
        <CsvLoader onDataLoaded={this.onDataLoaded} />
        <br />
        <br />
        <span>{ok ? 'Match' : 'Not match'}</span>
        <br />
        <br />
        <button onClick={() => confirm(id)}>Confirm transaction</button>
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
