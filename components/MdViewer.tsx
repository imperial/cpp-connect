import styles from "./md-viewer.module.scss"

import React from "react"
import Markdown from "react-markdown"
import rehypeRaw from "rehype-raw"
import remarkBreaks from "remark-breaks"
import remarkGfm from "remark-gfm"

const MdViewer = ({ markdown, tos = false }: { markdown: string; tos?: boolean }) => {
  return (
    <Markdown
      className={tos ? styles.tosViewer : styles.markdownViewer}
      remarkPlugins={[remarkGfm, remarkBreaks]}
      rehypePlugins={[rehypeRaw]}
    >
      {markdown}
    </Markdown>
  )
}

export default MdViewer
