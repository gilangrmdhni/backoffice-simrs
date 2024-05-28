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
import { useGetDepositDetailQuery, useCreateDepositMutation, useUpdateDepositMutation } from '@/store/api/bank/deposit/depositApiSlice';
import { useGetBanksQuery } from '@/store/api/bank/bankApiSlice';
import { DepositType, DepositUpdateType } from '@/types/depositType';

const DepositForm = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const { data: detailDeposit, refetch: refetchDetailDeposit } = id ? useGetDepositDetailQuery(Number(id)) : { data: null, refetch: () => { } };
    const [createDeposit, { isLoading: isCreating }] = useCreateDepositMutation();
    const [updateDeposit, { isLoading: isUpdating }] = useUpdateDepositMutation();

    const schema = yup.object({
        journalDescDebit: yup.string().required('Credit Description is Required'),
        coaDebit: yup.string().required('Deposit To is Required'),
        coaCredit: yup.string().required('Account is Required'),
        amount: yup.number().required('Amount is Required'),
        createdDate: yup.date().required('Created Date is Required'),
        status: yup.string().required('Status is Required'),
    }).required();

    const { register, formState: { errors }, handleSubmit, setValue } = useForm<DepositType>({
        resolver: yupResolver(schema),
    });

    const { data: bankResponse } = useGetBanksQuery({});
    const bankList = bankResponse?.data ?? [];

    const onSubmit = async (data: DepositType) => {
        try {
            const postData = [data];
            console.log("Form Data Submitted:", postData);
            let response;
            if (id) {
                const updateData: DepositUpdateType = { journalId: parseInt(id), ...data };
                response = await updateDeposit(updateData).unwrap();
            } else {
                response = await createDeposit(postData).unwrap();
            }
            responseCallback(response, () => {
                navigate('/deposit');
            }, null);
        } catch (err: any) {
            toastMessage(err.message, 'error');
        }
    };

    useEffect(() => {
        dispatch(setPageTitle('Deposit'));
        dispatch(setTitle('Deposit'));
        dispatch(setBreadcrumbTitle(['Dashboard', 'Bank', 'Deposit', id ? 'Update' : 'Create']));
        if (id) {
            refetchDetailDeposit();
        }
    }, [dispatch, id, refetchDetailDeposit]);

    useEffect(() => {
        if (detailDeposit && detailDeposit.data) {
            Object.keys(detailDeposit.data).forEach((key) => {
                if (key === 'createdDate') {
                    const isoString = detailDeposit.data[key as keyof DepositType] as string;
                    const date = new Date(isoString);
                    const formattedDate = date.toISOString().split('T')[0];
                    setValue(key as keyof DepositType, formattedDate);
                } else {
                    setValue(key as keyof DepositType, detailDeposit.data[key as keyof DepositType]);
                }
            });
        }
    }, [detailDeposit, setValue]);

    return (
        <div>
            <ToastContainer />
            <div className='panel flex'>
                <ol className="flex space-x-2 rtl:space-x-reverse">
                    <li>
                        <Link to="/deposit" className="text-primary hover:underline">
                            Deposit
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
                            <label htmlFor="coaDebit">Deposit To</label>
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
                            <label htmlFor="journalDescCredit">Memo</label>
                            <div className="relative text-white-dark">
                                <input id="journalDescCredit" type="text" placeholder="Enter Credit Description" {...register('journalDescDebit')} className="form-input placeholder:text-white-dark" />
                            </div>
                            <span className="text-danger text-xs">{(errors.journalDescDebit as FieldError)?.message}</span>
                        </div>

                        <div>
                            <label htmlFor="amount">Amount</label>
                            <div className="relative text-white-dark">
                                <input id="amount" type="number" placeholder="Enter Amount" {...register('amount')} className="form-input placeholder:text-white-dark" />
                            </div>
                            <span className="text-danger text-xs">{(errors.amount as FieldError)?.message}</span>
                        </div>
                        <div>
                            <label htmlFor="createdDate">Created Date</label>
                            <div className="relative text-white-dark">
                                <input id="createdDate" type="date" {...register('createdDate')} className="form-input placeholder:text-white-dark" />
                            </div>
                            <span className="text-danger text-xs">{(errors.createdDate as FieldError)?.message}</span>
                        </div>
                        <div>
                            <label htmlFor="status">Status</label>
                            <div className="relative text-white-dark">
                                <select id="status" {...register('status')} className="form-select placeholder:text-white-dark">
                                    <option value="">Select Status</option>
                                    <option value="Pending">Pending</option>
                                    <option value="Completed">Completed</option>
                                </select>
                            </div>
                            <span className="text-danger text-xs">{(errors.status as FieldError)?.message}</span>
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

export default DepositForm;
