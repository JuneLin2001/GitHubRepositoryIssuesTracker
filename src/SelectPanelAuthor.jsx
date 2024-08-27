import { useState } from "react";
import { Button, SelectPanel } from "@primer/react";
import { TriangleDownIcon } from "@primer/octicons-react";

const SelectPanelAuthor = ({ authors = [], onSelect }) => {
  const [selected, setSelected] = useState(authors[0]);
  const [filter, setFilter] = useState("");
  const [open, setOpen] = useState(false);

  const filteredItems = [
    { text: "all", id: "all" },
    ...authors.map((author) => ({
      key: author,
      text: author,
      onAction: () => console.log(`Option ${author} selected`),
    })),
  ].filter((item) => item.text.toLowerCase().startsWith(filter.toLowerCase()));

  const handleSelectedChange = (selected) => {
    setSelected(selected);
    if (onSelect) {
      console.log(selected);
      console.log(selected.text);
      onSelect(selected.text);
    }
  };

  return (
    <>
      <SelectPanel
        title="Filter by label"
        renderAnchor={({
          children,
          "aria-labelledby": ariaLabelledBy,
          ...anchorProps
        }) => (
          <Button
            trailingAction={TriangleDownIcon}
            aria-labelledby={` ${ariaLabelledBy}`}
            {...anchorProps}
          >
            {children ?? "Select Labels"}
          </Button>
        )}
        placeholderText="Filter Labels"
        open={open}
        onOpenChange={setOpen}
        items={filteredItems}
        selected={selected}
        onSelectedChange={handleSelectedChange}
        onFilterChange={setFilter}
        showItemDividers={true}
        overlayProps={{
          width: "small",
          height: "auto",
        }}
      />
    </>
  );
};
export default SelectPanelAuthor;