import Web3 from 'web3';
import { fromWei } from 'web3-utils';

import { INITIALIZE } from './constants';
import { initialize as initializeMultisig } from '../../store/multisig/actions';

export function initialize() {
  return async dispatch => {
    try {
      let web3; 
      if (window.ethereum) {
          await window.ethereum.enable();
          web3 = new Web3(window.ethereum);
      } else if (window.web3) {
          web3 = new Web3(window.web3.currentProvider);
      } else {
          throw new Error('No web3 provider reachable.');
      }
      const account = (await web3.eth.getAccounts())[0];
      const weiBalance = await web3.eth.getBalance(account);
      const ethBalance = fromWei(weiBalance);
      
      await dispatch({
        type: INITIALIZE,
        data: {
          web3,
          initialized: true,
          account,
          balance: ethBalance,
        }
      });
      dispatch(initializeMultisig());
    } catch (error) {
      console.log(error);
      dispatch({
        type: INITIALIZE,
        data: {
          web3: null,
          initialized: false,
          account: null,
          balance: 0,
        },
      });
    }
  };
}
