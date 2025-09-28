const More: React.FC = () => {
  return (
    <div>
      <button className="flex w-48 py-3 items-center text-black font-bold hover:bg-gray rounded-full absolute bottom-1">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 mr-3 ml-3"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
        更多
      </button>
    </div>
  );
};
export default More;
