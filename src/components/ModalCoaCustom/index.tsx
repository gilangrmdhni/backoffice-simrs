import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useEffect, useState, useRef } from 'react';
import IconX from '@/components/Icon/IconX';
import SelectSearch from 'react-select';
import { useSelector } from 'react-redux';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { useGetCOAQuery, useDeleteCOAMutation, useGetOptionCOAQuery, useDownloadCoaMutation, useCOAUploadMutation } from '@/store/api/coa/coaApiSlice';
import '@/pages/Master/Coa/index.css';
import { COAType, usersType, OptionType } from '@/types';
import { number } from 'yup';
import { useGetRolesQuery } from '@/store/api/roles/rolesApiSlice';
import './index.css'

const ModalCoaCustom = ({ setIsSave, selectedRecords, setSelectedRecords, showModal, setShowSelected, setIsShowModal,excludeId} : {setIsSave : any, selectedRecords : any, setSelectedRecords : any, setShowSelected : any, showModal : boolean, setIsShowModal : any,excludeId : any}) => {
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
        page: page,
        pageSize: pageSize,
        status
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

    let setShowModal = (isShow: boolean) => {
        if (isShow === true) {
            return true;
        }
        return showModal;
    }
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

    const handleButtonSave = () => {
        setShowSelected(selectedRecords)
        setIsSave(true)
        setIsShowModal(false)
    }

    useEffect(() => {
        setPage(1);
    }, [sortStatus, search, pageSize, role]);

    return (
        <div className="mb-5">
            <Transition appear show={showModal} as={Fragment}>
                <Dialog as="div" open={showModal} onClose={() => setIsShowModal(false)}>
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
                    <div id="coaModal fadein_modal" className="fixed inset-0 bg-[black]/60 z-[998] overflow-y-auto">
                        <div className="flex items-start justify-center min-h-screen px-4">
                            <Dialog.Panel className="panel border-0 p-0 rounded-lg overflow-hidden w-full max-w-5xl my-8 text-black dark:text-white-dark animate__animated animate__fadeIn">
                                <div className="flex bg-[#fbfbfb] dark:bg-[#121c2c] items-center justify-between px-5 py-3">
                                    <h5 className="font-bold text-lg">Chart Of Account</h5>
                                    <button onClick={() => setIsShowModal(false)} type="button" className="text-white-dark hover:text-dark">
                                        <IconX />
                                    </button>
                                </div>
                                <div className="datatables p-5">
                                    {/* table */}
                                    <input type="text" className="form-input w-auto mb-5 font-normal" placeholder="Keyword..." value={search} onChange={(e) => setSearch(e.target.value)} />
                                    {/* <DataTable
                                        striped
                                        highlightOnHover
                                        withColumnBorders
                                        records={CoAList?.data?.data}
                                        columns={[
                                            { accessor: 'name', width: '40%' },
                                            { accessor: 'streetAddress', width: '60%' },
                                            { accessor: 'city', width: 160 },
                                            { accessor: 'state', width: 80, textAlign: 'right' },
                                        ]}
                                        idAccessor="name"
                                        selectedRecords={selectedRecords}
                                        onSelectedRecordsChange={setSelectedRecords}
                                    /> */}
                                    <DataTable
                                                highlightOnHover
                                                className={`${isRtl ? 'whitespace-nowrap table-hover' : 'whitespace-nowrap table-hover'}`}
                                                records={CoAList?.data?.data}
                                                columns={[
                                                    { 
                                                        accessor: 'coaCode', 
                                                        title: 'Kode', 
                                                        sortable: true, 
                                                        render: (row: COAType,index: number) => (
                                                            <>
                                                                <span style={{ fontWeight: row.accountTypeName == "Header" ? 'bold' : 'normal'}}>
                                                                    {row.coaCode}
                                                                </span>
                                                            </>
                                                        )
                                                    },
                                                    
                                                    {
                                                        accessor: 'coaName', 
                                                        title: 'Nama Akun', 
                                                        sortable: true,
                                                        render: (row: COAType,index: number) => (
                                                            <>
                                                                <span style={{ fontWeight: row.accountTypeName == "Header" ? 'bold' : 'normal'}}>
                                                                    {row.accountTypeName}
                                                                </span>
                                                            </>
                                                        )
                                                    },
                                                    {
                                                        accessor: 'accountTypeName', 
                                                        title: 'Kategori', 
                                                        sortable: true,
                                                        render: (row: COAType,index: number) => (
                                                            <>
                                                                <span style={{ fontWeight: row.accountTypeName == "Header" ? 'bold' : 'normal'}}>
                                                                    {row.coaName}
                                                                </span>
                                                            </>
                                                        )
                                                    },
                                                ]}
                                                recordsPerPage={pageSize}
                                                page={page}
                                                onPageChange={(p) => setPage(p)}
                                                recordsPerPageOptions={PAGE_SIZES}
                                                onRecordsPerPageChange={setPageSize}
                                                sortStatus={sortStatus}
                                                onSortStatusChange={setSortStatus}
                                                selectedRecords={selectedRecords}
                                                onSelectedRecordsChange={setSelectedRecords}
                                                totalRecords={CoAList?.data?.totalData}
                                                isRecordSelectable={ (record) => record.accountTypeName != "Header" && record.coaCode != excludeId }
                                                fetching={isLoading}
                                                minHeight={200}
                                                idAccessor='coaCode'
                                            />
                                    <div className="flex justify-end items-center mt-8">
                                        <button onClick={() => setIsShowModal(false)} type="button" className="btn bg-gray-400 text-white rounded-md shadow-sm">
                                            Cancel
                                        </button>
                                        <button type="button" onClick={handleButtonSave} className="btn btn-primary ltr:ml-4 rtl:mr-4">
                                            Save
                                        </button>
                                    </div>
                                </div>
                            </Dialog.Panel>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </div>
    );
}

export default ModalCoaCustom