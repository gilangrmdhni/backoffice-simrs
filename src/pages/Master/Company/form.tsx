import { useEffect } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { FieldError, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { ToastContainer } from 'react-toastify';
import { useGetDetailCompanyQuery, usePostCompanyMutation, useUpdateCompanyMutation } from '@/store/api/company/companyApiSlice';
import { useGetCurrencyQuery } from '@/store/api/currency/currencyApiSlice';
import { setPageTitle, setTitle, setBreadcrumbTitle } from '../../../store/themeConfigSlice';
import { companyType, CurrencyType } from '@/types';
import { responseCallback } from '@/utils/responseCallback';
import { toastMessage } from '@/utils/toastUtils';

const CompanyForm = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const pathSegments = location.pathname.split('/');
    const lastSegment = pathSegments[pathSegments.length - 1];
    const type = pathSegments[2];
    const { id } = useParams();
    const { data: detailCompany, refetch: detailCompanyRefetch } = id ? useGetDetailCompanyQuery(id) : { data: null, refetch: () => { } };
    const [post, { isLoading: isLoadingPost }] = usePostCompanyMutation();
    const [update, { isLoading: isLoadingUpdate }] = useUpdateCompanyMutation();

    const schema = yup.object({
        companyName: yup.string().required('Company Name is Required'),
        phone: yup.string().required('Phone is Required'),
        email: yup.string().email('Email format is wrong').required('Email is Required'),
        address: yup.string().required('Address is Required'),
        financialClosingDate: yup.string().required('Financial Closing Date is Required'),
        currencyId: yup.string().required('Currency is Required'),
        status: yup.string().required('Status is Required'),
    }).required();

    const {
        register,
        formState: { errors },
        handleSubmit,
        setValue,
    } = useForm<companyType>({
        resolver: yupResolver(schema),
        mode: 'all',
        defaultValues: {
            status: 'Active',
        },
    });

    const { data: currencyList } = useGetCurrencyQuery([]);

    const submitForm = async (data: companyType) => {
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
        dispatch(setPageTitle('Company'));
        dispatch(setTitle('Company'));
        dispatch(setBreadcrumbTitle(['Dashboard', 'Master', 'Company', 'Form']));
        if (id) {
            detailCompanyRefetch();
        }
    }, [dispatch, id, detailCompanyRefetch]);

    useEffect(() => {
        if (detailCompany?.data) {
            Object.keys(detailCompany.data).forEach((key) => {
                setValue(key as keyof companyType, detailCompany.data[key]);
            });
        }
    }, [detailCompany, setValue]);

    return (
        <div>
            <ToastContainer />
            <div className='panel flex'>
                <ol className="flex space-x-2 rtl:space-x-reverse">
                    <li>
                        <Link to="/company" className="text-primary hover:underline">
                            Company
                        </Link>
                    </li>
                    <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                        <span>{type}</span>
                    </li>
                    {type === 'update' ? (
                        <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                            <span>{lastSegment}</span>
                        </li>
                    ) : null}
                </ol>
            </div>
            <div className="panel mt-6">
                <form className="flex gap-6 flex-col" onSubmit={handleSubmit(submitForm)}>
                    <div className="grid md:grid-cols-2 gap-4 w-full">
                        <div>
                            <label htmlFor="companyName">Company Name</label>
                            <div className="relative text-white-dark">
                                <input id="companyName" type="text" placeholder="Enter Company Name" {...register('companyName')} className="form-input placeholder:text-white-dark" />
                            </div>
                            <span className="text-danger text-xs">{(errors.companyName as FieldError)?.message}</span>
                        </div>
                        <div>
                            <label htmlFor="phone">Phone</label>
                            <div className="relative text-white-dark">
                                <input id="phone" type="text" placeholder="Enter Phone" {...register('phone')} className="form-input placeholder:text-white-dark" />
                            </div>
                            <span className="text-danger text-xs">{(errors.phone as FieldError)?.message}</span>
                        </div>
                        <div>
                            <label htmlFor="email">Email</label>
                            <div className="relative text-white-dark">
                                <input id="email" type="email" placeholder="Enter Email" {...register('email')} className="form-input placeholder:text-white-dark" />
                            </div>
                            <
                                span className="text-danger text-xs">{(errors.email as FieldError)?.message}</span>
                        </div>
                        <div>
                            <label htmlFor="address">Address</label>
                            <div className="relative text-white-dark">
                                <input id="address" type="text" placeholder="Enter Address" {...register('address')} className="form-input placeholder:text-white-dark" />
                            </div>
                            <span className="text-danger text-xs">{(errors.address as FieldError)?.message}</span>
                        </div>
                        <div>
                            <label htmlFor="financialClosingDate">Financial Closing Date</label>
                            <div className="relative text-white-dark">
                                <input id="financialClosingDate" type="date" {...register('financialClosingDate')} className="form-input placeholder:text-white-dark" />
                            </div>
                            <span className="text-danger text-xs">{(errors.financialClosingDate as FieldError)?.message}</span>
                        </div>
                        <div>
                            <label htmlFor="currencyId">Currency</label>
                            <div className="relative text-white-dark">
                                <select id="currencyId" {...register('currencyId')} className="form-select placeholder:text-white-dark">
                                    <option value="">Select Currency</option>
                                    {currencyList?.data?.map((currency: CurrencyType) => (
                                        <option key={currency.currencyId} value={currency.currencyId}>
                                            {currency.currencyName}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <span className="text-danger text-xs">{(errors.currencyId as FieldError)?.message}</span>
                        </div>
                        <div>
                            <label>Status</label>
                            <div className="flex space-x-4">
                                <label className="flex items-center">
                                    <input type="radio" value="Active" {...register('status')} className="form-radio" />
                                    <span className="ml-2 text-white-dark">Active</span>
                                </label>
                                <label className="flex items-center">
                                    <input type="radio" value="Inactive" {...register('status')} className="form-radio" />
                                    <span className="ml-2 text-white-dark">Inactive</span>
                                </label>
                            </div>
                            <span className="text-danger text-xs">{(errors.status as FieldError)?.message}</span>
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="btn btn-primary w-1/6 border-0 uppercase shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)]"
                        disabled={isLoadingPost || isLoadingUpdate}
                    >
                        {isLoadingPost || isLoadingUpdate ? 'Loading' : id ? 'Update' : 'Save'}
                    </button>


                </form>
            </div>
        </div>
    );
};

export default CompanyForm;
