import React, { useEffect } from 'react';
import MicropostFeed from './MicropostFeed';
import ProfileSidebar from './ProfileSidebar';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import {
  setViewedUser,
  setViewedUserToNull,
} from '../reducers/viewedUserReducer';
import {
  getViewedUserRelationships,
  setViewedUserRelationshipsToEmpty,
} from '../reducers/viewedUserRelationshipReducer';

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

  useEffect(() => {
    dispatch(getViewedUserRelationships(viewedUserId));
    
    return () => {
      dispatch(setViewedUserRelationshipsToEmpty());
    }
  }, [dispatch]);

  return (
    viewedUser && (
      <div className="container">
        <div className="row">
          <ProfileSidebar />
          <MicropostFeed microposts={viewedUser.microposts} />
        </div>
      </div>
    )
  );
};

export default ProfilePage;
