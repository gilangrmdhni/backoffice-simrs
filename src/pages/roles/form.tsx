import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { setPageTitle } from '../../store/themeConfigSlice';
import * as yup from 'yup';
import { useForm, SubmitHandler, SubmitErrorHandler, FieldError, set } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { usersType } from '@/types';
import { useGetDetailRolesQuery, usePostRolesMutation, useUpdateRolesMutation } from '@/store/api/roles/rolesApiSlice';
import { rolesType } from '@/types/rolesType';
import { ToastContainer, toast } from 'react-toastify';
import { responseCallback } from '@/utils/responseCallback';
import { toastMessage } from '@/utils/toastUtils';

interface accessListType {
    pageCode?: string;
    action?: string;
    roleID?: number;
}

interface roleType {
    roleID?: number;
    accessList?: accessListType[];
    pageList?: string[];
}

const Form = () => {
    const [post, { isLoading: isLoadingPost, error: isErrorPost }] = usePostRolesMutation();
    const [update, { isLoading: isLoadingUpdate, error: isErrorUpdate }] = useUpdateRolesMutation();
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();
    const pathSegments = location.pathname.split('/');
    const lastSegment = pathSegments[pathSegments.length - 1];
    const type = pathSegments[2];

    const { id } = useParams();
    const { data: detailRoles, refetch: detailRolesRefetch } = id ? useGetDetailRolesQuery(id) : { data: null, refetch: () => {} };
    const { data: getAccessList, refetch: getAccessListRefetch } = useGetDetailRolesQuery('0');

    const schema = yup
        .object({
            roleName: yup.string().required('Role Name is Required'),
            accessList: yup
                .array()
                .of(yup.object({ roleID: yup.number().nullable(), action: yup.array().nullable(), pageCode: yup.string() }))
                .nullable(),
            pageList: yup.array().nullable(),
        })
        .required();

    const {
        register,
        formState: { errors },
        handleSubmit,
        setValue,
    } = useForm<any>({
        resolver: yupResolver(schema),
        mode: 'all',
        defaultValues: {
            pageList: null,
        },
    });

    const submitForm = async (data: any) => {
        try {
            data.accessList = data.accessList?.filter((item: accessListType) => item.pageCode !== 'false') || [];
            data.accessList?.forEach((item: any) => {
                if (item.action && Array.isArray(item.action)) {
                    item.action = item.action.join(',');
                }
            });
            let response: any;
            if (id) {
                response = await update(data);
            } else {
                response = await post(data);
            }
            responseCallback(response, (data: any) => setTimeout(() => navigate('/role'), 2000), null);
        } catch (err: any) {
            toastMessage(err.message, 'error');
        }
    };

    useEffect(() => {
        dispatch(setPageTitle('Roles'));
        if (id) {
            detailRolesRefetch();
        } else {
            getAccessListRefetch();
        }
    }, [dispatch, id]);

    useEffect(() => {
        if (detailRoles?.data) {
            Object.keys(detailRoles.data).forEach((key) => {
                if (key === 'accessList') {
                    const accessListWithArrayAction = detailRoles.data[key].map((item: accessListType) => ({
                        ...item,
                        action: item.action ? item.action.split(',') : [],
                    }));
                    console.log(accessListWithArrayAction);

                    setValue(key as keyof roleType, accessListWithArrayAction);
                } else {
                    setValue(key as keyof roleType, detailRoles.data[key]);
                }
            });
        }
    }, [detailRoles, setValue]);

    const isActionChecked = (pageCode: string, action: string, accessList: accessListType[]): boolean => {
        if (!Array.isArray(accessList)) {
            // Ini bukan array, jadi kembalikan false atau lakukan penanganan lain
            return false;
        }

        const pageAccess = accessList.find((item) => item.pageCode === pageCode);
        // Gunakan || untuk menggantikan undefined dengan false
        return pageAccess ? pageAccess.action?.includes(action) || false : false;
    };

    return (
        <div>
            <ToastContainer />
            <div className='panel flex'>
                <ol className="flex space-x-2 rtl:space-x-reverse">
                    <li>
                        <Link to="/role" className="text-primary hover:underline">
                            Roles
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
                    <div className="w-full md:w-1/2">
                        <div>
                            <label htmlFor="roleName">Role Name</label>
                            <div className="relative text-white-dark">
                                <input id="roleName" type="text" placeholder="Enter Username" {...register('roleName')} className="form-input placeholder:text-white-dark" />
                                {/* <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                    <IconMail fill={true} />
                                </span> */}
                            </div>
                            <span className="text-danger text-xs">{(errors.roleName as FieldError)?.message}</span>
                        </div>
                    </div>
                    <div className=" w-full ">
                        <label>Master Data</label>
                        <div className="flex flex-wrap gap-x-20 gap-y-5">
                            {getAccessList?.data?.pageList?.map((dt: any, idx: number) => (
                                <div key={idx}>
                                    <div className="relative flex items-center">
                                        <input id={`checkBoxPage_${idx}`} type="checkbox" value={dt?.pageCode} {...register(`accessList.${idx}.pageCode`)} className="form-checkbox" />
                                        <label htmlFor={`checkBoxPage_${idx}`} className="mt-[0.365rem]">
                                            {dt?.page}
                                        </label>
                                    </div>
                                    {['Create', 'Read', 'Update', 'Delete']?.map((d: string, i: number) => {
                                        return (
                                            <div key={i} className="relative flex items-center ml-7">
                                                <input
                                                    id={`checkBoxAction_${idx}_${d}`}
                                                    type="checkbox"
                                                    defaultChecked={isActionChecked(dt?.pageCode, d, detailRoles?.data?.accessList || [])}
                                                    value={d}
                                                    {...register(`accessList.${idx}.action`)}
                                                    className="form-checkbox"
                                                />
                                                <label htmlFor={`checkBoxAction_${idx}_${d}`} className="mt-[0.365rem]">
                                                    {d}
                                                </label>
                                            </div>
                                        );
                                    })}
                                </div>
                            ))}
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
