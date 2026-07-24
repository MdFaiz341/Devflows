"use client"

import { GridIcon } from "../Icons/icon";
import { LuLinkedin } from "react-icons/lu";
import { BsGithub } from "react-icons/bs";
import { SlSocialTwitter } from "react-icons/sl";
import { Button } from "@repo/ui/button";


const footerSections = [
  {
    title: "Product",
    items: ["Canvas", "Chat", "Second Brain", "Integrations"],
  },
  {
    title: "Resources",
    items: ["Docs", "API", "Community", "Guides"],
  },
  {
    title: "Company",
    items: ["About", "Careers", "Privacy", "Contact"],
  },
];


export const Footer = ()=>{
    return(
        <footer className="border-t border-white/10 bg-black/50 backdrop-blur-xl">
          <div className="mx-auto max-w-7xl px-6 py-20">
            <div className="grid gap-14 lg:grid-cols-4">
              <div>
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 via-blue-500 to-cyan-400">
                    <GridIcon className="h-5 w-5" />
                  </div>

                  <h3 className="text-2xl font-black">
                    Dev<span className="text-violet-400">Flows</span>
                  </h3>
                </div>

                <p className="mt-5 leading-relaxed text-zinc-400">
                  The collaborative canvas and second brain platform for modern
                  teams.
                </p>

                <div className="mt-6 flex items-center gap-4">
                  <Button
                    type="button"
                    icon={<BsGithub/>}
                    className="flex h-11 w-11 items-center justify-center"
                    design="outline"
                  />
                  <Button
                    type="button"
                    icon={<LuLinkedin/>}
                    className="flex h-11 w-11 items-center justify-center"
                    design="outline"
                  />
                  <Button
                    type="button"
                    icon={<SlSocialTwitter/>}
                    className="flex h-11 w-11 items-center justify-center"
                    design="outline"
                  />
                </div>
              </div>

              {footerSections.map((section) => (
                <FooterColumn
                  key={section.title}
                  title={section.title}
                  items={section.items}
                />
              ))}
            </div>

            <div className="mt-20 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-sm text-zinc-500 md:flex-row">
              <p>© 2026 DevFlows. All rights reserved.</p>

              <p>Built for creators, startups and developers.</p>
            </div>
          </div>
        </footer>
    )
}




function FooterColumn({
  title,
  items,
}: {
  title: string;
  items: string[];
}) {
  return (
    <div>
      <h4 className="text-lg font-semibold">{title}</h4>

      <div className="mt-5 space-y-4">
        {items.map((item) => (
          <button
            key={item}
            type="button"
            className="block text-left text-zinc-400 transition hover:text-white"
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
}