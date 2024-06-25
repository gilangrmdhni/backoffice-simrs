import PerfectScrollbar from 'react-perfect-scrollbar';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useLocation } from 'react-router-dom';
import { toggleSidebar } from '../../store/themeConfigSlice';
import AnimateHeight from 'react-animate-height';
import { useState, useEffect } from 'react';
import IconMenuUsers from '../Icon/Menu/IconMenuUsers';
import IconMenuDocumentation from '../Icon/Menu/IconMenuDocumentation'
import IconCaretDown from '../Icon/IconCaretDown';
import IconHome from '../Icon/IconHome';

const Sidebar = () => {
    const user = useSelector((state: any) => state.auth.user);
    const [currentMenu, setCurrentMenu] = useState<string>('');
    const [errorSubMenu, setErrorSubMenu] = useState(false);
    const themeConfig = useSelector((state: any) => state.themeConfig);
    const semidark = useSelector((state: any) => state.themeConfig.semidark);
    const location = useLocation();
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const toggleMenu = (value: string) => {
        setCurrentMenu((oldValue) => {
            return oldValue === value ? '' : value;
        });
    };

    useEffect(() => {
        const selector = document.querySelector('.sidebar ul a[href="' + window.location.pathname + '"]');
        if (selector) {
            selector.classList.add('active');
            const ul: any = selector.closest('ul.sub-menu');
            if (ul) {
                let ele: any = ul.closest('li.menu').querySelectorAll('.nav-link') || [];
                if (ele.length) {
                    ele = ele[0];
                    setTimeout(() => {
                        ele.click();
                    });
                }
            }
        }
    }, []);

    useEffect(() => {
        if (window.innerWidth < 1024 && themeConfig.sidebar) {
            dispatch(toggleSidebar());
        }
    }, [location]);

    return (
        <div className={semidark ? 'dark' : ''}>
            <nav
                className={`sidebar fixed min-h-screen h-full top-0 bottom-0 w-[260px] shadow-[5px_0_25px_0_rgba(94,92,154,0.1)] z-50 transition-all duration-300 ${semidark ? 'text-white-dark' : ''}`}
            >
                <div className="bg-white h-full">
                    <div className="flex justify-between items-left px-4 py-3 ">
                        <div className="flex flex-col justify-center items-center">
                            <h3 className='font-semibold text-2xl'>RS Setia Mitra</h3>
                            <NavLink to="/" className="main-logo flex items-center shrink-0">
                                {/* <img className="w-8 ml-[5px] flex-none h-[45px] w-auto" src="https://placehold.co/150x45" alt="logo" /> */}
                                <img src="/assets/images/profile.jpg" alt="img" className="w-24 h-24 rounded-full object-cover mt-5 mb-5"></img>
                            </NavLink>
                            <p className='font-semibold text-xl'>{user?.displayName || ''}</p>
                            <p className='font-semibold text-l'>{user?.role?.roleName || ''}</p>
                        </div>

                        <button
                            type="button"
                            className="collapse-icon w-8 h-8 rounded-full flex items-center hover:bg-gray-500/10 dark:hover:bg-dark-light/10 dark:text-white-light transition duration-300 rtl:rotate-180"
                            onClick={() => dispatch(toggleSidebar())}
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 m-auto">
                                <path d="M13 19L7 12L13 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <path opacity="0.5" d="M16.9998 19L10.9998 12L16.9998 5" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                    </div>
                    <PerfectScrollbar className="h-[calc(100vh-80px)] relative">
                        <ul className="relative font-semibold space-y-0.5 p-4 py-0">
                            <li className={`menu nav-item ${currentMenu === 'dashboard' ? 'bg-[#9C6ACD]' : ''} hover:bg-purple-300`}>
                                <NavLink to="/">
                                    <button
                                        type="button"
                                        className={`nav-link group w-full`}
                                        onClick={() => toggleMenu('dashboard')}
                                    >
                                        <div className="flex items-center">
                                            <IconHome color={currentMenu === 'dashboard' ? 'white' : 'black'} />
                                            <span className={`ltr:pl-3 rtl:pr-3 ${currentMenu === 'dashboard' ? 'text-white' : 'text-black'}`}>{t('dashboard')}</span>
                                        </div>

                                        <div className={currentMenu === 'dashboard' ? 'rotate-90' : 'rtl:rotate-180'}></div>
                                    </button>
                                </NavLink>
                            </li>

                            <li className={`menu nav-item ${currentMenu === 'users' ? 'bg-[#9C6ACD]' : ''} hover:bg-purple-300`}>
                                <NavLink to="/users">
                                    <button type="button" className={`nav-link group w-full`} onClick={() => toggleMenu('users')}>
                                        <div className="flex items-center">
                                            <IconMenuUsers fill={`${currentMenu === "users" ? "white" : 'black'}`} className="group-hover:!text-primary text-black shrink-0" />
                                            <span className={`ltr:pl-3 rtl:pr-3 ${currentMenu === 'users' ? 'text-white' : 'text-black'}`}>{t('users')}</span>
                                        </div>
                                    </button>
                                </NavLink>
                            </li>
                            <li className={`menu nav-item ${currentMenu === 'role' ? 'bg-[#9C6ACD]' : ''} hover:bg-purple-300`}>
                                <NavLink to="/roles">
                                    <button type="button" className={`${currentMenu === 'role' ? 'active' : ''} nav-link group w-full`} onClick={() => toggleMenu('role')}>
                                        <div className="flex items-center">
                                            <IconMenuUsers fill={`${currentMenu === "role" ? "white" : 'black'}`} className="group-hover:!text-primary shrink-0" />
                                            <span className={`ltr:pl-3 rtl:pr-3 ${currentMenu === 'role' ? 'text-white' : 'text-black'}`}>{t('Roles')}</span>
                                        </div>
                                    </button>
                                </NavLink>
                            </li>

                            <li className={`menu nav-item ${currentMenu === 'master' ? 'bg-[#9C6ACD]' : ''} hover:bg-purple-300`}>
                                <button type="button" className={`nav-link group w-full`} onClick={() => toggleMenu('master')}>
                                    <div className="flex items-center">
                                        <svg className="group-hover:!text-primary shrink-0" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                opacity="0.5"
                                                d="M13 15.4C13 13.3258 13 12.2887 13.659 11.6444C14.318 11 15.3787 11 17.5 11C19.6213 11 20.682 11 21.341 11.6444C22 12.2887 22 13.3258 22 15.4V17.6C22 19.6742 22 20.7113 21.341 21.3556C20.682 22 19.6213 22 17.5 22C15.3787 22 14.318 22 13.659 21.3556C13 20.7113 13 19.6742 13 17.6V15.4Z"
                                                fill={`${currentMenu === "master" ? "white" : 'black'}`}
                                            />
                                            <path
                                                d="M2 8.6C2 10.6742 2 11.7113 2.65901 12.3556C3.31802 13 4.37868 13 6.5 13C8.62132 13 9.68198 13 10.341 12.3556C11 11.7113 11 10.6742 11 8.6V6.4C11 4.32582 11 3.28873 10.341 2.64437C9.68198 2 8.62132 2 6.5 2C4.37868 2 3.31802 2 2.65901 2.64437C2 3.28873 2 4.32582 2 6.4V8.6Z"
                                                fill={`${currentMenu === "master" ? "white" : 'black'}`}
                                            />
                                            <path
                                                d="M13 5.5C13 4.4128 13 3.8692 13.1713 3.44041C13.3996 2.86867 13.8376 2.41443 14.389 2.17761C14.8024 2 15.3266 2 16.375 2H18.625C19.6734 2 20.1976 2 20.611 2.17761C21.1624 2.41443 21.6004 2.86867 21.8287 3.44041C22 3.8692 22 4.4128 22 5.5C22 6.5872 22 7.1308 21.8287 7.55959C21.6004 8.13133 21.1624 8.58557 20.611 8.82239C20.1976 9 19.6734 9 18.625 9H16.375C15.3266 9 14.8024 9 14.389 8.82239C13.8376 8.58557 13.3996 8.13133 13.1713 7.55959C13 7.1308 13 6.5872 13 5.5Z"
                                                fill={`${currentMenu === "master" ? "white" : 'black'}`}
                                            />
                                            <path
                                                opacity="0.5"
                                                d="M2 18.5C2 19.5872 2 20.1308 2.17127 20.5596C2.39963 21.1313 2.83765 21.5856 3.38896 21.8224C3.80245 22 4.32663 22 5.375 22H7.625C8.67337 22 9.19755 22 9.61104 21.8224C10.1624 21.5856 10.6004 21.1313 10.8287 20.5596C11 20.1308 11 19.5872 11 18.5C11 17.4128 11 16.8692 10.8287 16.4404C10.6004 15.8687 10.1624 15.4144 9.61104 15.1776C9.19755 15 8.67337 15 7.625 15H5.375C4.32663 15 3.80245 15 3.38896 15.1776C2.83765 15.4144 2.39963 15.8687 2.17127 16.4404C2 16.8692 2 17.4128 2 18.5Z"
                                                fill={`${currentMenu === "master" ? "white" : 'black'}`}
                                            />
                                        </svg>
                                        <span className={`ltr:pl-3 rtl:pr-3 ${currentMenu === 'master' ? 'text-white' : 'text-black'}`}>{t('Master')}</span>
                                    </div>
                                    <div className={currentMenu !== 'master' ? 'rtl:rotate-90 -rotate-90' : ''}>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M19 9L12 15L5 9" stroke={`${currentMenu === 'master' ? 'white' : 'black'}`} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                                        </svg>
                                    </div>
                                </button>
                                <AnimateHeight duration={300} height={currentMenu === 'master' ? 'auto' : 0}>
                                    <ul className={`sub-menu text-black bg-white`}>
                                        <li>
                                            <NavLink to="/accountGroup">
                                                Account Group
                                            </NavLink>
                                        </li>
                                        <li>
                                            <NavLink to="/accountType">
                                                Account Type
                                            </NavLink>
                                        </li>
                                        <li>
                                            <NavLink to="/coa">
                                                Chart Of Acount
                                            </NavLink>
                                        </li>
                                        <li>
                                            <NavLink to="/currency">
                                                Currency
                                            </NavLink>
                                        </li>
                                        <li>
                                            <NavLink to="/company">
                                                Company
                                            </NavLink>
                                        </li>
                                        <li>
                                            <NavLink to="/branch">
                                                Branch
                                            </NavLink>
                                        </li>
                                    </ul>
                                </AnimateHeight>
                            </li>

                            <li className={`menu nav-item ${currentMenu === 'buku-kas' ? 'bg-[#9C6ACD]' : ''} hover:bg-purple-300`}>
                                <button type="button" className={`nav-link group w-full`} onClick={() => toggleMenu('buku-kas')}>
                                    <div className="flex items-center">
                                        <svg className="group-hover:!text-primary shrink-0" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                opacity="0.5"
                                                d="M13 15.4C13 13.3258 13 12.2887 13.659 11.6444C14.318 11 15.3787 11 17.5 11C19.6213 11 20.682 11 21.341 11.6444C22 12.2887 22 13.3258 22 15.4V17.6C22 19.6742 22 20.7113 21.341 21.3556C20.682 22 19.6213 22 17.5 22C15.3787 22 14.318 22 13.659 21.3556C13 20.7113 13 19.6742 13 17.6V15.4Z"
                                                fill={`${currentMenu === "buku-kas" ? "white" : 'black'}`}
                                            />
                                            <path
                                                d="M2 8.6C2 10.6742 2 11.7113 2.65901 12.3556C3.31802 13 4.37868 13 6.5 13C8.62132 13 9.68198 13 10.341 12.3556C11 11.7113 11 10.6742 11 8.6V6.4C11 4.32582 11 3.28873 10.341 2.64437C9.68198 2 8.62132 2 6.5 2C4.37868 2 3.31802 2 2.65901 2.64437C2 3.28873 2 4.32582 2 6.4V8.6Z"
                                                fill={`${currentMenu === "buku-kas" ? "white" : 'black'}`}
                                            />
                                            <path
                                                d="M13 5.5C13 4.4128 13 3.8692 13.1713 3.44041C13.3996 2.86867 13.8376 2.41443 14.389 2.17761C14.8024 2 15.3266 2 16.375 2H18.625C19.6734 2 20.1976 2 20.611 2.17761C21.1624 2.41443 21.6004 2.86867 21.8287 3.44041C22 3.8692 22 4.4128 22 5.5C22 6.5872 22 7.1308 21.8287 7.55959C21.6004 8.13133 21.1624 8.58557 20.611 8.82239C20.1976 9 19.6734 9 18.625 9H16.375C15.3266 9 14.8024 9 14.389 8.82239C13.8376 8.58557 13.3996 8.13133 13.1713 7.55959C13 7.1308 13 6.5872 13 5.5Z"
                                                fill={`${currentMenu === "buku-kas" ? "white" : 'black'}`}
                                            />
                                            <path
                                                opacity="0.5"
                                                d="M2 18.5C2 19.5872 2 20.1308 2.17127 20.5596C2.39963 21.1313 2.83765 21.5856 3.38896 21.8224C3.80245 22 4.32663 22 5.375 22H7.625C8.67337 22 9.19755 22 9.61104 21.8224C10.1624 21.5856 10.6004 21.1313 10.8287 20.5596C11 20.1308 11 19.5872 11 18.5C11 17.4128 11 16.8692 10.8287 16.4404C10.6004 15.8687 10.1624 15.4144 9.61104 15.1776C9.19755 15 8.67337 15 7.625 15H5.375C4.32663 15 3.80245 15 3.38896 15.1776C2.83765 15.4144 2.39963 15.8687 2.17127 16.4404C2 16.8692 2 17.4128 2 18.5Z"
                                                fill={`${currentMenu === "buku-kas" ? "white" : 'black'}`}
                                            />
                                        </svg>
                                        <span className={`ltr:pl-3 rtl:pr-3 ${currentMenu === 'buku-kas' ? 'text-white' : 'text-black'}`}>{t('Buku Kas')}</span>
                                    </div>
                                    <div className={currentMenu !== 'buku-kas' ? 'rtl:rotate-90 -rotate-90' : ''}>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M19 9L12 15L5 9" stroke={`${currentMenu === 'buku-kas' ? 'white' : 'black'}`} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                                        </svg>
                                    </div>
                                </button>
                                <AnimateHeight duration={300} height={currentMenu === 'buku-kas' ? 'auto' : 0}>
                                    <ul className={`sub-menu text-black bg-white`}>
                                        <li>
                                            <NavLink to="/daftar-buku-kas">
                                                Daftar Buku Kas dan Bank
                                            </NavLink>
                                        </li>
                                        <li>
                                            <NavLink to="/daftar-transfer">
                                                Daftar Transfer
                                            </NavLink>
                                        </li>
                                    </ul>
                                </AnimateHeight>
                            </li>

                            <li className={`menu nav-item ${currentMenu === 'penerimaan' ? 'bg-[#9C6ACD]' : ''} hover:bg-purple-300`}>
                                <button type="button" className={`nav-link group w-full`} onClick={() => toggleMenu('penerimaan')}>
                                    <div className="flex items-center">
                                        <svg className="group-hover:!text-primary shrink-0" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                opacity="0.5"
                                                d="M13 15.4C13 13.3258 13 12.2887 13.659 11.6444C14.318 11 15.3787 11 17.5 11C19.6213 11 20.682 11 21.341 11.6444C22 12.2887 22 13.3258 22 15.4V17.6C22 19.6742 22 20.7113 21.341 21.3556C20.682 22 19.6213 22 17.5 22C15.3787 22 14.318 22 13.659 21.3556C13 20.7113 13 19.6742 13 17.6V15.4Z"
                                                fill={`${currentMenu === "penerimaan" ? "white" : 'black'}`}
                                            />
                                            <path
                                                d="M2 8.6C2 10.6742 2 11.7113 2.65901 12.3556C3.31802 13 4.37868 13 6.5 13C8.62132 13 9.68198 13 10.341 12.3556C11 11.7113 11 10.6742 11 8.6V6.4C11 4.32582 11 3.28873 10.341 2.64437C9.68198 2 8.62132 2 6.5 2C4.37868 2 3.31802 2 2.65901 2.64437C2 3.28873 2 4.32582 2 6.4V8.6Z"
                                                fill={`${currentMenu === "penerimaan" ? "white" : 'black'}`}
                                            />
                                            <path
                                                d="M13 5.5C13 4.4128 13 3.8692 13.1713 3.44041C13.3996 2.86867 13.8376 2.41443 14.389 2.17761C14.8024 2 15.3266 2 16.375 2H18.625C19.6734 2 20.1976 2 20.611 2.17761C21.1624 2.41443 21.6004 2.86867 21.8287 3.44041C22 3.8692 22 4.4128 22 5.5C22 6.5872 22 7.1308 21.8287 7.55959C21.6004 8.13133 21.1624 8.58557 20.611 8.82239C20.1976 9 19.6734 9 18.625 9H16.375C15.3266 9 14.8024 9 14.389 8.82239C13.8376 8.58557 13.3996 8.13133 13.1713 7.55959C13 7.1308 13 6.5872 13 5.5Z"
                                                fill={`${currentMenu === "penerimaan" ? "white" : 'black'}`}
                                            />
                                            <path
                                                opacity="0.5"
                                                d="M2 18.5C2 19.5872 2 20.1308 2.17127 20.5596C2.39963 21.1313 2.83765 21.5856 3.38896 21.8224C3.80245 22 4.32663 22 5.375 22H7.625C8.67337 22 9.19755 22 9.61104 21.8224C10.1624 21.5856 10.6004 21.1313 10.8287 20.5596C11 20.1308 11 19.5872 11 18.5C11 17.4128 11 16.8692 10.8287 16.4404C10.6004 15.8687 10.1624 15.4144 9.61104 15.1776C9.19755 15 8.67337 15 7.625 15H5.375C4.32663 15 3.80245 15 3.38896 15.1776C2.83765 15.4144 2.39963 15.8687 2.17127 16.4404C2 16.8692 2 17.4128 2 18.5Z"
                                                fill={`${currentMenu === "penerimaan" ? "white" : 'black'}`}
                                            />
                                        </svg>
                                        <span className={`ltr:pl-3 rtl:pr-3 ${currentMenu === 'penerimaan' ? 'text-white' : 'text-black'}`}>{t('Penerimaan')}</span>
                                    </div>
                                    <div className={currentMenu !== 'penerimaan' ? 'rtl:rotate-90 -rotate-90' : ''}>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M19 9L12 15L5 9" stroke={`${currentMenu === 'penerimaan' ? 'white' : 'black'}`} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                                        </svg>
                                    </div>
                                </button>
                                <AnimateHeight duration={300} height={currentMenu === 'penerimaan' ? 'auto' : 0}>
                                    <ul className={`sub-menu text-black bg-white`}>
                                        <li>
                                            <NavLink to="/daftar-penerimaan">
                                                Daftar Penerimaan
                                            </NavLink>
                                        </li>
                                    </ul>
                                </AnimateHeight>
                            </li>

                            <li className={`menu nav-item ${currentMenu === 'pengeluaran' ? 'bg-[#9C6ACD]' : ''} hover:bg-purple-300`}>
                                <button type="button" className={`nav-link group w-full`} onClick={() => toggleMenu('pengeluaran')}>
                                    <div className="flex items-center">
                                        <svg className="group-hover:!text-primary shrink-0" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                opacity="0.5"
                                                d="M13 15.4C13 13.3258 13 12.2887 13.659 11.6444C14.318 11 15.3787 11 17.5 11C19.6213 11 20.682 11 21.341 11.6444C22 12.2887 22 13.3258 22 15.4V17.6C22 19.6742 22 20.7113 21.341 21.3556C20.682 22 19.6213 22 17.5 22C15.3787 22 14.318 22 13.659 21.3556C13 20.7113 13 19.6742 13 17.6V15.4Z"
                                                fill={`${currentMenu === "pengeluaran" ? "white" : 'black'}`}
                                            />
                                            <path
                                                d="M2 8.6C2 10.6742 2 11.7113 2.65901 12.3556C3.31802 13 4.37868 13 6.5 13C8.62132 13 9.68198 13 10.341 12.3556C11 11.7113 11 10.6742 11 8.6V6.4C11 4.32582 11 3.28873 10.341 2.64437C9.68198 2 8.62132 2 6.5 2C4.37868 2 3.31802 2 2.65901 2.64437C2 3.28873 2 4.32582 2 6.4V8.6Z"
                                                fill={`${currentMenu === "pengeluaran" ? "white" : 'black'}`}
                                            />
                                            <path
                                                d="M13 5.5C13 4.4128 13 3.8692 13.1713 3.44041C13.3996 2.86867 13.8376 2.41443 14.389 2.17761C14.8024 2 15.3266 2 16.375 2H18.625C19.6734 2 20.1976 2 20.611 2.17761C21.1624 2.41443 21.6004 2.86867 21.8287 3.44041C22 3.8692 22 4.4128 22 5.5C22 6.5872 22 7.1308 21.8287 7.55959C21.6004 8.13133 21.1624 8.58557 20.611 8.82239C20.1976 9 19.6734 9 18.625 9H16.375C15.3266 9 14.8024 9 14.389 8.82239C13.8376 8.58557 13.3996 8.13133 13.1713 7.55959C13 7.1308 13 6.5872 13 5.5Z"
                                                fill={`${currentMenu === "pengeluaran" ? "white" : 'black'}`}
                                            />
                                            <path
                                                opacity="0.5"
                                                d="M2 18.5C2 19.5872 2 20.1308 2.17127 20.5596C2.39963 21.1313 2.83765 21.5856 3.38896 21.8224C3.80245 22 4.32663 22 5.375 22H7.625C8.67337 22 9.19755 22 9.61104 21.8224C10.1624 21.5856 10.6004 21.1313 10.8287 20.5596C11 20.1308 11 19.5872 11 18.5C11 17.4128 11 16.8692 10.8287 16.4404C10.6004 15.8687 10.1624 15.4144 9.61104 15.1776C9.19755 15 8.67337 15 7.625 15H5.375C4.32663 15 3.80245 15 3.38896 15.1776C2.83765 15.4144 2.39963 15.8687 2.17127 16.4404C2 16.8692 2 17.4128 2 18.5Z"
                                                fill={`${currentMenu === "pengeluaran" ? "white" : 'black'}`}
                                            />
                                        </svg>
                                        <span className={`ltr:pl-3 rtl:pr-3 ${currentMenu === 'pengeluaran' ? 'text-white' : 'text-black'}`}>{t('Pengeluaran')}</span>
                                    </div>
                                    <div className={currentMenu !== 'pengeluaran' ? 'rtl:rotate-90 -rotate-90' : ''}>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M19 9L12 15L5 9" stroke={`${currentMenu === 'pengeluaran' ? 'white' : 'black'}`} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                                        </svg>
                                    </div>
                                </button>
                                <AnimateHeight duration={300} height={currentMenu === 'pengeluaran' ? 'auto' : 0}>
                                    <ul className={`sub-menu text-black bg-white`}>
                                        <li>
                                            <NavLink to="/daftar-pengeluaran">
                                                Daftar Pengeluaran
                                            </NavLink>
                                        </li>
                                        <li>
                                            <NavLink to="/daftar-biaya">
                                                Daftar Biaya
                                            </NavLink>
                                        </li>
                                        <li>
                                            <NavLink to="/daftar-biaya-rutin">
                                                Daftar Biaya Rutin
                                            </NavLink>
                                        </li>
                                    </ul>
                                </AnimateHeight>
                            </li>

                            <li className={`menu nav-item ${currentMenu === 'receivable' ? 'bg-[#9C6ACD]' : ''} hover:bg-purple-300`}>
                                <button type="button" className={`nav-link group w-full`} onClick={() => toggleMenu('receivable')}>
                                    <div className="flex items-center">
                                        <svg className="group-hover:!text-primary shrink-0" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                opacity="0.5"
                                                d="M13 15.4C13 13.3258 13 12.2887 13.659 11.6444C14.318 11 15.3787 11 17.5 11C19.6213 11 20.682 11 21.341 11.6444C22 12.2887 22 13.3258 22 15.4V17.6C22 19.6742 22 20.7113 21.341 21.3556C20.682 22 19.6213 22 17.5 22C15.3787 22 14.318 22 13.659 21.3556C13 20.7113 13 19.6742 13 17.6V15.4Z"
                                                fill={`${currentMenu === "receivable" ? "white" : 'black'}`}
                                            />
                                            <path
                                                d="M2 8.6C2 10.6742 2 11.7113 2.65901 12.3556C3.31802 13 4.37868 13 6.5 13C8.62132 13 9.68198 13 10.341 12.3556C11 11.7113 11 10.6742 11 8.6V6.4C11 4.32582 11 3.28873 10.341 2.64437C9.68198 2 8.62132 2 6.5 2C4.37868 2 3.31802 2 2.65901 2.64437C2 3.28873 2 4.32582 2 6.4V8.6Z"
                                                fill={`${currentMenu === "receivable" ? "white" : 'black'}`}
                                            />
                                            <path
                                                d="M13 5.5C13 4.4128 13 3.8692 13.1713 3.44041C13.3996 2.86867 13.8376 2.41443 14.389 2.17761C14.8024 2 15.3266 2 16.375 2H18.625C19.6734 2 20.1976 2 20.611 2.17761C21.1624 2.41443 21.6004 2.86867 21.8287 3.44041C22 3.8692 22 4.4128 22 5.5C22 6.5872 22 7.1308 21.8287 7.55959C21.6004 8.13133 21.1624 8.58557 20.611 8.82239C20.1976 9 19.6734 9 18.625 9H16.375C15.3266 9 14.8024 9 14.389 8.82239C13.8376 8.58557 13.3996 8.13133 13.1713 7.55959C13 7.1308 13 6.5872 13 5.5Z"
                                                fill={`${currentMenu === "receivable" ? "white" : 'black'}`}
                                            />
                                            <path
                                                opacity="0.5"
                                                d="M2 18.5C2 19.5872 2 20.1308 2.17127 20.5596C2.39963 21.1313 2.83765 21.5856 3.38896 21.8224C3.80245 22 4.32663 22 5.375 22H7.625C8.67337 22 9.19755 22 9.61104 21.8224C10.1624 21.5856 10.6004 21.1313 10.8287 20.5596C11 20.1308 11 19.5872 11 18.5C11 17.4128 11 16.8692 10.8287 16.4404C10.6004 15.8687 10.1624 15.4144 9.61104 15.1776C9.19755 15 8.67337 15 7.625 15H5.375C4.32663 15 3.80245 15 3.38896 15.1776C2.83765 15.4144 2.39963 15.8687 2.17127 16.4404C2 16.8692 2 17.4128 2 18.5Z"
                                                fill={`${currentMenu === "receivable" ? "white" : 'black'}`}
                                            />
                                        </svg>
                                        <span className={`ltr:pl-3 rtl:pr-3 ${currentMenu === 'receivable' ? 'text-white' : 'text-black'}`}>{t('Receivable')}</span>
                                    </div>
                                    <div className={currentMenu !== 'receivable' ? 'rtl:rotate-90 -rotate-90' : ''}>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M19 9L12 15L5 9" stroke={`${currentMenu === 'receivable' ? 'white' : 'black'}`} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                                        </svg>
                                    </div>
                                </button>
                                <AnimateHeight duration={300} height={currentMenu === 'receivable' ? 'auto' : 0}>
                                    <ul className={`sub-menu text-black bg-white`}>
                                        <li>
                                            <NavLink to="/aging-schedule">
                                                Aging Schedule
                                            </NavLink>
                                        </li>
                                        <li>
                                            <NavLink to="/payment-period">
                                                Payment Period
                                            </NavLink>
                                        </li>
                                    </ul>
                                </AnimateHeight>
                            </li>
                            <li className={`menu nav-item ${currentMenu === 'bank' ? 'bg-[#9C6ACD]' : ''} hover:bg-purple-300`}>
                                <button type="button" className={`nav-link group w-full`} onClick={() => toggleMenu('bank')}>
                                    <div className="flex items-center">
                                        <svg className="group-hover:!text-primary shrink-0" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                opacity="0.5"
                                                d="M13 15.4C13 13.3258 13 12.2887 13.659 11.6444C14.318 11 15.3787 11 17.5 11C19.6213 11 20.682 11 21.341 11.6444C22 12.2887 22 13.3258 22 15.4V17.6C22 19.6742 22 20.7113 21.341 21.3556C20.682 22 19.6213 22 17.5 22C15.3787 22 14.318 22 13.659 21.3556C13 20.7113 13 19.6742 13 17.6V15.4Z"
                                                fill={`${currentMenu === "bank" ? "white" : 'black'}`}
                                            />
                                            <path
                                                d="M2 8.6C2 10.6742 2 11.7113 2.65901 12.3556C3.31802 13 4.37868 13 6.5 13C8.62132 13 9.68198 13 10.341 12.3556C11 11.7113 11 10.6742 11 8.6V6.4C11 4.32582 11 3.28873 10.341 2.64437C9.68198 2 8.62132 2 6.5 2C4.37868 2 3.31802 2 2.65901 2.64437C2 3.28873 2 4.32582 2 6.4V8.6Z"
                                                fill={`${currentMenu === "bank" ? "white" : 'black'}`}
                                            />
                                            <path
                                                d="M13 5.5C13 4.4128 13 3.8692 13.1713 3.44041C13.3996 2.86867 13.8376 2.41443 14.389 2.17761C14.8024 2 15.3266 2 16.375 2H18.625C19.6734 2 20.1976 2 20.611 2.17761C21.1624 2.41443 21.6004 2.86867 21.8287 3.44041C22 3.8692 22 4.4128 22 5.5C22 6.5872 22 7.1308 21.8287 7.55959C21.6004 8.13133 21.1624 8.58557 20.611 8.82239C20.1976 9 19.6734 9 18.625 9H16.375C15.3266 9 14.8024 9 14.389 8.82239C13.8376 8.58557 13.3996 8.13133 13.1713 7.55959C13 7.1308 13 6.5872 13 5.5Z"
                                                fill={`${currentMenu === "bank" ? "white" : 'black'}`}
                                            />
                                            <path
                                                opacity="0.5"
                                                d="M2 18.5C2 19.5872 2 20.1308 2.17127 20.5596C2.39963 21.1313 2.83765 21.5856 3.38896 21.8224C3.80245 22 4.32663 22 5.375 22H7.625C8.67337 22 9.19755 22 9.61104 21.8224C10.1624 21.5856 10.6004 21.1313 10.8287 20.5596C11 20.1308 11 19.5872 11 18.5C11 17.4128 11 16.8692 10.8287 16.4404C10.6004 15.8687 10.1624 15.4144 9.61104 15.1776C9.19755 15 8.67337 15 7.625 15H5.375C4.32663 15 3.80245 15 3.38896 15.1776C2.83765 15.4144 2.39963 15.8687 2.17127 16.4404C2 16.8692 2 17.4128 2 18.5Z"
                                                fill={`${currentMenu === "bank" ? "white" : 'black'}`}
                                            />
                                        </svg>
                                        <span className={`ltr:pl-3 rtl:pr-3 ${currentMenu === 'bank' ? 'text-white' : 'text-black'}`}>{t('Bank')}</span>
                                    </div>
                                    <div className={currentMenu !== 'bank' ? 'rtl:rotate-90 -rotate-90' : ''}>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M19 9L12 15L5 9" stroke={`${currentMenu === 'receivable' ? 'white' : 'black'}`} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                                        </svg>
                                    </div>
                                </button>
                                <AnimateHeight duration={300} height={currentMenu === 'bank' ? 'auto' : 0}>
                                    <ul className={`sub-menu text-black bg-white`}>
                                        <li>
                                            <NavLink to="/bookBank">
                                                Book Bank
                                            </NavLink>
                                        </li>
                                        <li>
                                            <NavLink to="/deposit">
                                                Deposit
                                            </NavLink>
                                        </li>
                                        <li>
                                            <NavLink to="/payment">
                                                Payment
                                            </NavLink>
                                        </li>
                                        <li>
                                            <NavLink to="/reconcile">
                                                Reconcile
                                            </NavLink>
                                        </li>
                                    </ul>
                                </AnimateHeight>
                            </li>
                            <li className={`menu nav-item ${currentMenu === 'general-ledger' ? 'bg-[#9C6ACD]' : ''} hover:bg-purple-300`}>
                                <button type="button" className={`nav-link group w-full`} onClick={() => toggleMenu('general-ledger')}>
                                    <div className="flex items-center">
                                        <svg className="group-hover:!text-primary shrink-0" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                opacity="0.5"
                                                d="M13 15.4C13 13.3258 13 12.2887 13.659 11.6444C14.318 11 15.3787 11 17.5 11C19.6213 11 20.682 11 21.341 11.6444C22 12.2887 22 13.3258 22 15.4V17.6C22 19.6742 22 20.7113 21.341 21.3556C20.682 22 19.6213 22 17.5 22C15.3787 22 14.318 22 13.659 21.3556C13 20.7113 13 19.6742 13 17.6V15.4Z"
                                                fill={`${currentMenu === "general-ledger" ? "white" : 'black'}`}
                                            />
                                            <path
                                                d="M2 8.6C2 10.6742 2 11.7113 2.65901 12.3556C3.31802 13 4.37868 13 6.5 13C8.62132 13 9.68198 13 10.341 12.3556C11 11.7113 11 10.6742 11 8.6V6.4C11 4.32582 11 3.28873 10.341 2.64437C9.68198 2 8.62132 2 6.5 2C4.37868 2 3.31802 2 2.65901 2.64437C2 3.28873 2 4.32582 2 6.4V8.6Z"
                                                fill={`${currentMenu === "general-ledger" ? "white" : 'black'}`}
                                            />
                                            <path
                                                d="M13 5.5C13 4.4128 13 3.8692 13.1713 3.44041C13.3996 2.86867 13.8376 2.41443 14.389 2.17761C14.8024 2 15.3266 2 16.375 2H18.625C19.6734 2 20.1976 2 20.611 2.17761C21.1624 2.41443 21.6004 2.86867 21.8287 3.44041C22 3.8692 22 4.4128 22 5.5C22 6.5872 22 7.1308 21.8287 7.55959C21.6004 8.13133 21.1624 8.58557 20.611 8.82239C20.1976 9 19.6734 9 18.625 9H16.375C15.3266 9 14.8024 9 14.389 8.82239C13.8376 8.58557 13.3996 8.13133 13.1713 7.55959C13 7.1308 13 6.5872 13 5.5Z"
                                                fill={`${currentMenu === "general-ledger" ? "white" : 'black'}`}
                                            />
                                            <path
                                                opacity="0.5"
                                                d="M2 18.5C2 19.5872 2 20.1308 2.17127 20.5596C2.39963 21.1313 2.83765 21.5856 3.38896 21.8224C3.80245 22 4.32663 22 5.375 22H7.625C8.67337 22 9.19755 22 9.61104 21.8224C10.1624 21.5856 10.6004 21.1313 10.8287 20.5596C11 20.1308 11 19.5872 11 18.5C11 17.4128 11 16.8692 10.8287 16.4404C10.6004 15.8687 10.1624 15.4144 9.61104 15.1776C9.19755 15 8.67337 15 7.625 15H5.375C4.32663 15 3.80245 15 3.38896 15.1776C2.83765 15.4144 2.39963 15.8687 2.17127 16.4404C2 16.8692 2 17.4128 2 18.5Z"
                                                fill={`${currentMenu === "general-ledger" ? "white" : 'black'}`}
                                            />
                                        </svg>
                                        <span className={`ltr:pl-3 rtl:pr-3 ${currentMenu === 'general-ledger' ? 'text-white' : 'text-black'}`}>{t('General Ledger')}</span>
                                    </div>
                                    <div className={currentMenu !== 'general-ledger' ? 'rtl:rotate-90 -rotate-90' : ''}>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M19 9L12 15L5 9" stroke={`${currentMenu === 'general-ledger' ? 'white' : 'black'}`} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                                        </svg>
                                    </div>
                                </button>
                                <AnimateHeight duration={300} height={currentMenu === 'general-ledger' ? 'auto' : 0}>
                                    <ul className={`sub-menu text-black bg-white`}>
                                        <li>
                                            <NavLink to="/general-ledger/history">
                                                History
                                            </NavLink>
                                        </li>
                                        <li>
                                            <NavLink to="/general-ledger/summary">
                                                Summary
                                            </NavLink>
                                        </li>
                                    </ul>
                                </AnimateHeight>
                            </li>

                            <li className={`menu nav-item ${currentMenu === 'journal' ? 'bg-[#9C6ACD]' : ''} hover:bg-purple-300`}>
                                <button type="button" className={`nav-link group w-full`} onClick={() => toggleMenu('journal')}>
                                    <div className="flex items-center">
                                        <svg className="group-hover:!text-primary shrink-0" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                opacity="0.5"
                                                d="M13 15.4C13 13.3258 13 12.2887 13.659 11.6444C14.318 11 15.3787 11 17.5 11C19.6213 11 20.682 11 21.341 11.6444C22 12.2887 22 13.3258 22 15.4V17.6C22 19.6742 22 20.7113 21.341 21.3556C20.682 22 19.6213 22 17.5 22C15.3787 22 14.318 22 13.659 21.3556C13 20.7113 13 19.6742 13 17.6V15.4Z"
                                                fill={`${currentMenu === "journal" ? "white" : 'black'}`}
                                            />
                                            <path
                                                d="M2 8.6C2 10.6742 2 11.7113 2.65901 12.3556C3.31802 13 4.37868 13 6.5 13C8.62132 13 9.68198 13 10.341 12.3556C11 11.7113 11 10.6742 11 8.6V6.4C11 4.32582 11 3.28873 10.341 2.64437C9.68198 2 8.62132 2 6.5 2C4.37868 2 3.31802 2 2.65901 2.64437C2 3.28873 2 4.32582 2 6.4V8.6Z"
                                                fill={`${currentMenu === "journal" ? "white" : 'black'}`}
                                            />
                                            <path
                                                d="M13 5.5C13 4.4128 13 3.8692 13.1713 3.44041C13.3996 2.86867 13.8376 2.41443 14.389 2.17761C14.8024 2 15.3266 2 16.375 2H18.625C19.6734 2 20.1976 2 20.611 2.17761C21.1624 2.41443 21.6004 2.86867 21.8287 3.44041C22 3.8692 22 4.4128 22 5.5C22 6.5872 22 7.1308 21.8287 7.55959C21.6004 8.13133 21.1624 8.58557 20.611 8.82239C20.1976 9 19.6734 9 18.625 9H16.375C15.3266 9 14.8024 9 14.389 8.82239C13.8376 8.58557 13.3996 8.13133 13.1713 7.55959C13 7.1308 13 6.5872 13 5.5Z"
                                                fill={`${currentMenu === "journal" ? "white" : 'black'}`}
                                            />
                                            <path
                                                opacity="0.5"
                                                d="M2 18.5C2 19.5872 2 20.1308 2.17127 20.5596C2.39963 21.1313 2.83765 21.5856 3.38896 21.8224C3.80245 22 4.32663 22 5.375 22H7.625C8.67337 22 9.19755 22 9.61104 21.8224C10.1624 21.5856 10.6004 21.1313 10.8287 20.5596C11 20.1308 11 19.5872 11 18.5C11 17.4128 11 16.8692 10.8287 16.4404C10.6004 15.8687 10.1624 15.4144 9.61104 15.1776C9.19755 15 8.67337 15 7.625 15H5.375C4.32663 15 3.80245 15 3.38896 15.1776C2.83765 15.4144 2.39963 15.8687 2.17127 16.4404C2 16.8692 2 17.4128 2 18.5Z"
                                                fill={`${currentMenu === "journal" ? "white" : 'black'}`}
                                            />
                                        </svg>
                                        <span className={`ltr:pl-3 rtl:pr-3 ${currentMenu === 'journal' ? 'text-white' : 'text-black'}`}>{t('Journal')}</span>
                                    </div>
                                    <div className={currentMenu !== 'journal' ? 'rtl:rotate-90 -rotate-90' : ''}>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M19 9L12 15L5 9" stroke={`${currentMenu === 'journal' ? 'white' : 'black'}`} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                                        </svg>
                                    </div>
                                </button>
                                <AnimateHeight duration={300} height={currentMenu === 'journal' ? 'auto' : 0}>
                                    <ul className={`sub-menu text-black bg-white`}>
                                        <li>
                                            <NavLink to="/journal/journal-report">
                                                Journal Report
                                            </NavLink>
                                        </li>
                                        <li>
                                            <NavLink to="/journal/trial-journal">
                                                Trial Journal
                                            </NavLink>
                                        </li>
                                    </ul>
                                </AnimateHeight>
                            </li>
                        </ul>
                    </PerfectScrollbar>
                </div>
            </nav>
        </div>
    );
};

export default Sidebar;
