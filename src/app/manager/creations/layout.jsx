export default function Layout({ children }) {
    return <>
        <div style={{
            backgroundColor: '#f6f6f6',
            minHeight: '100vh',
        }}>
            {children}
        </div>
    </>
}