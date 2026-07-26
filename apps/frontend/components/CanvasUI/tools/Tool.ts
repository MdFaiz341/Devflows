



export type ToolType = 
    "rectangle" | "circle" | "line" | "arrow" | "pencil" | "text" | "select";

import { ArrowTool } from "./ArrowTool";
import { CircleTool } from "./CircleTool";
import { LineTool } from "./LineTool";
import { RectangleTool } from "./RectangleTool";


export type Tool = RectangleTool | CircleTool | LineTool | ArrowTool;