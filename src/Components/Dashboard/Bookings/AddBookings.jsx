import Axios from "axios";
import { useForm } from "react-hook-form";
import { FetchUrls } from "../../Common/FetchUrls";
import Swal from "sweetalert2";

const AddBookings = () => {
  const { register, handleSubmit, errors } = useForm();
  console.log(errors);

  const onSubmit = async (data) => {
    console.log(data);
    // const formData = new FormData();

    // for (const index in data) {
    //   formData.append(index, data[index]);
    // }
    // try {
    //   Axios.post(FetchUrls("bookings/add-bookings"), formData).then((res) => {
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
      label: "Bookings (Start Date)",
      type: "date",
      placeholder: "Bookingsstart Date",
      name: "bookingsstartDate",
    },
    {
      id: 2,
      label: "Bookings (Ends Date)",
      type: "date",
      placeholder: "Bookingsends Date",
      name: "bookingsendsDate",
    },
    {
      id: 3,
      label: "Select Your Room",
      type: "select",
      name: "selectroom",
      values: ["Delux Room", "Single Room", "Double Room", "Family Room"],
    },
    {
      id: 4,
      label: "Guest's Name",
      type: "text",
      placeholder: "Guest's Name",
      name: "customername",
    },
    {
      id: 5,
      label: "Guest's Phone Number",
      type: "number",
      placeholder: "Guest's Phone Number",
      name: "customerphone",
    },
    {
      id: 6,
      label: "Guest's NID",
      type: "file",
      placeholder: "Guest's NID",
      name: "customernid",
    },
    {
      id: 7,
      label: "Select Your Payment",
      type: "select",
      placeholder: "Payment",
      name: "payment",
      values: ["Paid", "Due"],
    },
  ];
  return (
    <section>
      <form onSubmit={handleSubmit(onSubmit)} className="pb-10 font-[raleway]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {bookingsFormData?.map((data, index) => {
            return (
              <div key={index}>
                <label className="mb-3 block">{data?.label}</label>
                {data.type === "select" ? (
                  <select
                    {...register(`${data?.name}`, { required: true })}
                    name={data.name}
                    className="w-full rounded-lg border-[1.5px] bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary"
                  >
                    <option value="">{data?.label}</option>
                    {data.values.map((value, index) => (
                      <option key={index} value={value}>
                        {value}
                      </option>
                    ))}
                  </select>
                ) : data.type === "file" ? (
                  <>
                    <input
                      {...register(`${data?.name}`)}
                      type={data.type}
                      placeholder={data.placeholder}
                      className="border py-3 px-5 rounded-lg focus:border-primary w-full text-sm file:mr-4 file:rounded-md file:border-0 file:bg-orange-500 file:py-2 file:px-4 file:text-sm file:font-semibold file:text-white hover:file:bg-orange-700 focus:outline-none hover:cursor-pointer"
                    />
                  </>
                ) : (
                  <input
                    {...register(`${data?.name}`, { required: `${data?.label} is Required` })}
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
          className="flex uppercase text-white justify-center rounded bg-primary p-3 font-bold text-gray mt-5"
        >
          Add Bookings
        </button>
      </form>
    </section>
  );
};

export default AddBookings;
