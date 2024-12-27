
import Link from "next/link";
import './layout.scss'

export const metadata = {
    title: "Platform Admin",
    description: "Generated by create next app",
};

const Layout = async ({ children,detail }) => {
    const links = [
        { tag: "审核信息", href: "/admin" },
        { tag: "公告管理", href: "/admin/announcement" },
        { tag: "审核员管理", href: "/admin/manager" },
    ]

    return (
        <>
            <header style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                position: 'relative',
                height: '56px',
                zIndex: '101',
                width: '100vw',
                backgroundColor: 'black',
                color: 'white',
                fontSize: '20px',
            }}>
                管理界面
            </header>
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                position: 'fixed',
                backgroundColor: 'rgba(12,12,12,0.3)',
                top: 0,
                left: 0,
                zIndex: '100',
            }}>
                {detail}
            </div>
            <main>
                <div className="admin-layout-fix">
                    {links.map((link, index) => (
                        <Link key={index}
                            target="_blank"
                            href={link.href}
                            className="admin-option"
                        >
                            {link.tag}
                        </Link>
                    ))}
                </div>
                <div className="admin-layout">
                    {children}
                </div>
            </main>
        </>
    );
}

export default Layout;