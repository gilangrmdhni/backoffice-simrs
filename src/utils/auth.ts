export const baseAuthName: string = import.meta.env.VITE_BASE_APP_NAME as string;

export const removeUserInfo = (): void => {
  localStorage.removeItem(`${baseAuthName}-token`);
  localStorage.removeItem(`${baseAuthName}-user`);
};

export const setToken = (token: string): void => {
  localStorage.setItem(`${baseAuthName}-token`, token);
};

export const setProfile = (profile: Record<string, any>): void => {
  localStorage.setItem(`${baseAuthName}-user`, JSON.stringify(profile));
};

export const getAuthenticated = (): string | null => {
  const token = localStorage.getItem(`${baseAuthName}-token`);
  return token || null;
};

export const getProfile = (): Record<string, any> | null => {
  const profileData = localStorage.getItem(`${baseAuthName}-user`);
  return (profileData && JSON.parse(profileData)) || null;
};
