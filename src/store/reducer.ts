// third-party
import { combineReducers } from 'redux';
import pgLocationReducer from './slices/pgLocationSlice';
import breadcrumbReducer from './slices/breadcrumbSlice';

const reducer = combineReducers({
  pgLocation: pgLocationReducer,
  breadcrumb: breadcrumbReducer
});

export default reducer;
