import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { setPageTitle,setTitle,setBreadcrumbTitle } from '../../../store/themeConfigSlice';
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
    console.log(detailCurrency)
    const schema = yup
        .object({
            currencyName: yup.string().required('Currency Name is Required'),
            currencyCode: yup.string().required('Currency Code is Required'),
            symbol: yup.string().required('symbol is Required'),
            country: yup.string().required('Country is Required'),
            exchangeRate: yup.number().required('Exchange Rate Name is Required'),
        })
        .required();

    const {
        register,
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
        dispatch(setPageTitle('Currency'));
        dispatch(setTitle('Currency'));
        dispatch(setBreadcrumbTitle(['Dashboard','Master','Currency',type,lastSegment]));
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
            <div className="panel mt-6">
                <form className="flex gap-6 flex-col" onSubmit={handleSubmit(submitForm)}>
                    <div className="grid md:grid-cols-2 gap-4 w-full ">
                        <div>
                            <label htmlFor="currencyName">Currency Name</label>
                            <div className="relative text-white-dark">
                                <input id="currencyName" type="text" placeholder="Enter Username" {...register('currencyName')} className="form-input placeholder:text-white-dark" />
                                {/* <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                    <IconMail fill={true} />
                                </span> */}
                            </div>
                            <span className="text-danger text-xs">{(errors.currencyName as FieldError)?.message}</span>
                        </div>
                        <div>
                            <label htmlFor="currencyCode">Currency Code</label>
                            <div className="relative text-white-dark">
                                <input id="currencyCode" type="text" placeholder="Enter Code" {...register('currencyCode')} className="form-input placeholder:text-white-dark" />
                                {/* <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                    <IconMail fill={true} />
                                </span> */}
                            </div>
                            <span className="text-danger text-xs">{(errors.currencyCode as FieldError)?.message}</span>
                        </div>
                        <div>
                            <label htmlFor="symbol">symbol</label>
                            <div className="relative text-white-dark">
                                <input id="symbol" type="text" placeholder="Enter symbol" {...register('symbol')} className="form-input placeholder:text-white-dark" />
                                {/* <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                    <IconMail fill={true} />
                                </span> */}
                            </div>
                            <span className="text-danger text-xs">{(errors.symbol as FieldError)?.message}</span>
                        </div>
                        <div>
                            <label htmlFor="country">country</label>
                            <div className="relative text-white-dark">
                                <input id="country" type="text" placeholder="Enter country" {...register('country')} className="form-input placeholder:text-white-dark" />
                                {/* <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                    <IconMail fill={true} />
                                </span> */}
                            </div>
                            <span className="text-danger text-xs">{(errors.country as FieldError)?.message}</span>
                        </div>
                        <div>
                            <label htmlFor="exchangeRate">Exchange Rate</label>
                            <div className="relative text-white-dark">
                                <input id="exchangeRate" type="text" placeholder="Enter exchangeRate" {...register('exchangeRate')} className="form-input placeholder:text-white-dark" />
                                {/* <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                    <IconMail fill={true} />
                                </span> */}
                            </div>
                            <span className="text-danger text-xs">{(errors.exchangeRate as FieldError)?.message}</span>
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


