"use client"

import { FeatureCard } from "./FeaturesCard"

export const Features = () => {
  return (
    <section id="features" className="px-6 py-28">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-2xl">
              <div className="mb-4 inline-flex rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-2 text-sm text-violet-300">
                Features
              </div>

              <h2 className="text-4xl font-black md:text-6xl">
                Everything your team needs.
              </h2>

              <p className="mt-6 text-lg leading-relaxed text-zinc-400">
                DevFlows unifies realtime collaboration, visual thinking and AI-powered knowledge management in one beautiful workspace.
              </p>
            </div>

            <div className="mt-16 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              <FeatureCard
                icon="canvas"
                title="Collaborative Canvas"
                description="Realtime multiplayer whiteboard inspired by Excalidraw with shapes, flows and drawing tools."
              />

              <FeatureCard
                icon="chat"
                title="Realtime Chat"
                description="Create workspace conversations with instant messaging and presence indicators."
              />

              <FeatureCard
                icon="brain"
                title="Second Brain"
                description="Store notes, tweets, videos and links with smart organization and retrieval."
              />

              <FeatureCard
                icon="ai"
                title="AI Workspace"
                description="Boost productivity with AI-assisted workflows, search and summarization."
              />
            </div>
          </div>
        </section>
  )
}