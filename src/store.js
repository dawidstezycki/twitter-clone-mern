import {createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'

import micropostReducer from './reducers/micropostReducer'
import usersReducer from './reducers/usersReducer'
import userReducer from './reducers/userReducer'
import viewedUserReducer from './reducers/viewedUserReducer'
import relationshipReducer from './reducers/relationshipReducer'
import viewedUserRelationshipReducer from './reducers/viewedUserRelationshipReducer'
import newPostReducer from './reducers/newPostReducer'

const reducer = combineReducers({
  microposts: micropostReducer,
  users: usersReducer,
  user: userReducer,
  viewedUser: viewedUserReducer,
  relationships: relationshipReducer,
  viewedUserRelationships: viewedUserRelationshipReducer,
  newPost: newPostReducer,
})

const store = createStore(reducer, composeWithDevTools(applyMiddleware(thunk)))

export default store;