"use client";

import { ExternalLink, Globe, Loader2, Trash2} from "lucide-react";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import api from "../../API/Interceptor";
import { ContentFormat, useBrainStore } from "../../Storage/useBrainStore";
import { YoutubeEmbed } from "./Embed/YoutubeEmbed";
import { TwitterEmbed } from "./Embed/TwitterEmbed";
import { WebsiteEmbed } from "./Embed/WebsiteEmbed";
import { GithubEmbed } from "./Embed/GithubEmbed";
import { ContentIcon } from "./ContentIcons";
import { LinkedinEmbed } from "./Embed/LinkedinEmbed";

/* =========================================================
   TYPES
========================================================= */

export type ContentType = "youtube" | "twitter" | "github" | "website" | "unknown" | "linkedin";

interface UrlInfo {
  type: ContentType;
  url: string;
  embedUrl?: string;
  videoId?: string;
  twitterUrl?: string;
}

/* =========================================================
   URL HELPERS
========================================================= */

function normalizeUrl(value: string) {
  try {
    return new URL(value.startsWith("http") ? value : `https://${value}`);
  } catch {
    return null;
  }
}

/* =========================================================
   YOUTUBE
========================================================= */

function getYoutubeVideoId(url: string): string | null {
  try {
    const parsed = new URL(url.startsWith("http") ? url : `https://${url}`);

    const hostname = parsed.hostname.toLowerCase().replace("www.", "");

    /*
      youtube.com/watch?v=VIDEO_ID
    */

    if (hostname === "youtube.com") {
      const videoId = parsed.searchParams.get("v");

      if (videoId) {
        return videoId;
      }

      /*
        youtube.com/shorts/VIDEO_ID
      */

      if (parsed.pathname.startsWith("/shorts/")) {
        return parsed.pathname.split("/shorts/")[1]?.split("/")[0] || null;
      }

      /*
        youtube.com/embed/VIDEO_ID
      */

      if (parsed.pathname.startsWith("/embed/")) {
        return parsed.pathname.split("/embed/")[1]?.split("/")[0] || null;
      }
    }

    /*
      youtu.be/VIDEO_ID
    */

    if (hostname === "youtu.be") {
      return parsed.pathname.slice(1).split("/")[0] || null;
    }

    return null;
  } catch {
    return null;
  }
}

/* =========================================================
   LinkedIn
========================================================= */
function isLinkedinUrl(url: string) {
  const parsed = normalizeUrl(url);

  if (!parsed) return false;

  const hostname = parsed.hostname
    .toLowerCase()
    .replace("www.", "");

  return hostname === "linkedin.com";
}

/* =========================================================
   TWITTER / X
========================================================= */

function isTwitterUrl(url: string) {
  const parsed = normalizeUrl(url);

  if (!parsed) return false;

  const hostname = parsed.hostname.toLowerCase().replace("www.", "");

  return hostname === "twitter.com" || hostname === "x.com";
}

/* =========================================================
   GITHUB
========================================================= */

function isGithubUrl(url: string) {
  const parsed = normalizeUrl(url);

  if (!parsed) return false;

  const hostname = parsed.hostname.toLowerCase().replace("www.", "");

  return hostname === "github.com";
}

/* =========================================================
   URL DETECTOR
========================================================= */

function detectUrl(url: string): UrlInfo {
  const normalized = normalizeUrl(url);

  if (!normalized) {
    return {
      type: "unknown",
      url,
    };
  }

  /*
    YOUTUBE
  */

  const youtubeId = getYoutubeVideoId(url);

  if (youtubeId) {
    return {
      type: "youtube",

      url,

      videoId: youtubeId,

      /*
        plays inside iframe
      */

      embedUrl: `https://www.youtube.com/embed/${youtubeId}` + `?rel=0&modestbranding=1`,
    };
  }

  /*
    TWITTER / X
  */

  if (isTwitterUrl(url)) {
    return {
      type: "twitter",
      url,
      twitterUrl: url.replace("x.com", "twitter.com"),
    };
  }

  /*
    GITHUB
  */

  if (isGithubUrl(url)) {
    return {
      type: "github",
      url,
    };
  }

  if(isLinkedinUrl(url)){
    return {
      type: "linkedin",
      url,
    };
  }

  /*
    EVERYTHING ELSE
  */

  return {
    type: "website",
    url,
  };
}


