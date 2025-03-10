import { Input } from "antd";
import { BiSearch } from "react-icons/bi";
import useSearchStore from "../../../store/useSearch";

export default function Search() {
  const { searchQuery, setSearchQuery } = useSearchStore();
  return (
    <Input
      size="middle"
      placeholder="Search..."
      prefix={<BiSearch size={18} color="gray" />}
      style={{ width: 300 }}
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
    />
  );
}
