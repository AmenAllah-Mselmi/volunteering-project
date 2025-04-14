import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Toaster } from "@/components/ui/toaster"
import { PrivateRoute } from "@/components/private-route"
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <PrivateRoute>
    <SidebarProvider>
      <AppSidebar />
      <main>
        <SidebarTrigger />
        {children}
      </main>
      <Toaster />
    </SidebarProvider>
    </PrivateRoute>
  )
}
