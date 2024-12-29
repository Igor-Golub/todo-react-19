import { ChangeEvent, useMemo, useState } from "react";
import debounce from "debounce";

interface Props {
  onSearchChanged: (value: string) => void;
}

export const TasksFiltersPanel = ({ onSearchChanged }: Props) => {
  const [searchValue, setSearchValue] = useState<string>("");

  const debouncedOnSearchChanged = useMemo(
    () => debounce((value: string) => onSearchChanged(value), 300),
    [onSearchChanged],
  );

  const handleChangeSearch = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    setSearchValue(value);
    debouncedOnSearchChanged(value);
  };

  return (
    <div className="flex gap-2 w-full">
      <input
        type="search"
        value={searchValue}
        placeholder="Search.."
        onChange={handleChangeSearch}
        className="border p-2 rounded w-full"
      />
    </div>
  );
};
