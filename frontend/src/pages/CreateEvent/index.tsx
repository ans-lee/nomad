import React from 'react';
import CreateEventForm from 'src/forms/CreateEventForm';
import Header from 'src/components/Header';

const CreateEventPage: React.FC = () => (
  <>
    <Header />
    <div className="m-auto flex flex-col p-4 justify-center w-1/4">
      <div className="h-full rounded-md border border-gray-300 p-4 bg-white sm:h-auto">
        <h1 className="text-4xl text-center mb-4">Create Event</h1>
        <CreateEventForm />
      </div>
    </div>
  </>
);

export default CreateEventPage;
