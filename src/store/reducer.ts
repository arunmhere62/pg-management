// third-party
import { combineReducers } from 'redux';
import pgLocationReducer from './slices/pgLocationSlice';
const reducer = combineReducers({
  pgLocation: pgLocationReducer
});

export default reducer;
