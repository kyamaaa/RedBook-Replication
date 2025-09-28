import React from "react";

const Bottom: React.FC = () => {
  return (
    <div className="bg-white shadow-md flex items-center justify-around py-3 px-6 fixed bottom-0 left-0 right-0">
      <button className="flex items-center gap-2">
        <svg
          className="w-5 h-5 text-black"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M3 12l2-2m0 0l7-7 7 7M3 12h18M3 16h18M3 20h18"
          ></path>
        </svg>
        <span className="text-base text-black hidden sm:block">发现</span>
      </button>

      <button className="flex items-center gap-2">
        <svg
          className="w-5 h-5 text-gray4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
          ></path>
        </svg>
        <span className="text-base text-gray4 hidden sm:block">发布</span>
      </button>

      <button className="flex items-center gap-2">
        <svg
          className="w-5 h-5 text-gray4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          ></path>
        </svg>
        <span className="text-base text-gray4 hidden sm:block">通知</span>
      </button>

      <button className="flex items-center gap-2">
        <svg
          className="w-5 h-5 text-gray4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          ></path>
        </svg>
        <span className="text-base text-gray4 hidden sm:block">我</span>
      </button>
    </div>
  );
};

export default Bottom;
