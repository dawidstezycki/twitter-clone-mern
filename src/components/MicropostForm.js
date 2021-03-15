import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createMicropost } from '../reducers/micropostReducer';

const MicropostForm = () => {
  const dispatch = useDispatch();
  const [currentContent, setCurrentContent] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    const noteToSubmit = currentContent;
    dispatch(createMicropost(noteToSubmit));
    setCurrentContent('');
  };

  const handleChange = (event) => {
    setCurrentContent(event.target.value);
  };

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
