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
import { useGetTransactionJournalQuery, useDeleteTransactionJournalMutation } from '@/store/api/daftarTransfer/daftarTransferApiSlice';
import { TransactionJournalType, TransactionDetail } from '@/types/transactionJournalType';
import { addDays } from 'date-fns';
import SelectSearch from 'react-select';
import DateRangePicker from '@/components/DateRangePicker';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.css';
import './index.css'

const Index = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(setPageTitle('Trial Journal'));
        dispatch(setTitle('Trial Journal'));
        dispatch(setBreadcrumbTitle(["Dashboard", "Master", "Trial Journal", "List"]));
    }, [dispatch]);

    const isRtl = useSelector((state: any) => state.themeConfig.rtlClass) === 'rtl' ? true : false;
    const [page, setPage] = useState<number>(1);
    const PAGE_SIZES: number[] = [10, 20, 30, 50, 100];
    const [pageSize, setPageSize] = useState<number>(PAGE_SIZES[0]);
    const [search, setSearch] = useState<string>('');
    const [status, setStatus] = useState<string>('Pending');
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
    } = useGetTransactionJournalQuery({
        orderBy: sortStatus.columnAccessor,
        orderType: sortStatus.direction,
        page: page,
        pageSize: pageSize,
        keyword: search,
        status: status,
        startDate: startDate,
        endDate: endDate,
    });

    const [deleteTransactionJournal, { isError: isDeleteError }] = useDeleteTransactionJournalMutation();
    const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
    const [deleteId, setDeleteId] = useState<number>(0);


    const handleDelete = async (id: number) => {
        try {
            const response = await deleteTransactionJournal(id).unwrap();
            responseCallback(response,
                toastMessage("Success delete Trial Journal.", 'success')
                
                , null);
                setPage(1);
                
            refetch();
        } catch (err) {
            console.error("Error deleting Transaction Journal:", err);
            toastMessage("Failed to delete Transaction Journal.", 'error');
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
    }, [startDate, endDate]);
    const [dates, setDates] = useState<{ startDate: Date | null, endDate: Date | null }>({ startDate: new Date(), endDate: addDays(new Date(), 30) });

    const FormattedDate = (date: any) => {
        const tanggal = new Date(date);

        const formattedDate = tanggal.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });

        return formattedDate;
    }
    const formatNumber = (number: any) => {
        // Mengubah angka menjadi string dengan dua digit desimal
        let formattedNumber = number.toFixed(1);
        // Mengganti titik desimal dengan koma
        formattedNumber = formattedNumber.replace(',', '.');
        // Menambahkan titik sebagai pemisah ribuan
        formattedNumber = formattedNumber.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        return formattedNumber;
    };
    return (
        <div className='trialjournal'>
            <div className="panel mt-6">
                <div className="flex md:items-center md:flex-row flex-col mb-5 gap-5">
                    <div className="rtl:ml-auto rtl:mr-auto">
                        <div className="grid grid-cols-1 gap-2">
                            <span className=' text-3xl '>Trial Journal</span>
                        </div>
                    </div>
                </div>
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
                                    if (startDate != undefined) {
                                        setStartDate(formatDateState(startDate));
                                    }
                                    if (endDate != undefined) {
                                        setEndDate(formatDateState(endDate));
                                    }
                                }}
                            />
                        </div>
                    </div>
                </div>

                <div className='panel p-5'>
                    <div className="relative">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                            <div className='!border-r-[0.5px] !border-r-grey'>
                                <div className="text-primary">
                                    <p className='p-0 m-0'>
                                        Current
                                    </p>

                                    <span className='text-xs text-slate-500'>
                                        24 Juni 2024
                                    </span>
                                </div>
                                <div className="mt-2 font-semibold text-2xl">$50,000.00</div>
                            </div>
                            <div className='!border-r-[0.5px] !border-r-grey'>
                                <div className="text-primary">
                                    <p className="p-0 m-0">
                                        Day Before
                                    </p>
                                    <span className='text-xs text-slate-500'>
                                        23 Juni 34
                                    </span>
                                </div>
                                <div className="mt-2 font-semibold text-2xl">$15,000.00</div>
                            </div>
                            <div className='!border-r-[0.5px] !border-r-grey'>
                                <div className="text-primary">
                                    <p className='p-0 m-0'>
                                        Week Before in same day
                                    </p>
                                    <span className='text-xs text-slate-500'>
                                        17 Juni 34
                                    </span>
                                </div>
                                <div className="mt-2 font-semibold text-2xl">$2,500.00</div>
                            </div>
                            <div className=''>
                                <div className="text-primary">
                                    <p className='p-0 m-0'>
                                        Month Before same date
                                    </p>
                                    <span className='text-xs text-slate-500'>
                                        24 Juni 2024
                                    </span>
                                </div>
                                <div className="mt-2 font-semibold text-2xl">$10,500.00</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="datatables">
                    <table>
                        <thead>
                            <tr className='!border-3 !border-b-black'>
                                <th className='!border-3 !border-b-black'>No Transaksi</th>
                                <th>Deskripsi</th>
                                <th>Kode Akun</th>
                                <th>Nama Akun</th>
                                <th>Debit</th>
                                <th>Kredit</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                bookBankList?.data?.data?.map((item: TransactionJournalType, index: number) => {
                                    let totalDebit = 0
                                    let totalCredit = 0
                                    return (
                                        <React.Fragment key={index}>
                                            <tr className='!bg-[rgba(224,230,237,0.3)]'>
                                                <td colSpan={6} className='font-bold'>{item.description}</td>
                                                <td className='font-bold flex justify-end w-32'>{FormattedDate(item.transactionDate)}</td>
                                            </tr>
                                            {item.details.map((details: TransactionDetail, key: number) => (
                                                <tr key={key} className='!border-3 !border-y-[#d8d8d866]'>
                                                    <td >{item.transactionNo}</td>
                                                    <td>{details.journalDesc}</td>
                                                    <td>{details.coaCode}</td>
                                                    <td>{details.coaName}</td>
                                                    <td>{details.debitAmount != null ? formatNumber(details.debitAmount) : 0}</td>
                                                    <td colSpan={2}>{details.creditAmount != null ? formatNumber(details.creditAmount) : 0}</td>
                                                </tr>
                                            ))}
                                            <tr className='!bg-[rgba(224,230,237,0.5)]'>
                                                <td colSpan={3} className='font-bold'></td>
                                                <td className='font-bold'>Total({item.transactionNo})</td>
                                                <td>{item.amount != null && item.amount != undefined ? formatNumber(item.amount) : 0}</td>
                                                <td>{item.amount != null && item.amount != undefined ? formatNumber(item.amount) : 0}</td>
                                                <td>
                                                    <button type="button" className='btn btn-primary h-[10px]' >Close</button>
                                                </td>
                                            </tr>
                                        </React.Fragment>
                                    )
                                })
                            }
                            {
                                bookBankList?.data?.data.length < 1 ? <tr><td colSpan={7} style={{ height: '200px', textAlign: 'center' }}>Data Not Found</td></tr> : null
                            }
                        </tbody>
                    </table>
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

export default Index;
