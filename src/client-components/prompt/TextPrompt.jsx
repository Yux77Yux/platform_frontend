import Prompt from "./prompt"

const TextPrompt = ({ text, setOpen }) => {
    return <>
        <Prompt setOpen={setOpen}>
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'rgb(73, 73, 73)',
                padding: ' 6px 24px',
                letterSpacing: '2px',
                color: '#fff',
                borderRadius: '8px',
                fontSize: '18px',

            }}>{text}发布成功!</div>
        </Prompt>
    </>
}

export default TextPrompt;