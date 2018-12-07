import { createStore, applyMiddleware, combineReducers } from 'redux'
import thunk from 'redux-thunk'
import reducers from './reducers'
import api from './rest' 
 
const createStoreWithMiddleware = applyMiddleware(thunk)(createStore)
const reducer = combineReducers(Object.assign({ app: reducers }, api.reducers))

export default () => {
  return createStoreWithMiddleware(reducer)
}
