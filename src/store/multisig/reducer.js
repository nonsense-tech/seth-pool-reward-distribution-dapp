import { INITIALIZE } from './constants';

const initState = {
  instance: null,
  owners: [],
  transactions: [],
};

export default function(state = initState, { type, data }) {
  switch (type) {
    case INITIALIZE:
      const { instance, owners, transactions } = data;
      return { ...state, instance, owners, transactions };
    default:
      return state;
  }
}
