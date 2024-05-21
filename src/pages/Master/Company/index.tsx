import { createDispatchHook, useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { Fragment, useEffect, useState } from 'react';
import { setBreadcrumbTitle, setPageTitle, setTitle } from '../../../store/themeConfigSlice';
import { useDeleteCompanyMutation, useGetCompaniesQuery } from '@/store/api/company/companyApiSlice';
import IconServer from '@/components/Icon/IconServer';
import AnimateHeight from 'react-animate-height';
import IconTrashLines from '@/components/Icon/IconTrashLines';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import IconPencil from '@/components/Icon/IconPencil';
import { Dialog, Transition } from '@headlessui/react';
import IconX from '@/components/Icon/IconX';
import IconPlus from '@/components/Icon/IconPlus';
import IconDownload from '@/components/Icon/IconDownload';
import { companyType } from '@/types';
import { useGetRolesQuery } from '@/store/api/roles/rolesApiSlice';
import { rolesType } from '@/types/rolesType';
import { toastMessage } from '@/utils/toastUtils';
import { responseCallback } from '@/utils/responseCallback';

const Index = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Company'));
        dispatch(setTitle('Company'));
        dispatch(setBreadcrumbTitle(["Dashboard", "Master", "Company","List"]));
    }, [dispatch]);

    const isRtl = useSelector((state: any) => state.themeConfig.rtlClass) === 'rtl' ? true : false;
    const [page, setPage] = useState<number>(1);
    const PAGE_SIZES: number[] = [10, 20, 30, 50, 100];
    const [pageSize, setPageSize] = useState<number>(PAGE_SIZES[0]);
    const [search, setSearch] = useState<string>('');
    const [status, setStatus] = useState<string>('');
    const [role, setRole] = useState<string>('');
    const [showFilter, setShowFilter] = useState<boolean>(false);
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({ columnAccessor: 'companyId', direction: 'asc' });
    const {
        data: companyList,
        refetch,
        error,
        isLoading,
    } = useGetCompaniesQuery({
        keyword: search,
        page: page,
        role: role,
        pageSize: pageSize,
        orderBy: sortStatus.columnAccessor === 'companyName' ? 'companyName' : sortStatus.columnAccessor,
        orderType: sortStatus.direction,
        status,
    });
    const { data: rolesList, refetch: rolesListRefetch } = useGetRolesQuery({});
    const [deleted, { isError }] = useDeleteCompanyMutation();
    const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
    const [deleteId, setDeleteId] = useState<number>(0);
    const [selectedRecords, setSelectedRecords] = useState<any>([]);
    const navigate = useNavigate();

    const handleDelete = async () => {
        try {
            const response: any = await deleted(deleteId);
            setDeleteId(0);
            setShowDeleteModal(false);
            responseCallback(response, null, null);
            refetch();
        } catch (err: any) {
            toastMessage(err.message, 'error');
        }
    };

    useEffect(() => {
        refetch();
        rolesListRefetch();
    }, [page, refetch, rolesListRefetch]);

    useEffect(() => {
        setPage(1);
    }, [sortStatus, search, pageSize, role]);

    const colorStatus = (status: string) => {
        return status === 'Inactive' ? 'primary' : 'success';
    };

    return (
        <div>
            <div className="panel mt-6">
                <div className="flex md:items-center md:flex-row flex-col mb-5 gap-5">
                    <div className="rtl:ml-auto rtl:mr-auto">
                        <div className="grid grid-cols-3 gap-2">
                            <input type="text" className="form-input w-auto" placeholder="Keyword..." value={search} onChange={(e) => setSearch(e.target.value)} />
                            <select id="ctnSelect1" className="form-select text-white-dark" onChange={(e) => setStatus(e.target.value)}>
                                <option value={''}>All Status</option>
                                <option value={'Active'}>Active</option>
                                <option value={'Inactive'}>Inactive</option>
                            </select>
                            <select id="ctnSelect2" className="form-select text-white-dark" onChange={(e) => setRole(e.target.value)}>
                                <option value={''}>All Role</option>
                                {rolesList?.data?.map((d: rolesType) => (
                                    <option key={d.roleID} value={d.roleID}>{d.roleName}</option>
                                ))}
                            </select>
                            <button
                                type="button"
                                className="hidden w-10 h-10 p-2.5 rounded-full bg-white-light/40 dark:bg-dark/40 hover:text-primary hover:bg-white-light/90 dark:hover:bg-dark/60"
                                onClick={() => setShowFilter((prevValue) => !prevValue)}
                            >
                                <span className="flex items-center">
                                    <img src="/assets/images/sorting-options.svg" />
                                </span>
                            </button>
                        </div>
                    </div>
                    <div className="ltr:ml-auto">
                        <div className="grid grid-cols-2 gap-2">
                            <Tippy content="Add Company">
                                <button
                                    onClick={() => navigate(`/company/create`)}
                                    type="button"
                                    className="block w-10 h-10 p-2.5 rounded-full bg-white-light/40 dark:bg-dark/40 hover:text-primary hover:bg-white-light/90 dark:hover:bg-dark/6"
                                >
                                    <IconPlus />
                                </button>
                            </Tippy>
                            <Tippy content="Download">
                                <Link to="" className="block w-10 h-10 p-2.5 rounded-full bg-white-light/40 dark:bg-dark/40 hover:text-primary hover:bg-white-light/90 dark:hover:bg-dark/60">
                                    <IconDownload />
                                </Link>
                            </Tippy>
                        </div>
                    </div>
                </div>
                <div>
                    <AnimateHeight duration={300} height={showFilter ? 'auto' : 0}>
                        <div className="space-y-2 p-4 text-white-dark text-[13px] border-t border-[#d3d3d3] dark:border-[#1b2e4b]">
                            <div className="grid grid-cols-8 gap-2">
                                <input type="text" className="form-input w-auto" placeholder="Keyword..." value={search} onChange={(e) => setSearch(e.target.value)} />
                                <select id="ctnSelect1" className="form-select text-white-dark" onChange={(e) => setStatus(e.target.value)}>
                                    <option value={''}>All Status</option>
                                    <option value={'Active'}>Active</option>
                                    <option value={'Inactive'}>Inactive</option>
                                </select>
                                <input type="text" className="form-input w-auto" placeholder="Keyword..." value={search} onChange={(e) => setSearch(e.target.value)} />
                                <select id="ctnSelect1" className="form-select text-white-dark" onChange={(e) => setStatus(e.target.value)}>
                                    <option value={''}>All Status</option>
                                    <option value={'Active'}>Active</option>
                                    <option value={'Inactive'}>Inactive</option>
                                </select>
                                <input type="text" className="form-input w-auto" placeholder="Keyword..." value={search} onChange={(e) => setSearch(e.target.value)} />
                                <select id="ctnSelect1" className="form-select text-white-dark" onChange={(e) => setStatus(e.target.value)}>
                                    <option value={''}>All Status</option>
                                    <option value={'Active'}>Active</option>
                                    <option value={'Inactive'}>Inactive</option>
                                </select>
                            </div>
                        </div>
                    </AnimateHeight>
                </div>
                <div className="datatables">
                    <DataTable
                        highlightOnHover
                        className={`${isRtl ? 'whitespace-nowrap table-hover' : 'whitespace-nowrap table-hover'}`}
                        records={companyList?.data}
                        columns={[
                            { accessor: 'companyId', title: 'ID', sortable: true, textAlignment: 'center' },
                            { accessor: 'companyName', title: 'Company Name', sortable: true },
                            { accessor: 'phone', title: 'Phone', sortable: true },
                            { accessor: 'email', title: 'Email', sortable: true },
                            { accessor: 'address', title: 'Address', sortable: true },
                            { accessor: 'financialClosingDate', title: 'Financial Closing Date', sortable: true, render: ({ financialClosingDate }) => new Date(financialClosingDate).toLocaleDateString() },
                            { accessor: 'currencyName', title: 'Currency', sortable: true },
                            { accessor: 'status', title: 'Status', sortable: true, render: ({ status }) => <span className={`badge bg-${colorStatus(status)}/10 text-${colorStatus(status)}`}>{status}</span> },
                            {
                                accessor: '',
                                title: 'action',
                                render: (s: companyType) => (
                                    <>
                                        <Tippy content="Edit">
                                            <button type="button" onClick={() => navigate(`/company/update/${s.companyId}`)}>
                                                <IconPencil className="ltr:mr-2 rtl:ml-2" />
                                            </button>
                                        </Tippy>
                                        <Tippy content="Delete">
                                            <button
                                                type="button"
                                                onClick={async () => {
                                                    setDeleteId(s.companyId as number);
                                                    setShowDeleteModal(true);
                                                }}
                                            >
                                                <IconTrashLines className="m-auto" />
                                            </button>
                                        </Tippy>
                                    </>
                                ),
                            },
                        ]}
                        totalRecords={companyList?.totalCount}
                        recordsPerPage={pageSize}
                        page={page}
                        onPageChange={(p) => setPage(p)}
                        recordsPerPageOptions={PAGE_SIZES}
                        onRecordsPerPageChange={setPageSize}
                        sortStatus={sortStatus}
                        onSortStatusChange={setSortStatus}
                        selectedRecords={selectedRecords}
                        onSelectedRecordsChange={setSelectedRecords}
                        minHeight={200}
                        paginationText={({ from, to, totalRecords }) => `Showing  ${from} to ${to} of ${totalRecords} entries`}
                    />
                </div>
            </div>
            <Transition appear show={showDeleteModal} as={Fragment}>
                <Dialog as="div" open={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black/60 z-50" />
                    </Transition.Child>
                    <div className="fixed inset-0 overflow-y-auto z-50">
                        <div className="flex items-center justify-center min-h-full p-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="panel border-0 p-0 max-w-md overflow-hidden w-full transform align-middle transition-all shadow-xl rounded-lg">
                                    <button
                                        type="button"
                                        onClick={() => setShowDeleteModal(false)}
                                        className="absolute top-4 ltr:right-4 rtl:left-4 text-white-dark hover:text-dark"
                                    >
                                        <IconX />
                                    </button>
                                    <div className="p-5">
                                        <div className="text-center">
                                            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-danger/20 text-danger">
                                                <IconTrashLines />
                                            </div>
                                            <div className="mt-5">
                                                <h4 className="text-lg font-medium">Delete company</h4>
                                                <p className="text-white-dark">
                                                    Are you sure you want to delete this company? This action cannot be undone.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-5 bg-white flex justify-center gap-4 p-3">
                                        <button
                                            type="button"
                                            className="btn btn-outline-danger"
                                            onClick={handleDelete}
                                        >
                                            Delete
                                        </button>
                                        <button
                                            type="button"
                                            className="btn btn-outline-secondary"
                                            onClick={() => setShowDeleteModal(false)}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </div>
    );
};

export default Index;