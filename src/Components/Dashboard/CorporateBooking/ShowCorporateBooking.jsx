import Tooltip from "@mui/material/Tooltip";
import { useState } from "react";

const ShowCorporateBooking = ({ corporateBooking }) => {
  const [hoverData, setHoverData] = useState(null);
  // console.log(hoverData);
  const details = () => {
    return (
      <div className="text-[15px] tracking-wider">
        <h1 className="text-lg">Name : {hoverData?.customerName}</h1>
        <p>Organization : {hoverData?.organizationName}</p>
        <p>Phone : {hoverData?.customerNumber}</p>
        <p>Booking Hall : {hoverData?.halls}</p>
        <p>Total Amount : {hoverData?.price}</p>
        <p>Paid : {hoverData?.paidAmount} Taka</p>
        <p>Due : {hoverData?.dueAmount} Taka</p>
      </div>
    );
  };
  return (
    <div className="mt-3">
      <div>
        <h1 className="font-[raleway] font-extrabold text-accent text-xl">Corporate Bookings</h1>
        <div className="mt-2 flex gap-3 items-center flex-wrap">
          {corporateBooking.length > 0 ? (
            <>
              {corporateBooking?.map((item) => {
                return (
                  <div key={item?._id}>
                    <Tooltip title={details()} arrow>
                      <button
                        onMouseOver={() => {
                          const findData = corporateBooking.find((data) => data._id === item._id);
                          setHoverData(findData);
                        }}
                        className="border p-2 rounded-lg font-semibold bg-green-100 hover:bg-green-200 duration-500"
                      >
                        {item?.halls}
                      </button>
                    </Tooltip>
                  </div>
                );
              })}
            </>
          ) : (
            <h1 className="text-red-500 font-semibold">No Corporate Booking Found!</h1>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShowCorporateBooking;
