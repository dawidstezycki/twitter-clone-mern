import React, { useEffect } from 'react';
import MicropostFeed from './MicropostFeed';
import Sidebar from './Sidebar';
import { useDispatch, useSelector } from 'react-redux';
import { getMicroposts } from '../reducers/micropostReducer';
import { getUserRelationships } from '../reducers/relationshipReducer';

const HomePage = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const microposts = useSelector((state) => state.microposts);

  useEffect(() => {
    dispatch(getMicroposts());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getUserRelationships(user.id));
  }, [dispatch]);

  return (
    user && (
      <div className="container">
        <div className="row">
          <Sidebar />
          <MicropostFeed microposts={microposts} />
        </div>
      </div>
    )
  );
};

export default HomePage;
