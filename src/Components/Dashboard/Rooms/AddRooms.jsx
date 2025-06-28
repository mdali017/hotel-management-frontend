import Axios from "axios";
import { useForm } from "react-hook-form";
import { FetchUrls } from "../../Common/FetchUrls";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";
import TagsInput from "react-tagsinput";
import "react-tagsinput/react-tagsinput.css";
import axios from "axios";

const AddRooms = () => {
  const { register, handleSubmit, errors } = useForm();
  const [selectedMaxCapacity, setSelectedMaxCapacity] = useState([]);
  const [allRoomsData, setAllRoomsData] = useState([]);
  const [roomsName, setRoomsName] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState([]);

  const [facilitiesTags, setFacilitiesTags] = useState([]);
  const [roomNumbersTags, setRoomNumbersTags] = useState([]);
  // console.log(18);

  // filter by room name
  const filteredData = allRoomsData?.filter(
    (item) => item.roomname === selectedRoom
  );

  useEffect(() => {
    if (filteredData && filteredData.length > 0) {
      setFacilitiesTags(filteredData[0]?.facilities || []);
      setRoomNumbersTags(filteredData[0]?.roomnumber || []);
    }
  }, [selectedRoom, filteredData]);

  // get all room
  useEffect(() => {
    Axios(FetchUrls("rooms/allrooms")).then((res) => {
      setAllRoomsData(res.data.data);
      const allRooms = res?.data?.data?.map((room) => room.roomname);
      setRoomsName(allRooms);
      
    });
  }, []);

  const onSubmit = async (data) => {

    const formData = new FormData();
    for(const key in data){
      formData.append(key, data[key]);
    }

    console.log(data)

    formData.append("images", data.images[0]);
    console.log(data.avater[0].name, 53)
    // formData.append(data.facilities)
    data.facilities = facilitiesTags;
    data.roomnumber = roomNumbersTags;

    console.log(formData, 57)

    // try {
    //   await axios.post('http://localhost:5000/api/rooms/add-rooms', formData)
    //   .then(res => {
    //     console.log(res.data.data, 54)
    //   })
    // } catch (error) {
    //   console.log(error)
    // }

    // console.log(data);

    

    console.log("Form Data:", data);

    // try {
    //   Axios.post(FetchUrls("rooms/add-rooms", formData), data).then((res) => {
    //     console.log(res);
    //     if (res.status === 200) {
    //       Swal.fire({
    //         title: "Success!",
    //         text: "Room Added Successfully!",
    //         icon: "success",
    //       });
    //     } else {
    //       Swal.fire({
    //         title: "Error!",
    //         text: "Room Not Added!",
    //         icon: "error",
    //       });
    //     }
    //   });
    // } catch (error) {
    //   console.log(error);
    // }
  };

  const bookingsFormData = [
    {
      id: 1,
      label: "Room Name",
      // type: "select",
      type: "text",
      placeholder: "Enter Room Name",
      name: "roomname",
      // values: roomsName,
      // optionValue: "Select Your Room",
    },

    {
      id: 2,
      label: "Bed Type",
      type: "text",
      placeholder: filteredData[0]?.bedtype || "Bed Type",
      name: "bedtype",
    },
    {
      id: 3,
      label: "Cost",
      type: "number",
      placeholder: filteredData[0]?.cost || "cost",
      name: "cost",
    },
    {
      id: 4,
      label: "Facilities",
      type: "tags",
      placeholder: "Facilities",
      name: "facilities",
    },
    {
      id: 5,
      label: "Room Number",
      type: "tags",
      placeholder: "Room Number",
      name: "roomnumber",
    },
    {
      id: 6,
      label: "Max Capacity",
      type: "number",
      placeholder: "Max Capacity",
      name: "maxcapacity",
    },
    {
      id: 7,
      label: "Image",
      type: "file",
      placeholder: "photo name",
      name: "images",
    },
    // {
    //   id: 7,
    //   label: "CheckIn",
    //   type: "number",
    //   placeholder: "Roomcost",
    //   name: "roomcost",
    // },
    // {
    //   id: 9,
    //   label: "Description",
    //   type: "text",
    //   placeholder: "Description",
    //   name: "description",
    // },
    
  ];
  return (
    <>
      <section className="font-[raleway]">
        <h1 className="text-2xl font-bold pb-5">Add Rooms</h1>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className=" border p-3 rounded-lg shadow-lg"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {bookingsFormData?.map((data, index) => {
              return (
                <div key={index}>
                  <label className="mb-3 block">{data?.label}</label>
                  {data.type === "select" ? (
                    <>
                      <select
                        {...register(`${data?.name}`, { required: true })}
                        name={data.name}
                        onChange={(e) => {
                          setSelectedRoom(e.target.value);
                        }}
                        value={selectedRoom}
                        className="w-full rounded-lg border-[1.5px] bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary"
                      >
                        <option value="" disabled>
                          {data.optionValue}
                        </option>
                        {data?.values?.map((value, index) => (
                          <option key={index} value={value}>
                            {value}
                          </option>
                        ))}
                      </select>
                    </>
                  ) : data.type === "tags" ? (
                    <TagsInput
                    value={
                      data.name === "facilities" ? facilitiesTags : roomNumbersTags
                    }
                    onChange={(tags) => {
                      data.name === "facilities"
                        ? setFacilitiesTags(tags)
                        : setRoomNumbersTags(tags);
                    }}
                    addKeys={[9, 13, 32, 188]}
                    removeKeys={[8]}
                    removeTag={(index) => {
                      const newTags =
                        data.name === "facilities"
                          ? [...facilitiesTags]
                          : [...roomNumbersTags];
                      newTags.splice(index, 1);
                      data.name === "facilities"
                        ? setFacilitiesTags(newTags)
                        : setRoomNumbersTags(newTags);
                    }}
                  />
                  ) : data.type === "file" ? (
                    <input
                    multiple
                      {...register(`${data?.name}`, {
                        required: `${data?.label} is Required`,
                      })}
                      type={data.type}
                      placeholder={data.placeholder}
                      className="border py-3 px-5 rounded-lg focus:border-primary w-full text-sm file:mr-4 file:rounded-md file:border-0 file:bg-orange-500 file:py-2 file:px-4 file:text-sm file:font-semibold file:text-white hover:file:bg-orange-700 focus:outline-none hover:cursor-pointer"
                    />
                  ) : (
                    <input
                      multiple
                      {...register(`${data?.name || data.placeholder}`, {
                        required: `${data?.label} is Required`,
                      })}
                      type={data.type}
                      placeholder={data.placeholder}
                      className="w-full rounded-lg border-[1.5px] bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary"
                    />
                  )}
                </div>
              );
            })}
          </div>
          <button
            type="submit"
            onSubmit={handleSubmit}
            className="flex uppercase text-white justify-center rounded bg-primary p-3 font-bold text-gray mt-6"
          >
            Add Room
          </button>
        </form>
      </section>

    </>
  );
};

export default AddRooms;
