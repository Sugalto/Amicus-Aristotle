const isNode = typeof window === 'undefined';
const storage = isNode ? null : window.localStorage;

const getParam = (name, fallback = undefined) => {
  if (isNode) return fallback;
  const value = new URLSearchParams(window.location.search).get(name);
  return value || storage.getItem(`app_${name}`) || fallback;
};

export const appParams = {
  appId: getParam('app_id', import.meta.env.VITE_APP_ID),
  token: getParam('access_token'),
  fromUrl: getParam('from_url', window.location.href),
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || '',
};
