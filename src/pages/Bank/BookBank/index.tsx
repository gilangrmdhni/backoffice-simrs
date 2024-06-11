import React, { useState, useEffect } from 'react';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { Fragment } from 'react';
import { setBreadcrumbTitle, setPageTitle, setTitle } from '../../../store/themeConfigSlice';
import IconTrashLines from '@/components/Icon/IconTrashLines';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import IconPencil from '@/components/Icon/IconPencil';
import { Dialog, Transition } from '@headlessui/react';
import IconX from '@/components/Icon/IconX';
import IconPlus from '@/components/Icon/IconPlus';
import IconDownload from '@/components/Icon/IconDownload';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { responseCallback } from '@/utils/responseCallback';
import { toastMessage } from '@/utils/toastUtils';
import AnimateHeight from 'react-animate-height';
import { useGetBookBanksQuery, useDeleteBookBankMutation } from '@/store/api/bank/bookBank/bookBankApiSlice';
import { BookBankType } from '@/types/bookBankType';

const BookBankIndex = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(setPageTitle('Book Bank'));
        dispatch(setTitle('Book Bank'));
        dispatch(setBreadcrumbTitle(["Dashboard", "Master", "Book Bank"]));
    }, [dispatch]);

    const isRtl = useSelector((state: any) => state.themeConfig.rtlClass) === 'rtl' ? true : false;
    const [page, setPage] = useState<number>(1);
    const PAGE_SIZES: number[] = [10, 20, 30, 50, 100];
    const [pageSize, setPageSize] = useState<number>(PAGE_SIZES[0]);
    const [search, setSearch] = useState<string>('');
    const [status, setStatus] = useState<string>('');
    const [showFilter, setShowFilter] = useState<boolean>(false);
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({ columnAccessor: 'createdDate', direction: 'desc' });

    const {
        data: bookBankList,
        refetch,
        error,
        isLoading,
    } = useGetBookBanksQuery({
        orderBy: sortStatus.columnAccessor,
        orderType: sortStatus.direction,
        page: page,
        pageSize: pageSize,
        keyword: search,
        status: status,
    });

    const [deleteBookBank, { isError: isDeleteError }] = useDeleteBookBankMutation();
    const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
    const [deleteId, setDeleteId] = useState<number>(0);


    const handleDelete = async (id: number) => {
        try {
            const response = await deleteBookBank(id).unwrap();
            // Handle success response
        } catch (err) {
            // Handle error
            console.error("Error deleting book bank:", err);
            toastMessage("Failed to delete book bank.", 'error');
        }
    };
    

    const handleEdit = (id: number) => {
        navigate(`/bookBank/update/${id}`);
    };


    useEffect(() => {
        refetch();
    }, [page, refetch]);

    useEffect(() => {
        setPage(1);
    }, [sortStatus, search, pageSize]);

    return (
        <div>
            <div className="panel mt-6">
                <div className="flex md:items-center md:flex-row flex-col mb-5 gap-5">
                    <div className="rtl:ml-auto rtl:mr-auto">
                        <div className="grid grid-cols-3 gap-2">
                            <input type="text" className="form-input w-auto" placeholder="Keyword..." value={search} onChange={(e) => setSearch(e.target.value)} />
                            <select id="ctnSelect1" className="form-select text-white-dark" onChange={(e) => setStatus(e.target.value)}>
                                <option value={''}>All Status</option>
                                <option value={'Pending'}>Pending</option>
                                <option value={'Completed'}>Completed</option>
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
                            {/* <Tippy content="Add Book Bank">
                                <button
                                    onClick={() => navigate(`/bookBank/create`)}
                                    type="button"
                                    className="block w-10 h-10 p-2.5 rounded-full bg-white-light/40 dark:bg-dark/40 hover:text-primary hover:bg-white-light/90 dark:hover:bg-dark/6"
                                >
                                    <IconPlus />
                                </button>
                            </Tippy> */}
                            {/* <Tippy content="Download">
                                <Link to="" className="block w-10 h-10 p-2.5 rounded-full bg-white-light/40 dark:bg-dark/40 hover:text-primary hover:bg-white-light/90 dark:hover:bg-dark/60">
                                    <IconDownload />
                                </Link>
                            </Tippy> */}
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
                                    <option value={'Pending'}>Pending</option>
                                    <option value={'Completed'}>Completed</option>
                                </select>
                            </div>
                        </div>
                    </AnimateHeight>
                </div>
                <div className="datatables">
                    <DataTable
                        highlightOnHover
                        className={`${isRtl ? 'whitespace-nowrap table-hover' : 'whitespace-nowrap table-hover'}`}
                        records={bookBankList?.data?.data}
                        columns={[
                            { accessor: 'journalId', title: 'ID', sortable: true, textAlignment: 'center' },
                            { accessor: 'journalDescDebit', title: 'Debit Description', sortable: true },
                            { accessor: 'journalDescCredit', title: 'Credit Description', sortable: true },
                            { accessor: 'coaDebit', title: 'Debit', sortable: true },
                            { accessor: 'coaCredit', title: 'Credit', sortable: true },
                            { accessor: 'coaDebitName', title: 'Debit Account Name', sortable: true },
                            { accessor: 'coaDebitParent', title: 'Debit Account Parent', sortable: true },
                            { accessor: 'coaCreditName', title: 'Credit Account Name', sortable: true },
                            { accessor: 'coaCreditParent', title: 'Credit Account Parent', sortable: true },
                            { accessor: 'amount', title: 'Amount', sortable: true },
                            { accessor: 'source', title: 'Source', sortable: true },
                            { accessor: 'transactionDate', title: 'Transaction Date', sortable: true, render: (record: any) => new Date(record.transactionDate).toLocaleDateString() },
                            { accessor: 'vourcherId', title: 'Voucher ID', sortable: true },
                            { accessor: 'status', title: 'Status', sortable: true },

                        ]}
                        totalRecords={bookBankList?.data?.totalData}
                        recordsPerPage={pageSize}
                        page={page}
                        onPageChange={(p) => setPage(p)}
                        recordsPerPageOptions={PAGE_SIZES}
                        onRecordsPerPageChange={setPageSize}
                        sortStatus={sortStatus}
                        onSortStatusChange={setSortStatus}
                        minHeight={200}
                        paginationText={({ from, to, totalRecords }) => totalRecords > pageSize ? `Showing ${from} to ${to} of ${totalRecords} entries` : ''}
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
                                        <p>
                                            You will lose your data!
                                        </p>
                                        <div className="flex justify-end items-center mt-8">
                                            <button onClick={() => setShowDeleteModal(false)} type="button" className="btn btn-outline-dark">
                                                Cancel
                                            </button>
                                            <button
                                                onClick={() => handleDelete(deleteId)}
                                                type="button"
                                                className="btn btn-outline-danger ltr:ml-4 rtl:mr-4"
                                            >
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

export default BookBankIndex;
