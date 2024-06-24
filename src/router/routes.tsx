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
const CoAIndex = lazy(() => import('../pages/Master/Coa'));
const CoACreate = lazy(() => import('../pages/Master/Coa/form'));
const CoAUpdate = lazy(() => import('../pages/Master/Coa/form'));

const CurrencyIndex = lazy(() => import('../pages/Master/Currency'));
const CurrencyCreate = lazy(() => import('../pages/Master/Currency/form'));
const CurrencyUpdate = lazy(() => import('../pages/Master/Currency/form'));

// Company
const CompanyIndex = lazy(() => import('../pages/Master/Company'));
const CompanyCreate = lazy(() => import('../pages/Master/Company/form'));
const CompanyUpdate = lazy(() => import('../pages/Master/Company/form'));


// Company
const BranchIndex = lazy(() => import('../pages/Master/Branch'));
const BranchCreate = lazy(() => import('../pages/Master/Branch/form'));
const BranchUpdate = lazy(() => import('../pages/Master/Branch/form'));

// AgingSchedule
const AgingScheduleIndex = lazy(() => import('../pages/Receivable/AgingSchedule'));

// payment Period
const PaymentPeriodIndex = lazy(() => import('../pages/Receivable/PaymentPeriod'));

// Bank
const BookBankIndex = lazy(() => import('../pages/Bank/BookBank'));
const DepositCreate = lazy(() => import('../pages/Bank/Deposit/form'));
const PaymentCreate = lazy(() => import('../pages/Bank/Payment/form'));
const DepositUpdate = lazy(() => import('../pages/Bank/Deposit/form'));
const PaymentUpdate = lazy(() => import('../pages/Bank/Payment/form'));
const ReconcileCreate = lazy(() => import('../pages/Bank/Reconcile/form'));


// General Ledger History
const GeneralLedgerHistoryIndex = lazy(() => import('../pages/GeneralLedger/History'));

// General Ledger Summary
const GeneralLedgerSummaryIndex = lazy(() => import('../pages/GeneralLedger/Summary'));

// Kas Bank
const DaftarBukuKasIndex = lazy(() => import('../pages/BukuKas/DaftarBukuKas'));
const DaftarBukuKasCreate = lazy(() => import('../pages/BukuKas/DaftarBukuKas/form'));
const DaftarBukuKasDetail = lazy(() => import('../pages/BukuKas/DaftarBukuKas/detail'));
const DaftarTransferIndex = lazy(() => import('../pages/BukuKas/DaftarTransfer'));
const DaftarTransferCreate = lazy(() => import('../pages/BukuKas/DaftarTransfer/form'));

// Penerimaan
const DaftarPenerimaanIndex = lazy(() => import('../pages/Penerimaan/DaftarPenerimaan'));
const DaftarPenerimaanCreate = lazy(() => import('../pages/Penerimaan/DaftarPenerimaan/form'));

// Pengeluaran
const DaftarPengeluaranIndex = lazy(() => import('../pages/Pengeluaran/DaftarPengeluaran'));
const DaftarPengeluaranCreate = lazy(() => import('../pages/Pengeluaran/DaftarPengeluaran/form'));

// daftar biaya
const DaftarBiayaIndex = lazy(() => import('../pages/Pengeluaran/DaftarBiaya'));
const DaftarBiayaCreate = lazy(() => import('../pages/Pengeluaran/DaftarBiaya/form'));

// daftar biaya
const DaftarBiayaRutinIndex = lazy(() => import('../pages/Pengeluaran/DaftarBiayaRutin'));
const DaftarBiayaRutinCreate = lazy(() => import('../pages/Pengeluaran/DaftarBiayaRutin/form'));

const TrialJournalIndex = lazy(() => import('../pages/Journal/TrialJournal'));


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
        path: 'accountType/create',
        element: <AccountTypeCreate />,
        layout: 'default',
    },
    {
        path: 'accountType/update/:id',
        element: <AccountTypeUpdate />,
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
        element: <CompanyCreate />,
        layout: 'default',
    },
    {
        path: 'company/update/:id',
        element: <CompanyUpdate />,
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
        element: <BranchCreate />,
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
        path: '/aging-Schedule',
        element: <AgingScheduleIndex />,
        layout: 'default',
    },
    {
        path: '/payment-Period',
        element: <PaymentPeriodIndex />,
        layout: 'default',
    },
    {
        path: '/bookBank',
        element: <BookBankIndex />,
        layout: 'default',
    },
    {
        path: 'deposit',
        element: <DepositCreate />,
        layout: 'default',
    },
    {
        path: 'payment',
        element: <PaymentCreate />,
        layout: 'default',
    },
    {
        path: 'bookBank/update/:id',
        element: <PaymentUpdate />,
        layout: 'default',
    },
    {
        path: 'reconcile',
        element: <ReconcileCreate />,
        layout: 'default',
    },

    {
        path: '/general-ledger/History',
        element: <GeneralLedgerHistoryIndex />,
        layout: 'default',
    },
    {
        path: '/general-ledger/Summary',
        element: <GeneralLedgerSummaryIndex />,
        layout: 'default',
    },
    {
        path: '/daftar-buku-kas',
        element: <DaftarBukuKasIndex />,
        layout: 'default',
    },
    {
        path: '/daftar-buku-kas/detail/:coa',
        element: <DaftarBukuKasDetail />,
        layout: 'default',
    },
    {
        path: '/daftar-buku-kas/create',
        element: <DaftarBukuKasCreate />,
        layout: 'default',
    },
    {
        path: '/daftar-transfer',
        element: <DaftarTransferIndex />,
        layout: 'default',
    },
    {
        path: '/daftar-transfer/create',
        element: <DaftarTransferCreate />,
        layout: 'default',
    },
    {
        path: '/daftar-penerimaan',
        element: <DaftarPenerimaanIndex />,
        layout: 'default',
    },
    {
        path: '/daftar-penerimaan/create',
        element: <DaftarPenerimaanCreate />,
        layout: 'default',
    },
    {
        path: '/daftar-pengeluaran',
        element: <DaftarPengeluaranIndex />,
        layout: 'default',
    },
    {
        path: '/daftar-pengeluaran/create',
        element: <DaftarPengeluaranCreate />,
        layout: 'default',
    },
    {
        path: '/daftar-biaya',
        element: <DaftarBiayaIndex />,
        layout: 'default',
    },
    {
        path: '/daftar-biaya/create',
        element: <DaftarBiayaCreate />,
        layout: 'default',
    },
    {
        path: '/daftar-biaya-rutin',
        element: <DaftarBiayaRutinIndex />,
        layout: 'default',
    },
    {
        path: '/daftar-biaya-rutin/create',
        element: <DaftarBiayaRutinCreate />,
        layout: 'default',
    },
    {
        path: '/journal/trial-journal',
        element: <TrialJournalIndex />,
        layout: 'default',
    }
];

export { routes };
