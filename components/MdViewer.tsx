import styles from "./md-viewer.module.scss"

import React from "react"
import Markdown from "react-markdown"
import rehypeRaw from "rehype-raw"
import remarkBreaks from "remark-breaks"
import remarkGfm from "remark-gfm"

const MdViewer = ({ markdown }: { markdown: string }) => {
  return (
    <Markdown className={styles.markdownViewer} remarkPlugins={[remarkGfm, remarkBreaks]} rehypePlugins={[rehypeRaw]}>
      {markdown}
    </Markdown>
  )
}

export default MdViewer
