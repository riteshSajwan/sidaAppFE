import { getUserToken } from 'src/common/utils/tokenUtils';

const isAuthenticatedUser = (): Promise<boolean> => {
  return getUserToken()
    .then((token) => !!token)
    .catch(() => false);
};

export { isAuthenticatedUser };
