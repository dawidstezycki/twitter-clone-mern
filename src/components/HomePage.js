import React, { useEffect } from 'react';
import MicropostFeed from './MicropostFeed';
import Sidebar from './Sidebar';
import { useDispatch, useSelector } from 'react-redux';
import { getMicroposts } from '../reducers/micropostReducer';

const HomePage = () => {
  const dispatch = useDispatch();
  const microposts = useSelector((state) => state.microposts);

  useEffect(() => {
    dispatch(getMicroposts());
  }, [dispatch]);

  return (
    <div className="container">
      <div className="row">
        <Sidebar />
        <MicropostFeed microposts={microposts}/>
      </div>
    </div>
  );
};

export default HomePage;
