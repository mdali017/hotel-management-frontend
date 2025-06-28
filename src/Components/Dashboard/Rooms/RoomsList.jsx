import Axios from "axios";
import { useEffect, useState } from "react";
import { FetchUrls } from "../../Common/FetchUrls";

const RoomsList = () => {
  const [roomData, setRoomData] = useState([]);
  useEffect(() => {
    try {
      Axios.get(FetchUrls("rooms")).then((res) => {
        console.log(res);
        setRoomData(res.data.data);
      });
    } catch (error) {
      console.log(error);
    }
  }, []);
  return (
    <div className="w-full h-full font-[raleway]">
      <h1 className="text-2xl bold mb-5">Rooms</h1>
      <div className="max-w-full mx-5">
        <table className="w-full mt-5 bg-gray-100">
          <thead className='className="border-solid border border-grey-300 p-3'>
            <tr>
              <th className="px-4">Description</th>
              <th className="px-4">Room Types</th>
              <th className="px-4">Base Price</th>
              <th className="px-4">Bed Options</th>
              <th className="px-4">Sleep Count</th>
              <th className="px-4">Tags</th>
              <th className="px-4">Action</th>
            </tr>
          </thead>
          {roomData.map((item) => {
            return (
              <tbody className="border border-grey-300" key={item._id}>
                <tr className="hover:bg-gray-200 duration-500">
                  <td className="py-3 px-4">
                    <p className="min-w-max text-center">{item?.descriptions}</p>
                  </td>
                  <td className="py-3 px-4">
                    <p className="min-w-max text-center">{item?.types}</p>
                  </td>
                  <td className="py-3 px-4">
                    <p className="min-w-max text-center">{item?.baseprice}</p>
                  </td>
                  <td className="py-3 px-4">
                    <p className="min-w-max text-center">{item?.bedoptions}</p>
                  </td>
                  <td className="py-3 px-4">
                    <p className="min-w-max text-center">{item?.sleepcount}</p>
                  </td>
                  <td className="py-3 px-4">
                    <p className="min-w-max text-center">{item?.tags}</p>
                  </td>

                  <td className="py-3 px-4">
                    <p className="min-w-max text-center">
                      <button>...</button>
                    </p>
                  </td>
                </tr>
              </tbody>
            );
          })}
        </table>
      </div>
    </div>
  );
};

export default RoomsList;
