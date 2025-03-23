import React from 'react'
import { RenderElementProps } from 'slate-react';
interface ElementType {
    type: string;
    element: React.ReactNode; 
  }

const RenderElement = (props:RenderElementProps) => {
    const elements:ElementType[] =  [
    {
        type: "paragraph",
        element: <p {...props.attributes}>{props.children}</p>,
    },
    {
        type: "heading-one",
        element: <h1 {...props.attributes} className="text-4xl font-bold my-4">
        {props.children}
      </h1>,
    },
    {
        type: "heading-two",
        element: <h2 {...props.attributes} className="text-3xl font-bold my-3">
        {props.children}
      </h2>,
    },
    {
        type: "heading-three",
        element:<h3 {...props.attributes} className="text-2xl font-bold my-2">
        {props.children}
      </h3>,
    },
    {
        type: "block-quote",
        element:  <blockquote {...props.attributes} className="border-l-4 border-gray-300 pl-4 italic my-4">
        {props.children}
      </blockquote>,
    },
    {
        type: "bulleted-list",
        element:    <ul {...props.attributes} className="list-disc ml-6 my-4">
        {props.children}
      </ul>,
    },
    {
        type: "numbered-list",
        element:    <ol {...props.attributes} className="list-decimal ml-6 my-4">
        {props.children}
      </ol>,
    },
    {
        type: "list-item",
        element:    <li {...props.attributes}>{props.children}</li>,
    },
    {
        type: "code-block",
        element:     <pre {...props.attributes} className="bg-gray-100 p-4 rounded my-4 font-mono">
        {props.children}
      </pre>,
    },
    {
        type: "table",
        element:    <table {...props.attributes} className="border-collapse border border-gray-300 my-4 w-full">
        {props.children}
      </table>,
    },
    {
        type: "table-row",
        element:     <tr {...props.attributes}>{props.children}</tr>,
    },
    {
        type: "table-cell",
        element:    <td {...props.attributes} className="border border-gray-300 p-2">
        {props.children}
      </td>,
    },
    {
        type: "align-left",
        element:     <div {...props.attributes} className="text-left">
        {props.children}
      </div>,
    },
    {
        type: "align-center",
        element: <div {...props.attributes} className="text-center">
            {props.children}
          </div>,
    },
    {
        type: "align-right",
        element: <div {...props.attributes} className="text-right">
            {props.children}
          </div>,
    },
    {
        type: "align-justify",
        element: <div {...props.attributes} className="text-justify">
            {props.children}
          </div>,
    },
    {
        type: "image",
        element: <div {...props.attributes} className="w-full">
            <img src={`${props.element.children[0].url}`} alt={`${props.element.children[0].text}`} />
          </div>,
    },
];
return elements
}
export default RenderElement