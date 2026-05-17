import { useEffect, useState } from "react";
import ChatPanel from "./ChatPanel";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <div className="fixed z-40 bottom-5 right-4 md:right-6 flex flex-col gap-3 items-center">
        {/* Messenger */}
        <a
          href="https://m.me/"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full w-[52px] h-[52px] shadow-md hover:shadow-xl hover:-translate-y-1 active:translate-y-0 transition-all flex items-center justify-center bg-white"
          title="Chat qua Messenger"
        >
          <img src="https://img.icons8.com/color/96/facebook-messenger--v1.png" alt="Messenger" className="w-[52px] h-[52px] object-cover" />
        </a>

        {/* Zalo */}
        <a
          href="https://zalo.me/"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full w-[52px] h-[52px] shadow-md hover:shadow-xl hover:-translate-y-1 active:translate-y-0 transition-all flex items-center justify-center bg-white"
          title="Chat qua Zalo"
        >
          <img src="https://img.icons8.com/color/96/zalo.png" alt="Zalo" className="w-[52px] h-[52px] object-cover" />
        </a>

        {/* Chat Nội Bộ */}
        <button
          onClick={() => setOpen((v) => !v)}
          className="rounded-full w-[52px] h-[52px] shadow-lg bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 text-white hover:shadow-xl hover:-translate-y-1 active:translate-y-0 transition-all flex items-center justify-center mt-1"
          aria-label="Mở chat hỗ trợ"
          title="Chat hỗ trợ"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M4 5h16v9H7l-3 3V5z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
      </div>

      {open && (
        <div className="fixed z-40 bottom-20 right-4 md:right-6">
          <div className="hidden md:block">
            <ChatPanel onClose={() => setOpen(false)} />
          </div>
          <div className="block md:hidden">
            <ChatPanel onClose={() => setOpen(false)} fullscreen />
          </div>
        </div>
      )}
    </>
  );
}
