import { Button } from "@repo/ui/button";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  ArrowDown,
  ArrowUp,
  BringToFront,
  Code2,
  Download,
  PenLine,
  Trash2,
  Type,
} from "lucide-react";
import { useRef, useState } from "react";

const colors = [
  "#ffffff",
  "#ff6b6b",
  "#2ea043",
  "#58a6ff",
  "#d97706",
];

export const  ShapeSetting = ({active, removeShape}:
    {
        active:boolean,
        removeShape : ()=>void;
    })=>{

    const ref = useRef(true);
    function handleClick() {
        console.log("ref: ", ref.current);
        ref.current = !ref.current;
        console.log("ref: ", ref);
        setPlaceAt(ref.current);
    }
    console.log("ref: ", ref.current);
    const [placeAt, setPlaceAt] = useState(ref.current);

  return (
    active && 
        <div className={`absolute top-[15%] z-50 w-56 h-[70%] ${placeAt ? "left-1" : "right-1"} overflow-y-auto rounded-2xl bg-[#24242b] p-3 text-white border border-[#34343d]`}>
            <Button
                text={placeAt ? "right" : "left"}
                type="button"
                design="outline"
                className="p-px px-3 rounded-lg text-sm absolute right-5 bg-gray-600"
                onClick={handleClick}
            />
        {/* Stroke */}
        <Section title="Stroke">
            <div className="flex items-center gap-3">
                {colors.map((color) => (
                    <button
                    key={color}
                    className="w-7 h-7 rounded-md border border-white/20 transition hover:scale-110"
                    style={{ background: color }}
                    />
                ))}
            </div>
        </Section>

        {/* Font Family */}
        <Section title="Font family">
            <div className="flex items-center gap-3">
                <IconButton active>
                    <PenLine size={15} />
                </IconButton>

                <IconButton>
                    <Type size={15} />
                </IconButton>

                <IconButton>
                    <Code2 size={15} />
                </IconButton>
            </div>
        </Section>

        {/* Font Size */}
        <Section title="Font size">
            <div className="flex gap-3">
                {["S", "M", "L", "XL"].map((size, i) => (
                    <button
                        key={size}
                        className={`w-7 h-7 rounded-lg transition ${
                            i === 1
                            ? "bg-indigo-600"
                            : "bg-[#31313d] hover:bg-[#3d3d4b]"
                        }`}
                    >
                    {size}
                    </button>
                ))}
            </div>
        </Section>

        {/* Text Align */}
        <Section title="Text align">
            <div className="flex gap-3">
            <IconButton active>
                <AlignLeft size={15} />
            </IconButton>

            <IconButton>
                <AlignCenter size={15} />
            </IconButton>

            <IconButton>
                <AlignRight size={15} />
            </IconButton>
            </div>
        </Section>

        {/* Opacity */}
        <Section title="Opacity">
            <input
            type="range"
            min={0}
            max={100}
            defaultValue={100}
            className="w-full accent-indigo-500"
            />

            <div className="flex justify-between text-sm mt-2 text-white/80">
            <span>0</span>
            <span>100</span>
            </div>
        </Section>

        {/* Layers */}
        <Section title="Layers">
            <div className="grid grid-cols-4 gap-3">
                <IconButton>
                    <Download size={18} />
                </IconButton>

                <IconButton>
                    <Trash2 size={18} onClick={removeShape} />
                </IconButton>
            </div>
        </Section>
        </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-8">
      <h3 className="text-sm font-medium mb-4 text-white/90">
        {title}
      </h3>

      {children}
    </div>
  );
}

function IconButton({
  children,
  active = false,
}: {
  children: React.ReactNode;
  active?: boolean;
}) {
  return (
    <button
      className={`w-7 h-7 rounded-lg flex items-center justify-center transition
      ${
        active
          ? "bg-indigo-600"
          : "bg-[#31313d] hover:bg-[#3d3d4b]"
      }`}
    >
      {children}
    </button>
  );
}