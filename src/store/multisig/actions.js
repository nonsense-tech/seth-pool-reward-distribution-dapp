import { INITIALIZE, SET_TRANSACTIONS, SET_INITIALIZED } from './constants';
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
        owners,
        requiredConfirmationCount,
      },
    });
    await dispatch(loadTransactions());
    await dispatch({ type: SET_INITIALIZED });
  };
}

export function loadTransactions() {
  return async (dispatch, getState) => {
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
    dispatch(loadTransactions());
  };
}

export function execute(transactionId) {
  return async (dispatch, getState) => {
    const instance = getState().multisig.instance;
    const { account } = getState().web3connect;
    await instance.methods.executeTransaction(transactionId).send({ from: account });
    dispatch(loadTransactions());
  };
}

