
import { combineReducers } from 'redux';
import flashReducer from './flash/reducer';
import searchReducer from './search/reducer';

const reducers = combineReducers({
  flash: flashReducer,
  search: searchReducer,
});

export default reducers;
