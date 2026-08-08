

import { ExternalLink } from "lucide-react";
import { LuLinkedin } from "react-icons/lu";


export function LinkedinEmbed({ url }: { url: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-[#0a66c2]/20 to-transparent p-5">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0a66c2]">
          <LuLinkedin size={22} className="text-white" />
        </div>

        <div>
          <h3 className="font-semibold text-white">
            LinkedIn Post
          </h3>

          <p className="text-xs text-white/40">
            LinkedIn content
          </p>
        </div>
      </div>

      <p className="mt-4 text-sm text-white/60">
        LinkedIn doesn't allow this post to be displayed inside an
        iframe.
      </p>

      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 inline-flex items-center gap-2 rounded-xl
                   bg-[#0a66c2] px-4 py-2 text-sm font-medium
                   text-white transition hover:bg-[#084f96]"
      >
        Open on LinkedIn
        <ExternalLink size={15} />
      </a>
    </div>
  );
}