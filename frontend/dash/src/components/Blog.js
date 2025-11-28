import React from 'react';
import HomeHeader from './HomeHeader';
import HomeFooter from './HomeFooter';
import './Blog.css';

function Blog() {
  return (
    <>
      <HomeHeader />
      <div className="blog-root">
        <h1 className="blog-title">NGCFO Blog</h1>
        <p className="blog-desc">Welcome to our blog! Stay tuned for updates, news, and insights about secure certificate management, blockchain, and AI in education and employment.</p>
      </div>
      <HomeFooter />
    </>
  );
}

export default Blog; 