import { useDispatch } from 'react-redux';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import { setPageTitle, setTitle, setBreadcrumbTitle } from '../../../store/themeConfigSlice';
import { useForm, FieldError } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { branchType, CurrencyType, companyType } from '@/types';
import { useGetCurrencyQuery } from '@/store/api/currency/currencyApiSlice';
import { useGetCompaniesQuery } from '@/store/api/company/companyApiSlice';
import { ToastContainer } from 'react-toastify';
import { responseCallback } from '@/utils/responseCallback';
import { toastMessage } from '@/utils/toastUtils';
import { useGetDetailBranchQuery, usePostBranchMutation, useUpdateBranchMutation } from '@/store/api/branch/branchApiSlice';


const BranchForm = () => {
    const currencyRef = useRef<HTMLSelectElement>(null);
    const companyRef = useRef<HTMLSelectElement>(null);
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();
    const pathSegments = location.pathname.split('/');
    const lastSegment = pathSegments[pathSegments.length - 1];
    const type = pathSegments[2];
    const { id } = useParams();
    const { data: detailBranch , refetch: detailBranchRefetch } = id ? useGetDetailBranchQuery(id) : { data: null, refetch: () => { } };
    console.log(detailBranch);
    const [post, { isLoading: isLoadingPost, error: isErrorPost }] = usePostBranchMutation();
    const [update, { isLoading: isLoadingUpdate, error: isErrorUpdate }] = useUpdateBranchMutation();
    const schema = yup.object({
        branchName: yup.string().required('Branch Name is Required'),
        phone: yup.string().required('Phone is Required'),
        email: yup.string().email('Email format is wrong').required('Email is Required'),
        address: yup.string().required('Address is Required'),
        financialClosingDate: yup.string().required('Financial Closing Date is Required'),
        currencyId: yup.number().required('Currency is Required'),
        companyId: yup.number().required('Company is Required'),
        status: yup.string().required('Status is Required'),
    }).required();

    const {
        register,
        formState: { errors },
        handleSubmit,
        setValue,
    } = useForm<branchType>({
        resolver: yupResolver(schema),
        mode: 'all',
        defaultValues: {
            status: 'Active',
        },
    });

    const { data: currencyList } = useGetCurrencyQuery([]);
    const { data: companyList } = useGetCompaniesQuery([]);

    const submitForm = async (data: branchType) => {
        console.log("test")
        if (currencyRef.current) {
            data.currencyName = currencyRef.current.options[data.currencyId].text;
        }
        if (companyRef.current) {
            data.companyName = companyRef.current.options[data.companyId].text;
        }
        try {
            let response: any;
            console.log(data.financialClosingDate)
            if (id) {
                response = await update(data);
            } else {
                response = await post(data);
            }
            responseCallback(response, (data: any) => {
                navigate('/branch')
            }, null);
        } catch (err: any) {
            console.error("Error submitting form: ", err);
            toastMessage(err.message, 'error');
        }
    };


    useEffect(() => {
        dispatch(setPageTitle('Branch'));
        dispatch(setTitle('Branch'));
        if(type == 'create'){
            dispatch(setBreadcrumbTitle(['Dashboard', 'Master', 'Branch', type]));
        }else{
            dispatch(setBreadcrumbTitle(['Dashboard', 'Master', 'Branch', type,lastSegment]));
        }
        if (id) {
            detailBranchRefetch();
        }
    }, [dispatch, id, detailBranchRefetch]);

    useEffect(() => {
        if (detailBranch?.data) {
            Object.keys(detailBranch.data).forEach((key) => {
                if(key === 'financialClosingDate'){
                    const isoString = detailBranch.data[key];
                    const date = new Date(isoString);
                    const formattedDate = date.toISOString().split('T')[0];

                    setValue(key as keyof branchType, formattedDate);
                }else{
                    setValue(key as keyof branchType, detailBranch.data[key]);
                }
            });
        }
    }, [detailBranch, setValue]);

    return (
        <div>
            <div className="panel mt-6">
                <form className="flex gap-6 flex-col" onSubmit={handleSubmit(submitForm)}>
                    <div className="grid md:grid-cols-2 gap-4 w-full">
                        <div>
                            <label htmlFor="branchName">Branch Name</label>
                            <div className="relative text-white-dark">
                                <input id="branchName" type="text" placeholder="Enter Branch Name" {...register('branchName')} className="form-input placeholder:text-white-dark" />
                            </div>
                            <span className="text-danger text-xs">{(errors.branchName as FieldError)?.message}</span>
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
                            <span className="text-danger text-xs">{(errors.email as FieldError)?.message}</span>
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
                                <select id="currencyId" {...register('currencyId')} className="form-select placeholder:text-white-dark" ref={currencyRef}>
                                    <option value="">Select Currency</option>
                                    {currencyList?.data?.map((currency: CurrencyType) => (
                                        <option key={currency.currencyId} value={currency.currencyId} selected={currency?.currencyId == detailBranch?.data?.currencyId}>
                                            {currency.currencyName}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <span className="text-danger text-xs">{(errors.currencyId as FieldError)?.message}</span>
                        </div>
                        <div>
                            <label htmlFor="companyId">Company</label>
                            <div className="relative text-white-dark">
                                <select id="companyId" {...register('companyId')} className="form-select placeholder:text-white-dark" ref={companyRef}>
                                    <option value="">Select Company</option>
                                    {companyList?.data?.map((company: companyType) => (
                                        <option key={company.companyId} value={company.companyId} selected={company?.companyId == detailBranch?.data?.companyId}>
                                            {company.companyName}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <span className="text-danger text-xs">{(errors.companyId as FieldError)?.message}</span>
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
                    <div className="flex w-full justify-end">
                        <button type="submit" className="btn btn-primary w-1/6 border-0 uppercase shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)]">
                            {isLoadingPost || isLoadingUpdate ? 'Loading' : id ? 'Update' : 'Save'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BranchForm;
