import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setPageTitle, setTitle, setBreadcrumbTitle } from '../../../store/themeConfigSlice';
import { responseCallback } from '@/utils/responseCallback';
import { toastMessage } from '@/utils/toastUtils';
import { AccountGroupType } from '@/types';
import { useCreateAccountGroupMutation, useUpdateAccountGroupMutation } from '@/store/api/accountGrupApiSlice.ts/accountGrupApiSlice';
import { ToastContainer } from 'react-toastify';

const AccountGroupForm = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const [createAccountGroup, { isLoading: isCreating, error: createError }] = useCreateAccountGroupMutation();
    const [updateAccountGroup, { isLoading: isUpdating, error: updateError }] = useUpdateAccountGroupMutation();

    const schema = yup.object({
        accountGroupName: yup.string().required('Account Group Name is Required'),
        // Add additional validation rules if needed
    });

    const {
        register,
        formState: { errors },
        handleSubmit,
        setValue,
    } = useForm<AccountGroupType>({
        resolver: yupResolver(schema),
    });

    const onSubmit = async (data: AccountGroupType) => {
        try {
            let response: any;
            if (id) {
                response = await updateAccountGroup({ id: parseInt(id), ...data });
            } else {
                response = await createAccountGroup(data);
            }
            responseCallback(response, () => {
                navigate('/accountGroup');
            }, null);
        } catch (err: any) {
            console.error("Error submitting form: ", err);
            toastMessage(err.message, 'error');
        }
    };

    useEffect(() => {
        dispatch(setPageTitle('Account Group'));
        dispatch(setTitle('Account Group'));
        dispatch(setBreadcrumbTitle(['Dashboard', 'Master', 'Account Group', id ? 'Update' : 'Create']));
    }, [dispatch, id]);

    return (
        <div>
             <ToastContainer />
            <div className='panel flex'>
                <ol className="flex space-x-2 rtl:space-x-reverse">
                    <li>
                        <Link to="/accountGroup" className="text-primary hover:underline">
                            Account Group
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
                            <label htmlFor="accountGroupName">Account Group Name</label>
                            <div className="relative text-white-dark">
                                <input id="accountGroupName" type="text" placeholder="Enter Account Group Name" {...register('accountGroupName')} className="form-input placeholder:text-white-dark" />
                            </div>
                            <span className="text-danger text-xs">{errors.accountGroupName?.message}</span>
                        </div>
                        {/* Add more fields here if needed */}
                    </div>
                    <div className="flex w-full justify-end">
                        <button type="submit" className="btn btn-primary w-1/6 border-0 uppercase shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)]">
                            {isCreating || isUpdating ? 'Loading' : id ? 'Update' : 'Create'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AccountGroupForm;
