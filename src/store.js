import {createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'

import micropostReducer from './reducers/micropostReducer'
import userReducer from './reducers/userReducer'
import viewedUserReducer from './reducers/viewedUserReducer'
import newPostReducer from './reducers/newPostReducer'

const reducer = combineReducers({
  microposts: micropostReducer,
  user: userReducer,
  viewedUser: viewedUserReducer,
  newPost: newPostReducer,
})

const store = createStore(reducer, applyMiddleware(thunk))

export default store;