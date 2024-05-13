import { setBreadcrumbTitle,setTitle,setPageTitle } from '@/store/themeConfigSlice';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import 'grapesjs/dist/css/grapes.min.css';

const Index = () => {
    const dispatch = useDispatch()
    const [htmlContent, setHtmlContent] = useState<string>('');
    const user = useSelector((state: any) => state.auth?.user);

    useEffect(() => {
       dispatch(setPageTitle("Dashboard"))
       dispatch(setTitle("Dashboard"))
       dispatch(setBreadcrumbTitle([]))
    }, []);

    return (
        <div>
            <h1>hello {user?.displayName}</h1>
        </div>
    );
};

export default Index;
