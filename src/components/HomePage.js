import React, { useEffect } from 'react';
import MicropostFeed from './MicropostFeed';
import Sidebar from './Sidebar';
import { useDispatch, useSelector } from 'react-redux';
import { getMicroposts } from '../reducers/micropostReducer';
import { getUserRelationships } from '../reducers/relationshipReducer';


const HomePage = () => {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user)
  const relationships = useSelector((state) => state.relationships);
  
  const micropostsByFollowedUsers = useSelector((state) => {
    let followedUsers = []
    if (state.relationships)
    {
      followedUsers = state.relationships.map((relationship)=>relationship.followed.id);
    }
    return state.microposts.filter((micropost)=>{
      return followedUsers.includes(micropost.user.id) || (micropost.user.id === user.id)
    })
  });

  useEffect(() => {
    dispatch(getMicroposts());
  }, [dispatch]);

  return (
    user && (
      <div className="container">
        {relationships && <div className="row">
          <Sidebar />
          <MicropostFeed microposts={micropostsByFollowedUsers} />
        </div>}
      </div>
    )
  );
};

export default HomePage;
