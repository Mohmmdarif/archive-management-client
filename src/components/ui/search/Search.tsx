import { Input } from "antd";
import { BiSearch } from "react-icons/bi";
import useSearchStore from "../../../store/useSearch";

interface SearchProps {
  children?: React.ReactNode;
}

export default function Search({ children }: SearchProps) {
  const { searchQuery, setSearchQuery } = useSearchStore();
  return (
    <div className="flex flex-col w-full">
      <Input
        size="middle"
        placeholder="Pencarian..."
        prefix={<BiSearch size={18} color="gray" />}
        style={{ width: "auto", maxWidth: 300 }}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <div className="mt-1 text-xs text-gray-400 w-full md:w-2/3">
        {children}
      </div>
    </div>
  );
}
