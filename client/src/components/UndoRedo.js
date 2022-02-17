import { ActionCreators as UndoActionCreators } from "redux-undo";
import { connect } from "react-redux";
import {
  setDoUpdateRFInternalInstance,
  setUndoRedoFlag,
} from "../Redux/actions/nodes";

let UndoRedo = ({ canUndo, canRedo, onUndo, onRedo }) => (
  <p>
    <button onClick={onUndo} disabled={!canUndo}>
      Undo
    </button>
    <button onClick={onRedo} disabled={!canRedo}>
      Redo
    </button>
  </p>
);

const mapStateToProps = (state) => {
  console.log("state is >>>>>>>>>>", state);
  return {
    canUndo: state.past.length > 0,
    canRedo: state.future.length > 0,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onUndo: async () => {
      await dispatch(setDoUpdateRFInternalInstance(true));
      await dispatch(setUndoRedoFlag(true));
      await dispatch(UndoActionCreators.undo());
    },
    onRedo: async () => {
      await dispatch(setDoUpdateRFInternalInstance(true));
      await dispatch(setUndoRedoFlag(true));
      await dispatch(UndoActionCreators.redo());
    },
  };
};

UndoRedo = connect(mapStateToProps, mapDispatchToProps)(UndoRedo);

export default UndoRedo;
