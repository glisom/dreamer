import { useCallback } from 'react';
import { useRepositoriesContext } from '../context/RepositoriesProvider';
import {
  UpsertUserProfileInput,
  UserProfile,
  UserProfileRepository,
} from '../repositories/userProfileRepo';

export interface UseUserProfileResult {
  ready: boolean;
  repository: UserProfileRepository;
  getProfile: () => UserProfile | null;
  upsertProfile: (input: UpsertUserProfileInput) => UserProfile;
  deleteProfile: () => boolean;
}

export function useUserProfile(): UseUserProfileResult {
  const { ready, userProfile } = useRepositoriesContext();

  const getProfile = useCallback(() => userProfile.getProfile(), [userProfile]);
  const upsertProfile = useCallback(
    (input: UpsertUserProfileInput) => userProfile.upsertProfile(input),
    [userProfile]
  );
  const deleteProfile = useCallback(
    () => userProfile.deleteProfile(),
    [userProfile]
  );

  return {
    ready,
    repository: userProfile,
    getProfile,
    upsertProfile,
    deleteProfile,
  };
}
