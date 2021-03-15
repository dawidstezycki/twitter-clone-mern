import userService from '../services/users';
import relationshipService from '../services/relationships';

const relationshipReducer = (state = null, action) => {
  switch (action.type) {
    case 'ADD_RELATIONSHIP':
      return [...state, action.data];
    case 'SET_RELATIONSHIPS':
      return action.data;
    case 'DELETE_RELATIONSHIP':
      return state.filter((relationship)=>{return relationship.id !== action.data});
    default:
        return state;
  }
};

export const getUserRelationships = (userid) => {
  return async dispatch => {
    const user = await userService.getUser(userid)
    const relationships = user.relationships
    dispatch({
      type: "SET_RELATIONSHIPS",
      data: relationships,
    })
  }
}

export const addRelationship = (userFollowed) => {
  return async dispatch => {
    const newRelationship = await relationshipService.createRelationship(userFollowed);
    dispatch({
      type: "ADD_RELATIONSHIP",
      data: newRelationship,
    })
  }
}

export const deleteRelationship = (relationshipId) => {
  return async dispatch => {
    await relationshipService.deleteRelationship(relationshipId);
    dispatch({
      type: "DELETE_RELATIONSHIP",
      data: relationshipId,
    })
  }
}


export default relationshipReducer;
