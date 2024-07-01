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
import { useGetAgingScheduleInsuranceQuery,useGetAgingScheduleInsuranceDataMutation } from '@/store/api/agingSchedule/agingScheduleInsuranceApiSlice';
import '@/pages/Receivable/AgingSchedule/ReportPerInsurance/index.css'
import SelectSearch from 'react-select'
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.css';
import IconSearch from '@/components/Icon/IconSearch';
import { FormatNumber } from '@/utils/formatNumber';
const ReportPerInsurance = () => {
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
        data: agingScheduleInsuranceList,
        refetch,
        error,
        isLoading,
    } = useGetAgingScheduleInsuranceQuery({
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
    const [getAgingScheduleInsuranceData,{ isLoading: isLoadingInsuranceData, isError: isErrorInsuranceData }] = useGetAgingScheduleInsuranceDataMutation();
    
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
        data: agingScheduleInsuranceListOption,
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
    agingScheduleInsuranceListOption?.data?.map((item: any) => {
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
                agingScheduleInsuranceListOption?.data?.map((item: any) => {
                    AgingScheduleInsuranceOption.push({
                        label: item.insuranceName,
                        value: item.insuranceName
                    })
                })
            }
        }, 3000);
    }, [searchOptionInsurance]);

    let total = 0;
    let totalCell = 0;
    let zeroToFortyFiveTotal = 0;
    let fortyFiveToSixtyTotal = 0;
    let sixtyToNinetyTotal = 0;
    let ninetyToOneTwentyTotal = 0;
    let greaterThanOneTwentyTotal = 0;
    return(
        <>
        <div className='report-insurance'>
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
                                <th rowSpan={2}>Insurance</th>
                                <th rowSpan={2}>Amount</th>
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
                                agingScheduleInsuranceList?.data?.map((data:agingScheduleInsuranceType,index : number) => {
                                    totalCell = (data.zeroToFortyFive+data.fortyFiveToSixty+data.sixtyToNinety+data.ninetyToOneTwenty+data.ninetyToOneTwenty)
                                    total += totalCell
                                    zeroToFortyFiveTotal += data.zeroToFortyFive
                                    fortyFiveToSixtyTotal += data.fortyFiveToSixty
                                    sixtyToNinetyTotal += data.sixtyToNinety
                                    ninetyToOneTwentyTotal += data.ninetyToOneTwenty
                                    greaterThanOneTwentyTotal += data.greaterThanOneTwenty
                                    return(
                                        <React.Fragment key={index}>
                                            <tr >
                                                <td>{data.insuranceName}</td>
                                                <td>{FormatNumber(totalCell)}</td>
                                                <td>{FormatNumber(data.zeroToFortyFive)}</td>
                                                <td>{FormatNumber(data.fortyFiveToSixty)}</td>
                                                <td>{FormatNumber(data.sixtyToNinety)}</td>
                                                <td>{FormatNumber(data.ninetyToOneTwenty)}</td>
                                                <td>{FormatNumber(data.greaterThanOneTwenty)}</td>
                                            </tr>
                                        </React.Fragment>
                                    )
                                })
                            }
                        </tbody>
                        <tfoot>
                            <tr>
                                <th>Total</th>
                                <th>{FormatNumber(total)}</th>
                                <th>{FormatNumber(zeroToFortyFiveTotal)}</th>
                                <th>{FormatNumber(fortyFiveToSixtyTotal)}</th>
                                <th>{FormatNumber(sixtyToNinetyTotal)}</th>
                                <th>{FormatNumber(ninetyToOneTwentyTotal)}</th>
                                <th>{FormatNumber(greaterThanOneTwentyTotal)}</th>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </div>
        </>
    )
}

export default ReportPerInsurance

