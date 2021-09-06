import React from 'react';
import { useQuery } from 'react-query';
import { getUserMyself } from 'src/api';
import { useStore } from 'src/store';
import { UserDetails } from 'src/types/UserTypes';

const ProfileContainer: React.FC = () => {
  const userDetails = useStore((state) => state.userDetails);
  const setUserDetails = useStore((state) => state.setUserDetails);
  const { isLoading } = useQuery('userMyself', getUserMyself, {
    onSuccess: (data: UserDetails) => setUserDetails({ ...data }),
    refetchOnWindowFocus: false,
  });

  const { email, firstName, lastName } = userDetails;

  return (
    <div className="flex flex-col w-full h-full px-4 py-8">
      <div className="mx-72">
        {isLoading && <div>Loading...</div>}
        {!isLoading && (
          <>
            <div className="text-4xl mb-2">{`Welcome, ${firstName}`}</div>
            <div className="text-3xl mb-2">{`${firstName} ${lastName}`}</div>
            <div className="text-xl mb-2">{email}</div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProfileContainer;
