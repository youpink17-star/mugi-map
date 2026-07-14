"use client";
import { useEffect } from "react";

// 콘텐츠 무단 복사 방지 — 텍스트 선택/우클릭/복사를 막는다.
// 단, 입력창(위키 작성 등)에서는 사용자가 자기 글을 정상적으로
// 복사·붙여넣기 할 수 있어야 하므로 그 요소들은 예외로 둔다.
function isEditable(el: EventTarget | null): boolean {
  if (!(el instanceof HTMLElement)) return false;
  const tag = el.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || el.isContentEditable;
}

export default function CopyGuard() {
  useEffect(() => {
    function blockUnlessEditable(e: Event) {
      if (!isEditable(e.target)) e.preventDefault();
    }
    document.addEventListener("contextmenu", blockUnlessEditable);
    document.addEventListener("copy", blockUnlessEditable);
    document.addEventListener("cut", blockUnlessEditable);
    document.addEventListener("dragstart", blockUnlessEditable);
    return () => {
      document.removeEventListener("contextmenu", blockUnlessEditable);
      document.removeEventListener("copy", blockUnlessEditable);
      document.removeEventListener("cut", blockUnlessEditable);
      document.removeEventListener("dragstart", blockUnlessEditable);
    };
  }, []);

  return null;
}
