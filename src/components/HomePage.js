import React, { useEffect } from 'react';
import MicropostFeed from './MicropostFeed';
import Sidebar from './Sidebar';
import { useDispatch, useSelector } from 'react-redux';
import { getMicroposts } from '../reducers/micropostReducer';
import { getUserRelationships } from '../reducers/relationshipReducer';

const HomePage = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user)
  const followedUsers = useSelector((state)=>state.relationships.map((relationship)=>relationship.followed.id))
  const micropostsByFollowedUsers = useSelector((state) => {
    return state.microposts.filter((micropost)=>{
      return followedUsers.includes(micropost.user.id) || (micropost.user.id == user.id)
    })
  });
  
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
          {micropostsByFollowedUsers && <MicropostFeed microposts={micropostsByFollowedUsers} />}
        </div>
      </div>
    )
  );
};

export default HomePage;
