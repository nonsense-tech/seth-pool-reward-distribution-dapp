import papaparse from 'papaparse';

import { INITIALIZE } from './constants';
import MultisigABI from '../../contracts/ABIs/multisig.json';
import AirdropperABI from '../../contracts/ABIs/airdropper.json';
import addresses from '../../contracts/addresses.json';

export function initialize() {
  return async (dispatch, getState) => {
    const web3 = getState().web3connect.web3;
    const instance = new web3.eth.Contract(MultisigABI, addresses.multisig);
    const owners = await instance.methods.getOwners().call();

    const data = await Promise.all([
      instance.methods.transactionCount().call(),
      instance.methods.required().call(),
    ]);
    const transactionCount = Number(data[0]);
    let transactions = await Promise.all(
      [...Array(transactionCount)].map(async (item, index) => {
        const data = await Promise.all([
          instance.methods.transactions(index).call(),
          instance.methods.getConfirmationCount(index).call(),
        ]);
        return {
          index,
          confirmationCount: Number(data[1]),
          ...data[0],
        };
      })
    );
    transactions = transactions.filter(item =>
      item.destination.toLowerCase() === addresses.airdropper.toLowerCase()
    ).sort((a, b) => b.index - a.index);
    
    dispatch({
        type: INITIALIZE,
        data: {
          instance,
          owners,
          transactions,
          requiredConfirmationCount: Number(data[1]),
        },
      });
  };
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
      recipientsShares.push(item[1]);
    });
    const transactionData = airdropper.methods.multisend(addresses.token, recipientsAddresses, recipientsShares).encodeABI();
    await instance.methods.submitTransaction(addresses.airdropper, 0, transactionData).send({ from: account });
  };
}

export function confirm(transactionId) {
  return async (dispatch, getState) => {
    const instance = getState().multisig.instance;
    const { account } = getState().web3connect;
    await instance.methods.confirmTransaction(transactionId).send({ from: account });
  };
}

