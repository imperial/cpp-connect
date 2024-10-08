import { FileViewer } from "@/components/FileViewer"

import { Button, Flex, Text } from "@radix-ui/themes"
import { useState } from "react"
import { BsCloudUploadFill, BsSearch } from "react-icons/bs"

/**
 * Form input which allows the user to upload a file.
 * @param name - The name of the file input for the form.
 * @param header - The header of the file input to show on the page.
 * @param value - The path to the current file, if any.
 */
const FileInput = ({ name, header, value }: { name: string; header: string; value?: string | null }) => {
  const [filePath, setFilePath] = useState(value ? `/api/uploads/${value}` : "")
  const [file, setFile] = useState<File | null>(null)

  return (
    <>
      <Text as="div" size="2" weight="bold">
        {header}
      </Text>
      <Flex gap="2">
        <Button asChild style={{ flexGrow: 1, cursor: "pointer" }}>
          <label>
            <input
              type="file"
              hidden
              name={name}
              onChange={e => {
                const file = e.target.files?.[0]
                if (file) {
                  setFile(file)
                  setFilePath(file.name)
                }
              }}
            />

            <BsCloudUploadFill size="1.2em" />
            {filePath ? filePath.split("/").at(-1) : "Upload file"}
          </label>
        </Button>
        {filePath && ( // If a file is already uploaded, and hasn't been changed, show a view button
          <FileViewer fileUrl={file ? URL.createObjectURL(file) : filePath} title={header}>
            <Button variant="outline" style={{ flexGrow: 0, cursor: "pointer" }}>
              <BsSearch />
              View
            </Button>
          </FileViewer>
        )}
      </Flex>
    </>
  )
}

export default FileInput
