import userService from '../services/users';

const viewedUserReducer = (state = null, action) => {
  switch (action.type) {
    case 'SET_VIEWED_USER':
      return action.data;
    default:
      return state;
  }
};

export const setViewedUser = (userid) => {
  return async (dispatch) => {
    const user = await userService.getUser(userid);
    dispatch({
      type: 'SET_VIEWED_USER',
      data: user,
    });
  };
};

export const setViewedUserToNull = () => {
  return async (dispatch) => {
    dispatch({
      type: 'SET_VIEWED_USER',
      data: null,
    });
  };
};

export default viewedUserReducer;
