import React from 'react';
import CreateEventForm from 'src/components/Form/CreateEventForm';
import Header from 'src/components/Header';

const CreateEventPage: React.FC = () => (
  <>
    <Header />
    <div className="h-screen m-auto flex flex-col justify-center">
      <div className="h-screen rounded-md border border-gray-300 p-4 bg-gray-100 sm:h-auto">
        <CreateEventForm />
      </div>
    </div>
  </>
);

export default CreateEventPage;
