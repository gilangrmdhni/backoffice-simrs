import { Tab } from '@headlessui/react';
import { Fragment } from 'react';
import ReportPerInsurance from './ReportPerInsurance';
import ReportPerPatient from './ReportPerPatient';
import { setBreadcrumbTitle, setPageTitle, setTitle } from '../../../store/themeConfigSlice';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import React, { useState, useEffect } from 'react';

const Index = ()=>{
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Aging Schedule'));
        dispatch(setTitle('Aging Schedule'));
        dispatch(setBreadcrumbTitle(["Dashboard", "Receivable", "Aging Schedule","Report Per Patient"]));
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
                                Report Per Patient
                            </button>
                        )}
                    </Tab>
                    <Tab as={Fragment}>
                        {({ selected }) => (
                            <button
                                className={`${selected ? '!border-white-light !border-b-white  text-primary !outline-none dark:!border-[#191e3a] dark:!border-b-black' : ''}
                                dark:hover:border-b-black -mb-[1px] block border border-transparent p-3.5 py-2 hover:text-primary`}>
                                Report Per Insurance
                            </button>
                        )}
                    </Tab>
                </Tab.List>
                <Tab.Panels>
                    <Tab.Panel>
                        <div className="active pt-5">
                            <ReportPerPatient />
                        </div>
                    </Tab.Panel>
                    <Tab.Panel>
                        <div className='pt-5'>
                            <ReportPerInsurance />
                        </div>
                    </Tab.Panel>
                </Tab.Panels>
            </Tab.Group>
        </>
    )
}

export default Index