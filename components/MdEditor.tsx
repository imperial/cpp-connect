"use client"

import {
  BlockTypeSelect,
  BoldItalicUnderlineToggles,
  CodeToggle,
  InsertTable,
  InsertThematicBreak,
  ListsToggle,
  MDXEditor,
  MDXEditorMethods,
  MDXEditorProps,
  Separator,
  UndoRedo,
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  tablePlugin,
  thematicBreakPlugin,
  toolbarPlugin,
} from "@mdxeditor/editor"
import "@mdxeditor/editor/style.css"
import { Card, Flex } from "@radix-ui/themes"
import { FC, ForwardedRef } from "react"

interface EditorProps {
  markdown: string
  editorRef?: React.MutableRefObject<MDXEditorMethods | null>
}

/**
 * Extend this Component further with the necessary plugins or props you need.
 * proxying the ref is necessary. Next.js dynamically imported components don't support refs.
 */
const MdEditor = ({ markdown }: { markdown: string }) => {
  return (
    <MDXEditor
      plugins={[
        toolbarPlugin({
          toolbarContents: () => (
            <>
              <UndoRedo />
              <BoldItalicUnderlineToggles />
              <BlockTypeSelect />
              <CodeToggle />
              <InsertTable />
              <InsertThematicBreak />
              <Separator />
              <ListsToggle />
            </>
          ),
        }),
        tablePlugin(),
        thematicBreakPlugin(),
        listsPlugin(),
        headingsPlugin(),
        quotePlugin(),
      ]}
      markdown={markdown}
    />
  )
}

export default MdEditor
