import { Button } from "@repo/ui/button";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Code2,
  Download,
  Minus,
  PenLine,
  Trash2,
  Type,
} from "lucide-react";
import { useRef, useState } from "react";
import { useCanvasStore } from "../../Storage/useCanvasStore";
import { ToolType } from "./tools/Tool";

const colors = [
  "#ffffff",
  "#ff6b6b",
  "#2ea043",
  "#58a6ff",
  "#d97706",
];

const background = ["white", "gray", "pink", "red", "purple"];

export const  ShapeSetting = ({active, removeShape, currTool}:
    {
        active : boolean,
        removeShape : ()=>void,
        currTool : ToolType,
    })=>{

    const [placeAt, setPlaceAt] = useState(true);

    const setStroke = useCanvasStore((state)=>state.setStroke);
    const setStrokeWidth = useCanvasStore((state)=>state.setStrokeWidth);
    const setBackground = useCanvasStore((state)=>state.setBackground);
    const setTextSize = useCanvasStore((state)=>state.setTextSize);

    const [strokeIdx, setStrokeIdx] = useState<number>(-1);
    const [backgroundIdx, setBackgroundIdx] = useState<number>(-1);
    const [strokeWidthIdx, setStrokeWidthIdx] = useState<number>(-1);
    const [fontSizeIdx, setFontSizeIdx] = useState<number>(-1);


    console.log("currToll---- ", currTool);
    
    function textSizeHandler(size:string){
        if(size === "S") setTextSize("10px");
        else if(size === "M") setTextSize("22px")
        else if(size === "L") setTextSize("44px")
        else if(size === "XL") setTextSize("88px");
    }

    function handleClick() {
        setPlaceAt(!placeAt);
    }


    return (
        <div className={`absolute ${!active ? "hidden" : "block"} top-[15%] z-50 w-52 h-[70%] ${placeAt ? "left-1" : "right-1"} overflow-y-auto rounded-2xl bg-[#24242b] p-3 text-white border border-[#34343d]`}>
            <Button
                text={placeAt ? "right" : "left"}
                type="button"
                design="outline"
                className="p-px px-3 rounded-lg text-sm absolute right-8 bg-gray-600"
                onClick={handleClick}
            />
        {/* Stroke */}
        <Section title="Stroke">
            <div className="flex items-center gap-3">
                {colors.map((color, idx:number) => (
                    <button
                        onClick={()=>{setStroke(color), setStrokeIdx(idx)}}
                        key={color}
                        className={`w-6 h-6 rounded-md  ${idx === strokeIdx && "border-2 border-yellow-400 scale-110"} border-white/20 transition hover:scale-110`}
                        style={{ background: color }}
                    />
                ))}
            </div>
        </Section>

        {/* Stroke Width */}
        <Section title="Stroke width">
            <div className="flex items-center gap-3">
                <IconButton active setStrokeWidth={setStrokeWidth} width={2} strokeWidthIdx={strokeWidthIdx} setStrokeWidthIdx={setStrokeWidthIdx}>
                    <Minus strokeWidth={2} />
                </IconButton>

                <IconButton setStrokeWidth={setStrokeWidth} width={4} strokeWidthIdx={strokeWidthIdx} setStrokeWidthIdx={setStrokeWidthIdx}>
                    <Minus strokeWidth={4}/>
                </IconButton>

                <IconButton setStrokeWidth={setStrokeWidth} width={6} strokeWidthIdx={strokeWidthIdx} setStrokeWidthIdx={setStrokeWidthIdx}>
                    <Minus strokeWidth={6} />
                </IconButton>
            </div>
        </Section>

        {/* Background */}
        <Section title="Backgroud">
            <div className="flex items-center gap-3">
                {background.map((color, idx) => (
                    <button
                        onClick={()=>{setBackground(color), setBackgroundIdx(idx)}}
                        key={color}
                        className={`w-6 h-6 rounded-md border-white/20 ${idx === backgroundIdx && "border-2 border-yellow-400 scale-110"} transition hover:scale-110`}
                        style={{ background: color }}
                    />
                ))}
            </div>
        </Section>

            <div>
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

                <Section title="Font size">
                    <div className="flex gap-3">
                        {["S", "M", "L", "XL"].map((size, i) => (
                            <button
                                onClick={()=>{textSizeHandler(size), setFontSizeIdx(i)}}
                                key={size}
                                className={`w-7 h-7 rounded-lg transition ${
                                    i === fontSizeIdx
                                    ? "bg-indigo-600"
                                    : "bg-[#31313d] hover:bg-[#3d3d4b]"
                                }`}
                            >
                            {size}
                            </button>
                        ))}
                    </div>
                </Section>

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
            </div>

        


        {/* Layers */}
        <Section title="Layers">
            <div className="grid grid-cols-4 gap-3">
                <Button
                    type="button"
                    icon={ <Download size={18} />}
                    className="w-7 h-7 rounded-lg flex items-center justify-center transition hover:scale-110 bg-gray-500"
                    onClick={()=>{}}
                />
                <Button
                    type="button"
                    icon={<Trash2 size={18} />}
                    onClick={removeShape}
                    className="w-7 h-7 rounded-lg flex items-center justify-center transition hover:scale-110 bg-gray-500"
                />

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
  setStrokeWidth,
  strokeWidthIdx,
  setStrokeWidthIdx,
  width,
}: {
  children: React.ReactNode;
  active?: boolean;
  setStrokeWidth : (e:number)=>void
  width : number,
  strokeWidthIdx : number,
  setStrokeWidthIdx : (e:number)=>void
}) {
  return (
    <button
        onClick={()=>{setStrokeWidth(width), setStrokeWidthIdx(width)}}
      className={`w-7 h-7 rounded-lg flex items-center justify-center transition
      ${width === strokeWidthIdx ? "bg-indigo-600" : "bg-[#31313d] hover:bg-[#3d3d4b]"}`}
    >
      {children}
    </button>
  );
}