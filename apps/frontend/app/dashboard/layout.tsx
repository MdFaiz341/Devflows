import AuthProvider from "../../providers/AuthProvider";
import { SocketProvider } from "../../providers/SocketProvider";


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <SocketProvider>
          {children}
      </SocketProvider>
    </AuthProvider>
  );
}