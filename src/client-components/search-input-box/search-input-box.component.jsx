'use client';

import {
    useCallback,
    useRef,
    useState,
} from 'react';
import './search-input-box.styles.scss';

const SearchInputBox = () => {
    const inputRef = useRef(null);
    const [query, setQuery] = useState('')

    const handleClear = useCallback(() => {
        if (inputRef.current) {
            inputRef.current.value = '';  // 清空输入框内容
        }
    }, []);

    const changHandler = useCallback((e) => {
        setQuery(e.target.value)
    }, []);

    const searchHandler = useCallback(() => {
        window.open(`/search?query=${query}`, "_blank")
    }, [query])

    const keyDownHandler = useCallback((event) => {
        if (event.key === 'Enter') {
            searchHandler(event); // 只有按下 Enter 键时才执行
        }
    }, [searchHandler])

    return (
        <div className="search-input-box">
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