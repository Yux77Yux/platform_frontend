import Link from "next/link";
import "./laytout.scss";

import AuthGuard from "@/src/client-components/auth-guard/auth-guard"

interface Props {
    children: React.ReactNode
}

const ManagerLayout = async ({ children }: Props) => {
    const links = [
        { tag: "投稿", href: "/manager" },
        { tag: "稿件管理", href: "/manager/creations" },
        { tag: "存档管理", href: "/manager/archive" },
        { tag: "申诉管理", href: "#" },
    ]
    return (
        <>
            <AuthGuard />
            <header className="manager-header"></header>
            <div className="manager-layout-fix">
                {links.map((link, index) => (
                    <Link key={index}
                        target="_blank"
                        href={link.href}
                        className="manager-option"
                    >
                        {link.tag}
                    </Link>
                ))}
            </div>
            <div className="manager-layout">
                {children}
            </div>
        </>
    );
}

export default ManagerLayout;