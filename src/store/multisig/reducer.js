import { INITIALIZE, SET_TRANSACTIONS, SET_INITIALIZED, SET_TRANSACTIONS_LOADING } from './constants';

const initState = {
  instance: null,
  owners: [],
  transactions: [],
  requiredConfirmationCount: 0,
  initialized: false,
  transactionsLoading: false,
};

export default function(state = initState, { type, data }) {
  switch (type) {
    case INITIALIZE:
      const { instance, owners, requiredConfirmationCount } = data;
      return { ...state, instance, owners, requiredConfirmationCount };
    case SET_INITIALIZED:
      return { ...state, initialized: true };
    case SET_TRANSACTIONS:
      const { transactions } = data;
      return { ...state, transactions };
    case SET_TRANSACTIONS_LOADING:
      return { ...state, transactionsLoading: data.transactionsLoading };
    default:
      return state;
  }
}
