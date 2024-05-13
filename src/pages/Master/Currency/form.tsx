import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { setPageTitle } from '../../../store/themeConfigSlice';
import { useGetEmployeeQuery } from '@/store/api/employee/employeeApiSlice';
import IconMail from '@/components/Icon/IconMail';
import * as yup from 'yup';
import { useForm, FieldError } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { CurrencyType } from '@/types';
import { useGetDetailCurrencyQuery, usePostCurrencyMutation, useUpdateCurrencyMutation } from '@/store/api/currency/currencyApiSlice';
import { useGetRolesQuery } from '@/store/api/roles/rolesApiSlice';
import { rolesType } from '@/types/rolesType';
import { ToastContainer, toast } from 'react-toastify';
import { responseCallback } from '@/utils/responseCallback';
import { toastMessage } from '@/utils/toastUtils';

const Form = () => {
    const user = useSelector((state: any) => state.auth.user);
    const [post, { isLoading: isLoadingPost, error: isErrorPost }] = usePostCurrencyMutation();
    const [update, { isLoading: isLoadingUpdate, error: isErrorUpdate }] = useUpdateCurrencyMutation();
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();
    const pathSegments = location.pathname.split('/');
    const lastSegment = pathSegments[pathSegments.length - 1];
    const type = pathSegments[2];

    const { id } = useParams();
    const { data: detailCurrency, refetch: detailCurrencyRefetch } = id ? useGetDetailCurrencyQuery(id) : { data: null, refetch: () => {} };
    const { data: rolesList, refetch: rolesListRefetch } = useGetRolesQuery({});

    const schema = yup
        .object({
            currencyName: yup.string().required('Currency Name is Required'),
            currencyCode: yup.string().required('Currency Code is Required'),
            password: id ? yup.string() : yup.string().required('Password is Required'),
            symbol: yup.string().required('symbol is Required'),
            country: yup.string().required('Country is Required'),
            exchangeRate: yup.number().required('Exchange Rate Name is Required'),
        })
        .required();

    const {
        create,
        formState: { errors },
        handleSubmit,
        setValue,
    } = useForm<CurrencyType>({
        resolver: yupResolver(schema),
        mode: 'all',
        defaultValues: {
            branchId : 0
        },
    });

    const submitForm = async (data: CurrencyType) => {
        try {
            let response: any;
            if (id) {
                response = await update(data);
            } else {
                response = await post(data);
            }
            responseCallback(response, (data: any) => {
              // navigate('/user')
            }, null);
        } catch (err: any) {
            toastMessage(err.message, 'error');
        }
    };

    useEffect(() => {
        dispatch(setPageTitle('Users'));
        rolesListRefetch();
    }, [dispatch]);

    useEffect(() => {
        if (id) {
            detailCurrencyRefetch();
        }
    }, [id]);

    useEffect(() => {
        if (detailCurrency?.data) {
            Object.keys(detailCurrency.data).forEach((key) => {
                setValue(key as keyof CurrencyType, detailCurrency.data[key]);
            });
        }
    }, [detailCurrency, setValue]);

    return (
        <div>
            <ToastContainer />
            <ul className="flex space-x-2 rtl:space-x-reverse">
                <li>
                    <Link to="/currency" className="text-primary hover:underline">
                        Currency
                    </Link>
                </li>
                <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                    <span>{type}</span>
                </li>

                {type === 'update' ? (
                    <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                        <span>{lastSegment}</span>
                    </li>
                ) : (
                    ''
                )}
            </ul>
            <div className="panel mt-6">
                <form className="flex gap-6 flex-col" onSubmit={handleSubmit(submitForm)}>
                    <div className="grid md:grid-cols-2 gap-4 w-full ">
                        <div>
                            <label htmlFor="userName">Currency</label>
                            <div className="relative text-white-dark">
                                <input id="userName" type="text" placeholder="Enter Username" {...create('userName')} className="form-input placeholder:text-white-dark" />
                                {/* <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                    <IconMail fill={true} />
                                </span> */}
                            </div>
                            <span className="text-danger text-xs">{(errors.userName as FieldError)?.message}</span>
                        </div>
                        <div>
                            <label htmlFor="displayName">Name</label>
                            <div className="relative text-white-dark">
                                <input id="displayName" type="text" placeholder="Enter Name" {...create('displayName')} className="form-input placeholder:text-white-dark" />
                                {/* <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                    <IconMail fill={true} />
                                </span> */}
                            </div>
                            <span className="text-danger text-xs">{(errors.displayName as FieldError)?.message}</span>
                        </div>
                        <div>
                            <label htmlFor="Email">Email</label>
                            <div className="relative text-white-dark">
                                <input id="Email" type="email" placeholder="Enter Email" {...create('email')} className="form-input placeholder:text-white-dark" />
                                {/* <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                    <IconMail fill={true} />
                                </span> */}
                            </div>
                            <span className="text-danger text-xs">{(errors.email as FieldError)?.message}</span>
                        </div>
                        <div>
                            <label htmlFor="Password">Password</label>
                            <div className="relative text-white-dark">
                                <input id="Password" type="password" placeholder="Enter Password" {...create('password')} className="form-input placeholder:text-white-dark" />
                                {/* <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                    <IconMail fill={true} />
                                </span> */}
                            </div>
                            <span className="text-danger text-xs">{(errors.password as FieldError)?.message}</span>
                        </div>
                        <div>
                            <label htmlFor="roleID">Role</label>
                            <div className="relative text-white-dark">
                                <select id="roleID" {...create('roleID')} className="form-select">
                                    <option value="">Enter Role</option>
                                    {rolesList?.data?.map((d: rolesType, i: number) => {
                                        return (
                                            <option value={d.roleID} selected={detailUsers?.data?.roleID === d.roleID}>
                                                {d.roleName}
                                            </option>
                                        );
                                    })}
                                </select>
                            </div>
                            <span className="text-danger text-xs">{(errors.roleName as FieldError)?.message}</span>
                        </div>
                        <div>
                            <label>Status</label>
                            <div className="flex space-x-4">
                                <label className="flex items-center">
                                    <input type="radio" value="Active" {...create('status')} className="form-radio" />
                                    <span className="ml-2 text-white-dark">Active</span>
                                </label>
                                <label className="flex items-center">
                                    <input type="radio" value="InActive" {...create('status')} className="form-radio" />
                                    <span className="ml-2 text-white-dark">Inactive</span>
                                </label>
                            </div>
                            <span className="text-danger text-xs">{(errors.status as FieldError)?.message}</span>
                        </div>
                    </div>
                    <div className="flex w-full justify-end">
                        <button type="submit" className=" btn btn-primary  w-1/6 border-0 uppercase shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)]">
                            {isLoadingPost || isLoadingUpdate ? 'Loading' : id ? 'Update' : 'Save'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Form;
