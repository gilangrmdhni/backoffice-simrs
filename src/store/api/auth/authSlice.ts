import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { setProfile, setToken, removeUserInfo, getProfile, getAuthenticated } from '@/utils/auth';

interface AuthState {
    user: UserProfile | null;
    isAuth: boolean;
    token: string | null;
}

interface UserProfile {
    token: string;
    displayName: string;
    email: string;
}

const storedUser = getProfile();
export const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: storedUser || null,
        isAuth: !!storedUser,
        token: getAuthenticated(),
    } as AuthState,
    reducers: {
        setUser: (state, action: PayloadAction<UserProfile>) => {
            setProfile(action.payload);
            setToken(action.payload.token);
            state.user = action.payload;
            state.isAuth = true;
            state.token = action.payload.token;
        },
        logOut: (state) => {
            removeUserInfo();
            state.user = null;
            state.isAuth = false;
            state.token = null;
        },
    },
});

export const { setUser, logOut } = authSlice.actions;
export default authSlice.reducer;
