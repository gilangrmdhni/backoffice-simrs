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

// AccountGroup
const AccountGroupIndex = lazy(() => import('../pages/Master/AccountGroup'));
const AccountGroupCreate = lazy(() => import('../pages/Master/AccountGroup/form'));
const AccountGroupUpdate = lazy(() => import('../pages/Master/AccountGroup/form'));

// AccountType
const AccountTypeIndex = lazy(() => import('../pages/Master/AccountType'));
const AccountTypeCreate = lazy(() => import('../pages/Master/AccountType/form'));
const AccountTypeUpdate = lazy(() => import('../pages/Master/AccountType/form'));

// Buku Besar
const CoAIndex = lazy(() => import('../pages/Master/COA'));
const CoACreate = lazy(() => import('../pages/Master/COA/form'));
const CoAUpdate = lazy(() => import('../pages/Master/COA/form'));

const CurrencyIndex = lazy(() => import('../pages/Master/Currency'));
const CurrencyCreate = lazy(() => import('../pages/Master/Currency/form'));
const CurrencyUpdate = lazy(() => import('../pages/Master/Currency/form'));

// Company
const CompanyIndex = lazy(() => import('../pages/Master/Company'));
const CompanyCreate= lazy(() => import('../pages/Master/Company/form'));
const CompanyUpdate = lazy(() => import('../pages/Master/Company/form'));


// Company
const BranchIndex = lazy(() => import('../pages/Master/Branch'));
const BranchCreate= lazy(() => import('../pages/Master/Branch/form'));
const BranchUpdate= lazy(() => import('../pages/Master/Branch/form'));

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
        path: 'accountGroup',
        element: <AccountGroupIndex />,
        layout: 'default',
    },
    {
        path: 'accountGroup/create',
        element: <AccountGroupCreate />,
        layout: 'default',
    },
    {
        path: 'accountGroup/update/:id',
        element: <AccountGroupUpdate />,
        layout: 'default',
    },
    {
        path: 'accountType',
        element: <AccountTypeIndex />,
        layout: 'default',
    },
    {
        path: 'accountType/update/:id',
        element: <AccountTypeUpdate />,
        layout: 'default',
    },
    {
        path: 'accountType/create',
        element: <AccountTypeCreate />,
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
        path: 'coa/update/:id',
        element: <CoAUpdate />,
        layout: 'default',
    },
    {
        path: 'company',
        element: <CompanyIndex />,
        layout: 'default',
    },
    {
        path: 'company/create',
        element: <CompanyCreate/>,
        layout: 'default',
    },
    {
        path: 'company/update/:id',
        element: <CompanyUpdate/>,
        layout: 'default',
    },
    {
        path: '/currency/update/:id',
        element: <CompanyUpdate />,
        layout: 'default',
    },
    {
        path: 'branch',
        element: <BranchIndex />,
        layout: 'default',
    },
    {
        path: 'branch/create',
        element: <BranchCreate/>,
        layout: 'default',
    },
    {
        path: 'branch/update/:id',
        element: <BranchUpdate />,
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
