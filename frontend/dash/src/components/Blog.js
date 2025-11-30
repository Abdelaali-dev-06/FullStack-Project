import React from 'react';
import HomeHeader from './HomeHeader';
import HomeFooter from './HomeFooter';
import './Blog.css';

function Blog() {
  return (
    <>
      <HomeHeader />
      <div className="blog-root">
        <h1 className="blog-title">CERTA Blog</h1>
        <p className="blog-desc">Welcome to our blog! Stay tuned for updates, news, and insights about secure certificate management and blockchain in education and employment.</p>
        <p className='blog-new-desc'>🤖 New feature coming soon !! 🤖</p>
        <p className='blog-new-desc'>AI-powered tools for instant access and verification</p>
      </div>
      <HomeFooter />
    </>
  );
}

export default Blog; 