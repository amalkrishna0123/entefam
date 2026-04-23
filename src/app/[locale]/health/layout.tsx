import MainLayout from "@/components/layout/main-layout"

export default function HealthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <MainLayout>{children}</MainLayout>
}
