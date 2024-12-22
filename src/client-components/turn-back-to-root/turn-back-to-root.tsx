'use client';

import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function TurnBackToRoot() {
    useEffect(() => {
        const cancel = setTimeout(() => redirect("/"), 3000);

        return () => clearTimeout(cancel)
    }, [])

    return ""
}