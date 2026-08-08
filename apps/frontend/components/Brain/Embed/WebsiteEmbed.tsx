"use client";

import {
  ExternalLink,
  Globe,
} from "lucide-react";

interface WebsiteEmbedProps {
  url: string;
}

export function WebsiteEmbed({
  url,
}: WebsiteEmbedProps) {

  let hostname = "";

  try {
    hostname = new URL(
      url.startsWith("http") ? url : `https://${url}`
    ).hostname.replace("www.", "");
  } catch {
    hostname = url;
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
      {/* Header */}
      <div className="flex items-center gap-3 p-5">

        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-500/15">
          <Globe
            size={22}
            className="text-indigo-400"
          />
        </div>

        <div className="min-w-0">
          <h3 className="truncate font-semibold text-white">
            Website
          </h3>

          <p className="truncate text-xs text-white/40">
            {hostname}
          </p>
        </div>

      </div>

      {/* URL */}
      <div className="px-5">
        <div className="rounded-xl border border-white/5 bg-black/20 px-4 py-3">
          <p className="truncate text-sm text-white/50">
            {url}
          </p>
        </div>
      </div>

      {/* Open button */}
      <div className="p-5">

        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className=" flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-500
             px-4 py-2.5 text-sm font-medium text-white transition-all duration-200
            hover:bg-indigo-600 hover:shadow-lg hover:shadow-indigo-500/20">
          Open Website

          <ExternalLink size={16} />
        </a>

      </div>
    </div>
  );
}