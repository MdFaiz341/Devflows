import { ExternalLink, Globe } from "lucide-react";



export const IframeFallback = ({ url, message }: { url: string; message: string })=> {
  return (
    <div
      className=" flex min-h-[220px] flex-col items-center justify-center gap-4 rounded-2xl border border-white/10 bg-black/20 p-6 text-center">
      <Globe size={35} className="text-white/30" />
      <p
        className=" max-w-sm text-sm text-white/50">
        {message}
      </p>

      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className=" flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2 text-sm text-white transition hover:bg-white/20">
            Open
        <ExternalLink size={15} />
      </a>
    </div>
  );
}