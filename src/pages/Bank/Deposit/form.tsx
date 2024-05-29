import { useDispatch } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { setPageTitle, setTitle, setBreadcrumbTitle } from '../../../store/themeConfigSlice';
import { useForm, FieldError, useFieldArray } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { ToastContainer } from 'react-toastify';
import { responseCallback } from '@/utils/responseCallback';
import { toastMessage } from '@/utils/toastUtils';
import { useGetDepositDetailQuery, useCreateDepositMutation, useUpdateDepositMutation } from '@/store/api/bank/deposit/depositApiSlice';
import { useGetBanksQuery } from '@/store/api/bank/bankApiSlice';
import { DepositType, DepositUpdateType, CreditEntry } from '@/types/depositType';

const DepositForm = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const { data: detailDeposit, refetch: refetchDetailDeposit } = id ? useGetDepositDetailQuery(Number(id)) : { data: null, refetch: () => { } };
    const [createDeposit, { isLoading: isCreating }] = useCreateDepositMutation();
    const [updateDeposit, { isLoading: isUpdating }] = useUpdateDepositMutation();

    const schema = yup.object({
        journalDescDebit: yup.string().required('Debit Description is Required'),
        coaDebit: yup.string().required('Deposit To is Required'),
        amount: yup.number().required('Amount is Required'),
        createdDate: yup.date().required('Created Date is Required'),
        status: yup.string().required('Status is Required'),
        credits: yup.array().of(
            yup.object().shape({
                coaCredit: yup.string().required('Account is Required'),
                journalDescCredit: yup.string().required('Memo is Required'),
                amount: yup.number().required('Amount is Required').positive('Amount must be positive'),
            })
        ).notRequired(),
    }).required();

    const { register, control, formState: { errors }, handleSubmit, setValue, watch } = useForm<DepositType>({
        resolver: yupResolver(schema),
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'credits',
    });

    const { data: bankResponse } = useGetBanksQuery({});
    const bankList = bankResponse?.data ?? [];

    const onSubmit = async (data: DepositType) => {
        // Log data untuk debugging
        console.log('Data yang dikirim:', data);

        // Pastikan semua field dinamis terisi sebelum submit
        if (data.credits && data.credits.some(credit => !credit.coaCredit || !credit.journalDescCredit || !credit.amount)) {
            toastMessage('Please fill all required fields in the credit entries.', 'error');
            return;
        }

        // Transformasi data untuk memenuhi struktur yang diharapkan oleh API
        const postData = data.credits.map(credit => ({
            ...data,
            coaCredit: credit.coaCredit,
            journalDescCredit: credit.journalDescCredit,
            amount: credit.amount,
        }));

        try {
            let response;
            if (id) {
                const updateData = postData.map(entry => ({ ...entry, journalId: parseInt(id) }));
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
                            <label htmlFor="coaDebit" className="block text-sm font-medium text-gray-700">Deposit To</label>
                            <div className="relative text-white-dark">
                                <select id="coaDebit" {...register('coaDebit')} className="form-select placeholder:text-white-dark mt-1 block w-full rounded-md border-gray-300 shadow-sm">
                                    <option value="">Select Account</option>
                                    {bankList.map((bank) => (
                                        <option key={bank.desc} value={bank.desc}>{bank.label}</option>
                                    ))}
                                </select>
                            </div>
                            <span className="text-danger text-xs">{(errors.coaDebit as FieldError)?.message}</span>
                        </div>
                        <div>
                            <label htmlFor="journalDescDebit" className="block text-sm font-medium text-gray-700">Memo</label>
                            <div className="relative text-white-dark">
                                <input id="journalDescDebit" type="text" placeholder="Enter Debit Description" {...register('journalDescDebit')} className="form-input placeholder:text-white-dark mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                            </div>
                            <span className="text-danger text-xs">{(errors.journalDescDebit as FieldError)?.message}</span>
                        </div>

                        <div>
                            <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Amount</label>
                            <div className="relative text-white-dark">
                                <input id="amount" type="number" placeholder="Enter Amount" {...register('amount')} className="form-input placeholder:text-white-dark mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                            </div>
                            <span className="text-danger text-xs">{(errors.amount as FieldError)?.message}</span>
                        </div>
                        <div>
                            <label htmlFor="createdDate" className="block text-sm font-medium text-gray-700">Created Date</label>
                            <div className="relative text-white-dark">
                                <input id="createdDate" type="date" {...register('createdDate')} className="form-input placeholder:text-white-dark mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                            </div>
                            <span className="text-danger text-xs">{(errors.createdDate as FieldError)?.message}</span>
                        </div>
                        <div>
                            <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
                            <div className="relative text-white-dark">
                                <select id="status" {...register('status')} className="form-select placeholder:text-white-dark mt-1 block w-full rounded-md border-gray-300 shadow-sm">
                                    <option value="">Select Status</option>
                                    <option value="Pending">Pending</option>
                                    <option value="Completed">Completed</option>
                                </select>
                            </div>
                            <span className="text-danger text-xs">{(errors.status as FieldError)?.message}</span>
                        </div>
                    </div>

                    <div className="mt-6">
                        <label className="block text-sm font-medium text-gray-700">Say</label>
                        <p className="mt-1 text-gray-500">Satu Juta Rupiah</p>
                    </div>
                    <div className="mt-6">
                        <div className="mt-2 space-y-4">
                            {fields.map((field, index) => (
                                <div key={field.id} className="grid grid-cols-4 gap-4 items-center">
                                    <div>
                                        <label htmlFor={`credits.${index}.coaCredit`} className="block text-sm font-medium text-gray-700">Account</label>
                                        <div className="relative text-white-dark">
                                            <select
                                                id={`credits.${index}.coaCredit`}
                                                className="form-select placeholder:text-white-dark mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                                {...register(`credits.${index}.coaCredit` as const)}
                                            >
                                                <option value="">Select Account</option>
                                                {bankList.map((bank) => (
                                                    <option key={bank.desc} value={bank.desc}>{bank.label}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <span className="text-danger text-xs">{(errors.credits?.[index]?.coaCredit as FieldError)?.message}</span>
                                    </div>
                                    <div>
                                        <label htmlFor={`credits.${index}.journalDescCredit`} className="block text-sm font-medium text-gray-700">Memo</label>
                                        <div className="relative text-white-dark">
                                            <input
                                                id={`credits.${index}.journalDescCredit`}
                                                type="text"
                                                className="form-input placeholder:text-white-dark mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                                {...register(`credits.${index}.journalDescCredit` as const)}
                                                placeholder="Enter Credit Description"
                                            />
                                        </div>
                                        <span className="text-danger text-xs">{(errors.credits?.[index]?.journalDescCredit as FieldError)?.message}</span>
                                    </div>
                                    <div>
                                        <label htmlFor={`credits.${index}.amount`} className="block text-sm font-medium text-gray-700">Amount</label>
                                        <div className="relative text-white-dark">
                                            <input
                                                id={`credits.${index}.amount`}
                                                type="number"
                                                className="form-input placeholder:text-white-dark mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                                {...register(`credits.${index}.amount` as const)}
                                                placeholder="Enter Amount"
                                            />
                                        </div>
                                        <span className="text-danger text-xs">{(errors.credits?.[index]?.amount as FieldError)?.message}</span>
                                    </div>
                                    <button
                                        type="button"
                                        className="text-red-600"
                                        onClick={() => remove(index)}
                                    >
                                        X
                                    </button>
                                </div>
                            ))}
                            <button
                                type="button"
                                className="text-green-600"
                                onClick={() => append({ coaCredit: '', journalDescCredit: '', amount: 0 })}
                            >
                                + Add Credit
                            </button>
                        </div>
                    </div>

                    <div className="mt-6 grid grid-cols-2 gap-4">
                        <div className="flex justify-end">
                            <p>Total :</p>
                            <p>1.000.000</p>
                        </div>
                        <div className="flex justify-end">
                            <p>Difference :</p>
                            <p>1.000.000</p>
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end space-x-4">
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm"
                        >
                            {isCreating || isUpdating ? 'Loading' : id ? 'Update' : 'Create'}
                        </button>
                        <button
                            type="button"
                            className="px-4 py-2 bg-gray-600 text-white rounded-md shadow-sm"
                            onClick={() => navigate('/deposit')}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default DepositForm;
