import "./template.scss";

interface Props {
    children: React.ReactNode
}

const Template = async ({ children }: Props) => {
    return (
        <>
            {children}
        </>
    );
}

export default Template;