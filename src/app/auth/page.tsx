
import Auth from "@/src/client-components/auth/auth.compoennt";
import "./styles.scss";



const AuthPage = () => {
    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '400px',
            width: '600px',
            backgroundColor: '#fff',
            borderRadius: '16px'
        }}>
            <Auth />
        </div>
    );
}

export default AuthPage;