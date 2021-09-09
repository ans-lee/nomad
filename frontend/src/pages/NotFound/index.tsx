import React from 'react';
import Header from 'src/components/Header';

const NotFoundPage: React.FC = () => (
  <>
    <Header />
    <div className="flex flex-col h-screen-nav justify-center mx-12">
      <div className="text-3xl mb-2">404 Not Found</div>
      <div className="text-xl">The requested page could not be found.</div>
    </div>
  </>
);

export default NotFoundPage;
