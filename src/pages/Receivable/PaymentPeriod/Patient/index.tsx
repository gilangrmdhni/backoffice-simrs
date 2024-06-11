import React, { useState, useEffect } from 'react';
import Tippy from '@tippyjs/react';
import IconDownload from '@/components/Icon/IconDownload';
import AnimateHeight from 'react-animate-height';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { setBreadcrumbTitle, setPageTitle, setTitle } from '../../../../store/themeConfigSlice';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { responseCallback } from '@/utils/responseCallback';
import { toastMessage } from '@/utils/toastUtils';
import { agingScheduleInsuranceType } from '@/types/agingScheduleInsuranceType';
import { useGetAgingSchedulePatientQuery } from '@/store/api/agingSchedule/agingSchedulePatientApiSlice';
import { useGetAgingScheduleInsuranceQuery } from '@/store/api/agingSchedule/agingScheduleInsuranceApiSlice';
import '@/pages/Receivable/AgingSchedule/ReportPerInsurance/index.css'
import SelectSearch from 'react-select'
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.css';
import IconSearch from '@/components/Icon/IconSearch';
import { OptionType } from '@/types';
import { agingSchedulePatientType } from '@/types/agingSchedulePatientType';
import { useGetOptionInsuranceQuery,useGetOptionStatusQuery } from '@/store/api/receivable/receivableType';
const Patient = () => {
    const isRtl = useSelector((state: any) => state.themeConfig.rtlClass) === 'rtl' ? true : false;
    const dateNow = new Date
    const [page, setPage] = useState<number>(1);
    const PAGE_SIZES: number[] = [10, 20, 30, 50, 100];
    const [pageSize, setPageSize] = useState<number>(PAGE_SIZES[0]);
    const [search, setSearch] = useState<string>('');
    const [searchOptionInsurance, setSearchOptionInsurance] = useState<string>('');
    const [status, setStatus] = useState<string>('');
    const [searchInsurance, setSearchInsurance] = useState<string>('');
    const [showFilter, setShowFilter] = useState<boolean>(false);
    const [startDate, setStartDate] = useState<any>('');
    const [endDate, setEndDate] = useState<any>('');
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({ columnAccessor: 'billingDate', direction: 'desc' });
    const [selectedRecords, setSelectedRecords] = useState<any>([]);
    const navigate = useNavigate();
    const {
        data: PatientList,
        refetch,
        error,
        isLoading,
    } = useGetAgingSchedulePatientQuery({
        keyword: search,
        startDate:startDate,
        endDate:endDate,
        page: page,
        pageSize: pageSize,
        orderBy: sortStatus.columnAccessor === 'insuranceName' ? 'insuranceName' : sortStatus.columnAccessor,
        orderType: sortStatus.direction,
        insurance:searchInsurance,
        status,
    });
    //     useEffect(() => {
    //         try {
    //             const GetScheduleInsurance = async () => {    
    //                 await getAgingScheduleInsuranceData({
    //                     keyword: search,
    //                     page: page,
    //                     pageSize: pageSize,
    //                     orderBy: sortStatus.columnAccessor === 'insuranceName' ? 'insuranceName' : sortStatus.columnAccessor,
    //                     orderType: sortStatus.direction,
    //                     status: status,
    //                 }).unwrap();
    //             }
    //             toastMessage(GetScheduleInsurance.message,'success')
    //         } catch (err: any) {
    //             toastMessage(err.message,'error')
    //         }
    //     })
    const {
        data: insuranceListOption,
        refetch: insuranceListOptionRefetch,
        error: agingScheduleInsuranceError,
        isLoading: agingScheduleInsuranceIsLoading,
    } = useGetOptionInsuranceQuery({
        keyword: searchOptionInsurance,
        page: 1,
        pageSize: 20,
        orderBy: sortStatus.columnAccessor === 'insuranceName' ? 'insuranceName' : sortStatus.columnAccessor,
        orderType: sortStatus.direction,
        status,
    });

    let insuranceOption = [];
    insuranceOption.push({
        label: "All Insurance",
        value: "",
    })
    insuranceListOption?.data?.map((item: any) => {
        insuranceOption.push({
            label: item.label,
            value: item.value
        })
    })

    useEffect(() => {
        setTimeout(() => {
            insuranceListOptionRefetch();
            insuranceListOption.push({
                label: "All Insurance",
                value: "",
            })
            {
                insuranceListOption?.data?.map((item: any) => {
                    insuranceOption.push({
                        label: item.insuranceName,
                        value: item.insuranceName
                    })
                })
            }
        }, 3000);
    }, [searchOptionInsurance]);
    const {
        data: statusListOption,
        refetch: statusListOptionRefetch,
    } = useGetOptionStatusQuery({
        page: -1,
        pageSize: 20,
    });
    const formatNumber = (number: any) => {
        // Mengubah angka menjadi string dengan dua digit desimal
        let formattedNumber = number.toFixed(0);
        // Mengganti titik desimal dengan koma
        formattedNumber = formattedNumber.replace('.', ',');
        // Menambahkan titik sebagai pemisah ribuan
        formattedNumber = formattedNumber.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        return formattedNumber;
    };

    let total = 0;
    let totalCell = 0;
    
    return(
        <>
        <div className='report-insurance'>
            <div className="panel mt-6">
                <div className="flex md:items-center md:flex-row flex-col mb-5 gap-5">
                    <div className="rtl:ml-auto rtl:mr-auto">
                        <div className="grid grid-cols-5 gap-2">
                            <input type="text" className="form-input w-auto" placeholder="Keyword..." value={search} onChange={(e) => setSearch(e.target.value)} />
                            <select id="ctnSelect1" className="form-select text-white-dark" onChange={(e) => setStatus(e.target.value)}>
                                <option value={''}>All Status</option>
                                {statusListOption?.data?.map((d: OptionType, i: number) => {
                                    return <option value={d.value}>{d.label}</option>;
                                })}
                            </select>
                            <SelectSearch 
                                 placeholder="Search Insurance..."
                                 options={insuranceOption}
                                 className="z-10"
                                 onInputChange={(e)=> setSearchOptionInsurance(e)}
                                 onChange={(dt: any)=>{setSearchInsurance(dt.value)}}
                            />
                            <Flatpickr placeholder="Start Date" value={startDate} options={{ dateFormat: 'Y-m-d', position: isRtl ? 'auto right' : 'auto left' }} className="form-input" onChange={(date:any) => setStartDate(date)} />
                            <Flatpickr placeholder="End Date" value={endDate} options={{ dateFormat: 'Y-m-d', position: isRtl ? 'auto right' : 'auto left' }} className="form-input" onChange={(date:any) => setEndDate(date)} />
                        </div>
                    </div>
                    <div className="ltr:ml-auto">
                        <div className="grid grid-cols-2 gap-2">
                            <span></span>
                            <Tippy content="Download">
                                <Link to="" className="block w-10 h-10 p-2.5 rounded-full bg-white-light/40 dark:bg-dark/40 hover:text-primary hover:bg-white-light/90 dark:hover:bg-dark/60">
                                    <IconDownload />
                                </Link>
                            </Tippy>
                        </div>
                    </div>
                </div>
                
                <div className="datatables">
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Insurance</th>
                                <th>Billing Date</th>
                                <th>Due Date</th>
                                <th>Status</th>
                                <th>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                PatientList?.data?.data?.map((data:agingSchedulePatientType,index : number) => {
                                    totalCell = (data.zeroToFortyFive+data.fortyFiveToSixty+data.sixtyToNinety+data.ninetyToOneTwenty+data.ninetyToOneTwenty)
                                    total += totalCell
                                    return(
                                        <>
                                            <tr key={index}>
                                                <td>{data.pantientName}</td>
                                                <td>{data.insuranceName}</td>
                                                <td>{new Date(data.billingDate).toLocaleDateString()}</td>
                                                <td>{new Date(data.dueDate).toLocaleDateString()}</td>
                                                <td>
                                                    <span className={` text-bold ${data.status == "Not Yet Due" ? 'text-sky-600' : data.status == "Due Soon" ? 'text-orange-600' : 'text-red-600'}`} > 
                                                        {data.status} 
                                                    </span>
                                                </td>
                                                <td>{formatNumber(totalCell)}</td>
                                            </tr>
                                        </>
                                    )
                                })
                            }
                        </tbody>
                        <tfoot>
                            <tr>
                                <th colSpan={5}>Total</th>
                                <th>{formatNumber(total)}</th>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </div>
        </>
    )
}

export default Patient

