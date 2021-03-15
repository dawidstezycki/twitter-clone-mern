import userService from '../services/users';

const viewedUserRelationshipReducer = (state = null, action) => {
  switch (action.type) {
    case 'ADD_VIEWED_USER_RELATIONSHIP':
      return [...state, action.data];
    case 'SET_VIEWED_USER_RELATIONSHIPS':
      return action.data;
    case 'DELETE_VIEWED_USER_RELATIONSHIP':
      return state.filter((relationship) => {
        return relationship.follower.id !== action.data;
      });
    default:
      return state;
  }
};

export const getViewedUserRelationships = (userid) => {
  return async (dispatch) => {
    const user = await userService.getUser(userid);
    const relationships = user.relationships;
    dispatch({
      type: 'SET_VIEWED_USER_RELATIONSHIPS',
      data: relationships,
    });
  };
};

export const setViewedUserRelationshipsToNull = () => {
  return async (dispatch) => {
    dispatch({
      type: 'SET_VIEWED_USER_RELATIONSHIPS',
      data: null,
    });
  };
};

export const addViewedUserRelationship = (userFollowing, userFollowed) => {
  return async (dispatch) => {
    const newRelationship = {
      follower: { username: userFollowing.username, id: userFollowing.id },
      followed: { username: userFollowed.username, id: userFollowed.id },
    };
    dispatch({
      type: 'ADD_VIEWED_USER_RELATIONSHIP',
      data: newRelationship,
    });
  };
};

export const deleteViewedUserRelationship = (userFollowing) => {
  return async (dispatch) => {
    dispatch({
      type: 'DELETE_VIEWED_USER_RELATIONSHIP',
      data: userFollowing.id,
    });
  };
};

export default viewedUserRelationshipReducer;
