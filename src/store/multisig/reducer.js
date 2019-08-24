import { INITIALIZE } from './constants';

const initState = {
  instance: null,
  owners: [],
  transactions: [],
  requiredConfirmationCount: 0,
};

export default function(state = initState, { type, data }) {
  switch (type) {
    case INITIALIZE:
      const { instance, owners, transactions, requiredConfirmationCount } = data;
      return { ...state, instance, owners, transactions, requiredConfirmationCount };
    default:
      return state;
  }
}
