/* eslint-disable @typescript-eslint/no-explicit-any */
import { RenderLeafProps } from "slate-react";
interface RenderLeafs {
    type:any;
    element: React.ReactNode;
}
export const RenderLeafs=(props:RenderLeafProps) => 
{
    const leafs:RenderLeafs[] =     [
        {
            type:'bold',
            element: <strong>{props.children}</strong>
        },
        {
            type:'italic',
            element: <em>{props.children}</em>
        },
        {
            type:'underline',
            element: <u>{props.children}</u>
        },
        {
            type:'code',
            element: <code className="bg-gray-100 px-1 py-0.5 rounded font-mono">{props.children}</code>
        },
        {
            type:'strikethrough',
            element: <s>{props.children}</s>
        },
        {
            type:'superscript',
            element: <sup>{props.children}</sup>
        },
        {
            type:'subscript',
            element: <sub>{props.children}</sub>
        },
        {
            type:'color',
            element: <span style={{color:props.leaf.color}}>{props.children}</span>
        },
        
        
    ]
    return leafs
}