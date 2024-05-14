import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { setPageTitle } from '../../store/themeConfigSlice';
import { useGetEmployeeQuery } from '@/store/api/employee/employeeApiSlice';
import IconMail from '@/components/Icon/IconMail';
import * as yup from 'yup';
import { useForm, FieldError } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { usersType } from '@/types';
import { useGetDetailUsersQuery, usePostUsersMutation, useUpdateUsersMutation } from '@/store/api/users/usersApiSlice';
import { useGetRolesQuery } from '@/store/api/roles/rolesApiSlice';
import { rolesType } from '@/types/rolesType';
import { ToastContainer, toast } from 'react-toastify';
import { responseCallback } from '@/utils/responseCallback';
import { toastMessage } from '@/utils/toastUtils';

const Form = () => {
    const user = useSelector((state: any) => state.auth.user);
    const [post, { isLoading: isLoadingPost, error: isErrorPost }] = usePostUsersMutation();
    const [update, { isLoading: isLoadingUpdate, error: isErrorUpdate }] = useUpdateUsersMutation();
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();
    const pathSegments = location.pathname.split('/');
    const lastSegment = pathSegments[pathSegments.length - 1];
    const type = pathSegments[2];

    const { id } = useParams();
    const { data: detailUsers, refetch: detailUsersRefetch } = id ? useGetDetailUsersQuery(id) : { data: null, refetch: () => {} };
    const { data: rolesList, refetch: rolesListRefetch } = useGetRolesQuery({});

    const schema = yup
        .object({
            email: yup.string().email('email format salah').required('Email is Required'),
            password: id ? yup.string() : yup.string().required('Password is Required'),
            userName: yup.string().required('Username is Required'),
            displayName: yup.string().required('Name is Required'),
            roleID: yup.string().required('Role is Required'),
            status: yup.string().required('Status is Required'),
        })
        .required();

    const {
        register,
        formState: { errors },
        handleSubmit,
        setValue,
    } = useForm<usersType>({
        resolver: yupResolver(schema),
        mode: 'all',
        defaultValues: {
            status: 'Active',
        },
    });

    const submitForm = async (data: usersType) => {
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
            detailUsersRefetch();
        }
    }, [id]);

    useEffect(() => {
        if (detailUsers?.data) {
            Object.keys(detailUsers.data).forEach((key) => {
                setValue(key as keyof usersType, detailUsers.data[key]);
            });
        }
    }, [detailUsers, setValue]);

    return (
        <div>
            <div className='panel flex'>
                <ol className="flex space-x-2 rtl:space-x-reverse">
                    <li>
                        <Link to="/user" className="text-primary hover:underline">
                            Users
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
                </ol>
            </div>
            <div className="panel mt-6">
                <form className="flex gap-6 flex-col" onSubmit={handleSubmit(submitForm)}>
                    <div className="grid md:grid-cols-2 gap-4 w-full ">
                        <div>
                            <label htmlFor="userName">Username</label>
                            <div className="relative text-white-dark">
                                <input id="userName" type="text" placeholder="Enter Username" {...register('userName')} className="form-input placeholder:text-white-dark" />
                                {/* <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                    <IconMail fill={true} />
                                </span> */}
                            </div>
                            <span className="text-danger text-xs">{(errors.userName as FieldError)?.message}</span>
                        </div>
                        <div>
                            <label htmlFor="displayName">Name</label>
                            <div className="relative text-white-dark">
                                <input id="displayName" type="text" placeholder="Enter Name" {...register('displayName')} className="form-input placeholder:text-white-dark" />
                                {/* <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                    <IconMail fill={true} />
                                </span> */}
                            </div>
                            <span className="text-danger text-xs">{(errors.displayName as FieldError)?.message}</span>
                        </div>
                        <div>
                            <label htmlFor="Email">Email</label>
                            <div className="relative text-white-dark">
                                <input id="Email" type="email" placeholder="Enter Email" {...register('email')} className="form-input placeholder:text-white-dark" />
                                {/* <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                    <IconMail fill={true} />
                                </span> */}
                            </div>
                            <span className="text-danger text-xs">{(errors.email as FieldError)?.message}</span>
                        </div>
                        <div>
                            <label htmlFor="Password">Password</label>
                            <div className="relative text-white-dark">
                                <input id="Password" type="password" placeholder="Enter Password" {...register('password')} className="form-input placeholder:text-white-dark" />
                                {/* <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                    <IconMail fill={true} />
                                </span> */}
                            </div>
                            <span className="text-danger text-xs">{(errors.password as FieldError)?.message}</span>
                        </div>
                        <div>
                            <label htmlFor="roleID">Role</label>
                            <div className="relative text-white-dark">
                                <select id="roleID" {...register('roleID')} className="form-select">
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
                                    <input type="radio" value="Active" {...register('status')} className="form-radio" />
                                    <span className="ml-2 text-white-dark">Active</span>
                                </label>
                                <label className="flex items-center">
                                    <input type="radio" value="InActive" {...register('status')} className="form-radio" />
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
