"use client";
import { useState } from "react";

export default function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // 인앱 브라우저(인스타 등) 대비 fallback
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <button
      onClick={copy}
      className={`shrink-0 rounded-md px-3 py-1.5 text-sm font-medium transition ${
        copied ? "bg-green-600 text-white" : "bg-neutral-900 text-white"
      }`}
    >
      {copied ? "복사됨!" : "전체 복사"}
    </button>
  );
}
