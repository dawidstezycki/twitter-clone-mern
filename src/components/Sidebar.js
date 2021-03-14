import React from 'react'
import ProfilePreview from './ProfilePreview'
import MicropostForm from './MicropostForm'
import { useSelector } from 'react-redux';

const Sidebar = () => {
  const user = useSelector(state => state.user);
  return (
    <div className="col s3">
      <ProfilePreview username={user.username} />
      <MicropostForm />
    </div>
  );
};
export default Sidebar;