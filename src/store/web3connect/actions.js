import Web3 from 'web3';
import { fromWei } from 'web3-utils';

import { INITIALIZE, CHANGE_ACCOUNT } from './constants';
import { initialize as initializeMultisig, loadTransactions } from '../multisig/actions';

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
      let currentAccount = (await web3.eth.getAccounts())[0].toLowerCase();
      const weiBalance = await web3.eth.getBalance(currentAccount);
      const ethBalance = fromWei(weiBalance);

      web3.currentProvider.publicConfigStore.on('update', async function(obj) {
        const account = obj.selectedAddress && obj.selectedAddress.toLowerCase();
        if (account && account !== currentAccount) {
          currentAccount = account;
          await dispatch({
            type: CHANGE_ACCOUNT,
            data: {
              account: currentAccount,
            }
          });
          dispatch(loadTransactions());
        }
      });
      
      await dispatch({
        type: INITIALIZE,
        data: {
          web3,
          initialized: true,
          account: currentAccount,
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
