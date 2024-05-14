import { useSelector } from "react-redux";
import IconHome from "../Icon/IconHome";

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
                    index !== breadcrumbTitle.length - 1 ? (
                        <span key={index} className="">
                            <span className="text-sky-400 dark:text-white-light">
                                {dt}
                            </span>
                            <span className="text-gray-500">{index !== breadcrumbTitle.length - 1 && " / "}</span>  
                        </span>
                    ) : (
                        <span className="text-gray-500">
                            {dt}
                        </span>
                    )
                    
                ))}
            </div>
        </div>
    )
};

export default BreadCrumb;
