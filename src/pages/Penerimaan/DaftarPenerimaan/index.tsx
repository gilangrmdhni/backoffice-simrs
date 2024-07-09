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
import DateRangePicker from '@/components/DateRangePicker';
import { addDays } from 'date-fns';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.css';
import { FormatNumber } from '@/utils/formatNumber';
import { FormatDate } from '@/utils/formatDate';
import { useTranslation } from 'react-i18next';

const DaftarPenerimaanIndex = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { t } = useTranslation();
    useEffect(() => {
        dispatch(setPageTitle('Daftar Penerimaan'));
        dispatch(setTitle('Daftar Penerimaan'));
        dispatch(setBreadcrumbTitle(["Dashboard", "Master", "Daftar Penerimaan", "List"]));
    }, [dispatch]);

    const isRtl = useSelector((state: any) => state.themeConfig.rtlClass) === 'rtl' ? true : false;
    const [page, setPage] = useState<number>(1);
    const PAGE_SIZES: number[] = [10, 20, 30, 50, 100];
    const [pageSize, setPageSize] = useState<number>(PAGE_SIZES[0]);
    const [search, setSearch] = useState<string>('');
    const [status, setStatus] = useState<string>('');
    const [showFilter, setShowFilter] = useState<boolean>(false);
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({ columnAccessor: 'transactionDate', direction: 'desc' });
    const dateNow = new Date();
    const dateFirst = new Date(dateNow.getFullYear(), dateNow.getMonth(), 1);
    const [startDate, setStartDate] = useState<any>('');
    const [endDate, setEndDate] = useState<any>('');

    const formatDateState = (date: Date): string => {
        const year = date.getUTCFullYear();
        const month = String(date.getUTCMonth() + 1).padStart(2, '0');
        const day = String(date.getUTCDate()).padStart(2, '0');
        const hours = String(date.getUTCHours()).padStart(2, '0');
        const minutes = String(date.getUTCMinutes()).padStart(2, '0');
        const seconds = String(date.getUTCSeconds()).padStart(2, '0');
        const milliseconds = String(date.getUTCMilliseconds()).padStart(3, '0');

        return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}Z`;
    };

    const formatDateInput = (date: Date): string => {
        const year = date.getUTCFullYear();
        const month = String(date.getUTCMonth() + 1).padStart(2, '0');
        const day = String(date.getUTCDate()).padStart(2, '0');

        return `${year}-${month}-${day}`;
    };
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
        transactionType:"Deposit",
        startDate:startDate,
        endDate:endDate,
    });

    const [deleteBookBank, { isError: isDeleteError }] = useDeleteBookBankMutation();
    const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
    const [deleteId, setDeleteId] = useState<number>(0);

    const handleDelete = async () => {
        try {
            const response: any = await deleteBookBank(deleteId).unwrap();
            setDeleteId(0);
            setShowDeleteModal(false);
            responseCallback(response, null, null);
            toastMessage('Delete successful', 'success');
            setPage(1);
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
    useEffect(() => {
        refetch()
    },[startDate,endDate]);

    const [dates, setDates] = useState<{ startDate: Date | null, endDate: Date | null }>({ startDate: new Date(), endDate: addDays(new Date(), 30) });

    const handleFilter = (startDate: Date | null, endDate: Date | null) => {
        setDates({ startDate, endDate });
        console.log('Filtering data from', startDate, 'to', endDate);
    };

    return (
        <div>
            <div className="panel mt-6">
                <div className="flex md:items-center md:flex-row flex-col mb-5 gap-5">
                    <div className="rtl:ml-auto rtl:mr-auto">
                        <div className="grid grid-cols-4 gap-2">
                            <input type="text" className="form-input w-auto" placeholder="Keyword..." value={search} onChange={(e) => setSearch(e.target.value)} />
                            <Flatpickr
                                options={{
                                    mode: 'range',
                                    dateFormat: 'Y-m-d',
                                    // position: isRtl ? 'auto right' : 'auto left',
                                }}
                                className="form-input w-64 font-normal placeholder:"
                                // value={[startDate,endDate]}
                                placeholder={`Start Date - End Date`}
                                onChange={([startDate, endDate]) => {
                                    if(startDate != undefined){
                                        setStartDate(formatDateState(startDate));
                                    }
                                    if(endDate != undefined){
                                        setEndDate(formatDateState(endDate));
                                    }
                                }}
                            />
                        </div>
                    </div>
                    <div className="ltr:ml-auto">
                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => navigate(`/daftar-penerimaan/create`)}
                                type="button"
                                className="btn btn-primary"
                            >
                                + Tambah Daftar penerimaan
                            </button>
                        </div>
                    </div>
                </div>

                <div className="datatables">
                    <DataTable
                        highlightOnHover
                        className={`${isRtl ? 'whitespace-nowrap table-hover' : 'whitespace-nowrap table-hover'}`}
                        records={bookBankList?.data?.data}
                        columns={[
                            { accessor: 'transactionNo', title: t('No Transaksi'), sortable: true },
                            { accessor: 'transactionDate', title: t('Tanggal Transaksi'), sortable: true, render: (row: BookBankType) => (row.transactionDate ? FormatDate(row.transactionDate) : '') },

                            { accessor: 'coaName', title: t('Nama Akun'), sortable: true },
                            { accessor: 'amount', title: t('Jumlah'), sortable: true,render : (row: BookBankType) => FormatNumber(row.amount) },
                            { accessor: 'description', title: t('Keterangan'), sortable: true },
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

export default DaftarPenerimaanIndex;
