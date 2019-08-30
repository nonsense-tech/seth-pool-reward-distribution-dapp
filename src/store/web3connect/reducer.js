import { INITIALIZE, CHANGE_ACCOUNT, SET_GLOBAL_LOADING } from './constants';

const initState = {
  web3: null,
  initialized: false,
  account: null,
  balance: 0,
  globalLoading: false,
};

export default function(state = initState, { type, data }) {
  switch (type) {
    case INITIALIZE:
      const { web3, initialized, account, balance } = data;
      return { ...state, web3, initialized, account, balance };
    case CHANGE_ACCOUNT:
      return { ...state, account: data.account };
    case SET_GLOBAL_LOADING:
      return { ...state, globalLoading: data.globalLoading };
    default:
      return state;
  }
}
