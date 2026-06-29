import AppHeader from "@/components/AppHeader";
import BottomTabs from "@/components/BottomTabs";
import NotesView from "@/components/wiki/NotesView";

export default function NotesPage() {
  return (
    <>
      <AppHeader title="아이디어 노트" />
      <main className="flex-1">
        <NotesView />
      </main>
      <BottomTabs active="notes" />
    </>
  );
}
