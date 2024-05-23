import { useDispatch, useSelector } from 'react-redux';
import { Link, Navigate } from 'react-router-dom';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { Fragment, useEffect, useState,useRef } from 'react';
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
import { useNavigate } from 'react-router-dom';
import { COAType, usersType,OptionType } from '@/types';
import { number } from 'yup';
import { useGetRolesQuery } from '@/store/api/roles/rolesApiSlice';
import { rolesType } from '@/types/rolesType';
import { toastMessage } from '@/utils/toastUtils';
import { responseCallback } from '@/utils/responseCallback';
import { useGetCOAQuery,useDeleteCOAMutation,useGetOptionCOAQuery, useDownloadCoaMutation,useCOAUploadMutation } from '@/store/api/coa/coaApiSlice';
import '@/pages/Master/Coa/index.css';
import { FetchBaseQueryError } from '@reduxjs/toolkit/dist/query/fetchBaseQuery';
import { SerializedError } from '@reduxjs/toolkit';
import SelectSearch from 'react-select';
import moment from "moment";

const Index = () => {
    // const user = useSelector((state: any) => state.auth.user);
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('COA'));
        dispatch(setTitle('COA'));
        dispatch(setBreadcrumbTitle(['Dashboard','Master','COA','List']));
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
        pageSize:1000,
        status,
        parent : COALevel,
    });
    const {
        data: CoAListOption,
        refetch: refetchCoaOption,
    } = useGetOptionCOAQuery<any>({
        orderBy: sortStatus.columnAccessor === 'coaCode' ? 'coaCode' : sortStatus.columnAccessor,
        orderType: sortStatus.direction,
        pageSize:20,
        status,
        level : 4,
        accounttype : 1,
        keyword:searchType
    });

    const [CoaUpload, {isLoading:isLoadingError,isError: isErrorUpload}] = useCOAUploadMutation();


    const [downloadTemplateCOA] = useDownloadCoaMutation();


    let TypeListOption = [];
        TypeListOption.push({
            value: "",
            label: "All Type",
            level: "",
        })
    {
        CoAListOption?.data?.map((option: any) =>{
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
                CoAListOption?.data?.map((option: any) =>{
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
    const handleUploadClick =  () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileChange =  async (e: any) => {
        console.log("loading file")
        try {
            setIsLoadingUpload(true);
            const file = e.target.files[0];
            const response = await CoaUpload(file);
            if ('data' in response) {
                console.log("loading success");
                console.log("successUpload");
                setIsLoadingUpload(false);
                responseCallback(response, null, null);
            } else if ('error' in response) {
                console.log("loading success");
                console.log("errorUpload");
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
            console.log(error);
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

    return (
        <div>
            <div className="panel mt-6">
                <div className="flex md:items-center md:flex-row flex-col mb-5 gap-5 max-w-64">
                    <div className="rtl:ml-auto rtl:mr-auto">
                        <div className="grid grid-cols-3 gap-2">
                            <input type="text" className="form-input w-auto" placeholder="Keyword..." value={search} onChange={(e) => setSearch(e.target.value)} />
                            <select id="ctnSelect1" className="form-select text-white-dark" onChange={(e) => setStatus(e.target.value)}>
                                <option value={''}>All Status</option>
                                <option value={'active'}>Active</option>
                                <option value={'inactive'}>In Active</option>
                            </select>
                            {/* <select id="ctnSelect2" className="form-select text-white-dark w-48" onChange={(e) => setCOALevel(e.target.value)}>
                                <option value={""}>COA Level</option>
                                {CoAListOption?.map((d: OptionType, i: number) => {
                                    return <option value={d.value} className='truncate'>{d.label}</option>;
                                })}
                                
                            </select> */}
                            <SelectSearch 
                                    placeholder="All Type"
                                    options={TypeListOption}
                                    className="z-10"
                                    onInputChange={(e)=> setSearchType(e)}
                                    onChange={(dt: any)=>{setCOALevel(dt.value)}}
                                />
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
                        <div className="grid grid-cols-3 gap-2">
                            <Tippy content="Add CoA">
                                <button
                                    onClick={() => navigate(`/coa/create`)}
                                    type="button"
                                    className="block w-10 h-10 p-2.5 rounded-full bg-white-light/40 dark:bg-dark/40 hover:text-primary hover:bg-white-light/90 dark:hover:bg-dark/6"
                                >
                                    <IconPlus />
                                </button>
                            </Tippy>
                            <Tippy content="import File">
                                    <button
                                        type="button"
                                        onClick={handleUploadClick}
                                        className="block w-10 h-10 p-2.5 rounded-full bg-white-light/40 dark:bg-dark/40 hover:text-primary hover:bg-white-light/90 dark:hover:bg-dark/6"
                                    >
                                        {isLoadingUpload && <span className="animate-spin border-2 border-black border-l-transparent rounded-full w-5 h-5 ltr:mr-4 rtl:ml-4 inline-block align-middle"></span>}
                                        {!isLoadingUpload &&  <IconFile />}
                                        <input 
                                            type="file" 
                                            className={`hidden`}
                                            onChange={handleFileChange}
                                            ref={fileInputRef}
                                        />
                                    </button>
                            </Tippy>
                            <Tippy content="Download Template">
                                <button
                                        type="button"
                                        onClick={handleDownload}
                                        className="block w-10 h-10 p-2.5 rounded-full bg-white-light/40 dark:bg-dark/40 hover:text-primary hover:bg-white-light/90 dark:hover:bg-dark/6"
                                    >
                                        <IconDownload />
                                </button>
                            </Tippy>
                        </div>
                    </div>
                </div>
                <div className="datatables z-0">
                    <DataTable
                        highlightOnHover
                        className={`${isRtl ? 'whitespace-nowrap table-hover' : 'whitespace-nowrap table-hover'}`}
                        records={CoAList?.data?.data}
                        columns={[
                            { 
                                accessor: 'coaCode', 
                                title: 'CoA Code', 
                                sortable: true, 
                                render: (row: COAType,index: number) => (
                                    <>
                                        <span style={{ fontWeight: row.accountTypeName == "Header" ? 'bold' : 'normal', paddingLeft: (row.coaLevel > 4) ?`${(row.coaLevel-3) * 0.5}rem` : '0rem' }}>
                                            {row.coaCode}
                                        </span>
                                    </>
                                )
                            },
                            
                            {
                                accessor: 'coaName', 
                                title: 'CoA Name', 
                                sortable: true,
                                render: (row: COAType,index: number) => (
                                    <>
                                        <span style={{ fontWeight: row.accountTypeName == "Header" ? 'bold' : 'normal', paddingLeft: (row.coaLevel > 4) ?`${(row.coaLevel-3) * 0.5}rem` : '0rem' }}>
                                            {row.coaName}
                                        </span>
                                    </>
                                )
                            },

                            { 
                                accessor: 'balance', 
                                title: 'Balance', 
                                sortable: true,
                                render: (row: COAType,index: number) => (
                                    <>
                                        <span style={{ fontWeight: row.accountTypeName == "Header" ? 'bold' : 'normal'}}>
                                            {row.balance}
                                        </span>
                                    </>
                                )
                            },
                            
                            {
                                accessor: '',
                                title: 'action',
                                render: (s: COAType) => (
                                    <>
                                        <Tippy content="Edit">
                                            <button type="button" onClick={() => navigate(`/CoA/update/${s.coaId}`)} className="">
                                                <IconPencil className="ltr:mr-2 rtl:ml-2" />
                                            </button>
                                        </Tippy>
                                        <Tippy content="Delete">
                                            <button
                                                type="button"
                                                onClick={async () => {
                                                    setDeleteId(s.coaId as number);
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
