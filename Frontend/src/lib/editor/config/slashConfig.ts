/* eslint-disable @typescript-eslint/no-explicit-any */

import { Editor, Extension, ReactRenderer } from "@tiptap/react";
import Suggestion from "@tiptap/suggestion";

import { CommandsList } from "@/Components/editor/slash-command";
import tippy from "tippy.js"
import { slashTools } from "@/utils/editor/tools/s-tool";
interface SuggestionOptions {
    char: string;
    command: (props: { editor: any; range: any; props: any }) => void;
}
export class SlashConfig {


    getPlugin({editor, options}:{ editor: Editor, options: SuggestionOptions}) {
        return Suggestion({
            editor: editor,
            ...options,
            items: this.items.bind(this),
            render: this.render.bind(this),
        })
    }

    slashCommand() {
        const suggestionConfig = new SlashConfig();
        return Extension.create({
            name: "slash-commands",

            addOptions() {
                return {
                    suggestion: {
                        char: "/",
                        command: ({ editor, range, props }: any) => {
                            props.command({ editor, range })
                        },
                    },
                }
            },

            addProseMirrorPlugins() {
                return [suggestionConfig
                    .getPlugin({
                    editor:this.editor, 
                    options:this.options.suggestion})];
            },
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
                return (component.ref as any)?.onKeyDown?.(props)
            },
            onExit() {
                popup[0].destroy()
                component.destroy()
            },
        }
    }

}