import NotesApp from "@/components/notes/NotesApp"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Notes - FamilyOS",
  description: "Organize your thoughts, tasks, and family information in one place.",
}

export default function NotesPage() {
  return <NotesApp />
}
