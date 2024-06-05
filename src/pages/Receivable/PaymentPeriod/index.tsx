import { Tab } from '@headlessui/react';
import { Fragment } from 'react';
import Insurance from './Insurance';
import Patient from './Patient';
import { setBreadcrumbTitle, setPageTitle, setTitle } from '../../../store/themeConfigSlice';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import React, { useState, useEffect } from 'react';

const Index = ()=>{
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Payment Period'));
        dispatch(setTitle('Payment Period'));
        dispatch(setBreadcrumbTitle(["Dashboard", "Receivable", "Payment Period"]));
    }, [dispatch]);
    return (
        <>
            <Tab.Group>
                <Tab.List className="mt-3 flex flex-wrap border-b border-white-light dark:border-[#191e3a]">
                    <Tab as={Fragment}>
                        {({ selected }) => (
                            <button
                                className={`${selected ? '!border-white-light !border-b-white  text-primary !outline-none dark:!border-[#191e3a] dark:!border-b-black' : ''}
                                dark:hover:border-b-black -mb-[1px] block border border-transparent p-3.5 py-2 hover:text-primary`}>
                                Patient
                            </button>
                        )}
                    </Tab>
                    <Tab as={Fragment}>
                        {({ selected }) => (
                            <button
                                className={`${selected ? '!border-white-light !border-b-white  text-primary !outline-none dark:!border-[#191e3a] dark:!border-b-black' : ''}
                                dark:hover:border-b-black -mb-[1px] block border border-transparent p-3.5 py-2 hover:text-primary`}>
                                Insurance
                            </button>
                        )}
                    </Tab>
                </Tab.List>
                <Tab.Panels>
                    <Tab.Panel>
                        <div className="active pt-5">
                            <Patient />
                        </div>
                    </Tab.Panel>
                    <Tab.Panel>
                        <div className='pt-5'>
                            <Insurance />
                        </div>
                    </Tab.Panel>
                </Tab.Panels>
            </Tab.Group>
        </>
    )
}

export default Index