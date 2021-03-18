import React, { useEffect } from 'react';
import MicropostFeed from './MicropostFeed';
import Sidebar from './Sidebar';
import { useDispatch, useSelector } from 'react-redux';
import { getMicroposts } from '../reducers/micropostReducer';

const HomePage = () => {
  const dispatch = useDispatch();

  const loggedUser = useSelector((state) => state.loggedUser)
  const loggedUserRelationships = useSelector((state) => state.loggedUserRelationships);
  const micropostsByFollowedUsers = useSelector((state) => {
    let followedUsers = []
    if (state.loggedUserRelationships)
    {
      followedUsers = state.loggedUserRelationships.map((relationship)=>relationship.followed.id);
    }
    return state.microposts.filter((micropost)=>{
      return followedUsers.includes(micropost.user.id) || (micropost.user.id === loggedUser.id)
    })
  });

  useEffect(() => {
    dispatch(getMicroposts());
  }, [dispatch]);

  return (
    loggedUser && (
      <div className="container">
        {loggedUserRelationships && <div className="row">
          <Sidebar />
          <MicropostFeed microposts={micropostsByFollowedUsers} />
        </div>}
      </div>
    )
  );
};

export default HomePage;
