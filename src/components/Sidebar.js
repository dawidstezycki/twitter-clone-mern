import React from 'react'
import ProfilePreview from './ProfilePreview'
import MicropostForm from './MicropostForm'

const Sidebar = () => {
  return (
    <div className="col s3">
      <ProfilePreview />
      <MicropostForm />
    </div>
  );
};
export default Sidebar;