import { createStore, applyMiddleware, combineReducers } from 'redux'
import thunk from 'redux-thunk'
import api from './reducers' 
 
const createStoreWithMiddleware = applyMiddleware(thunk)(createStore)
const reducer = combineReducers(api.reducers)

export default () => {
  return createStoreWithMiddleware(reducer)
}
