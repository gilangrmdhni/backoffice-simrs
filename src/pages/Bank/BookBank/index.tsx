import React, { useState, useEffect, Fragment } from 'react';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { setBreadcrumbTitle, setPageTitle, setTitle } from '../../../store/themeConfigSlice';
import IconTrashLines from '@/components/Icon/IconTrashLines';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import IconEye from '@/components/Icon/IconEye'; // Import the IconEye component
import { Dialog, Transition } from '@headlessui/react';
import IconX from '@/components/Icon/IconX';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
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
    const [transactionType, setTransactionType] = useState<string>('');

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
        transactionType: transactionType,
    });

    const [deleteBookBank, { isError: isDeleteError }] = useDeleteBookBankMutation();
    const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
    const [deleteId, setDeleteId] = useState<string>('');

    const handleDelete = async (id: string) => {
        try {
            const response = await deleteBookBank(Number(id)).unwrap(); // Konversi id ke number
            toastMessage("Book bank deleted successfully.", 'success');
            refetch();
        } catch (err) {
            console.error("Error deleting book bank:", err);
            toastMessage("Failed to delete book bank.", 'error');
        }
    };

    const handleEdit = (id: string) => {
        navigate(`/bookBank/update/${id}`);
    };

    useEffect(() => {
        refetch();
    }, [page, refetch]);

    useEffect(() => {
        setPage(1);
    }, [sortStatus, search, pageSize]);

    const handleViewDetail = (id: string) => {
        navigate(`/bookBank/detail/${id}`);
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
                                <option value={'Pending'}>Pending</option>
                                <option value={'Completed'}>Completed</option>
                            </select>
                            <select id="transactionTypeSelect" className="form-select text-white-dark" onChange={(e) => setTransactionType(e.target.value)}> {/* Filter dropdown baru */}
                                <option value={''}>All Transaction Types</option>
                                <option value={'Deposit'}>Deposit</option>
                                <option value={'Withdrawal'}>Withdrawal</option>
                                <option value={'Transfer'}>Transfer</option>
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
                            { accessor: 'transactionDate', title: 'Transaction Date', sortable: true, render: (record: any) => new Date(record.transactionDate).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' }) },
                            { accessor: 'transactionNo', title: 'Transaction No', sortable: true },
                            { accessor: 'transactionType', title: 'Transaction Type', sortable: true },
                            { accessor: 'coaCode', title: 'Account No', sortable: true },
                            { accessor: 'coaName', title: 'Account Name', sortable: true },
                            { accessor: 'amount', title: 'Amount', sortable: true, render: (record: any) => Number(record.amount).toLocaleString('id-ID') },
                            { accessor: 'status', title: 'Status', sortable: true },
                            {
                                accessor: '',
                                title: 'Actions',
                                render: (s: BookBankType) => (
                                    <>
                                        <Tippy content="View Detail">
                                            <button type="button" onClick={() => handleViewDetail(String(s.transactionId))}>
                                                <IconEye className="ltr:mr-2 rtl:ml-2" />
                                            </button>
                                        </Tippy>
                                    </>
                                ),
                            },

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
                                            <button onClick={() => setShowDeleteModal(false)} type="button" className="btn btn-outline-dark hover:bg-gray-300">
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
