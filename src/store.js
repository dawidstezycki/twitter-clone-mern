import {createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'

import micropostReducer from './reducers/micropostReducer'
import usersReducer from './reducers/usersReducer'
import loggedUserReducer from './reducers/loggedUserReducer'
import viewedUserReducer from './reducers/viewedUserReducer'
import loggedUserRelationshipReducer from './reducers/loggedUserRelationshipReducer'
import viewedUserRelationshipReducer from './reducers/viewedUserRelationshipReducer'

const reducer = combineReducers({
  microposts: micropostReducer,
  users: usersReducer,
  loggedUser: loggedUserReducer,
  viewedUser: viewedUserReducer,
  loggedUserRelationships: loggedUserRelationshipReducer,
  viewedUserRelationships: viewedUserRelationshipReducer,
})

const store = createStore(reducer, composeWithDevTools(applyMiddleware(thunk)))

export default store;