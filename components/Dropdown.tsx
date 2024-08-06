import { Select } from "@radix-ui/themes"
import React, { ComponentProps } from "react"

interface DropdownProps {
  defaultValue: string
  onValueChange: (value: string) => void
  /** Item then value */
  items: { item: string; value: string }[]
  variant?: ComponentProps<typeof Select.Trigger>["variant"]
  color?: ComponentProps<typeof Select.Trigger>["color"]
  triggerProps?: ComponentProps<typeof Select.Trigger>
}

export const Dropdown: React.FC<DropdownProps> = ({
  defaultValue,
  onValueChange,
  items,
  variant,
  color,
  triggerProps,
}) => {
  return (
    <Select.Root defaultValue={defaultValue} onValueChange={onValueChange}>
      <Select.Trigger variant={variant} color={color} {...triggerProps} />
      <Select.Content>
        <Select.Group>
          {items.map(({ item, value }, index) => (
            <Select.Item key={index} value={value}>
              {item}
            </Select.Item>
          ))}
        </Select.Group>
      </Select.Content>
    </Select.Root>
  )
}
