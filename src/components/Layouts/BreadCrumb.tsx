import { useSelector } from "react-redux";

const BreadCrumb = () => {
    const {breadcrumbTitle,Title} = useSelector((state: any) => state.themeConfig);
    return (
        <div className='w-full h-[100px] bg-[#9C6ACD] flex px-6 items-center justify-between'>
            <div>
                <span>
                    {Title}
                </span>
            </div>
            <div>
                {breadcrumbTitle.map((dt : string, index : number) => (
                    index !== breadcrumbTitle.length - 1 ? (
                        <span key={index} className="">
                            <span className="text-sky-400 dark:text-white-light">
                                {dt} 
                            </span>
                            <span className="text-gray-300">{index !== breadcrumbTitle.length - 1 && " / "}</span>  
                        </span>
                    ) : (
                        <span className="text-white">
                            {dt}
                        </span>
                    )
                    
                ))}
            </div>
        </div>
    )
};

export default BreadCrumb;
