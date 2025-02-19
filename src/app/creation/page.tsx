import TurnBackToRoot from "@/src/client-components/turn-back-to-root/turn-back-to-root"

export default async function SpaceDefaultPage() {
    return (
        <div style={{
            height: '100vh',
            width: '100vw',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: '40px',
            fontWeight: '1000',
            letterSpacing: '5px',
        }}>
            404 Not found
            重定向回主页
            <TurnBackToRoot />
        </div>
    );
}