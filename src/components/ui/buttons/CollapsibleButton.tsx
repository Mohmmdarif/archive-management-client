import { CgMenuLeftAlt } from "react-icons/cg";

export default function CollapsibleButton() {
  return (
    <button
      type="button"
      className="flex justify-center items-center bg-white rounded-r-lg w-11 h-11 px-0.5"
    >
      <CgMenuLeftAlt className="w-10 h-6" color="black" />
    </button>
  );
}
