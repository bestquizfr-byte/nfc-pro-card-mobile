"use client";

import { useId, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";

export function Accordion({
  title,
  children,
  defaultOpen = false,
  id,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  id?: string;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const panelId = useId();
  return (
    <div className="border-b border-iron-800" id={id}>
      <h3>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls={panelId}
          className="flex w-full items-center justify-between py-5 text-left font-display text-xl font-bold uppercase tracking-wide"
        >
          {title}
          <Plus size={20} className={`transition-transform duration-300 ${open ? "rotate-45" : ""}`} />
        </button>
      </h3>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={panelId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="pb-6 text-[15px] leading-relaxed text-chalk/85">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
