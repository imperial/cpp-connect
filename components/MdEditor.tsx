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
  Separator,
  UndoRedo,
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  tablePlugin,
  thematicBreakPlugin,
  toolbarPlugin,
} from "@mdxeditor/editor"
import { FC } from "react"

interface EditorProps {
  markdown: string
  editorRef?: React.MutableRefObject<MDXEditorMethods | null>
  onChange: (markdown: string) => void
}

/**
 * Extend this Component further with the necessary plugins or props you need.
 * proxying the ref is necessary. Next.js dynamically imported components don't support refs.
 */
const MdEditor: FC<EditorProps> = ({ markdown, editorRef, onChange }) => {
  return (
    <MDXEditor
      plugins={[
        toolbarPlugin({
          toolbarContents: () => (
            <>
              {/* HACK: avoid unintented focus on the first button on hover*/}
              <button disabled style={{ display: "none" }}></button>
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
      ref={editorRef}
      onChange={onChange}
    />
  )
}

export default MdEditor
