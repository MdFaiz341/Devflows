"use client"

export function PricingCard() {

  return (
    <section id="price" className="relative min-h-screen  bg-black py-24 px-20 text-white">
      {/* Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:70px_70px] opacity-20" />

      {/* Glow */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange-500/10 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <div className="mb-16 text-center">
          <h2 className="text-2xl font-black tracking-tight md:text-6xl">
            Simple Pricing
          </h2>
          <p className="mt-4 text-lg text-zinc-400">
            Choose the perfect plan for your workflow.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`group relative rounded-[32px] border bg-[#050505] p-8 transition-all duration-500 hover:-translate-y-2 ${
                plan.highlighted
                  ? "border-orange-400 shadow-[0_0_120px_rgba(255,153,0,0.2)]"
                  : "border-white/10 hover:border-white/20"
              }`}
            >
              {/* Premium Glow */}
              {plan.highlighted && (
                <>
                  <div className="absolute -bottom-24 left-1/2 h-48 w-48 -translate-x-1/2 rounded-full bg-orange-500/40 blur-3xl" />

                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-orange-400 via-pink-500 to-purple-400 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-black shadow-lg">
                    Most Popular
                  </div>
                </>
              )}

              {/* Hover Shine */}
              <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                <div className="absolute inset-0 bg-gradient-to-b from-white/[0.05] to-transparent" />
              </div>

              <div className="relative z-10">
                <h3 className=" text-xl font-bold">{plan.name}</h3>
                <p className="mt-2 text-sm text-zinc-400">
                  {plan.description}
                </p>

                <div className="mt-10 flex items-end gap-2">
                  <span className="text-4xl font-black tracking-tight">
                    {plan.price}
                  </span>
                  <span className=" text-sm text-zinc-400">/mo</span>
                </div>

                <button
                  className={`mt-10 w-full rounded-2xl py-4 text-sm font-bold transition-all duration-300 ${
                    plan.highlighted
                      ? "bg-gradient-to-r from-orange-400 via-pink-500 to-purple-400 text-black hover:scale-[1.02]"
                      : "border border-white/10 bg-black text-white hover:border-white/20 hover:bg-white/5"
                  }`}
                >
                  Get started
                </button>

                <div className="mt-10 space-y-5">
                  {plan.features.map((feature) => (
                    <div
                      key={feature}
                      className="flex items-center gap-4 text-zinc-300"
                    >
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-yellow-400/10">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={3}
                          stroke="currentColor"
                          className="h-3 w-3 text-yellow-400"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M4.5 12.75l6 6 9-13.5"
                          />
                        </svg>
                      </div>

                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}




const plans = [
    {
      name: "Free",
      description: "For curious minds.",
      price: "$0",
      features: [
        "Unlimited personal canvas",
        "100 brain items",
        "Solo workspace",
      ],
      highlighted: false,
    },
    {
      name: "Pro",
      description: "For makers & duos.",
      price: "$12",
      features: [
        "Everything in Free",
        "Realtime collaboration",
        "Unlimited brain",
        "AI summaries",
      ],
      highlighted: true,
    },
    {
      name: "Team",
      description: "For growing teams.",
      price: "$24",
      features: [
        "Everything in Pro",
        "SSO & permissions",
        "Voice rooms",
        "Priority support",
      ],
      highlighted: false,
    },
  ];