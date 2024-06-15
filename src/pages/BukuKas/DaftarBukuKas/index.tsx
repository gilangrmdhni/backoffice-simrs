import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
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
import { COAType, usersType, OptionType } from '@/types';
import { useGetRolesQuery } from '@/store/api/roles/rolesApiSlice';
import { toastMessage } from '@/utils/toastUtils';
import { responseCallback } from '@/utils/responseCallback';
import { useGetCOAQuery, useDeleteCOAMutation, useGetOptionCOAQuery, useDownloadCoaMutation, useCOAUploadMutation } from '@/store/api/coa/coaApiSlice';
import { FetchBaseQueryError } from '@reduxjs/toolkit/dist/query/fetchBaseQuery';
import { SerializedError } from '@reduxjs/toolkit';
import SelectSearch from 'react-select';
import moment from "moment";
import './index.css';
import IconEye from '@/components/Icon/IconEye';

const Index = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Daftar Buku Kas'));
        dispatch(setTitle('Daftar Buku Kas'));
        dispatch(setBreadcrumbTitle(['Dashboard', 'Master', 'Buku Kas', 'List']));
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
    const {
        data: CoAList,
        refetch,
        error,
        isLoading,
    } = useGetCOAQuery<any>({
        keyword: search,
        orderBy: sortStatus.columnAccessor === 'coaCode' ? 'coaCode' : sortStatus.columnAccessor,
        orderType: sortStatus.direction,
        page: -1,
        status,
        parent: COALevel,
    });
    const {
        data: CoAListOption,
        refetch: refetchCoaOption,
    } = useGetOptionCOAQuery<any>({
        orderBy: sortStatus.columnAccessor === 'coaCode' ? 'coaCode' : sortStatus.columnAccessor,
        orderType: sortStatus.direction,
        pageSize: 20,
        status,
        level: 4,
        accounttype: 1,
        keyword: searchType
    });

    const [CoaUpload, { isLoading: isLoadingError, isError: isErrorUpload }] = useCOAUploadMutation();
    const [downloadTemplateCOA] = useDownloadCoaMutation();
    let TypeListOption = [];
    TypeListOption.push({
        value: "",
        label: "All Type",
        level: "",
    })
    {
        CoAListOption?.data?.map((option: any) => {
            TypeListOption.push({
                value: option.value,
                label: option.label,
                level: option.level ? option.level : '',
            })
        })
    }
    const { data: rolesList, refetch: rolesListRefetch } = useGetRolesQuery({});
    const [deleted, { isError }] = useDeleteCOAMutation();
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
        setTimeout(() => {
            refetchCoaOption();
            TypeListOption = []
            TypeListOption.push({
                value: "",
                label: "All Type",
                level: "",
            })
            {
                CoAListOption?.data?.map((option: any) => {
                    TypeListOption.push({
                        value: option.value,
                        label: option.label,
                        level: option.level ? option.level : '',
                    })
                })
            }
        }, 3000);
    }, [searchType]);

    useEffect(() => {
        refetch();
    }, [COALevel]);

    useEffect(() => {
        refetch();
        rolesListRefetch();
    }, [page]);

    useEffect(() => {
        setPage(1);
    }, [sortStatus, search, pageSize, role]);

    const colorStatus = (status: string) => {
        return status === 'InActive' ? 'primary' : 'success';
    };

    const fileInputRef = useRef<HTMLInputElement>(null);
    const handleUploadClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileChange = async (e: any) => {
        try {
            setIsLoadingUpload(true);
            const file = e.target.files[0];
            const response = await CoaUpload(file);
            if ('data' in response) {
                setIsLoadingUpload(false);
                responseCallback(response, null, null);
            } else if ('error' in response) {
                setIsLoadingUpload(false);
                if ('message' in response) {
                    responseCallback(response, (data: any) => {
                        navigate('/coa');
                    }, null);
                } else {
                    responseCallback(response, (data: any) => {
                        navigate('/coa');
                    }, null);
                }
            }
        } catch (error: any) {
            setIsLoadingUpload(false);
            toastMessage(error.message, 'error');
        } finally {
            setIsLoadingUpload(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = ''; // Reset input file
            }
        }
    };

    const handleDownload = async () => {
        try {
            const res = await downloadTemplateCOA({}).unwrap();
            const link = document.createElement('a');
            link.href = res as string;
            link.setAttribute('download', `COA_TEMPLATE_${moment().format("yyyyMMDD_Hms")}.xlsx`); // Adjust the file name as needed
            document.body.appendChild(link);
            link.click();
            link.parentNode?.removeChild(link);
        } catch (error: any) {
            console.error('Failed to download template', error);
            toastMessage(error.message, 'error');
        }
    };

    // Handler for checkbox select
    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSelectedRecords(CoAList?.data?.data.map((item: any) => item.coaId));
        } else {
            setSelectedRecords([]);
        }
    };

    const handleSelectRow = (id: number) => {
        setSelectedRecords((prevSelected: any) =>
            prevSelected.includes(id)
                ? prevSelected.filter((selectedId: number) => selectedId !== id)
                : [...prevSelected, id]
        );
    };
    const handleClick = (newStatus: React.SetStateAction<string>) => {
        setStatus(newStatus);
    };


    return (
        <div className='bukukas'>
            <div className="panel mt-6">
                <div className="flex md:items-center md:flex-row flex-col mb-5 gap-5 max-w-64 justify-between">
                    <div className="flex items-center gap-2 text-3xl">
                        Daftar Buku Bank & Kas
                    </div>
                    {/* <div className="flex items-center gap-2">
                        <button
                            type="button"
                            className="btn btn-secondary"
                        >
                            Tambah Transaksi
                        </button>
                    </div> */}
                </div>
                <div className="flex md:items-center md:flex-row flex-col mb-5 gap-5 max-w-64 justify-between">
                    <div className="flex items-center gap-2">
                        <input type="text" className="form-input" placeholder="Cari..." value={search} onChange={(e) => setSearch(e.target.value)} />
                    </div>
                    {/* <div className="ltr:ml-auto">
                        <div className="flex items-center gap-1">
                            <div className="flex border-2 rounded-lg overflow-hidden">
                                <button
                                    onClick={() => handleClick('Selesai')}
                                    className={`flex-1 px-4 py-2 ${status === 'Selesai' ? 'bg-purple-500 text-white' : 'bg-white text-black'}`}
                                >
                                    Semua
                                </button>
                                <button
                                    onClick={() => handleClick('Draf')}
                                    className={`flex-1 px-4 py-2 ${status === 'Draf' ? 'bg-purple-500 text-white border-l ' : 'bg-white text-black'}`}
                                >
                                    Active
                                </button>
                                <button
                                    onClick={() => handleClick('Void')}
                                    className={`flex-1 px-4 py-2 ${status === 'Void' ? 'bg-purple-500 text-white border-l ' : 'bg-white text-black'}`}
                                >
                                    Inaktive
                                </button>
                            </div>
                        </div>
                    </div> */}
                </div>

                <div className="datatables z-0">
                    <DataTable
                        highlightOnHover
                        className={`${isRtl ? 'whitespace-nowrap table-hover' : 'whitespace-nowrap table-hover'}`}
                        records={CoAList?.data?.data}
                        columns={[
                            {
                                accessor: 'coaCode',
                                title: 'KODE AKUN',
                                sortable: true,
                                render: (row: COAType, index: number) => (
                                    <>
                                        <span>{row.coaCode}</span>
                                    </>
                                )
                            },
                            {
                                accessor: 'accountTypeName',
                                title: 'TIPE',
                                sortable: true,
                                render: (row: COAType, index: number) => (
                                    <>
                                        <span>{row.accountTypeName}</span>
                                    </>
                                )
                            },
                            {
                                accessor: 'coaName',
                                title: 'NAMA AKUN',
                                sortable: true,
                                render: (row: COAType, index: number) => (
                                    <>
                                        <span style={{paddingLeft: (row.coaLevel > 4) ? `${(row.coaLevel - 4) * 0.5}rem` : '0rem' }}>
                                        </span>
                                        {row.accountTypeName !== "Header" && (
                                            <span className="yellow-bullet"></span>
                                        )}
                                        <span style={{fontWeight: row.accountTypeName === "Header" ? 'bold' : 'normal',}}>
                                            {row.coaName}
                                        </span>
                                    </>
                                )
                            },
                            {
                                accessor: 'balance',
                                title: 'SALDO',
                                sortable: true,
                                render: (row: COAType, index: number) => (
                                    <>
                                        <span>{row.balance}</span>
                                    </>
                                )
                            },
                            {
                                accessor: '',
                                title: 'ACTION',
                                render: (s: COAType) => {
                                    if(s.accountTypeName !== 'Header'){
                                        return(
                                            <>
                                                <Tippy content="Details">
                                                    <button type="button" onClick={() => navigate(`/bukukas/detail/${s.coaCode.replace(/\./g, '-')}`)} className="">
                                                        {/* <IconPencil className="ltr:mr-2 rtl:ml-2" /> */}
                                                        <IconEye className="ltr:mr-2 rtl:ml-2" />
                                                    </button>
                                                </Tippy>
                                            
                                            </>
                                        );
                                    }else{
                                        return(
                                            <>
                                                <span>-</span>
                                            </>
                                        )
                                    }
                                }
                            },
                        ]}
                        horizontalSpacing={`xs`}
                        verticalSpacing={`xs`}
                        totalRecords={CoAList?.totalData}
                        rowStyle={(state: COAType) => (state ? { padding: 0 } : { padding: 0 })}
                        fetching={isLoading}
                        minHeight={200}
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
                                        <h5 className="font-bold text-lg">Confimation</h5>
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

export default Index;
