"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Underline from "@tiptap/extension-underline"
import Link from "@tiptap/extension-link"
import TextAlign from "@tiptap/extension-text-align"
import { TextStyle } from "@tiptap/extension-text-style"
import Color from "@tiptap/extension-color"
import Placeholder from "@tiptap/extension-placeholder"
import {
    Bold,
    Italic,
    UnderlineIcon,
    Strikethrough,
    Link2,
    List,
    ListOrdered,
    AlignLeft,
    AlignCenter,
    AlignRight,
    Undo,
    Redo,
    Type,
} from "lucide-react"
import { Toggle } from "@/front/components/ui/toggle"
import { Separator } from "@/front/components/ui/separator"
import { cn } from "@/front/lib/utils"
import React from "react"

type TiptapEditorProps = {
    content?: string
    onChange?: (html: string) => void
    placeholder?: string
    className?: string
    minHeight?: string
    readOnly?: boolean
}

export function TiptapEditor({
    content = "",
    onChange,
    placeholder = "Rédigez votre message...",
    className,
    minHeight = "200px",
    readOnly = false,
}: TiptapEditorProps) {
    const editor = useEditor({
        immediatelyRender: false,
        extensions: [
            StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
            Underline.configure({}),
            Link.configure({ openOnClick: false, autolink: true, HTMLAttributes: { rel: "noopener noreferrer" } }),
            TextAlign.configure({ types: ["heading", "paragraph"] }),
            TextStyle,
            Color,
            Placeholder.configure({ placeholder }),
        ],
        content,
        editable: !readOnly,
        onUpdate: ({ editor }) => onChange?.(editor.getHTML()),
        editorProps: {
            attributes: {
                class: cn(
                    "prose prose-sm dark:prose-invert max-w-none p-3 focus:outline-none",
                    readOnly ? "cursor-default" : "cursor-text"
                ),
            },
        },
    })

    const setLink = () => {
        if (!editor) return
        const prev = editor.getAttributes("link").href as string | undefined
        const url = window.prompt("URL du lien", prev)
        if (url === null) return
        if (url === "") {
            editor.chain().focus().extendMarkRange("link").unsetLink().run()
            return
        }
        editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run()
    }

    if (!editor) return null

    return (
        <div className={cn("rounded-md border border-input bg-background", className)}>
            {!readOnly && (
                <div className="flex flex-wrap items-center gap-0.5 border-b border-input px-2 py-1">
                    <Toggle
                        size="sm"
                        pressed={editor.isActive("bold")}
                        onPressedChange={() => editor.chain().focus().toggleBold().run()}
                        aria-label="Gras"
                    >
                        <Bold className="size-4" />
                    </Toggle>
                    <Toggle
                        size="sm"
                        pressed={editor.isActive("italic")}
                        onPressedChange={() => editor.chain().focus().toggleItalic().run()}
                        aria-label="Italique"
                    >
                        <Italic className="size-4" />
                    </Toggle>
                    <Toggle
                        size="sm"
                        pressed={editor.isActive("underline")}
                        onPressedChange={() => editor.chain().focus().toggleUnderline().run()}
                        aria-label="Souligné"
                    >
                        <UnderlineIcon className="size-4" />
                    </Toggle>
                    <Toggle
                        size="sm"
                        pressed={editor.isActive("strike")}
                        onPressedChange={() => editor.chain().focus().toggleStrike().run()}
                        aria-label="Barré"
                    >
                        <Strikethrough className="size-4" />
                    </Toggle>

                    <Separator orientation="vertical" className="mx-1 h-5" />

                    <Toggle
                        size="sm"
                        pressed={editor.isActive({ textAlign: "left" })}
                        onPressedChange={() => editor.chain().focus().setTextAlign("left").run()}
                        aria-label="Gauche"
                    >
                        <AlignLeft className="size-4" />
                    </Toggle>
                    <Toggle
                        size="sm"
                        pressed={editor.isActive({ textAlign: "center" })}
                        onPressedChange={() => editor.chain().focus().setTextAlign("center").run()}
                        aria-label="Centre"
                    >
                        <AlignCenter className="size-4" />
                    </Toggle>
                    <Toggle
                        size="sm"
                        pressed={editor.isActive({ textAlign: "right" })}
                        onPressedChange={() => editor.chain().focus().setTextAlign("right").run()}
                        aria-label="Droite"
                    >
                        <AlignRight className="size-4" />
                    </Toggle>

                    <Separator orientation="vertical" className="mx-1 h-5" />

                    <Toggle
                        size="sm"
                        pressed={editor.isActive("bulletList")}
                        onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
                        aria-label="Liste"
                    >
                        <List className="size-4" />
                    </Toggle>
                    <Toggle
                        size="sm"
                        pressed={editor.isActive("orderedList")}
                        onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
                        aria-label="Liste numérotée"
                    >
                        <ListOrdered className="size-4" />
                    </Toggle>

                    <Separator orientation="vertical" className="mx-1 h-5" />

                    <Toggle
                        size="sm"
                        pressed={editor.isActive("heading", { level: 2 })}
                        onPressedChange={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                        aria-label="Titre"
                    >
                        <Type className="size-4" />
                    </Toggle>
                    <Toggle
                        size="sm"
                        pressed={editor.isActive("link")}
                        onPressedChange={setLink}
                        aria-label="Lien"
                    >
                        <Link2 className="size-4" />
                    </Toggle>

                    <Separator orientation="vertical" className="mx-1 h-5" />

                    <Toggle
                        size="sm"
                        pressed={false}
                        onPressedChange={() => editor.chain().focus().undo().run()}
                        disabled={!editor.can().undo()}
                        aria-label="Annuler"
                    >
                        <Undo className="size-4" />
                    </Toggle>
                    <Toggle
                        size="sm"
                        pressed={false}
                        onPressedChange={() => editor.chain().focus().redo().run()}
                        disabled={!editor.can().redo()}
                        aria-label="Rétablir"
                    >
                        <Redo className="size-4" />
                    </Toggle>
                </div>
            )}
            <EditorContent
                editor={editor}
                style={{ minHeight }}
                className="overflow-auto"
            />
        </div>
    )
}
