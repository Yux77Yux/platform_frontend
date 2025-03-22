import "./layout.scss"

const Layout = ({children})=>{
    return (
        <div className="search-root-layout">
            <header className="search-root-header">
                <div className="shader"></div>
            </header>
            <main>
                {children}
            </main>
            <footer></footer>
        </div>
    );
}

export default Layout;