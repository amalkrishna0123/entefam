import MainLayout from "@/components/layout/main-layout"

export default function EventsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <MainLayout>{children}</MainLayout>
}
