



export type ToolType = 
    "rectangle" | "circle" | "line" | "arrow" | "pencil" | "text" | "select";

import { ArrowTool } from "./ArrowTool";
import { CircleTool } from "./CircleTool";
import { LineTool } from "./LineTool";
import { PencilTool } from "./PencilTool";
import { RectangleTool } from "./RectangleTool";
import { TextTool } from "./TextTool";


export type Tool = RectangleTool | CircleTool | LineTool | ArrowTool | PencilTool | TextTool;