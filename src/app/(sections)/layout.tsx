import SectionsHeader from "@/src/server-components/sections-header/sections-header.component"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <header><SectionsHeader /></header>
      <main>{children}</main>
      <footer></footer>
    </>
  );
}
