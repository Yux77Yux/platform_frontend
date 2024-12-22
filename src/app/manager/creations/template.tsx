import "./template.scss";

interface Props {
    children: React.ReactNode
}

const CreationsTemplate = async ({ children }: Props) => {
    return (
        <>
            {children}
        </>
    );
}

export default CreationsTemplate;