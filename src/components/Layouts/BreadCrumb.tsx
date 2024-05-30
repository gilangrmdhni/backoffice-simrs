import { useSelector } from "react-redux";
import IconHome from "../Icon/IconHome";
import { NavLink } from "react-router-dom";

const BreadCrumb = () => {
    const {breadcrumbTitle,Title} = useSelector((state: any) => state.themeConfig);
    const NotLink = [
        "Master",
        "Receivable",
        "General Ledger",
        "create",
        "update"
    ];
    const SkyText = [
        "Master",
        "Receivable",
        "General Ledger"
    ]
    return (
        <div className='w-full h-[100px] bg-[#9C6ACD] flex px-6 items-center justify-between'>
            <div>
                <h1 className="font-semibold text-2xl text-white">
                    {Title}
                </h1>
            </div>
            <div className={`${Title !== "Dashboard" ? "panel p-3" : ''}`}>
                {breadcrumbTitle.map((dt : string, index : number) => (
                    index !== breadcrumbTitle.length - 1 && !NotLink.includes(dt) ? (
                        <span key={index} className="">                   
                            <NavLink to={`/${dt == 'Dashboard' ? '' : dt.replace(/\s+/g, '')}`}>
                                <span className="text-sky-400 dark:text-white-light hover:underline">
                                    {dt}
                                </span>
                            </NavLink>
                            <span className="text-gray-500">{index !== breadcrumbTitle.length - 1 && " / "}</span>  
                        </span>
                    ) : (
                        <span className="">
                            <span className={`${ SkyText.includes(dt) ? 'text-sky-400'  : 'text-gray-500'}`}>{dt}</span>
                            {
                               NotLink.includes(dt) ? <span className="text-gray-500">{index !== breadcrumbTitle.length - 1 && " / "}</span> 
                               : <span></span>  
                            }
                            
                        </span>
                        
                    )
                    
                ))}
            </div>
        </div>
    )
};

export default BreadCrumb;
