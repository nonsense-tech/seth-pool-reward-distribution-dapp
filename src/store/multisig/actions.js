import { toWei, BN } from 'web3-utils';

import { INITIALIZE, SET_TRANSACTIONS, SET_INITIALIZED, SET_TRANSACTIONS_LOADING } from './constants';
import MultisigABI from '../../contracts/ABIs/multisig.json';
import AirdropperABI from '../../contracts/ABIs/airdropper.json';
import addresses from '../../contracts/addresses.json';

export function initialize() {
  return async (dispatch, getState) => {
    const { web3 } = getState().web3connect;
    const instance = new web3.eth.Contract(MultisigABI, addresses.multisig);
    const owners = await instance.methods.getOwners().call();
    const requiredConfirmationCount = Number(await instance.methods.required().call());
    
    await dispatch({
      type: INITIALIZE,
      data: {
        instance,
        owners: owners.map(item => item.toLowerCase()),
        requiredConfirmationCount,
      },
    });
    await dispatch(loadTransactions());
    await dispatch({ type: SET_INITIALIZED });
  };
}

export function loadTransactions() {
  return async (dispatch, getState) => {
    dispatch({
      type: SET_TRANSACTIONS_LOADING,
      data: { 
        loading: true,
      },
    });
    const { web3, account } = getState().web3connect;
    const instance = new web3.eth.Contract(MultisigABI, addresses.multisig);

    const transactionCount = Number(await instance.methods.transactionCount().call());
    let transactions = await Promise.all(
      [...Array(transactionCount)].map(async (item, index) => {
        const id = index;
        const data = await Promise.all([
          instance.methods.transactions(id).call(),
          instance.methods.getConfirmationCount(id).call(),
          instance.methods.confirmations(id, account).call(),
        ]);
        return {
          id,
          confirmationCount: Number(data[1]),
          youConfirmed: data[2],
          ...data[0],
        };
      })
    );
    transactions = transactions.filter(item =>
      item.destination.toLowerCase() === addresses.airdropper.toLowerCase()
    ).sort((a, b) => b.id - a.id);

    dispatch({
      type: SET_TRANSACTIONS,
      data: { transactions },
    });
    dispatch({
      type: SET_TRANSACTIONS_LOADING,
      data: { 
        loading: false,
      },
    });
  }
}

export function create(data) {
  return async (dispatch, getState) => {
    const instance = getState().multisig.instance;
    const { web3, account } = getState().web3connect;
    const airdropper = new web3.eth.Contract(AirdropperABI, addresses.airdropper);

    const recipientsAddresses = [];
    const recipientsShares = [];
    data.forEach(item => {
      recipientsAddresses.push(item[0]);
      recipientsShares.push(toWei(Number(item[1]).toFixed(6), 'ether'));
    });
    const transactionData = airdropper.methods.multisend(addresses.token, recipientsAddresses, recipientsShares).encodeABI();
    await instance.methods.submitTransaction(addresses.airdropper, 0, transactionData).send({ from: account });
  };
}

function confirmOrExecute(method, transactionId, txData) {
  return async (dispatch, getState) => {
    const instance = getState().multisig.instance;
    const { web3, account } = getState().web3connect;
    const airdropper = new web3.eth.Contract(AirdropperABI, addresses.airdropper);
    const airdropperGas = await airdropper.methods.multisend(
      addresses.token,
      txData.addresses,
      txData.values
    ).estimateGas({ from: addresses.multisig });
    const multisigGas = await instance.methods[method](transactionId).estimateGas({ from: account });
    await instance.methods[method](transactionId).send({ from: account, gas: airdropperGas + multisigGas });
    dispatch(loadTransactions());
  };
}

export function confirm(transactionId, txData) {
  return confirmOrExecute('confirmTransaction', transactionId, txData);
}

export function execute(transactionId, txData) {
  return confirmOrExecute('executeTransaction', transactionId, txData);
}

