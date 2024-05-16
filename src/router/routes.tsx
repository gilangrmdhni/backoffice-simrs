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
const CoAIndex = lazy(() => import('../pages/Master/COA'));
const CoACreate = lazy(() => import('../pages/Master/COA/form'));

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
        path: '/users',
        element: <UserIndex />,
        layout: 'default',
    },
    {
        path: '/users/create',
        element: <UserCreate />,
        layout: 'default',
    },
    {
        path: '/users/update/:id',
        element: <UserUpdate />,
        layout: 'default',
    },
    {
        path: '/login',
        element: <LoginBoxed />,
        layout: 'blank',
    },
    {
        path: '/roles',
        element: <RoleIndex />,
        layout: 'default',
    },
    {
        path: '/roles/create',
        element: <RoleCreate />,
        layout: 'default',
    },
    {
        path: '/roles/update/:id',
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
