'use client';

import {
    useCallback,
    useEffect,
    useRef,
    useState,
} from 'react';
import './search-input-box.styles.scss';
import { useRouter, useSearchParams } from 'next/navigation';

const SearchInputBox = () => {
    const router = useRouter()
    const inputRef = useRef(null);
    const [query, setQuery] = useState('')
    const search = useSearchParams()

    const handleClear = useCallback(() => {
        if (inputRef.current) {
            inputRef.current.value = '';  // 清空输入框内容
        }
    }, []);

    const changHandler = useCallback((e) => {
        setQuery(e.target.value)
    }, []);

    const searchHandler = useCallback(() => {
        router.push(`/search?query=${query}`)
    }, [router, query])

    const keyDownHandler = useCallback((event) => {
        if (event.key === 'Enter') {
            searchHandler(event); // 只有按下 Enter 键时才执行
        }
    }, [searchHandler])

    useEffect(() => {
        setQuery(search.get("query"))
    }, [search])

    return (
        <div className="search-box">
            <div className="type-in-box">
                <input
                    ref={inputRef}
                    type="text"
                    autoComplete='off'
                    autoCapitalize='off'
                    autoCorrect='off'
                    name="searched"
                    value={query}
                    onChange={changHandler}
                    onKeyDown={keyDownHandler}
                    placeholder="请输入关键词"
                />
                <span className="cross-mark" onClick={handleClear}></span>
            </div>
            <span className="search-input-magnifying-glass" onClick={searchHandler}></span>
        </div>
    );
}

export default SearchInputBox;