import { create } from 'zustand';

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
  setNotes: (notes: Note[]) => void;
  addNote: (note: Note) => void;
  updateNote: (id: string, updatedFields: Partial<Note>) => void;
  deleteNote: (id: string) => void;
}

export const useNotesStore = create<NotesState>((set) => ({
  notes: [],
  setNotes: (notes) => set({ notes }),
  addNote: (note) => set((state) => ({ notes: [note, ...state.notes] })),
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
}));
