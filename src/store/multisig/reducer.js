import { INITIALIZE } from './constants';

const initState = {
  instance: null,
  owners: [],
};

export default function(state = initState, { type, data }) {
  switch (type) {
    case INITIALIZE:
      const { instance, owners } = data;
      return { ...state, instance, owners };
    default:
      return state;
  }
}
