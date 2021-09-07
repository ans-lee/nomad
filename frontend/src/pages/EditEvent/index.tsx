import React from 'react';
import EditEventForm from 'src/components/Form/EditEventForm';
import Header from 'src/components/Header';

const EditEventPage: React.FC = () => {
  return (
    <>
      <Header />
      <div className="h-screen-nav m-auto flex flex-col justify-center w-1/4">
        <div className="h-full rounded-md border border-gray-300 p-4 bg-white sm:h-auto">
          <h1 className="text-4xl text-center mb-4">Edit Event</h1>
          <EditEventForm />
        </div>
      </div>
    </>
  );
};

export default EditEventPage;
