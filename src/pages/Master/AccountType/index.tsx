import React, { useState, useEffect } from 'react';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { Fragment } from 'react';
import { setBreadcrumbTitle, setPageTitle, setTitle } from '../../../store/themeConfigSlice';
import { useDeleteAccountTypeMutation, useGetAccountTypesQuery, useExportAccountTypeMutation } from '@/store/api/accountType/accountTypeApiSlice';
import IconTrashLines from '@/components/Icon/IconTrashLines';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import IconPencil from '@/components/Icon/IconPencil';
import { Dialog, Transition } from '@headlessui/react';
import IconX from '@/components/Icon/IconX';
import IconPlus from '@/components/Icon/IconPlus';
import { AccountType } from '@/types';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { responseCallback } from '@/utils/responseCallback';
import { toastMessage } from '@/utils/toastUtils';
import IconDownload from '@/components/Icon/IconDownload';

const Index = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Account Type'));
        dispatch(setTitle('Account Type'));
        dispatch(setBreadcrumbTitle(["Dashboard", "Master", "Account Type", "List"]));
    }, [dispatch]);

    const isRtl = useSelector((state: any) => state.themeConfig.rtlClass) === 'rtl';
    const [page, setPage] = useState<number>(1);
    const PAGE_SIZES: number[] = [10, 20, 30, 50, 100];
    const [pageSize, setPageSize] = useState<number>(PAGE_SIZES[0]);
    const [search, setSearch] = useState<string>('');
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({ columnAccessor: 'accountTypeId', direction: 'asc' });
    const {
        data: accountTypeList,
        refetch,
        error,
        isLoading,
    } = useGetAccountTypesQuery({
        keyword: search,
        page: page,
        pageSize: pageSize,
        orderBy: sortStatus.columnAccessor === 'accountTypeName' ? 'accountTypeName' : sortStatus.columnAccessor,
        orderType: sortStatus.direction,
    });

    const [exportAccountType] = useExportAccountTypeMutation();
    const [deleted, { isError }] = useDeleteAccountTypeMutation();
    const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
    const [deleteId, setDeleteId] = useState<number>(0);
    const navigate = useNavigate();

    const handleDelete = async () => {
        try {
            const response: any = await deleted(deleteId);
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

    const handleExport = async () => {
        try {
            const type = 'xlsx';
            const keyword = search;
            const orderBy = sortStatus.columnAccessor;
            const orderType = sortStatus.direction;

            const res = await exportAccountType({ type, keyword, orderBy, orderType }).unwrap();
            const url = window.URL.createObjectURL(res);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `AccountTypes_${new Date().toISOString()}.xlsx`);
            document.body.appendChild(link);
            link.click();
            link.parentNode?.removeChild(link);
        } catch (error: any) {
            console.error('Failed to download account types', error);
            toastMessage(error.message, 'error');
        }
    };

    useEffect(() => {
        refetch();
    }, [page, search, sortStatus, pageSize, refetch]);

    useEffect(() => {
        setPage(1);
    }, [sortStatus, search, pageSize]);

    useEffect(() => {
        console.log('Search value changed:', search);
    }, [search]);

    return (
        <div>
            <div className="panel mt-6">
                <div className="flex md:items-center md:flex-row flex-col mb-5 gap-5">
                    <div className="rtl:ml-auto rtl:mr-auto">
                        <div className="grid grid-cols-1 gap-2">
                            <input
                                type="text"
                                className="form-input w-auto"
                                placeholder="Keyword..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="ltr:ml-auto flex gap-2">
                        <div className="grid grid-cols-1 gap-2">
                            <Tippy content="Download AccountType">
                                <button
                                    onClick={handleExport}
                                    type="button"
                                    className="block w-10 h-10 p-2.5 rounded-full bg-white-light/40 dark:bg-dark/40 hover:text-primary hover:bg-white-light/90 dark:hover:bg-dark/6"
                                >
                                    <IconDownload />
                                </button>
                            </Tippy>
                        </div>
                        <div className="grid grid-cols-1 gap-2">
                            <Tippy content="Add AccountType">
                                <button
                                    onClick={() => navigate(`/accountType/create`)}
                                    type="button"
                                    className="block w-10 h-10 p-2.5 rounded-full bg-white-light/40 dark:bg-dark/40 hover:text-primary hover:bg-white-light/90 dark:hover:bg-dark/6"
                                >
                                    <IconPlus />
                                </button>
                            </Tippy>
                        </div>
                    </div>
                </div>
                <div className="datatables">
                    <DataTable
                        highlightOnHover
                        className={`${isRtl ? 'whitespace-nowrap table-hover' : 'whitespace-nowrap table-hover'}`}
                        records={accountTypeList?.data?.data}
                        columns={[
                            { accessor: 'accountTypeName', title: 'Account Type Name', sortable: true },
                            {
                                accessor: '',
                                title: 'Action',
                                width: 100,
                                render: (s: AccountType) => (
                                    <>
                                        <Tippy content="Edit">
                                            <button type="button" onClick={() => navigate(`/accountType/update/${s.accountTypeId}`)}>
                                                <IconPencil className="ltr:mr-2 rtl:ml-2" />
                                            </button>
                                        </Tippy>
                                        <Tippy content="Delete">
                                            <button
                                                type="button"
                                                onClick={async () => {
                                                    setDeleteId(s.accountTypeId as number);
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
                        totalRecords={accountTypeList?.data?.totalData}
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

export default Index;
