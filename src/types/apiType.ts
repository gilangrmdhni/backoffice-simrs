import { SerializedError } from '@reduxjs/toolkit';
import { FetchBaseQueryError } from '@reduxjs/toolkit/dist/query';

export interface LoginRequest {
    email: number;
    password: string;
}

export interface LoginResponse {
    token: string;
    displayName: string;
    email: string;
}

export interface ApiResponse<T> {
    data?: T;
    error?: FetchBaseQueryError;
}
