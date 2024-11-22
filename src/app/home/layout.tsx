export default function HomeLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <header>Nvidia Yes</header>
            <main>{children}</main>
        </>
    );
}