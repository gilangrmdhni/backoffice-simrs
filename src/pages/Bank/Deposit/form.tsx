import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { setPageTitle, setTitle, setBreadcrumbTitle } from '../../../store/themeConfigSlice';
import { useForm, FieldError, useFieldArray } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { ToastContainer } from 'react-toastify';
import { responseCallback } from '@/utils/responseCallback';
import { toastMessage } from '@/utils/toastUtils';
import { useGetDepositDetailQuery, useCreateDepositMutation, useUpdateDepositMutation } from '@/store/api/bank/deposit/depositApiSlice';
import { useGetBanksQuery, useGetOptionBankQuery } from '@/store/api/bank/bankApiSlice';
import { DepositType, DebitEntry, DepositUpdateType } from '@/types/depositType';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTimes, faTrash } from '@fortawesome/free-solid-svg-icons';
import IconPlus from '@/components/Icon/IconPlus';
import ModalCoaCustom from '@/components/ModalCoaCustom';
import { COAType } from '@/types';
import { useTranslation } from 'react-i18next';
import i18next from 'i18next';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.css';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';

interface BankOption {
    desc: string;
    label: string;
}

const DepositForm = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const isRtl = useSelector((state: any) => state.themeConfig.rtlClass) === 'rtl' ? true : false;
    const { data: detailDeposit, refetch: refetchDetailDeposit } = id ? useGetDepositDetailQuery(Number(id)) : { data: null, refetch: () => { } };
    const [createDeposit, { isLoading: isCreating }] = useCreateDepositMutation();
    const [updateDeposit, { isLoading: isUpdating }] = useUpdateDepositMutation();
    const [isShowModalCoa, setIsShowModalCoa] = useState<boolean>(false);
    const [selectedRecords, setSelectedRecords] = useState<any>([]);
    const [showSelected, setShowSelected] = useState<any>([]);
    const [excludeId, setExcludeId] = useState<any>('');
    const [isSave, setIsSave] = useState<boolean>(false);

    const schema = yup.object({
        transactionNo: yup.string().required('Transaction No is Required'),
        desciption: yup.string().required('Credit Description is Required'),
        coaCode: yup.string().required('Account is Required'),
        transactionDate: yup.date().required('Created Date is Required'),
        details: yup.array().of(
            yup.object().shape({
                // coaCode: yup.string().required('Account is Required'),
                desciption: yup.string().required('Memo is Required'),
                amount: yup.number().required('Amount is Required').positive('Amount must be positive'),
            })
        ).required().min(1, 'At least one debit entry is required'),
    }).required();

    const { register, control, formState: { errors }, handleSubmit, setValue, watch } = useForm<DepositType>({
        resolver: yupResolver(schema),
        defaultValues: {
            details: [{ coaCode: '', desciption: '', amount: 0 }]
        }
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'details',
    });

    const { data: bankResponse } = useGetOptionBankQuery({
        parent: 952,
    });
    const bankList: BankOption[] = bankResponse?.data ?? [];

    const [total, setTotal] = useState(0);
    const [difference, setDifference] = useState(0);
    const [amountText, setAmountText] = useState('');

    const convertNumberToText = (num: number) => {
        const units = ['', 'Satu', 'Dua', 'Tiga', 'Empat', 'Lima', 'Enam', 'Tujuh', 'Delapan', 'Sembilan'];
        const teens = ['Sepuluh', 'Sebelas', 'Dua Belas', 'Tiga Belas', 'Empat Belas', 'Lima Belas', 'Enam Belas', 'Tujuh Belas', 'Delapan Belas', 'Sembilan Belas'];
        const tens = ['', '', 'Dua Puluh', 'Tiga Puluh', 'Empat Puluh', 'Lima Puluh', 'Enam Puluh', 'Tujuh Puluh', 'Delapan Puluh', 'Sembilan Puluh'];
        const thousands = ['', 'ribu', 'Juta', 'Miliar', 'Triliun'];

        if (num === 0) return 'Nol';

        let numStr = num.toString();
        let word = '';
        let scale = 0;

        while (numStr.length > 0) {
            let chunk;
            if (numStr.length > 3) {
                chunk = parseInt(numStr.slice(-3), 10);
                numStr = numStr.slice(0, -3);
            } else {
                chunk = parseInt(numStr, 10);
                numStr = '';
            }

            if (chunk) {
                let chunkStr = '';
                if (chunk > 99) {
                    if (Math.floor(chunk / 100) === 1) {
                        chunkStr += 'Seratus ';
                    } else {
                        chunkStr += units[Math.floor(chunk / 100)] + ' Ratus ';
                    }
                    chunk %= 100;
                }
                if (chunk > 19) {
                    chunkStr += tens[Math.floor(chunk / 10)] + ' ';
                    chunk %= 10;
                }
                if (chunk > 9) {
                    chunkStr += teens[chunk - 10] + ' ';
                } else {
                    if (chunk === 1 && scale === 1) {
                        chunkStr += 'Se';
                    } else {
                        chunkStr += units[chunk] + ' ';
                    }
                }
                word = chunkStr + thousands[scale] + ' ' + word;
            }
            scale++;
        }

        return word.trim() + ' Rupiah';
    };

    const deleteItem = (indexToDelete: any) => {
        const newItems = showSelected.filter((value: any, index: number) => index !== indexToDelete);
        setShowSelected(newItems);
        setSelectedRecords(newItems);
    };


    useEffect(() => {
        dispatch(setPageTitle('Deposit'));
        dispatch(setTitle('Deposit'));
        dispatch(setBreadcrumbTitle(['Dashboard', 'Bank', 'Deposit', id ? 'Update' : 'Create']));

        if (id) {
            refetchDetailDeposit();
        }
    }, [dispatch, id, refetchDetailDeposit]);

    useEffect(() => {
        if (detailDeposit && detailDeposit.data) {
            Object.keys(detailDeposit.data).forEach((key) => {
                if (key === 'transactionDate') {
                    const isoString = detailDeposit.data[key as keyof DepositType] as string;
                    const date = new Date(isoString);
                    const formattedDate = date.toISOString().split('T')[0];
                    setValue(key as keyof DepositType, formattedDate);
                } else {
                    setValue(key as keyof DepositType, detailDeposit.data[key as keyof DepositType]);
                }
            });
        }
    }, [detailDeposit, setValue]);

    useEffect(() => {
        const subscription = watch((value, { name, type }) => {
            // console.log(name)
            if (name === 'amount' || name?.includes("amount")) {
                const amount = parseFloat(value.amount?.toString() || '0') || 0;
                setAmountText(convertNumberToText(amount));
                setTotal(amount);
                const totaldetails = value.details?.reduce((sum, debit) => {
                    const debitAmount = parseFloat(debit?.amount?.toString() || '0') || 0;
                    return sum + debitAmount;
                }, 0) || 0;
                setDifference(amount - totaldetails);
            }
        });
        return () => subscription.unsubscribe();
    }, [watch]);

    const { t } = useTranslation();

    return (
        <div>
            <div className="panel mt-6">
                <div className='panel'>

                </div>
            </div>
        </div>
    );
};

export default DepositForm;
