import React, { useEffect } from 'react';
import MicropostFeed from './MicropostFeed';
import ProfileSidebar from './ProfileSidebar';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import {
  setViewedUser,
  setViewedUserToNull,
} from '../reducers/viewedUserReducer';

const ProfilePage = () => {
  const viewedUserId = useParams().id;
  const dispatch = useDispatch();
  const viewedUser = useSelector((state) => state.viewedUser);

  useEffect(() => {
    dispatch(setViewedUser(viewedUserId));
    
    return () => {
      dispatch(setViewedUserToNull());
    }
  }, [dispatch]);

  return (
    viewedUser && (
      <div className="container">
        <div className="row">
          <ProfileSidebar username={viewedUser.username} />
          <MicropostFeed microposts={viewedUser.microposts} />
        </div>
      </div>
    )
  );
};

export default ProfilePage;
