import userService from '../services/users';
import relationshipService from '../services/relationships';

const loggedUserRelationshipReducer = (state = null, action) => {
  switch (action.type) {
    case 'ADD_LOGGED_USER_RELATIONSHIP':
      return [...state, action.data];
    case 'SET_LOGGED_USER_RELATIONSHIPS':
      return action.data;
    case 'DELETE_LOGGED_USER_RELATIONSHIP':
      return state.filter((relationship)=>{return relationship.id !== action.data});
    default:
        return state;
  }
};

export const getLoggedUserRelationships = (userid) => {
  return async dispatch => {
    const user = await userService.getUser(userid)
    const relationships = user.relationships
    dispatch({
      type: "SET_LOGGED_USER_RELATIONSHIPS",
      data: relationships,
    })
  }
}

export const addLoggedUserRelationship = (userFollowed) => {
  return async dispatch => {
    const newRelationship = await relationshipService.createRelationship(userFollowed);
    dispatch({
      type: "ADD_LOGGED_USER_RELATIONSHIP",
      data: newRelationship,
    })
  }
}

export const deleteLoggedUserRelationship = (relationshipId) => {
  return async dispatch => {
    await relationshipService.deleteRelationship(relationshipId);
    dispatch({
      type: "DELETE_LOGGED_USER_RELATIONSHIP",
      data: relationshipId,
    })
  }
}


export default loggedUserRelationshipReducer;
