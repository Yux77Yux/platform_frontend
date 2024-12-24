import './layout.scss'
import Options from './options'

const Layout = async ({ children }) => {
    return (
        <div className='reviewer-layout'>
            <Options />
            {children}
            
        </div>
    );
}

export default Layout;