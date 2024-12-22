import "./template.scss";

interface PropsType {
    children: React.ReactNode
}

const Template = async ({ children }: PropsType) => {
    return (
        <div className="setting-template">
            {children}
        </div>
    );
}

export default Template;