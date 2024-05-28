import { useDispatch } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { setPageTitle, setTitle, setBreadcrumbTitle } from '../../../store/themeConfigSlice';
import { useForm, FieldError } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { ToastContainer } from 'react-toastify';
import { responseCallback } from '@/utils/responseCallback';
import { toastMessage } from '@/utils/toastUtils';
import { useGetPaymentDetailQuery, useCreatePaymentMutation, useUpdatePaymentMutation } from '@/store/api/bank/payment/paymentApiSlice';
import { useGetBanksQuery } from '@/store/api/bank/bankApiSlice';
import { PaymentType, PaymentUpdateType } from '@/types/paymentType';

const PaymentForm = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const { data: detailPayment, refetch: refetchDetailPayment } = id ? useGetPaymentDetailQuery(Number(id)) : { data: null, refetch: () => { } };
    const [createPayment, { isLoading: isCreating }] = useCreatePaymentMutation();
    const [updatePayment, { isLoading: isUpdating }] = useUpdatePaymentMutation();

    const schema = yup.object({
        journalDescDebit: yup.string().required('Debit Description is Required'),
        coaDebit: yup.string().required('Account is Required'),
        coaCredit: yup.string().required('Account is Required'),
        amount: yup.number().required('Amount is Required'),
        createdDate: yup.date().required('Pay Date is Required'),
    }).required();

    const { register, formState: { errors }, handleSubmit, setValue } = useForm<PaymentType>({
        resolver: yupResolver(schema),
    });

    const { data: bankResponse } = useGetBanksQuery({});
    const bankList = bankResponse?.data ?? [];

    const onSubmit = async (data: PaymentType) => {
        try {
            const postData = [data];
            let response: any;
            if (id) {
                const updateData: PaymentUpdateType = { journalId: parseInt(id), ...data };
                response = await updatePayment(updateData);
            } else {
                response = await createPayment(postData);
            }
            responseCallback(response, () => {
                navigate('/payment');
            }, null);
        } catch (err: any) {
            toastMessage(err.message, 'error');
        }
    };

    useEffect(() => {
        dispatch(setPageTitle('Payment'));
        dispatch(setTitle('Payment'));
        dispatch(setBreadcrumbTitle(['Dashboard', 'Bank', 'Payment', id ? 'Update' : 'Create']));
        if (id) {
            refetchDetailPayment();
        }
    }, [dispatch, id, refetchDetailPayment]);

    useEffect(() => {
        if (detailPayment && detailPayment.data) {
            Object.keys(detailPayment.data).forEach((key) => {
                if (key === 'createdDate') {
                    const isoString = detailPayment.data[key as keyof PaymentType] as string;
                    const date = new Date(isoString);
                    const formattedDate = date.toISOString().split('T')[0];
                    setValue(key as keyof PaymentType, formattedDate);
                } else {
                    setValue(key as keyof PaymentType, detailPayment.data[key as keyof PaymentType]);
                }
            });
        }
    }, [detailPayment, setValue]);

    return (
        <div>
            <ToastContainer />
            <div className='panel flex'>
                <ol className="flex space-x-2 rtl:space-x-reverse">
                    <li>
                        <Link to="/payment" className="text-primary hover:underline">
                            Payment
                        </Link>
                    </li>
                    <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                        <span>{id ? 'Update' : 'Create'}</span>
                    </li>
                </ol>
            </div>
            <div className="panel mt-6">
                <form className="flex gap-6 flex-col" onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid md:grid-cols-2 gap-4 w-full">
                        <div>
                            <label htmlFor="coaDebit">PayTo</label>
                            <div className="relative text-white-dark">
                                <select id="coaDebit" {...register('coaDebit')} className="form-select placeholder:text-white-dark">
                                    <option value="">Select Account</option>
                                    {bankList.map((bank) => (
                                        <option key={bank.value} value={bank.desc}>{bank.label}</option>
                                    ))}
                                </select>
                            </div>
                            <span className="text-danger text-xs">{(errors.coaDebit as FieldError)?.message}</span>
                        </div>
                        <div>
                            <label htmlFor="journalDescDebit">Memo</label>
                            <div className="relative text-white-dark">
                                <input id="journalDescDebit" type="text" placeholder="Enter Debit Description" {...register('journalDescDebit')} className="form-input placeholder:text-white-dark" />
                            </div>
                            <span className="text-danger text-xs">{(errors.journalDescDebit as FieldError)?.message}</span>
                        </div>
                        <div>
                            <label htmlFor="coaCredit">Account</label>
                            <div className="relative text-white-dark">
                                <select id="coaCredit" {...register('coaCredit')} className="form-select placeholder:text-white-dark">
                                    <option value="">Select Account</option>
                                    {bankList.map((bank) => (
                                        <option key={bank.value} value={bank.desc}>{bank.label}</option>
                                    ))}
                                </select>
                            </div>
                            <span className="text-danger text-xs">{(errors.coaCredit as FieldError)?.message}</span>
                        </div>
                        <div>
                            <label htmlFor="amount">Amount</label>
                            <div className="relative text-white-dark">
                                <input id="amount" type="number" placeholder="Enter Amount" {...register('amount')} className="form-input placeholder:text-white-dark" />
                            </div>
                            <span className="text-danger text-xs">{(errors.amount as FieldError)?.message}</span>
                        </div>
                        <div>
                            <label htmlFor="createdDate">Pay Date</label>
                            <div className="relative text-white-dark">
                                <input id="createdDate" type="date" {...register('createdDate')} className="form-input placeholder:text-white-dark" />
                            </div>
                            <span className="text-danger text-xs">{(errors.createdDate as FieldError)?.message}</span>
                        </div>
                       
                    </div>
                    <div className="flex w-full justify-end mt-6">
                        <button type="submit" className="btn btn-primary w-1/6 border-0 uppercase shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)]">
                            {isCreating || isUpdating ? 'Loading' : id ? 'Update' : 'Create'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PaymentForm;
