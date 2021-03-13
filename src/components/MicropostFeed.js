import React from 'react'
import Micropost from './Micropost';
import { useSelector } from 'react-redux';

const MicropostFeed = () => {
  const microposts = useSelector((state) => state.microposts);

  return (
    <div className="col s9">
      <div className="section">
        <h4>Feed</h4>
      </div>
      <div>
        {microposts.map((post) =>
          <div key={post.id}>
            <div className="divider"></div>
            <Micropost micropost={post} />
          </div>
        )}
      </div>
    </div>
  );
};
export default MicropostFeed;