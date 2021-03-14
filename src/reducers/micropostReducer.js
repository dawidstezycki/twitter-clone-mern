import micropostService from '../services/microposts';

const micropostReducer = (state = [], action) => {
  switch (action.type) {
    case 'NEW_MICROPOST':
      return [action.data, ...state];
    case 'SET_MICROPOSTS':
      return action.data
    default:
        return state;
  }
};

export const getMicroposts = () => {
  return async dispatch => {
    const microposts = await micropostService.getAll()
    microposts.reverse()
    dispatch({
      type: "SET_MICROPOSTS",
      data: microposts,
    })
  }
}

export const setMicroposts = (microposts) => {
  return async dispatch => {
    microposts.reverse()
    dispatch({
      type: "SET_MICROPOSTS",
      data: microposts,
    })
  }
}

export const createMicropost = (content) => {
  return async dispatch => {
    const newMicropost = await micropostService.create(content)
    dispatch({
      type: "NEW_MICROPOST",
      data: newMicropost,
    })
  }
}

export default micropostReducer;