export const Card = (props: ContentFormat) => {
  const deleteContent = useBrainStore((state) => state.deleteContent);
  const [deleting, setDeleting] = useState(false);
  const [iframeError, setIframeError] = useState(false);
  const urlInfo = useMemo(() => detectUrl(props.link), [props.link]);

  /* =====================================================
     DELETE
  ===================================================== */

  async function deleteHandler() {
    if (deleting) return;

    setDeleting(true);

    const toastId = toast.loading("Deleting...");

    try {
      const response = await api.post("/deleteContent", {
        id: props.id,
      });

      deleteContent(props.id);

      toast.success(response.data.message);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to delete content");
    } finally {
      setDeleting(false);

      toast.dismiss(toastId);
    }
  }

  /* =====================================================
     RESET IFRAME ERROR
  ===================================================== */

  useEffect(() => {
    setIframeError(false);
  }, [props.link]);

  return (
    <article
      className=" group relative break-inside-avoid mb-5 w-full overflow-hidden 
        rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-2xl shadow-[0_10px_40px_rgba(0,0,0,0.25)] 
        transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:shadow-[0_20px_60px_rgba(99,102,241,0.18)]">
      {/* =================================================
          HEADER
      ================================================= */}

      <div
        className=" flex items-center justify-between gap-4 px-5 pt-5">
        <div
          className=" min-w-0 flex-1">
          <h2
            className=" truncate text-lg font-semibold text-white">
            {props.title}
          </h2>

          <p
            className=" mt-1 truncate text-xs text-white/40">
            {props.link}
          </p>
        </div>

        <ContentIcon type={urlInfo.type} />
      </div>

      {/* =================================================
          CONTENT
      ================================================= */}

      <div className="mt-4 px-5">
        {/* ================= YOUTUBE ================= */}

        {urlInfo.type === "youtube" && (
          <YoutubeEmbed
            embedUrl={urlInfo.embedUrl!}
            title={props.title}
            hasError={iframeError}
            setError={setIframeError}
          />
        )}

        {/* ================= TWITTER ================= */}

        {urlInfo.type === "twitter" && (
          <TwitterEmbed url={urlInfo.twitterUrl || props.link} />
        )}

        {/* ================= GITHUB ================= */}

        {urlInfo.type === "github" && <GithubEmbed url={props.link} />}

        {/* ================= WEBSITE ================= */}

        {urlInfo.type === "website" && (
          <WebsiteEmbed
            url={props.link}
          />
        )}

        {/* ================= LINKEDIN ================= */}
        {urlInfo.type === "linkedin" && (
          <LinkedinEmbed url={props.link} />
        )}

        {/* ================= UNKNOWN ================= */}

        {/* {urlInfo.type === "unknown" && <FallbackLink url={props.link} />} */}
      </div>

      {/* =================================================
          FOOTER
      ================================================= */}

      <div
        className="  flex items-center justify-between gap-4 px-5 py-4">
        <div
          className="flex items-center gap-2 text-sm font-medium text-white/50">
          <span>{new Date(props.createdAt).toLocaleDateString()}</span>
        </div>

        <div
          className=" flex items-center gap-3">
          {/* OPEN */}

          <a
            href={props.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 text-white/50 transition  hover:bg-white/10 hover:text-white">
            <ExternalLink size={17} />
          </a>

          {/* DELETE */}

          <button
            disabled={deleting}
            onClick={deleteHandler}
            className="flex h-9  w-9 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400 transition hover:bg-red-500/10 hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
            {deleting ? (
              <Loader2 size={17} className="animate-spin" />
            ) : (
              <Trash2 size={17} />
            )}
          </button>
        </div>
      </div>
    </article>
  );
};

/* =========================================================
   UNKNOWN URL
========================================================= */

function FallbackLink({ url }: { url: string }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className=" flex min-h-[180px] flex-col items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03]  text-white/60 transition hover:bg-white/[0.06] hover:text-white">
      <Globe size={35} />

      <span className="text-sm">Open content</span>
    </a>
  );
}
