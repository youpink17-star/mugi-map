"use client";
import { useEffect, useState } from "react";
import WikiNotes from "./WikiNotes";
import {
  getOrCreateWiki,
  addNote,
  deleteNote,
  markNoteAsIdea,
  type BusinessWiki,
} from "@/lib/wikiStore";

// 아이디어(불편함) 노트 — 위키와 분리된 독립 페이지
export default function NotesView() {
  const [wiki, setWiki] = useState<BusinessWiki | null>(null);

  useEffect(() => {
    setWiki(getOrCreateWiki());
  }, []);

  if (!wiki) {
    return (
      <div className="flex flex-1 items-center justify-center py-24 text-[14px] text-muted">
        노트를 불러오는 중…
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-app px-4 py-5 md:max-w-2xl md:px-6 md:py-9 lg:max-w-3xl">
      <WikiNotes
        wiki={wiki}
        onAdd={(n) => setWiki((p) => (p ? addNote(p, n) : p))}
        onDelete={(id) => setWiki((p) => (p ? deleteNote(p, id) : p))}
        onMarkIdea={(id) => setWiki((p) => (p ? markNoteAsIdea(p, id) : p))}
      />
    </div>
  );
}
