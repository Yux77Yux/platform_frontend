import "./layout.scss"

export default async function SpaceLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="space-root-layout">
            <header className="space-root-header"></header>
            <main>
                {children}
            </main>
            <footer></footer>
        </div>
    );
}
