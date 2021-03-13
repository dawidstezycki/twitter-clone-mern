import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createMicropost } from '../reducers/micropostReducer';
import { setContent } from '../reducers/newPostReducer';

const MicropostForm = () => {
  const dispatch = useDispatch();
  const currentContent = useSelector(state=>state.newPost);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const noteToSubmit = currentContent;
    dispatch(createMicropost(noteToSubmit));
    dispatch(setContent(""))
  };

  const handleChange = (event) =>
  {
    dispatch(setContent(event.target.value));
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="input-field">
          <textarea
            type="text"
            id="micropost"
            className="materialize-textarea"
            maxLength="140"
            value={currentContent}
            onChange={handleChange}
          ></textarea>
          <label htmlFor="micropost">Micropost</label>
          <div>
            <button
              className="btn-small waves-effect waves-light"
              type="submit"
            >
              Post
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
export default MicropostForm;
