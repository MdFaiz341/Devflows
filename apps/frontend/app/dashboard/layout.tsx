import AuthProvider from "../../providers/AuthProvider";
// import { DashboardProvider } from "../../providers/DashboardProvider";
import { SocketProvider } from "../../providers/SocketProvider";


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <SocketProvider>
        {/* <DashboardProvider> */}
          {children}
        {/* </DashboardProvider> */}
      </SocketProvider>
    </AuthProvider>
  );
}