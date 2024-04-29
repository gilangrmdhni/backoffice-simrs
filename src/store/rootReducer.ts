
import themeConfigSlice from './themeConfigSlice';
import auth from './api/auth/authSlice';

const rootReducer = {
  themeConfig: themeConfigSlice,
  auth
};
export default rootReducer;
