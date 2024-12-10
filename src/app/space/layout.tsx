import "./layout.scss"

export default function SpaceLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="space-layout">
            <header className="space-header"></header>
            <main>
                {children}
            </main>
            <footer></footer>
        </div>
    );
}
