"use client";

import { ExternalLink, Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { RiTwitterXFill } from "react-icons/ri";

declare global {
  interface Window {
    twttr?: {
      widgets?: {
        load: (element?: HTMLElement) => void;
      };
    };
  }
}

interface TwitterEmbedProps {
  url: string;
}

function getTweetId(url: string): string | null {
  const match = url.match(/status\/(\d+)/);

  return match?.[1] || null;
}

export function TwitterEmbed({ url }: TwitterEmbedProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const tweetId = getTweetId(url);

  useEffect(() => {
    if (!tweetId || !containerRef.current) {
      setError(true);
      setLoading(false);
      return;
    }

    const loadTwitter = () => {
      if (!containerRef.current) return;

      containerRef.current.innerHTML = "";

      const blockquote = document.createElement("blockquote");

      blockquote.className = "twitter-tweet";

      const link = document.createElement("a");

      link.href = `https://twitter.com/i/web/status/${tweetId}`;

      blockquote.appendChild(link);

      containerRef.current.appendChild(blockquote);

      window.twttr?.widgets?.load(containerRef.current);

      setTimeout(() => {
        setLoading(false);
      }, 1500);
    };

    if (window.twttr?.widgets) {
      loadTwitter();
      return;
    }

    const existingScript =
      document.getElementById("twitter-widget-script");

    if (!existingScript) {
      const script = document.createElement("script");

      script.id = "twitter-widget-script";
      script.src = "https://platform.twitter.com/widgets.js";
      script.async = true;

      script.onload = loadTwitter;

      script.onerror = () => {
        setLoading(false);
        setError(true);
      };

      document.body.appendChild(script);
    } else {
      const interval = setInterval(() => {
        if (window.twttr?.widgets) {
          clearInterval(interval);
          loadTwitter();
        }
      }, 100);

      return () => clearInterval(interval);
    }
  }, [tweetId, url]);

  if (error) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
        <div className="flex items-center gap-3">
          <RiTwitterXFill size={20} className="text-sky-400" />

          <div>
            <p className="font-medium text-white">
              X post unavailable
            </p>

            <p className="text-xs text-white/40">
              This post could not be embedded.
            </p>
          </div>
        </div>

        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-2 rounded-xl
                     bg-sky-500 px-4 py-2 text-sm font-medium
                     text-white hover:bg-sky-600"
        >
          Open on X
          <ExternalLink size={15} />
        </a>
      </div>
    );
  }

  return (
    <div className="relative min-h-[120px] overflow-hidden rounded-2xl">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader2
            size={25}
            className="animate-spin text-white/50"
          />
        </div>
      )}

      <div ref={containerRef} />
    </div>
  );
}