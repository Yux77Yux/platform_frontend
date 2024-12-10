import Link from "next/link";
import Image from "next/image";
import "./template.scss"

export default async function SpaceTemplate({
    children,
}: {
    children: React.ReactNode;
}) {
    const result = await fetch('http://localhost:8080/api/space/user', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({})
    });
    
    return (
        <div className="space-template">
            <div className="space-top">
                <div className="avator-top">
                    <Link href="#">
                        <Image src="" />
                    </Link>
                </div>
                <div className="space-options">option</div>
            </div>
            <div>
                {children}
            </div>
        </div>
    );
}
