import React from 'react';
import { useQuery } from 'react-query';
import { getUserMyself } from 'src/api';
import EditUserDetailsForm from 'src/components/Form/EditUserDetailsForm';
import { useStore } from 'src/store';
import { UserDetails } from 'src/types/UserTypes';

const ProfileContainer: React.FC = () => {
  const { firstName } = useStore((state) => state.userDetails);
  const setUserDetails = useStore((state) => state.setUserDetails);
  const { isLoading } = useQuery('userMyself', getUserMyself, {
    onSuccess: (data: UserDetails) => setUserDetails({ ...data }),
    refetchOnWindowFocus: false,
  });

  return (
    <div className="flex flex-col w-full h-full px-4 py-8">
      <div className="mx-72">
        {isLoading && <div>Loading...</div>}
        {!isLoading && (
          <>
            <div className="text-4xl mb-2">{`Welcome, ${firstName}`}</div>
            <EditUserDetailsForm />
          </>
        )}
      </div>
    </div>
  );
};

export default ProfileContainer;
