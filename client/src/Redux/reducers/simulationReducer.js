import {
  ADD_NODE_TO_SIMULATION,
  REMOVE_NODE_FROM_SIMULATION,
  SET_CURRENT_SIMULATION,
} from "../constants";

const initialState = {
  simulations: {
    "Authentication with GitHub": [
      "randomnode_1649613468513",
      "randomnode_1649613487157",
      "randomnode_1649613537384",
    ],
    "Loading PR files on Landing": [],
    "Saving diagram": [],
    "Loading diagram": [],
  },
  currentSimulation: "",
};

export const simulationReducer = (state = initialState, action) => {
  if (action.type === ADD_NODE_TO_SIMULATION) {
    try {
      let sims = state.simulations;
      if (state.currentSimulation in sims) {
        sims[state.currentSimulation].push(action.payload);
      }
      return {
        ...state,
        simulations: sims,
      };
    } catch (e) {
      console.log(e);
    }
  } else if (action.type === REMOVE_NODE_FROM_SIMULATION) {
    try {
      let sims = state.simulations;
      if (state.currentSimulation in sims) {
        let sim = sims[state.currentSimulation];
        var index = sim.indexOf(action.payload);
        if (index !== -1) {
          sim.splice(index, 1);
        }
        sims[state.currentSimulation] = sim;
      }
      return {
        ...state,
        simulations: sims,
      };
    } catch (e) {
      console.log(e);
    }
  } else if (action.type === SET_CURRENT_SIMULATION) {
    return {
      ...state,
      currentSimulation: action.payload,
    };
  } else {
    return state;
  }
};
