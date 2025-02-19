import "./template.scss";

const Template = async ({ children }) => {
    return (
        <>
            <header style={{
                display: "block",
                position: 'relative',
                height: '56px',
                width: '100%',
                backgroundColor: 'rgb(44, 40, 40)'
            }}></header>
            <div className="creation-template">{children}</div>
        </>
    );
}

export default Template;