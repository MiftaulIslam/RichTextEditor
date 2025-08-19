/* eslint-disable @typescript-eslint/no-explicit-any */
import EditorCompo from "@/Components/editor/ui/editor-compo";

export const topbarTools=({editor}:any) =>{
    
  const editorComponents = EditorCompo({editor});
 
    return [
    {
        items: [
            {
                id: 'undo',
                render: editorComponents.history("undo"),
            },
            {
                id: 'redo',
                render: editorComponents.history("redo"),
            }
        ]
    },
    {
        id: 'separator'
    },
    {
        items: [
            {
                id: 'bold',
                render: editorComponents.bold(),
            },
            {
                id: 'italic',
                render: editorComponents.italic(),
            },
            {
                id: 'underline',
                render: editorComponents.underline(),
            },
            {
                id: 'strike',
                render: editorComponents.strike(),
            },
            {
                id: 'heading',
                render: editorComponents.heading_dropdown(),
            },
        ]
    },
    {
        id: 'separator'
    },
    {
        items: [
            {
                id: 'blockquote',
                render: editorComponents.blockquote(),
            },
            {
                id: 'code',
                render: editorComponents.code(),
            },
            {
                id: 'link',
                render: editorComponents.link(),
            },
        ]
    },
    {
        id: 'separator'
    },
    {
        items: [
            {
                id:"listOrder",
                render:editorComponents.list("order"),
            },
            {
                id:"listBullet",
                render:editorComponents.list("bullet"),
            }
            ,
            {
                id: 'alignLeft',
                render: editorComponents.align('left')
            },
            {
                id: 'alignCenter',
                render: editorComponents.align('center')
            },
            {
                id: 'alignRight',
                render: editorComponents.align('right')
            },
        ]
    },
    {
        id: 'separator'
    },
    {
        items: [
            {
                id: 'image',
                render: editorComponents.imageUpload(),
            },
        ]
    },
    {
        id: 'separator'
    },
]}