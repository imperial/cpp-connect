"use client"

import {
  BlockTypeSelect,
  BoldItalicUnderlineToggles,
  InsertTable,
  InsertThematicBreak,
  ListsToggle,
  MDXEditor,
  MDXEditorMethods,
  Separator,
  UndoRedo,
  headingsPlugin,
  listsPlugin,
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
            <div style={{ display: "flex", flexWrap: "wrap" }}>
              {/* HACK: avoid unintended focus on the first button on hover*/}
              <button disabled style={{ display: "none" }}></button>
              <UndoRedo />
              <Separator />
              <BoldItalicUnderlineToggles />
              <InsertTable />
              <InsertThematicBreak />
              <Separator />
              <ListsToggle />
              <BlockTypeSelect />
            </div>
          ),
        }),
        tablePlugin(),
        thematicBreakPlugin(),
        listsPlugin(),
        headingsPlugin(),
      ]}
      markdown={markdown}
      ref={editorRef}
      onChange={onChange}
    />
  )
}

export default MdEditor
