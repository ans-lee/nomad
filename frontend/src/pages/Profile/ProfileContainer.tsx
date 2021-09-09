import React from 'react';
import { useQuery } from 'react-query';
import { getUserMyself } from 'src/api';
import { useStore } from 'src/store';
import { UserDetails } from 'src/types/UserTypes';
import EditUserDetailsForm from 'src/forms/EditUserDetailsForm';

const ProfileContainer: React.FC = () => {
  const { firstName } = useStore((state) => state.userDetails);
  const setUserDetails = useStore((state) => state.setUserDetails);
  const setUserAuthenticated = useStore((state) => state.setUserAuthenticated);

  const { isLoading } = useQuery('userMyself', getUserMyself, {
    onSuccess: (data: UserDetails) => {
      setUserDetails({ ...data });
      setUserAuthenticated(true);
    },
    onError: () => {
      setUserDetails({ id: '', email: '', firstName: '', lastName: '' });
      setUserAuthenticated(false);
    },
    refetchOnWindowFocus: false,
    retry: false,
  });

  return (
    <div className="flex flex-col w-full h-full px-4 py-8">
      <div className="w-1/3 mx-auto">
        {isLoading && <div>Loading...</div>}
        {!isLoading && (
          <>
            <div className="text-4xl mb-8">{`Welcome, ${firstName}`}</div>
            <EditUserDetailsForm />
          </>
        )}
      </div>
    </div>
  );
};

export default ProfileContainer;
