/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { createContext, Dispatch, useState, SetStateAction, PropsWithChildren, useContext } from 'react';

// 创建一个上下文，传递默认值
const SpaceContext = createContext<{ space: any; setSpace: Dispatch<SetStateAction<any>>; }>({
    space: null,
    setSpace: () => null,
});

// 创建一个提供者组件
export const SpaceProvider = ({
    space: initial,
    children,
}: PropsWithChildren<{ space: any }>) => {
    const [space, setSpace] = useState<any>(initial);


    return (
        <SpaceContext.Provider value={{ space, setSpace }}>
            {children}
        </SpaceContext.Provider>
    );
};

export const useSpace = () => useContext(SpaceContext)
