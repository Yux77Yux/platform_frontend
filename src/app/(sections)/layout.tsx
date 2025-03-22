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
        <div className="category">
          <span className="section-header-span">科技</span>
          <span className="section-header-span">美食</span>
          <span className="section-header-span">知识</span>
          <span className="section-header-span">电影</span>
          <span className="section-header-span">动画</span>
          <span className="section-header-span">鬼畜</span>
          <span className="section-header-span">舞蹈</span>
          <span className="section-header-span">娱乐</span>
          <span className="section-header-span">没事</span>
          <span className="section-header-span">汽车</span>
          <span className="section-header-span">体育</span>
          <span className="section-header-span">纪录片</span>
          <span className="section-header-span">游戏</span>
          <span className="section-header-span">音乐</span>
          <span className="section-header-span">动物圈</span>
          <span className="section-header-span">MMD</span>
        </div>
      </header>
      <main>{children}</main>
      <footer></footer>
    </>
  );
}
