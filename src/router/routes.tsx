import { lazy } from 'react';
const Index = lazy(() => import('../pages/Index'));

// User
const UserIndex = lazy(() => import('../pages/users'));
const UserCreate = lazy(() => import('../pages/users/form'));
const UserUpdate = lazy(() => import('../pages/users/form'));
const LoginBoxed = lazy(() => import('../pages/Auth/LoginBoxed'));

// Role
const RoleIndex = lazy(() => import('../pages/roles'));
const RoleCreate = lazy(() => import('../pages/roles/form'));
const RoleUpdate = lazy(() => import('../pages/roles/form'));

// Buku Besar
const CoAIndex = lazy(() => import('../pages/Master/CoA'));
const CoACreate = lazy(() => import('../pages/Master/CoA/form'));

const CurrencyIndex = lazy(() => import('../pages/Master/Currency'));
const CurrencyCreate = lazy(() => import('../pages/Master/Currency/form'));
const CurrencyUpdate = lazy(() => import('../pages/Master/Currency/form'));

const routes = [
    // dashboard
    {
        path: '/',
        element: <Index />,
        layout: 'default',
    },
    {
        path: '/user',
        element: <UserIndex />,
        layout: 'default',
    },
    {
        path: '/user/create',
        element: <UserCreate />,
        layout: 'default',
    },
    {
        path: '/user/update/:id',
        element: <UserUpdate />,
        layout: 'default',
    },
    {
        path: '/login',
        element: <LoginBoxed />,
        layout: 'blank',
    },
    {
        path: '/role',
        element: <RoleIndex />,
        layout: 'default',
    },
    {
        path: '/role/create',
        element: <RoleCreate />,
        layout: 'default',
    },
    {
        path: '/role/update/:id',
        element: <RoleUpdate />,
        layout: 'default',
    },
    {
        path: 'coa',
        element: <CoAIndex />,
        layout: 'default',
    },
    {
        path: 'coa/create',
        element: <CoACreate />,
        layout: 'default',
    },
    {
        path: '/currency',
        element: <CurrencyIndex />,
        layout: 'default',
    },
    {
        path: '/currency/create',
        element: <CurrencyCreate />,
        layout: 'default',
    },
    {
        path: '/currency/update/:id',
        element: <CurrencyUpdate />,
        layout: 'default',
    },
    {
        path: '/bukti-jurnal-umum',
        element: <UserIndex />,
        layout: 'default',
    },
    {
        path: '/proses-akhir-bulan',
        element: <UserIndex />,
        layout: 'default',
    },
    {
        path: '/info-perusahaan',
        element: <UserIndex />,
        layout: 'default',
    },
];

export { routes };
