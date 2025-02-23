import React, { useEffect, useState, useRef } from "react";
import SelectItem, { SelectItemProps } from "./SelectItem";
import ArrowIcon from "./svg/ArrowIcon";

interface SelectProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "size" | "onChange"> {
  items: SelectItemProps[];
  selectedValues?: string[];
  label?: string;
  multiple?: boolean;
  onValueChange?: (selectedItem: SelectItemProps[] | []) => void;
}

export const Select = ({
  items,
  selectedValues,
  label = "Select an option",
  className,
  multiple = false,
  onValueChange,
  ...props
}: SelectProps) => {

  const [selected, setSelected] = useState<SelectItemProps[]>([]);

  const [open, setOpen] = useState<boolean>(false);

  const itemsToRender = useRef<SelectItemProps[] | []>(items);

  useEffect(() => {
    itemsToRender.current = items.filter((item: SelectItemProps) => {
      if (selectedValues?.includes(item.value)) return [item, item.selected = true]
      if (!selectedValues?.includes(item.value)) return [item]
    });
  }, [selectedValues, items])


  useEffect(()=>{
    setSelected(itemsToRender.current.filter((item) => item.selected === true))
  },[])

  useEffect(() => {
    selected.length == 0 ? setOpen(false) : null;
    onValueChange && onValueChange(selected ?? []);
  }, [onValueChange, selected]);


  const handleSelectItemClick = (item: SelectItemProps) => {

    if (selected.length > 0 && multiple) {
      if (selected.some((it) => it.value == item.value)) {
        setSelected(selected.filter((it) => it.value !== item.value));
        return;
      }
      setSelected([...selected, item]);
      return;
    }

    if(selected != null && selected.some((it) => it.value == item.value) && !multiple){
      setSelected([]);
      setOpen(false);
      return;
    }
    setSelected([item]);
    setOpen(false);
    return;
  };

  return (
    <div
      {...props}
      className={`relative bg-[#f4f4f5] select-none rounded-md transition-all duration-200 ${className} `}
    >
      <div
        onClick={() => setOpen(!open)}
        className={`h-full rounded-md cursor-pointer flex flex-col justify-center `}
        role="button"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <p
          className={`absolute left-3 transition-all duration-300 ${selected.length > 0 || open
            ? "top-0.5 text-sm text-[#8c8c8c]"
            : "top-1/2 -translate-y-1/2 text-md text-gray-500"
            }`}
        >
          {label}
        </p>

        <ArrowIcon open={open} />

        {selected.length > 0 && (
          <p className="absolute top-6 left-3 text-sm text-gray-800">
            {
              selected.length > 1
                ? `${selected.length} items selected`
                : selected[0].label
            }
          </p>
        )}
      </div>
      {open && (
        <ul
          className={`absolute w-full max-h-42 ${items.length > 4 && "overflow-y-scroll"
            } scroll-smooth !mt-1 flex flex-col gap-1 !p-1 bg-white rounded-md shadow-lg`}
          role="listbox"
          style={{
            msOverflowStyle: "none",
            scrollbarWidth: "none",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {itemsToRender.current?.map((item) => (
            <SelectItem
              className={`${item.disabled ? "opacity-50" : ""}`}
              key={item.value}
              disabled={item.disabled}
              value={item.value}
              label={item.label}
              selectedItem={selected || []}
              onClick={() => handleSelectItemClick(item)}
            />
          ))}
        </ul>
      )}
    </div>
  );
};

export default Select;
