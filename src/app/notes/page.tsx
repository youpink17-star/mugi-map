import AppHeader from "@/components/AppHeader";
import BottomTabs from "@/components/BottomTabs";
import NotesView from "@/components/wiki/NotesView";

export default function NotesPage() {
  return (
    <>
      <AppHeader />
      <main className="flex-1">
        <NotesView />
      </main>
      <BottomTabs active="notes" />
    </>
  );
}
