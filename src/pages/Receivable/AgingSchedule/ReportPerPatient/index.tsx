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
import { agingSchedulePatientType } from '@/types/agingSchedulePatientType';
import SelectSearch from 'react-select'
import { useGetAgingSchedulePatientQuery } from '@/store/api/agingSchedule/agingSchedulePatientApiSlice';
import { useGetAgingScheduleInsuranceQuery } from '@/store/api/agingSchedule/agingScheduleInsuranceApiSlice';
import '@/pages/Receivable/AgingSchedule/ReportPerPatient/index.css'
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.css';

const ReportPerPatient = ()=>{
    const isRtl = useSelector((state: any) => state.themeConfig.rtlClass) === 'rtl' ? true : false;
    const [page, setPage] = useState<number>(1);
    const PAGE_SIZES: number[] = [10, 20, 30, 50, 100];
    const [pageSize, setPageSize] = useState<number>(PAGE_SIZES[0]);
    const [search, setSearch] = useState<string>('');
    const [searchOptionInsurance, setSearchOptionInsurance] = useState<string>('');
    const [status, setStatus] = useState<string>('');
    const [searchInsurance, setSearchInsurance] = useState<string>('');
    const [startDate, setStartDate] = useState<any>('');
    const [endDate, setEndDate] = useState<any>('');
    const [showFilter, setShowFilter] = useState<boolean>(false);
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({ columnAccessor: 'billingDate', direction: 'desc' });
    const [selectedRecords, setSelectedRecords] = useState<any>([]);
    const navigate = useNavigate();
    const {
        data: agingSchedulePatientList,
        refetch,
        error,
        isLoading,
    } = useGetAgingSchedulePatientQuery({
        keyword: search,
        insurance:searchInsurance,
        startDate:startDate,
        endDate:endDate,
        page: page,
        pageSize: pageSize,
        orderBy: sortStatus.columnAccessor === 'patientName' ? 'patientName' : sortStatus.columnAccessor,
        orderType: sortStatus.direction,
        status,
    });

    const {
        data: agingScheduleInsuranceList,
        refetch: agingScheduleInsuranceRefetch,
        error: agingScheduleInsuranceError,
        isLoading: agingScheduleInsuranceIsLoading,
    } = useGetAgingScheduleInsuranceQuery({
        keyword: searchOptionInsurance,
        page: 1,
        pageSize: 20,
        orderBy: sortStatus.columnAccessor === 'insuranceName' ? 'insuranceName' : sortStatus.columnAccessor,
        orderType: sortStatus.direction,
        status,
    });

    let AgingScheduleInsuranceOption = [];
    AgingScheduleInsuranceOption.push({
        label: "All Insurance",
        value: "",
    })
    agingScheduleInsuranceList?.data?.map((item: any) => {
        AgingScheduleInsuranceOption.push({
            label: item.insuranceName,
            value: item.insuranceName
        })
    })

    useEffect(() => {
        setTimeout(() => {
            agingScheduleInsuranceRefetch();
            AgingScheduleInsuranceOption.push({
                label: "All Insurance",
                value: "",
            })
            {
                agingScheduleInsuranceList?.data?.map((item: any) => {
                    AgingScheduleInsuranceOption.push({
                        label: item.insuranceName,
                        value: item.insuranceName
                    })
                })
            }
        }, 3000);
    }, [searchOptionInsurance]);

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
    let zeroToFortyFiveTotal = 0;
    let fortyFiveToSixtyTotal = 0;
    let sixtyToNinetyTotal = 0;
    let ninetyToOneTwentyTotal = 0;
    let greaterThanOneTwentyTotal = 0;
    return(
        <>
        <div className='report-patient'>
            <div className="panel mt-6">
                <div className="flex md:items-center md:flex-row flex-col mb-5 gap-5">
                    <div className="rtl:ml-auto rtl:mr-auto">
                        <div className="grid grid-cols-5 gap-2">
                            <input type="text" className="form-input w-auto" placeholder="Keyword..." value={search} onChange={(e) => setSearch(e.target.value)} />
                            <SelectSearch 
                                 placeholder="All Type"
                                 options={AgingScheduleInsuranceOption}
                                 className="z-10"
                                 onInputChange={(e)=> setSearchOptionInsurance(e)}
                                 onChange={(dt: any)=>{setSearchInsurance(dt.value)}}
                            />
                            <Flatpickr placeholder="Start Date" value={startDate} options={{ dateFormat: 'Y-m-d', position: isRtl ? 'auto right' : 'auto left' }} className="form-input" onChange={(date:any) => setStartDate(date)} />
                            <Flatpickr placeholder="End Date" value={endDate} options={{ dateFormat: 'Y-m-d', position: isRtl ? 'auto right' : 'auto left' }} className="form-input" onChange={(date:any) => setEndDate(date)} />
                          
                            <button className={`btn btn-primary w-20`}>
                                Filter
                            </button>
                          
                            <button
                                type="button"
                                className="hidden w-10 h-10 p-2.5 rounded-full bg-white-light/40 dark:bg-dark/40 hover:text-primary hover:bg-white-light/90 dark:hover:bg-dark/60"
                                onClick={() => setShowFilter((prevValue) => !prevValue)}
                            >
                                <span className="flex items-center">
                                    <img src="/assets/images/sorting-options.svg" />
                                </span>
                            </button>
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
                                <th rowSpan={2}>Name</th>
                                <th rowSpan={2}>Insurance</th>
                                <th rowSpan={2}>Billing Date</th>
                                <th rowSpan={2}>Total</th>
                                <th colSpan={5}>Period (Days)</th>
                            </tr>
                            <tr>
                                <th>0-45</th>
                                <th>45-60</th>
                                <th>60-90</th>
                                <th>90-120</th>
                                <th>120</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                agingSchedulePatientList?.data?.map((data: agingSchedulePatientType,index:number) => {
                                    totalCell = (data.zeroToFortyFive+data.fortyFiveToSixty+data.sixtyToNinety+data.ninetyToOneTwenty+data.ninetyToOneTwenty)
                                    total += totalCell
                                    zeroToFortyFiveTotal += data.zeroToFortyFive
                                    fortyFiveToSixtyTotal += data.fortyFiveToSixty
                                    sixtyToNinetyTotal += data.sixtyToNinety
                                    ninetyToOneTwentyTotal += data.ninetyToOneTwenty
                                    greaterThanOneTwentyTotal += data.greaterThanOneTwenty
                                    return(
                                        <>
                                            <tr key={index} className='hover:bg-'>
                                                <td>{data.patientName}</td>
                                                <td>{data.insuranceName}</td>
                                                <td>{new Date(data.billingDate).toLocaleDateString()}</td>
                                                <td>{formatNumber(totalCell)}</td>
                                                <td>{formatNumber(data.zeroToFortyFive)}</td>
                                                <td>{formatNumber(data.fortyFiveToSixty)}</td>
                                                <td>{formatNumber(data.sixtyToNinety)}</td>
                                                <td>{formatNumber(data.ninetyToOneTwenty)}</td>
                                                <td>{formatNumber(data.greaterThanOneTwenty)}</td>
                                            </tr>
                                        </>
                                    )
                                })
                            }
                        </tbody>
                        <tfoot>
                            <tr>
                                <th colSpan={3}>Total</th>
                                <th>{formatNumber(total)}</th>
                                <th>{formatNumber(zeroToFortyFiveTotal)}</th>
                                <th>{formatNumber(fortyFiveToSixtyTotal)}</th>
                                <th>{formatNumber(sixtyToNinetyTotal)}</th>
                                <th>{formatNumber(ninetyToOneTwentyTotal)}</th>
                                <th>{formatNumber(greaterThanOneTwentyTotal)}</th>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </div>
        </>
    )
}

export default ReportPerPatient

