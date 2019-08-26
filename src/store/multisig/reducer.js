import { INITIALIZE, SET_TRANSACTIONS } from './constants';

const initState = {
  instance: null,
  owners: [],
  transactions: [],
  requiredConfirmationCount: 0,
};

export default function(state = initState, { type, data }) {
  switch (type) {
    case INITIALIZE:
      const { instance, owners, requiredConfirmationCount } = data;
      return { ...state, instance, owners, requiredConfirmationCount };
    case SET_TRANSACTIONS:
      const { transactions } = data;
      return { ...state, transactions };
    default:
      return state;
  }
}
