import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import 'grapesjs/dist/css/grapes.min.css';

const Index = () => {
    const [htmlContent, setHtmlContent] = useState<string>('');
    const user = useSelector((state: any) => state.auth?.user);

    useEffect(() => {
       
    }, []);

    return (
        <div>
            <h1>hello {user?.displayName}</h1>
        </div>
    );
};

export default Index;
