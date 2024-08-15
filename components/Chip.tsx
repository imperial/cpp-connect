import styles from "./chip.module.scss"

import { Flex, IconButton, Text } from "@radix-ui/themes"
import { BsX } from "react-icons/bs"

interface BaseChipProps {
  label: string
}

interface NonDeletableChipProps extends BaseChipProps {
  deletable?: false
}

interface DeletableChipProps extends BaseChipProps {
  deletable: true
  onDelete: () => void
}

type ChipProps = NonDeletableChipProps | DeletableChipProps

const Chip = (props: ChipProps) => {
  const { label, deletable } = props

  return (
    <Flex className={styles.chip} gap="2">
      <Text>{label}</Text>
      {deletable && (
        <IconButton type="button" color="gray" size="1" className={styles.deleteButton} onClick={props.onDelete}>
          <BsX />
        </IconButton>
      )}
    </Flex>
  )
}

export default Chip
