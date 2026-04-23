import MainLayout from "@/components/layout/main-layout"

export default function ExpensesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <MainLayout>{children}</MainLayout>
}
