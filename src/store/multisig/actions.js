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

    const transactionCount = Number(await instance.methods.transactionCount().call());
    const transactions = await Promise.all(
      [...Array(transactionCount)].map((item, index) => instance.methods.transactions(index).call())
    );
    
    dispatch({
        type: INITIALIZE,
        data: {
          instance,
          owners,
        },
      });
  };
}

export function create(recipientsData) {
  return async (dispatch, getState) => {
    const instance = getState().multisig.instance;
    const { web3, account } = getState().web3connect;
    const airdropper = new web3.eth.Contract(AirdropperABI, addresses.airdropper);

    const parsedData = papaparse.parse(recipientsData, { delimiter: ',', header: false, skipEmptyLines: true }).data;
    const recipientsAddresses = [];
    const recipientsShares = [];
    parsedData.forEach(item => {
      recipientsAddresses.push(item[0]);
      recipientsShares.push(item[1]);
    });
    const transactionData = airdropper.methods.multisend(addresses.token, recipientsAddresses, recipientsShares).encodeABI();
    await instance.methods.submitTransaction(addresses.airdropper, 0, transactionData).send({ from: account });
  };
}

