"use client";

import * as React from "react";
import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Command,
  Figma,
  ImageIcon,
  LoaderIcon,
  MonitorIcon,
  Paperclip,
  SendIcon,
  Sliders,
  XIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface UseAutoResizeTextareaProps {
  minHeight: number;
  maxHeight?: number;
}

function useAutoResizeTextarea({
  minHeight,
  maxHeight,
}: UseAutoResizeTextareaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = useCallback(
    (reset?: boolean) => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      if (reset) {
        textarea.style.height = `${minHeight}px`;
        return;
      }

      textarea.style.height = `${minHeight}px`;
      const newHeight = Math.max(
        minHeight,
        Math.min(textarea.scrollHeight, maxHeight ?? Number.POSITIVE_INFINITY)
      );

      textarea.style.height = `${newHeight}px`;
    },
    [maxHeight, minHeight]
  );

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = `${minHeight}px`;
    }
  }, [minHeight]);

  useEffect(() => {
    const handleResize = () => adjustHeight();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [adjustHeight]);

  return { textareaRef, adjustHeight };
}

interface CommandSuggestion {
  icon: React.ReactNode;
  label: string;
  description: string;
  prefix: string;
}

const commandSuggestions: CommandSuggestion[] = [
  {
    icon: <ImageIcon className="h-4 w-4" />,
    label: "Clone UI",
    description: "Generate a UI from a screenshot",
    prefix: "/clone",
  },
  {
    icon: <Figma className="h-4 w-4" />,
    label: "Import Figma",
    description: "Import a design from Figma",
    prefix: "/figma",
  },
  {
    icon: <MonitorIcon className="h-4 w-4" />,
    label: "Create Page",
    description: "Generate a new web page",
    prefix: "/page",
  },
  {
    icon: <Sliders className="h-4 w-4" />,
    label: "Refine Design",
    description: "Improve existing UI layout",
    prefix: "/refine",
  },
];

interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  containerClassName?: string;
  showRing?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, containerClassName, showRing = true, ...props }, ref) => {
    const [isFocused, setIsFocused] = React.useState(false);

    return (
      <div className={cn("relative", containerClassName)}>
        <textarea
          className={cn(
            "flex min-h-[80px] w-full rounded-md border border-zinc-800 bg-transparent px-3 py-2 text-sm text-white",
            "transition-all duration-200 ease-in-out",
            "placeholder:text-zinc-500",
            "disabled:cursor-not-allowed disabled:opacity-50",
            showRing
              ? "focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
              : "",
            className
          )}
          ref={ref}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />

        {showRing && isFocused && (
          <motion.span
            className="pointer-events-none absolute inset-0 rounded-md ring-1 ring-zinc-500 ring-offset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

export function AnimatedAIChat() {
  const [value, setValue] = useState("");
  const [attachments, setAttachments] = useState<string[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [, startTransition] = useTransition();
  const [activeSuggestion, setActiveSuggestion] = useState<number>(-1);
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [recentCommand, setRecentCommand] = useState<string | null>(null);
  const [inputFocused, setInputFocused] = useState(false);
  const { textareaRef, adjustHeight } = useAutoResizeTextarea({
    minHeight: 60,
    maxHeight: 200,
  });
  const commandPaletteRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value.startsWith("/") && !value.includes(" ")) {
      setShowCommandPalette(true);

      const matchingSuggestionIndex = commandSuggestions.findIndex((cmd) =>
        cmd.prefix.startsWith(value)
      );

      setActiveSuggestion(matchingSuggestionIndex >= 0 ? matchingSuggestionIndex : -1);
    } else {
      setShowCommandPalette(false);
    }
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const commandButton = document.querySelector("[data-command-button]");

      if (
        commandPaletteRef.current &&
        !commandPaletteRef.current.contains(target) &&
        !commandButton?.contains(target)
      ) {
        setShowCommandPalette(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!recentCommand) return;

    const timeoutId = window.setTimeout(() => setRecentCommand(null), 2500);
    return () => window.clearTimeout(timeoutId);
  }, [recentCommand]);

  const handleSendMessage = () => {
    if (!value.trim()) return;

    startTransition(() => {
      setIsTyping(true);
      window.setTimeout(() => {
        setIsTyping(false);
        setValue("");
        adjustHeight(true);
      }, 2000);
    });
  };

  const handleAttachFile = () => {
    const mockFileName = `file-${Math.floor(Math.random() * 1000)}.pdf`;
    setAttachments((prev) => [...prev, mockFileName]);
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const selectCommandSuggestion = (index: number) => {
    const selectedCommand = commandSuggestions[index];
    setValue(`${selectedCommand.prefix} `);
    setShowCommandPalette(false);
    setRecentCommand(selectedCommand.label);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (showCommandPalette) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveSuggestion((prev) =>
          prev < commandSuggestions.length - 1 ? prev + 1 : 0
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveSuggestion((prev) =>
          prev > 0 ? prev - 1 : commandSuggestions.length - 1
        );
      } else if (e.key === "Tab" || e.key === "Enter") {
        e.preventDefault();
        if (activeSuggestion >= 0) {
          selectCommandSuggestion(activeSuggestion);
        }
      } else if (e.key === "Escape") {
        e.preventDefault();
        setShowCommandPalette(false);
      }
    } else if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (value.trim()) {
        handleSendMessage();
      }
    }
  };

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-black p-6 text-white">
      <div className="relative mx-auto w-full max-w-2xl">
        <motion.div
          className="relative z-10 space-y-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="space-y-3 text-center">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-block"
            >
              <h1 className="text-3xl font-medium tracking-tight text-white">
                How can I help today?
              </h1>
              <motion.div
                className="h-px bg-zinc-800"
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: "100%", opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              />
            </motion.div>
            <motion.p
              className="text-sm text-zinc-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Type a command or ask a question
            </motion.p>
          </div>

          <motion.div
            className="relative rounded-xl border border-zinc-800 bg-[#09090b] shadow-xl"
            initial={{ scale: 0.98 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <AnimatePresence>
              {showCommandPalette && (
                <motion.div
                  ref={commandPaletteRef}
                  className="absolute bottom-full left-4 right-4 z-50 mb-2 overflow-hidden rounded-lg border border-zinc-800 bg-black shadow-lg"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  transition={{ duration: 0.15 }}
                >
                  <div className="bg-black py-1">
                    {commandSuggestions.map((suggestion, index) => (
                      <motion.div
                        key={suggestion.prefix}
                        className={cn(
                          "flex cursor-pointer items-center gap-2 px-3 py-2 text-xs transition-colors",
                          activeSuggestion === index
                            ? "bg-zinc-800 text-white"
                            : "text-zinc-300 hover:bg-zinc-900"
                        )}
                        onClick={() => selectCommandSuggestion(index)}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.03 }}
                      >
                        <div className="flex h-5 w-5 items-center justify-center text-zinc-400">
                          {suggestion.icon}
                        </div>
                        <div>
                          <div className="font-medium">{suggestion.label}</div>
                          <div className="text-[11px] text-zinc-500">
                            {suggestion.description}
                          </div>
                        </div>
                        <div className="ml-auto text-xs font-mono text-zinc-500">
                          {suggestion.prefix}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="p-4">
              <Textarea
                ref={textareaRef}
                value={value}
                onChange={(e) => {
                  setValue(e.target.value);
                  adjustHeight();
                }}
                onKeyDown={handleKeyDown}
                onFocus={() => setInputFocused(true)}
                onBlur={() => setInputFocused(false)}
                placeholder="Ask a question..."
                containerClassName="w-full"
                className={cn(
                  "min-h-[60px] w-full resize-none border-none bg-transparent px-4 py-3 text-sm text-white",
                  "focus:outline-none placeholder:text-zinc-500"
                )}
                style={{ overflow: "hidden" }}
                showRing={false}
              />
            </div>

            <AnimatePresence>
              {attachments.length > 0 && (
                <motion.div
                  className="flex flex-wrap gap-2 px-4 pb-3"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  {attachments.map((file, index) => (
                    <motion.div
                      key={`${file}-${index}`}
                      className="flex items-center gap-2 rounded-lg bg-zinc-900 border border-zinc-800 px-3 py-1.5 text-xs text-zinc-300 font-mono"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                    >
                      <span>{file}</span>
                      <button
                        type="button"
                        onClick={() => removeAttachment(index)}
                        className="text-zinc-500 transition-colors hover:text-white"
                      >
                        <XIcon className="h-3 w-3" />
                      </button>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex items-center justify-between gap-4 border-t border-zinc-800 p-4">
              <div className="flex items-center gap-3">
                <motion.button
                  type="button"
                  onClick={handleAttachFile}
                  whileTap={{ scale: 0.94 }}
                  className="group relative rounded-lg p-2 text-zinc-400 transition-colors hover:text-white"
                >
                  <Paperclip className="h-4 w-4" />
                </motion.button>
                <motion.button
                  type="button"
                  data-command-button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowCommandPalette((prev) => !prev);
                  }}
                  whileTap={{ scale: 0.94 }}
                  className={cn(
                    "group relative rounded-lg p-2 text-zinc-400 transition-colors hover:text-white",
                    showCommandPalette && "bg-zinc-800 text-white"
                  )}
                >
                  <Command className="h-4 w-4" />
                </motion.button>
              </div>

              <motion.button
                type="button"
                onClick={handleSendMessage}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                disabled={isTyping || !value.trim()}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all",
                  value.trim()
                    ? "bg-white text-black font-semibold"
                    : "bg-zinc-900 text-zinc-500 border border-zinc-800"
                )}
              >
                {isTyping ? (
                  <LoaderIcon className="h-4 w-4 animate-spin text-black" />
                ) : (
                  <SendIcon className="h-4 w-4" />
                )}
                <span>Send</span>
              </motion.button>
            </div>
          </motion.div>

          <div className="flex flex-wrap items-center justify-center gap-2">
            {commandSuggestions.map((suggestion, index) => (
              <motion.button
                key={suggestion.prefix}
                type="button"
                onClick={() => selectCommandSuggestion(index)}
                className="group relative flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900/60 px-3 py-2 text-sm text-zinc-300 transition-all hover:bg-zinc-800 hover:text-white"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {suggestion.icon}
                <span>{suggestion.label}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {isTyping && (
          <motion.div
            className="fixed bottom-8 left-1/2 mx-auto -translate-x-1/2 rounded-full border border-zinc-800 bg-zinc-900 px-4 py-2 shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <div className="flex items-center gap-3">
              <div className="flex h-7 w-8 items-center justify-center rounded-full bg-zinc-800 text-center">
                <span className="mb-0.5 text-xs font-mono font-medium text-white">
                  SAVVY
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-zinc-300 font-mono">
                <span>Thinking</span>
                <TypingDots />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function TypingDots() {
  return (
    <div className="ml-1 flex items-center">
      {[1, 2, 3].map((dot) => (
        <motion.div
          key={dot}
          className="mx-0.5 h-1.5 w-1.5 rounded-full bg-white"
          initial={{ opacity: 0.3 }}
          animate={{
            opacity: [0.3, 0.9, 0.3],
            scale: [0.85, 1.1, 0.85],
          }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            delay: dot * 0.15,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
