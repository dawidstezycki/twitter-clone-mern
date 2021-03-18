const loggedUserReducer = (state = null, action) => {
  switch (action.type) {
    case 'SET_LOGGED_USER':
      return action.data;
    default:
        return state;
  }
};

export const setLoggedUser = (user) => {
  return async dispatch => {
    dispatch({
      type: "SET_LOGGED_USER",
      data: user,
    })
  }
}

export default loggedUserReducer;
