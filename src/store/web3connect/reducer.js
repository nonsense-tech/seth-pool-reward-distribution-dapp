import { INITIALIZE, CHANGE_ACCOUNT } from './constants';

const initState = {
  web3: null,
  initialized: false,
  account: null,
  balance: 0,
};

export default function(state = initState, { type, data }) {
  switch (type) {
    case INITIALIZE:
      const { web3, initialized, account, balance } = data;
      return { ...state, web3, initialized, account, balance };
    case CHANGE_ACCOUNT:
      return { ...state, account: data.account };
    default:
      return state;
  }
}
