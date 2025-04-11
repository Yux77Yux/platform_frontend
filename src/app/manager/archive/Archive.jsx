'use client';
import Image from "next/image";
import { useCallback, useRef } from "react";
import {
    uploadArchive,
    saveArchive,
    chooseArchive,
} from "@/src/tool/archive"

const Archive = ({
    info,
    handleField,
    fileHandler,
    selected,
}) => {
    const archiveRef = useRef(null)
    const getValue = useCallback((key) => info[key], [info]);

    const uploadArchiveHandler = useCallback(() => {
        const archive = getValue(`${selected}Archive`)
        const order = getValue(selected)
        uploadArchive(order, archive)
    }, [getValue, selected])

    const chooseArchiveHandler = useCallback(async () => {
        const order = getValue(selected)
        const result = await chooseArchive(order)
        if (!result) return
        handleField((prev) => ({ ...prev, ["choose"]: getValue(selected) }))
    }, [getValue, selected, handleField])

    const saveArchiveHandler = useCallback(async () => {
        const order = getValue(selected)
        const result = await saveArchive(order)
        console.log(result)
    }, [getValue, selected])

    return (
        <div style={{ display: 'flex', position: 'relative', flexDirection: 'column', alignItems: 'center' }}>
            {getValue('choose') == getValue(selected)
                ? <div className="choosing">当前选择</div>
                : getValue(`${selected}Exist`) ? <div className="unchoose" onClick={chooseArchiveHandler}>选择</div>
                    : ""
            }
            <div className="archive">
                {(getValue(`${selected}Exist`) || getValue(selected) == 0)
                    && <>
                        <Image src={getValue(`${selected}Cover`) ? getValue(`${selected}Cover`) : "/img/default-cover.png"}
                            alt='' fill style={{ objectFit: 'cover' }}
                        />
                        <label style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            boxShadow: 'inset 0px 10px 10px -5px rgba(0, 0, 0, 0.3)', // 阴影从内部顶部向下
                            borderTop: '1px ',
                            position: 'absolute',
                            height: '40px',
                            width: '100%',
                            cursor: 'pointer',
                            top: 0,
                            color: 'rgb(255, 255, 255)',
                        }}>
                            更改封面
                            <input type="file" name="" id=""
                                onChange={e => fileHandler(selected, e)}
                                style={{ position: 'absolute', visibility: 'hidden', opacity: 0 }}
                            />
                        </label>

                        <div className="buttons">
                            {selected != "left" && <button type="button" className="archive-option"
                                onClick={() => archiveRef.current?.click()}
                            >
                                更换
                            </button>}
                            <button type="button" className="archive-option"
                                style={{
                                    visibility: getValue(`${selected}Able`)
                                        ? "visible" : "hidden",
                                }}
                                onClick={uploadArchiveHandler}
                            >
                                确认
                            </button>
                            <button type="button"
                                className="archive-option"
                                onClick={saveArchiveHandler}
                            >
                                下载
                            </button>
                        </div>
                    </>
                }
                <label ref={archiveRef}
                    style={{
                        zIndex: (selected != "left" && !getValue(`${selected}Exist`)) ? '1' : '-1',
                        position: 'relative',
                        height: '100%',
                        width: '100%',
                        border: '1px solid rgb(50, 51, 50)',
                        backgroundColor: 'rgb(61, 55, 55)',
                        backgroundImage: 'url(/plus.svg)',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: '50px',
                        cursor: 'pointer',
                    }}
                >
                    <input type="file"
                        onChange={e => handleField(
                            (prev) => ({
                                ...prev,
                                [`${selected}Archive`]: e.target.files[0],
                                [`${selected}Able`]: true,
                                [`${selected}Exist`]: true,
                            })
                        )}
                        style={{ position: 'absolute', visibility: 'hidden', opacity: 0 }}
                    />
                </label>
            </div>
        </div >
    );
}

export default Archive;