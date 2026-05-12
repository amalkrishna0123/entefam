"use client"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { Note, NoteFormat, NotePriority, ListType, NoteListItem, useNotesStore } from "@/store/notes-store"
import { AlignLeft, List as ListIcon, X, ArrowRight } from "lucide-react"

interface NoteFormProps {
  initialData?: Note | null
  onClose: () => void
}

interface FormData {
  title: string
  content: string
  priority: NotePriority
  format: NoteFormat
  listType: ListType
}

export default function NoteForm({ initialData, onClose }: NoteFormProps) {
  const { addNote, updateNote } = useNotesStore()
  
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      title: initialData?.title || "",
      content: initialData?.content || "",
      priority: initialData?.priority || "Medium",
      format: initialData?.format || "paragraph",
      listType: initialData?.listType || "none"
    }
  })

  const currentFormat = watch("format")

  const [isSubmitting, setIsSubmitting] = useState(false)

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true)
    try {
      let listItems = initialData?.listItems;
      if (data.format === 'list') {
        const lines = data.content.split('\n').filter(l => l.trim() !== '');
        listItems = lines.map(line => {
          const priceMatch = line.match(/(.*?)\s*[₹$]?\s*(\d+(?:\.\d+)?)\s*$/);
          let text = line;
          let price: number | undefined = undefined;

          if (priceMatch && priceMatch[1].trim()) {
            text = priceMatch[1].trim();
            price = parseFloat(priceMatch[2]);
          }

          const existing = initialData?.listItems?.find(item => item.text === text);
          if (existing) return { ...existing, text, price: price ?? existing.price };
          
          return {
            id: crypto.randomUUID(),
            text,
            isPurchased: false, 
            price
          } as NoteListItem;
        });
      } else {
        listItems = undefined;
        data.listType = 'none';
      }

      if (initialData) {
        const res = await fetch(`/api/notes/${initialData.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...data, listItems })
        });
        if (res.ok) {
          updateNote(initialData.id, { ...data, listItems })
          onClose()
        }
      } else {
        const res = await fetch('/api/notes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...data, listItems })
        });
        if (res.ok) {
          const newNote = await res.json()
          addNote(newNote)
          onClose()
        }
      }
    } catch (e) {
      console.error("Failed to save note:", e)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="p-5 sm:p-8 w-full max-w-[600px] mx-auto relative" style={{ backgroundColor: '#ffffff', borderRadius: '16px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)', border: '1px solid #e5e5e5',padding:"10px" }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#111111', margin: '0' }}>{initialData ? 'Edit Note' : 'Create New Note'}</h2>
        <button onClick={onClose} style={{ padding: '8px', borderRadius: '50%', border: 'none', backgroundColor: '#f5f5f5', color: '#666666', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s', flexShrink: 0 }} onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#e0e0e0'; e.currentTarget.style.color = '#111111'; }} onMouseOut={(e) => { e.currentTarget.style.backgroundColor = '#f5f5f5'; e.currentTarget.style.color = '#666666'; }}>
          <X size={20} />
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label htmlFor="title" style={{ color: '#111111', fontWeight: '600', fontSize: '0.875rem' }}>Title <span style={{ color: '#000000' }}>*</span></label>
          <input 
            id="title" 
            placeholder="Enter note title..." 
            style={{ width: '100%', height: '44px', padding: '0 16px', borderRadius: '8px', border: '1px solid #d4d4d4', backgroundColor: '#ffffff', color: '#111111', fontSize: '0.875rem', outline: 'none', transition: 'border-color 0.2s' }}
            {...register("title", { 
              required: "Title is required", 
              maxLength: { value: 100, message: "Maximum 100 characters allowed" } 
            })}
            onFocus={(e) => {
              e.target.style.borderColor = '#000000';
            }}
            onBlur={(e) => {
              register("title").onBlur(e);
              e.target.style.borderColor = '#d4d4d4';
            }}
          />
          {errors.title && <span style={{ fontSize: '0.75rem', color: '#000000', fontWeight: '500' }}>{errors.title.message}</span>}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label htmlFor="priority" style={{ color: '#111111', fontWeight: '600', fontSize: '0.875rem' }}>Priority Level</label>
            <select 
              id="priority"
              {...register("priority")}
              style={{ width: '100%', height: '44px', padding: '0 16px', borderRadius: '8px', border: '1px solid #d4d4d4', backgroundColor: '#ffffff', color: '#111111', fontSize: '0.875rem', outline: 'none', cursor: 'pointer', transition: 'border-color 0.2s', appearance: 'none', backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23111111%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 16px top 50%', backgroundSize: '10px auto' }}
              onFocus={(e) => {
                e.target.style.borderColor = '#000000';
              }}
              onBlur={(e) => {
                register("priority").onBlur(e);
                e.target.style.borderColor = '#d4d4d4';
              }}
            >
              <option value="Low">Low Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="High">High Priority</option>
              <option value="Critical">Critical Priority</option>
            </select>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ color: '#111111', fontWeight: '600', fontSize: '0.875rem' }}>Format Type</label>
            <div style={{ display: 'flex', backgroundColor: '#f5f5f5', borderRadius: '8px', padding: '4px' }}>
              <button
                type="button"
                onClick={() => setValue("format", "paragraph")}
                style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px', padding: '8px 4px', fontSize: '0.875rem', fontWeight: '500', borderRadius: '6px', transition: 'all 0.2s', border: 'none', cursor: 'pointer', backgroundColor: currentFormat === 'paragraph' ? '#ffffff' : 'transparent', color: currentFormat === 'paragraph' ? '#111111' : '#666666', boxShadow: currentFormat === 'paragraph' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none', whiteSpace: 'nowrap' }}
              >
                <AlignLeft size={16} className="shrink-0" /> <span className="hidden xs:inline sm:inline">Paragraph</span><span className="inline xs:hidden sm:hidden">Text</span>
              </button>
              <button
                type="button"
                onClick={() => setValue("format", "list")}
                style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px', padding: '8px 4px', fontSize: '0.875rem', fontWeight: '500', borderRadius: '6px', transition: 'all 0.2s', border: 'none', cursor: 'pointer', backgroundColor: currentFormat === 'list' ? '#ffffff' : 'transparent', color: currentFormat === 'list' ? '#111111' : '#666666', boxShadow: currentFormat === 'list' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none', whiteSpace: 'nowrap' }}
              >
                <ListIcon size={16} className="shrink-0" /> <span>List</span>
              </button>
            </div>
          </div>
        </div>

        {currentFormat === 'list' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label htmlFor="listType" style={{ color: '#111111', fontWeight: '600', fontSize: '0.875rem' }}>List Type</label>
            <select 
              id="listType"
              {...register("listType")}
              style={{ width: '100%', height: '44px', padding: '0 16px', borderRadius: '8px', border: '1px solid #d4d4d4', backgroundColor: '#ffffff', color: '#111111', fontSize: '0.875rem', outline: 'none', cursor: 'pointer', transition: 'border-color 0.2s', appearance: 'none', backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23111111%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 16px top 50%', backgroundSize: '10px auto' }}
              onFocus={(e) => {
                e.target.style.borderColor = '#000000';
              }}
              onBlur={(e) => {
                register("listType").onBlur(e);
                e.target.style.borderColor = '#d4d4d4';
              }}
            >
              <option value="none">Standard List</option>
              <option value="reminder">Reminder List</option>
              <option value="shopping">Shopping/Purchase List</option>
            </select>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label htmlFor="content" style={{ color: '#111111', fontWeight: '600', fontSize: '0.875rem' }}>Content <span style={{ color: '#000000' }}>*</span></label>
          <textarea 
            id="content"
            placeholder={currentFormat === 'list' ? "Enter list items (one per line)..." : "Write your note here..."}
            {...register("content", { required: "Content is required" })}
            style={{ width: '100%', minHeight: '180px', padding: '16px', borderRadius: '8px', border: '1px solid #d4d4d4', backgroundColor: '#ffffff', color: '#111111', fontSize: '0.875rem', outline: 'none', resize: 'vertical', fontFamily: currentFormat === 'list' ? 'monospace' : 'inherit', transition: 'border-color 0.2s', lineHeight: '1.5' }}
            onFocus={(e) => {
              e.target.style.borderColor = '#000000';
            }}
            onBlur={(e) => {
              register("content").onBlur(e);
              e.target.style.borderColor = '#d4d4d4';
            }}
          />
          {errors.content && <span style={{ fontSize: '0.75rem', color: '#000000', fontWeight: '500' }}>{errors.content.message}</span>}
        </div>

        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-6 mt-2 border-t border-gray-100">
          <button type="button" style={{padding:"10px"}} onClick={onClose} className="w-full sm:w-auto px-5 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 text-sm font-semibold hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button type="submit" disabled={isSubmitting} style={{padding:"10px", opacity: isSubmitting ? 0.7 : 1}} className="w-full sm:w-auto px-6 py-2.5 rounded-lg border-none bg-black text-white text-sm font-semibold flex items-center justify-center gap-2 hover:bg-gray-800 transition-all hover:-translate-y-[1px] shadow-sm whitespace-nowrap">
            {isSubmitting ? 'Saving...' : (initialData ? 'Save Changes' : 'Create Note')} {!isSubmitting && <ArrowRight size={16} />}
          </button>
        </div>
      </form>
    </div>
  )
}
