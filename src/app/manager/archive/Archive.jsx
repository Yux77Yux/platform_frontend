'use client';
import Image from "next/image";
import { useCallback } from "react";

const Archive = ({
    info,
    handleField,
    fileHandler,
    selected,
}) => {
    const getValue = useCallback((key) => info[key], [info]);

    return (
        <div style={{ display: 'flex', position: 'relative', flexDirection: 'column', alignItems: 'center' }}>
            {getValue('choose') === selected
                ? <div className="choosing">当前选择</div>
                : getValue(selected)
                    ? <div className="unchoose" onClick={() => handleField("choose", selected)}>选择</div>
                    : ""
            }
            <div className="archive">
                {getValue(selected)
                    ? <>
                        <Image src={getValue(`${selected}Cover`) ? getValue(`${selected}Cover`) : "/img/default-cover.png"} alt='' fill style={{ objectFit: 'cover' }} />
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
                            <button type="button" className="archive-option"
                                onClick={() => { handleField(`${selected}Able`, true) }}
                            >
                                更名
                            </button>
                            <button type="button" className="archive-option"
                                style={{
                                    visibility: getValue(`${selected}Able`)
                                        ? "visible" : "hidden",
                                }}
                                onClick={() => handleField(`${selected}Able`, true)}
                            >
                                确认
                            </button>
                            <button type="button" className="archive-option"
                            >
                                删除
                            </button>
                            <button type="button" className="archive-option"
                            >
                                下载
                            </button>
                        </div>
                    </>
                    : <>
                        <label style={{
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
                        }}>
                            <input type="file" name="" id=""
                                onChange={e => handleField(selected, e.target.files[0])}
                                style={{ position: 'absolute', visibility: 'hidden', opacity: 0 }}
                            />
                        </label>
                    </>
                }
            </div>
            {getValue(`${selected}`) &&
                <>
                    <input className="archive-option" type="text"
                        disabled={!getValue(`${selected}Able`)}
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            color: "rgb(0, 0, 0)",
                            textAlign: 'center',
                            fontSize: '18px',
                        }}
                        maxLength="12"
                        value={getValue(`${selected}Name`)} onChange={e => handleField(`${selected}Name`, e.target.value)}
                    />
                </>}
        </div>
    );
}

export default Archive;