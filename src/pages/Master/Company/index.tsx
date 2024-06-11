import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { Fragment, useEffect, useState } from 'react';
import { setBreadcrumbTitle, setPageTitle, setTitle } from '../../../store/themeConfigSlice';
import { useDeleteCompanyMutation, useGetCompaniesQuery } from '@/store/api/company/companyApiSlice';
import AnimateHeight from 'react-animate-height';
import IconTrashLines from '@/components/Icon/IconTrashLines';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import IconPencil from '@/components/Icon/IconPencil';
import { Dialog, Transition } from '@headlessui/react';
import IconX from '@/components/Icon/IconX';
import IconPlus from '@/components/Icon/IconPlus';
import { companyType } from '@/types';
import { toastMessage } from '@/utils/toastUtils';
import { responseCallback } from '@/utils/responseCallback';

const Index = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Company'));
        dispatch(setTitle('Company'));
        dispatch(setBreadcrumbTitle(["Dashboard", "Master", "Company", "List"]));
    }, [dispatch]);

    const isRtl = useSelector((state: any) => state.themeConfig.rtlClass) === 'rtl' ? true : false;
    const [page, setPage] = useState<number>(1);
    const PAGE_SIZES: number[] = [10, 20, 30, 50, 100];
    const [pageSize, setPageSize] = useState<number>(PAGE_SIZES[0]);
    const [search, setSearch] = useState<string>('');
    const [status, setStatus] = useState<string>('');
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
        pageSize: pageSize,
        orderBy: sortStatus.columnAccessor === 'companyName' ? 'companyName' : sortStatus.columnAccessor,
        orderType: sortStatus.direction,
        status,
    });

    const [deleted, { isError }] = useDeleteCompanyMutation();
    const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
    const [deleteId, setDeleteId] = useState<number>(0);
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
    }, [page, refetch]);

    useEffect(() => {
        setPage(1);
    }, [sortStatus, search, pageSize]);

    const colorStatus = (status: string) => {
        return status === 'Inactive' ? 'primary' : 'success';
    };

    return (
        <div>
            <div className="panel mt-6">
                <div className="flex md:items-center md:flex-row flex-col mb-5 gap-5">
                    <div className="rtl:ml-auto rtl:mr-auto">
                        <div className="grid grid-cols-2 gap-2">
                            <input type="text" className="form-input w-auto" placeholder="Keyword..." value={search} onChange={(e) => setSearch(e.target.value)} />
                            <select id="ctnSelect1" className="form-select text-white-dark" onChange={(e) => setStatus(e.target.value)}>
                                <option value={''}>All Status</option>
                                <option value={'Active'}>Active</option>
                                <option value={'Inactive'}>Inactive</option>
                            </select>
                        </div>
                    </div>
                    <div className="ltr:ml-auto">
                        <div className="grid grid-cols-1 gap-2">
                            <Tippy content="Add Company">
                                <button
                                    onClick={() => navigate(`/company/create`)}
                                    type="button"
                                    className="block w-10 h-10 p-2.5 rounded-full bg-white-light/40 dark:bg-dark/40 hover:text-primary hover:bg-white-light/90 dark:hover:bg-dark/6"
                                >
                                    <IconPlus />
                                </button>
                            </Tippy>
                        </div>
                    </div>
                </div>
                <div>
                    <AnimateHeight duration={300} height={showFilter ? 'auto' : 0}>
                        <div className="space-y-2 p-4 text-white-dark text-[13px] border-t border-[#d3d3d3] dark:border-[#1b2e4b]">
                            <div className="grid grid-cols-8 gap-2">
                                <input type="text" className="form-input w-auto" placeholder="Keyword..." value={search} onChange={(e) => setSearch(e.target.value)} />
                                <select id="ctnSelect1" className="form-select text-black" onChange={(e) => setStatus(e.target.value)}>
                                    <option value={''}>All Status</option>
                                    <option value={'Active'}>Active</option>
                                    <option value={'Inactive'}>Inactive</option>
                                </select>
                                <input type="text" className="form-input w-auto" placeholder="Keyword..." value={search} onChange={(e) => setSearch(e.target.value)} />
                                <input type="text" className="form-input w-auto" placeholder="Keyword..." value={search} onChange={(e) => setSearch(e.target.value)} />
                                <select id="ctnSelect1" className="form-select text-black" onChange={(e) => setStatus(e.target.value)}>
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
                        records={companyList?.data?.data}
                        columns={[
                            { accessor: 'companyName', title: 'Company Name', sortable: true },
                            { accessor: 'phone', title: 'Phone', sortable: true },
                            { accessor: 'email', title: 'Email', sortable: true },
                            { accessor: 'address', title: 'Address', sortable: true },
                            { accessor: 'financialClosingDate', title: 'Financial Closing Date', sortable: true, render: ({ financialClosingDate }) => new Date(financialClosingDate).toLocaleDateString() },
                            { accessor: 'currencyName', title: 'Currency', sortable: true },
                            { accessor: 'status', title: 'Status', sortable: true, render: ({ status }) => <span className={`badge bg-${colorStatus(status)}/10 text-${colorStatus(status)}`}>{status}</span> },
                            {
                                accessor: '',
                                title: 'Action',
                                width: 100,
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
                        totalRecords={companyList?.data?.totalData}
                        recordsPerPage={pageSize}
                        page={page}
                        onPageChange={(p) => setPage(p)}
                        recordsPerPageOptions={PAGE_SIZES}
                        onRecordsPerPageChange={setPageSize}
                        sortStatus={sortStatus}
                        onSortStatusChange={setSortStatus}
                        minHeight={200}
                        paginationText={({ from, to, totalRecords }) => `Showing ${from} to ${to} of ${totalRecords} entries`}
                    />
                </div>
            </div>
            <div className="mb-5">
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
                            <div className="fixed inset-0" />
                        </Transition.Child>
                        <div id="fadein_modal" className="fixed inset-0 bg-[black]/60 z-[999] overflow-y-auto">
                            <div className="flex items-start justify-center min-h-screen px-4">
                                <Dialog.Panel className="panel border-0 p-0 rounded-lg overflow-hidden w-full max-w-lg my-8 text-black dark:text-white-dark animate__animated animate__fadeIn">
                                    <div className="flex bg-[#fbfbfb] dark:bg-[#121c2c] items-center justify-between px-5 py-3">
                                        <h5 className="font-bold text-lg">Confirmation</h5>
                                        <button onClick={() => setShowDeleteModal(false)} type="button" className="text-white-dark hover:text-dark">
                                            <IconX />
                                        </button>
                                    </div>
                                    <div className="p-5">
                                        <p>You will lose your data!</p>
                                        <div className="flex justify-end items-center mt-8">
                                            <button onClick={() => setShowDeleteModal(false)} type="button" className="btn btn-outline-dark">
                                                Cancel
                                            </button>
                                            <button onClick={handleDelete} type="button" className="btn btn-outline-danger ltr:ml-4 rtl:mr-4">
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </Dialog.Panel>
                            </div>
                        </div>
                    </Dialog>
                </Transition>
            </div>
        </div>
    );
};

export default Index;
