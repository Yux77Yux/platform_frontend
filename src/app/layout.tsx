import type { Metadata } from "next";
import "@/public/globals.css";
import NavContainer from "../server-components/nav-container/nav-container.component";

export const metadata: Metadata = {
  title: "Platform",
  description: "Generated by create next app",
};

export default async function RootLayout(props: {
  auth: React.ReactNode,
  children: React.ReactNode,
}) {
  return (
    <html>
      <body>
        <div style={{
          position: 'absolute',
          top: 0,
          width: '100%',
          zIndex: 100,
        }}>
          <NavContainer />
        </div>
        {props.children}

        <div id="modal-root" style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'absolute',
          backgroundColor: 'rgba(12,12,12,0.3)',
          top: 0,
          left: 0,
        }}>{props.auth}</div>
      </body>
    </html>
  );
}
