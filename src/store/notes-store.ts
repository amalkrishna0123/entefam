import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type NotePriority = 'Low' | 'Medium' | 'High' | 'Critical';
export type NoteFormat = 'list' | 'paragraph';
export type ListType = 'none' | 'reminder' | 'shopping';

export interface NoteListItem {
  id: string;
  text: string;
  isPurchased: boolean;
  price?: number;
  reason?: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  format: NoteFormat;
  listType?: ListType;
  listItems?: NoteListItem[];
  expenseAdded?: boolean;
  priority: NotePriority;
  createdAt: string;
  updatedAt: string;
}

interface NotesState {
  notes: Note[];
  addNote: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateNote: (id: string, updatedFields: Partial<Note>) => void;
  deleteNote: (id: string) => void;
}

export const useNotesStore = create<NotesState>()(
  persist(
    (set) => ({
      notes: [],
      addNote: (note) => set((state) => {
        const newNote: Note = {
          ...note,
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        return { notes: [newNote, ...state.notes] };
      }),
      updateNote: (id, updatedFields) => set((state) => ({
        notes: state.notes.map((note) =>
          note.id === id
            ? { ...note, ...updatedFields, updatedAt: new Date().toISOString() }
            : note
        ),
      })),
      deleteNote: (id) => set((state) => ({
        notes: state.notes.filter((note) => note.id !== id),
      })),
    }),
    {
      name: 'familyos-notes-storage', // unique name
      storage: createJSONStorage(() => localStorage),
    }
  )
);
