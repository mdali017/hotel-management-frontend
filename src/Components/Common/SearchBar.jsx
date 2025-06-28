import { FaSearch } from "react-icons/fa";

const SearchBar = ({ onSearchChange }) => {
  return (
    <div className="flex justify-center items-center">
      <input
        //   onChange={(e) => onSearchChange(e.target.value)}
        className="border py-3 px-5 rounded-lg focus:border-primary w-full text-sm file:mr-4 file:rounded-md file:border-0 file:bg-orange-500 file:py-2 file:px-4 file:text-sm file:font-semibold file:text-white hover:file:bg-orange-700 focus:outline-none hover:cursor-pointer"
        type="text"
        placeholder="Search Item.."
      />
      <FaSearch onClick={(e) => onSearchChange(e.target.value)} className="-ml-7 text-gray-400" />
    </div>
  );
};

export default SearchBar;
