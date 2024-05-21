import { useDispatch } from 'react-redux';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { setPageTitle, setTitle, setBreadcrumbTitle } from '../../../store/themeConfigSlice';
import { useForm, FieldError } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { ToastContainer } from 'react-toastify';
import { useGetAccountTypesQuery, useUpdateAccountTypeMutation, useCreateAccountTypeMutation, useGetAccountTypeDetailQuery } from '@/store/api/accountType/accountTypeApiSlice';
import { responseCallback } from '@/utils/responseCallback';
import { toastMessage } from '@/utils/toastUtils';
import { AccountType } from '@/types';

const Form = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const pathSegments = location.pathname.split('/');
    const lastSegment = pathSegments[pathSegments.length - 1];
    const type = pathSegments[2];
    const { data: detailAccountType, refetch: refetchDetailAccountType } = id ? useGetAccountTypeDetailQuery<any>(id) : { data: null, refetch: () => {} };
    const [createAccountType, { isLoading: isCreating, error: createError }] = useCreateAccountTypeMutation();
    const [updateAccountType, { isLoading: isUpdating, error: updateError }] = useUpdateAccountTypeMutation();

    
    const schema = yup.object({
        accountTypeName: yup.string().required('Account Type Name is Required'),
    }).required();

    const {
        register,
        formState: { errors },
        handleSubmit,
        setValue,
    } = useForm<AccountType>({
        resolver: yupResolver(schema),
    });

    const onSubmit = async (data: AccountType) => {
        try {
            let response: any;
            if (id) {
                response = await updateAccountType(data);
            } else {
                response = await createAccountType(data);
            }
            responseCallback(response, () => {
                navigate('/accountType');
            }, null);
        } catch (err: any) {
            console.error("Error submitting form: ", err);
            toastMessage(err.message, 'error');
        }
    };

    useEffect(() => {
        dispatch(setPageTitle('Account Type'));
        dispatch(setTitle('Account Type'));
        if(type == 'create'){
            dispatch(setBreadcrumbTitle(['Dashboard', 'Master', 'AccountType', type]));
        }else{
            dispatch(setBreadcrumbTitle(['Dashboard', 'Master', 'AccountType', type,lastSegment]));
        }
        if (id) {
            refetchDetailAccountType();
        }
    }, [dispatch, id, refetchDetailAccountType]);

    useEffect(() => {
        if (detailAccountType && 'data' in detailAccountType) {
            if (detailAccountType?.data) {
                Object.keys(detailAccountType.data).forEach((key) => {
                    setValue(key as keyof AccountType, detailAccountType.data[key]);
                });
            }
        }
    }, [detailAccountType, setValue]);

    return (
        <div>
            <div className="panel mt-6">
                <form className="flex gap-6 flex-col" onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid md:grid-cols-2 gap-4 w-full">
                        <div>
                            <label htmlFor="accountTypeName">Account Type Name</label>
                            <div className="relative text-white-dark">
                                <input id="accountTypeName" type="text" placeholder="Enter Account Type Name" {...register('accountTypeName')} className="form-input placeholder:text-white-dark" />
                            </div>
                            <span className="text-danger text-xs">{errors.accountTypeName?.message}</span>
                        </div>
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

export default Form;
