"use client";

import {
  ExternalLink,
  GitBranch,
} from "lucide-react";
import { FaGithub } from "react-icons/fa";



function parseGithubUrl(url: string) {
  try {
    const parsed = new URL(
      url.startsWith("http") ? url : `https://${url}`
    );

    const parts = parsed.pathname
      .split("/")
      .filter(Boolean);

    return {
      owner: parts[0] || "",
      repo: parts[1] || "",
      path: parts.slice(2).join("/"),
    };
  } catch {
    return {
      owner: "",
      repo: "",
      path: "",
    };
  }
}

export function GithubEmbed({ url }: {url : string}) {
  const { owner, repo, path } = parseGithubUrl(url);

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0d1117]">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-white/10 p-5">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10">
          <FaGithub size={24} className="text-white" />
        </div>

        <div className="min-w-0">
          <p className="truncate font-semibold text-white">
            {owner}/{repo}
          </p>

          <p className="truncate text-xs text-white/40">
            GitHub repository
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-center gap-2 text-sm text-white/60">
          <GitBranch size={16} />

          <span>
            {path || "Repository"}
          </span>
        </div>

        <p className="mt-4 text-sm text-white/50">
          View this repository or file directly on GitHub.
        </p>

        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex items-center gap-2 rounded-xl
                     bg-white/10 px-4 py-2 text-sm font-medium
                     text-white transition hover:bg-white/20"
        >
          Open on GitHub
          <ExternalLink size={15} />
        </a>
      </div>
    </div>
  );
}