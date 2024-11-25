'use client';

import {
    KeyboardEventHandler,
    MouseEventHandler,
    useCallback,
    useRef,
} from 'react';
import './search-input-box.styles.scss';

interface SearchInputBoxProps {
    searchHandler?: MouseEventHandler<HTMLDivElement>,
    enterHandler?: KeyboardEventHandler<HTMLInputElement>,
}

const SearchInputBox = (props: SearchInputBoxProps) => {
    const {
        searchHandler,
        enterHandler,
    } = props;

    const inputRef = useRef<HTMLInputElement | null>(null);

    const handleClear = useCallback(() => {
        if (inputRef.current) {
            inputRef.current.value = '';  // 清空输入框内容
        }
    }, []);

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
                    onKeyDown={enterHandler}
                    placeholder="请输入关键词"
                />
                <span className="cross-mark" onClick={handleClear}></span>
            </div>
            <span className="search-input-magnifying-glass" onClick={searchHandler}></span>
        </div>
    );
}

export default SearchInputBox;