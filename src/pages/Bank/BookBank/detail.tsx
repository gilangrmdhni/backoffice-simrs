import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useGetTransactionDetailQuery } from '@/store/api/bank/bookBank/bookBankApiSlice';
import { setBreadcrumbTitle, setPageTitle, setTitle } from '../../../store/themeConfigSlice';
import { useDispatch } from 'react-redux';

const BookBankDetail = () => {
    const { id } = useParams<{ id: string }>();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setPageTitle('Transaction Detail'));
        dispatch(setTitle('Transaction Detail'));
        dispatch(setBreadcrumbTitle(["Dashboard", "Master", "Book Bank", "Detail"]));
    }, [dispatch]);

    const { data: transactionDetail, error, isLoading } = useGetTransactionDetailQuery(id);

    const endingBalance = transactionDetail?.data ? transactionDetail.data.amount : 0;

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error loading transaction detail</div>;

    const formattedPeriod = `${new Date('2024-06-30').toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })} - ${new Date('2024-07-08').toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}`;

    return (
        <div className="panel mt-6">
            <div className="flex justify-between items-center bg-purple-600 text-white p-4 rounded-t-lg">
                <div>
                    <h2 className="font-bold text-2xl">Nama Akun</h2>
                    <p className="text-lg">Kas Sentral</p>
                    <p className="text-sm">Periode: {formattedPeriod}</p>
                </div>
                <div className="text-right">
                    <p className="text-lg">Saldo Akhir</p>
                    <p className="text-2xl font-bold">Rp {Number(endingBalance).toLocaleString('id-ID')}</p>
                </div>
            </div>
            <div className="p-4">
                <div className="flex justify-between items-center mb-4">
                    <input
                        type="text"
                        className="form-input w-auto"
                        value={formattedPeriod}
                        readOnly
                    />
                </div>
                <div className="datatables">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TANGGAL</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NO TRANSAKSI</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">KETERANGAN</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Debit</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Credit</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Saldo</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {transactionDetail?.data ? (
                                <tr>
                                    <td className="px-6 py-4 whitespace-nowrap">{new Date(transactionDetail.data.transactionDate).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{transactionDetail.data.transactionNo}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{transactionDetail.data.description}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">Rp {Number(transactionDetail.data.amount).toLocaleString('id-ID')}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">Rp 0</td>
                                    <td className="px-6 py-4 whitespace-nowrap">Rp {Number(transactionDetail.data.amount).toLocaleString('id-ID')}</td>
                                </tr>
                            ) : (
                                <tr>
                                    <td colSpan={6} className="text-center py-4">No records</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <div className=" justify-center mt-6 w-full">
                    <Link to="/bookBank" className="btn btn-outline-primary hover:bg-purple-600 hover:text-white border-1 border-purple-600 text-purple-600 px-6 py-2 rounded-md">Kembali</Link>
                </div>
            </div>
        </div>
    );
};

export default BookBankDetail;
