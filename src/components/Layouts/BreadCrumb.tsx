import { useSelector } from "react-redux";
import IconHome from "../Icon/IconHome";
import { NavLink } from "react-router-dom";

const BreadCrumb = () => {
    const {breadcrumbTitle,Title} = useSelector((state: any) => state.themeConfig);
    return (
        <div className='w-full h-[100px] bg-[#9C6ACD] flex px-6 items-center justify-between'>
            <div>
                <h1 className="font-semibold text-2xl text-white">
                    {Title}
                </h1>
            </div>
            <div className={`${Title !== "Dashboard" ? "panel p-3" : ''}`}>
                {breadcrumbTitle.map((dt : string, index : number) => (
                    index !== breadcrumbTitle.length - 1 && dt !== "Master"  && dt !== "update" && dt !== "create"   ? (
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
                            <span className={`${dt == "Master" ? 'text-sky-400'  : 'text-gray-500'}`}>{dt}</span>
                            {
                               dt == "create"  || dt === "update" ||  dt == "Master" ? <span className="text-gray-500">{index !== breadcrumbTitle.length - 1 && " / "}</span> 
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
