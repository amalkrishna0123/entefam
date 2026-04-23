import MainLayout from "@/components/layout/main-layout"

export default function MembersLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <MainLayout>{children}</MainLayout>
}
