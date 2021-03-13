const newPostReducer = (state = "", action) => {
  switch (action.type) {
    case 'CHANGE_CONTENT':
      return action.data;
    default:
        return state;
  }
};

export const setContent = (content) => {
  return async dispatch => {
    dispatch({
      type: "CHANGE_CONTENT",
      data: content,
    })
  }
}

export default newPostReducer;
