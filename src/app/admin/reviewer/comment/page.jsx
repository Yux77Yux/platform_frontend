'use client'

import { useCallback, useEffect, useState } from 'react';
import './page.scss'

const Page = () => {
    const [info, setInfo] = useState({
        status: 'pending'
    });

    const setValue = useCallback((key, value) => setInfo((prev) => ({ ...prev, [key]: value })), [setInfo]);
    const getValue = useCallback((key) => info[key], [info]);

    useEffect(() => { }, []);

    return (
        <div className='review-video'>

        </div>
    );
}

export default Page;