import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { setPageTitle } from '../../store/themeConfigSlice';
import IconMail from '../../components/Icon/IconMail';
import IconLockDots from '../../components/Icon/IconLockDots';
import { useLoginMutation } from "@/store/api/auth/authApiSlice";
import { useForm, SubmitHandler, SubmitErrorHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { setUser } from "@/store/api/auth/authSlice";
import { LoginRequest } from '@/types/apiType';

const LoginBoxed = () => {
    const [login, {error, isLoading}] = useLoginMutation();
    const dispatch = useDispatch();
    
    const schema = yup.object({
                        email: yup.string().email("email format salah").required("Email is Required"),
                        password: yup.string().required("Password is Required"),
                    }).required();


    useEffect(() => {
        dispatch(setPageTitle('Login Boxed'));
    });

    const { register,  formState: { errors }, handleSubmit} = useForm({
         resolver: yupResolver(schema), mode: "all",
    });

    const navigate = useNavigate();
    const submitForm = async (request : LoginRequest) => {
        const response  = await login(request);
        if(!error){
            dispatch(setUser(response.data.data));
            navigate("/")
        }
    };

    return (
        <div>
            <div className="relative flex min-h-screen items-center justify-center bg-[url(/assets/images/03.jpg)] bg-cover bg-center bg-no-repeat px-6 py-10 dark:bg-[#060818] sm:px-16">
                <div className="relative w-full max-w-[870px] rounded-md bg-[linear-gradient(45deg,#fff9f9_0%,rgba(255,255,255,0)_25%,rgba(255,255,255,0)_75%,_#fff9f9_100%)] p-2 dark:bg-[linear-gradient(52.22deg,#0E1726_0%,rgba(14,23,38,0)_18.66%,rgba(14,23,38,0)_51.04%,rgba(14,23,38,0)_80.07%,#0E1726_100%)]">
                    <div className="relative flex flex-col justify-center rounded-md bg-white/60 backdrop-blur-lg dark:bg-black/50 px-6 lg:min-h-[758px] py-20">
                        <div className="mx-auto w-full max-w-[440px]">
                            <div className="mb-10">
                                <h1 className="text-3xl font-extrabold uppercase !leading-snug text-primary md:text-4xl">Sign in</h1>
                                <p className="text-base font-bold leading-normal text-white-dark">Enter your email and password to login</p>
                            </div>
                            <form className="space-y-5 dark:text-white" onSubmit={handleSubmit(submitForm)}>
                                <div>
                                    <label htmlFor="Email">Email</label>
                                    <div className="relative text-white-dark">
                                        <input id="Email" type="email" {...register('email')} placeholder="Enter Email" className="form-input ps-10 placeholder:text-white-dark" />
                                        <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                            <IconMail fill={true} />
                                        </span>
                                    </div>
                                    <span className="text-danger text-xs">{errors.email?.message}</span>
                                </div>
                                <div>
                                    <label htmlFor="Password">Password</label>
                                    <div className="relative text-white-dark">
                                        <input id="Password" type="password"  {...register('password')} placeholder="Enter Password" className="form-input ps-10 placeholder:text-white-dark" />
                                        <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                            <IconLockDots fill={true} />
                                        </span>
                                    </div>
                                    <span className="text-danger text-xs">{errors.password?.message}</span>
                                </div>
                                <button disabled={isLoading} type="submit" className="btn btn-primary !mt-6 w-full border-0 uppercase shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)]">
                                    Sign in {isLoading ? <span className="animate-ping w-3 h-3 ltr:mr-4 rtl:ml-10 inline-block rounded-full bg-white ml8"></span> : ""}
                                </button>
                                <span className="text-danger text-xs">{error?.data?.message}</span>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginBoxed;
