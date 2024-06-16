import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate,useParams } from 'react-router-dom';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { Fragment, useEffect, useState, useRef } from 'react';
import { setBreadcrumbTitle, setPageTitle, setTitle } from '../../../store/themeConfigSlice';
import { useDeleteUsersMutation, useGetUsersQuery } from '@/store/api/users/usersApiSlice';
import IconServer from '@/components/Icon/IconServer';
import AnimateHeight from 'react-animate-height';
import IconTrashLines from '@/components/Icon/IconTrashLines';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import IconPencil from '@/components/Icon/IconPencil';
import { Dialog, Transition } from '@headlessui/react';
import IconX from '@/components/Icon/IconX';
import IconPlus from '@/components/Icon/IconPlus';
import IconFile from '@/components/Icon/IconTxtFile';
import IconDownload from '@/components/Icon/IconDownload';
import { COAType, usersType, OptionType,Journal } from '@/types';
import { useGetRolesQuery } from '@/store/api/roles/rolesApiSlice';
import { toastMessage } from '@/utils/toastUtils';
import { responseCallback } from '@/utils/responseCallback';
import { useGetCOAQuery, useDeleteCOAMutation, useGetOptionCOAQuery, useDownloadCoaMutation, useCOAUploadMutation,useGetDetailCoaWithCoaQuery } from '@/store/api/coa/coaApiSlice';
import { FetchBaseQueryError } from '@reduxjs/toolkit/dist/query/fetchBaseQuery';
import { SerializedError } from '@reduxjs/toolkit';
import SelectSearch from 'react-select';
import moment from "moment";
import './index.css';
import { useTranslation } from 'react-i18next';
import { t } from 'i18next';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.css';
const Index = () => {
    const dispatch = useDispatch();
    const { coa } = useParams();
    const coaFix = coa?.replace(/\-/g, '.');
    useEffect(() => {
        dispatch(setPageTitle('Daftar Buku Kas'));
        dispatch(setTitle('Daftar Buku Kas'));
        dispatch(setBreadcrumbTitle(['Dashboard', 'Master', 'Buku Kas', coa]));
    });
    const [isLoadingUpload, setIsLoadingUpload] = useState<boolean>(false);
    const isRtl = useSelector((state: any) => state.themeConfig.rtlClass) === 'rtl' ? true : false;
    const [page, setPage] = useState<number>(1);
    const PAGE_SIZES: number[] = [10, 20, 30, 50, 100];
    const [pageSize, setPageSize] = useState<number>(PAGE_SIZES[0]);
    const [search, setSearch] = useState<string>('');
    const [searchType, setSearchType] = useState<string>('');
    const [status, setStatus] = useState<string>('');
    const [COALevel, setCOALevel] = useState<string>('');
    const [role, setRole] = useState<string>('');
    const [showFilter, setShowFilter] = useState<boolean>(false);
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({ columnAccessor: 'coaCode', direction: 'asc' });

    const dateNow = new Date();
    const dateFirst = new Date(dateNow.getFullYear(), dateNow.getMonth(), 1);

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

    const [startDate, setStartDate] = useState<any>(formatDateState(dateFirst));
    const [endDate, setEndDate] = useState<any>(formatDateState(dateNow));

    const {data,refetch,error,isLoading} = useGetDetailCoaWithCoaQuery<any>({
        'coa':coaFix,
        'startDate':startDate,
        'endDate':endDate,
    })

    const navigate = useNavigate();

    useEffect(() => {
        setPage(1);
    }, [sortStatus, search, pageSize, role]);

    const { t } = useTranslation();

    const formatDate = (date: Date): string => {
        const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'short', year: 'numeric' };
        return date.toLocaleDateString('en-GB', options);
    };

    useEffect(() => {
        refetch()
    },[startDate,endDate]);

    function formatDateString(dateString: string): string {
        return dateString.split('T')[0]; // Mengambil bagian tanggal (YYYY-MM-DD)
    }

    return (
        <div className='bukukas'>
            <div className='panel mt-6'>
                <div className='my-3 mx-3'>
                    <div className="flex justify-between px-5 panel bg-gradient-to-r from-violet-600 via-purple-500 to-violet-600">
                        <div>
                            <h2 className='text-xl text-white font-bold'>{t('Nama Akun')}</h2>
                            <h2 className='text-base text-white font-bold'>{t(data?.data?.coaName)}</h2>
                            <div className='flex flex-start'>
                                <p className='text-sm text-white'>{t('Periode: ')}</p>
                                <span className='flex'>
                                    <p className='text-sm text-white font-bold' >{t(formatDate(startDate))}</p>
                                    <p className='text-sm text-white font-bold' >-</p>
                                    <p className='text-sm text-white font-bold' >{t(formatDate(endDate))}</p>
                                </span>
                            </div>
                        </div>
                        <div className='content-center'>
                            <h2 className='text-xl text-white font-bold'>{t('Saldo Akhir')}</h2>
                            <h2 className='text-2xl text-white font-bold'>{t(`${data?.data?.currencyName != null ? data?.data?.currencyName : 'Rp. '}  ${data?.data?.balance.toLocaleString('en-US')}`)}</h2>
                        </div>
                    </div>
                    <div className='panel'>
                        <div className='flex flex-start'>
                            
                            {/* <Flatpickr value={startDate} options={{ dateFormat: 'Y-m-d', position: isRtl ? 'auto right' : 'auto left' }} className="form-input w-64 font-normal" onChange={(date) => setStartDate(date)} />
                            <span className='font-bold mx-3 content-center'> - </span>
                            <Flatpickr value={startDate} options={{ dateFormat: 'Y-m-d', position: isRtl ? 'auto right' : 'auto left' }} className="form-input w-64 font-normal" onChange={(date) => setStartDate(date)} /> */}
                            
                            {/* bawaan flatpickr */}
                            <Flatpickr
                                options={{
                                    mode: 'range',
                                    dateFormat: 'Y-m-d',
                                    // position: isRtl ? 'auto right' : 'auto left',
                                }}
                                className="form-input w-64 font-normal placeholder:"
                                // value={[startDate,endDate]}
                                placeholder={`${formatDateInput(startDate)} to ${formatDateInput(endDate)}`}
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
                        <div className='datatables mt-4'>
                            <DataTable
                                highlightOnHover
                                className={`${isRtl ? 'whitespace-nowrap table-hover' : 'whitespace-nowrap table-hover'}`}
                                records={data?.data?.journals}
                                columns={[
                                    {
                                        accessor: 'transactionDate',
                                        title: 'TANGGAL',
                                        sortable: true,
                                        render: (row: Journal, index: number) => (
                                            <>
                                                <span>{row?.createdDate ? formatDateString(row.createdDate) : '-'}</span>
                                            </>
                                        )
                                    },
                                    {
                                        accessor: 'transactionNo',
                                        title: 'NO TRANSAKSI',
                                        sortable: true,
                                        render: (row: Journal, index: number) => (
                                            <>
                                                <span>{row?.transactionDetail?.transactionNo}</span>
                                            </>
                                        )
                                    },
                                    {
                                        accessor: 'description',
                                        title: 'KETERANGAN',
                                        sortable: true,
                                        render: (row: Journal, index: number) => (
                                            <>
                                                <span>{row.journalDesc}</span>
                                            </>
                                        )
                                    },
                                    {
                                        accessor: 'coaDebit',
                                        title: 'Debit',
                                        sortable: true,
                                        render: (row: Journal, index: number) =>(
                                            <>
                                                <span>
                                                    {row.debitAmount != null && row.debitAmount != undefined ?
                                                        row.debitAmount.toLocaleString('en-US') : 0}
                                                </span>
                                            </>
                                        )
                                    },
                                    {
                                        accessor: 'coaCredit',
                                        title: 'Credit',
                                        sortable: true,
                                        render: (row: Journal, index: number) =>(
                                            <>
                                                <span>
                                                    {row.creditAmount != null && row.creditAmount != undefined ?
                                                        row.creditAmount.toLocaleString('en-US') : 0}
                                                </span>
                                            </>
                                        )
                                    },
                                    {
                                        accessor: 'amount',
                                        title: 'Saldo',
                                        sortable: true,
                                        render: (row: Journal, index: number) => (
                                            <>
                                                <span>
                                                    {row.balance != null && row.balance != undefined ?
                                                        row.balance.toLocaleString('en-US') : 0}
                                                </span>
                                            </>
                                        )
                                    },
                                ]}
                                horizontalSpacing={`xs`}
                                verticalSpacing={`xs`}
                                fetching={isLoading}
                                minHeight={200}
                            />
                        </div>

                        <button
                            className='w-full btn btn-outline-primary rounded-md '
                            onClick={()=>{
                                navigate('/bukukas')
                            }}
                        >
                            Kembali
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Index;
