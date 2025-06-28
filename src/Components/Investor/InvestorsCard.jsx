import React from "react";

const InvestorsCard = ({ item }) => {
  return (
    <div>
      <div className="group border relative items-center justify-center overflow-hidden cursor-pointer hover:shadow-sm hover:shadow-black/20">
        <div className="h-[271px] md:h-96 w-full">
          <img
            className="w-full h-full object-cover group-hover:scale-125 duration-500"
            src={`https://backend.hotelorioninternational.com/${item?.image}`}
            alt=""
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via transparent to-black group-hover:translate-y-0 "></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center px-9 text-center lg:translate-y-[55%] group-hover:translate-y-0 group-hover:duration-1000 ">
          {/* <h1 className="text-xl font-semibold text-white">{item.name}</h1> */}
          <p className="text-md my-4 italic text-white mb-3 lg:opacity-0 group-hover:opacity-100 duration-300">
            {item?.title}
          </p>
        </div>
      </div>
    </div>
  );
};

export default InvestorsCard;
