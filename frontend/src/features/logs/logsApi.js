import { BACKEND_URL } from '../../app/constants';

export const getLogs = async () => {
  const response = await fetch(`${BACKEND_URL}/logs`, {
    cache: 'default',
  });

  return await response.json();
};
