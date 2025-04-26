/* eslint-disable @typescript-eslint/no-explicit-any */

import { Editor, ReactRenderer } from "@tiptap/react";
import Suggestion from "@tiptap/suggestion";
import { slashTools } from "../tools/s-tool";
import { CommandsList } from "@/Components/editor/slash-command";
import tippy from "tippy.js"
interface SuggestionOptions {
    char: string;
    command: (props: { editor: any; range: any; props: any }) => void;
}
export class SlashConfig {
    private editor: Editor;
    private options: SuggestionOptions;
    constructor(editor: Editor, options: SuggestionOptions) {
        this.editor = editor;
        this.options = options;
    }

     getPlugin() {
        return Suggestion({
            editor: this.editor,
            ...this.options,
            items: this.items.bind(this),
            render: this.render.bind(this),
        })
    }
    private items({ query }: { query: string }) {
        return [...slashTools,].filter((item) => {
            if (typeof query === "string" && query.length > 0) {
                return item.title.toLowerCase().includes(query.toLowerCase())
            }
            return true
        })
    }

    private render(): any {
        let component: ReactRenderer
        let popup: any

        return {
            onStart: (props: any) => {
                component = new ReactRenderer(CommandsList, {
                    props,
                    editor: props.editor,
                })

                popup = tippy("body", {
                    getReferenceClientRect: props.clientRect,
                    appendTo: () => document.body,
                    content: component.element,
                    showOnCreate: true,
                    interactive: true,
                    trigger: "manual",
                    placement: "bottom-start",
                })
            },
            onUpdate(props: any) {
                component.updateProps(props)

                popup[0].setProps({
                    getReferenceClientRect: props.clientRect,
                })
            },
            onKeyDown(props: any) {
                if (props.event.key === "Escape") {
                    popup[0].hide()
                    return true
                }

            },
            onExit() {
                popup[0].destroy()
                component.destroy()
            },
        }
    }

}