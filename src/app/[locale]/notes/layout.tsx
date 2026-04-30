import MainLayout from "@/components/layout/main-layout"

export default function NotesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <MainLayout>{children}</MainLayout>
}
