import { INITIALIZE } from './constants';
import Multisig from '../../contracts/multisig.json';

export function initialize() {
  return async (dispatch, getState) => {
    const web3 = getState().web3connect.web3;
    const instance = new web3.eth.Contract(Multisig.abi, Multisig.address);
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

export function create() {
  return async (dispatch, getState) => {
    const instance = getState().multisig.instance;
    const account = getState().web3connect.account;
    await instance.methods.submitTransaction(account, '1', '0x').send({ from: account });
  };
}

