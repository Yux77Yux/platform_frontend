import SectionsHeader from "@/src/server-components/sections-header/sections-header.component";
import "./layout.scss"

export default function SectionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <header>
        <SectionsHeader />
        <div style={{
          display: 'flex',
          height: '50px',
          width: '100%',
          flexDirection: 'row',
          justifyContent: 'space-evenly',
          backgroundColor: 'rgb(226, 208, 208)',
          alignItems: 'center',
        }}>
          <span className="section-header-span">科技</span>
          <span className="section-header-span">美食</span>
          <span className="section-header-span">知识</span>
          <span className="section-header-span">电影片段</span>
          <span className="section-header-span">动画片段</span>
        </div>
      </header>
      <main>{children}</main>
      <footer></footer>
    </>
  );
}
