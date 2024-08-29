import { Button, Text } from "@radix-ui/themes"
import { useState } from "react"

/**
 * Form input which allows the user to upload a file.
 * @param name - The name of the file input for the form.
 * @param header - The header of the file input to show on the page.
 * @param value - The path to the current file, if any.
 */
const FileInput = ({ name, header, value }: { name: string; header: string; value?: string | null }) => {
  const [file, setFile] = useState(value || "")

  return (
    <>
      <Text as="div" size="2" weight="bold">
        {header}
      </Text>
      <Button asChild>
        <label>
          <input
            type="file"
            hidden
            name={name}
            onChange={e => {
              const file = e.target.files?.[0]
              if (file) {
                setFile(file.name)
              }
            }}
          />
          {file || "Upload file"}
        </label>
      </Button>
    </>
  )
}

export default FileInput
