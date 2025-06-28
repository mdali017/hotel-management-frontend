import React, { useState } from "react";
import Modal from "../../Common/Modal";
import { useForm } from "react-hook-form";
import Axios from "axios";
import { FetchUrls } from "../../Common/FetchUrls";
import Swal from "sweetalert2";

const DaylongPackage = () => {
  const [daylongModal, setshowDaylongModal] = useState(false);
  const formattedDate = new Date().toISOString().slice(0, 10);
  const [payment, setpayment] = useState(null);

  const { register, handleSubmit, reset } = useForm();

  const [adult, setAdult] = useState(0);
  const [adultPrice, setAdultPrice] = useState(0);
  const [children, setChildren] = useState(0);
  const [childrenPrice, setChildrenPrice] = useState(0);
  const [driver, setdriver] = useState(0);
  const [driverPrice, setdriverPrice] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [flatDiscount, setFlatDiscount] = useState(0);
  const [previousDate, setPreviousDate] = useState(null);

  const discountvalue = () => {
    const value = adult * adultPrice + children * childrenPrice + driver * driverPrice;
    const discountAmount = (value * discount) / 100;
    const discountedAmount = value - flatDiscount - discountAmount;
    return Math.ceil(discountedAmount);
  };

  const ondaylongsubmit = (data) => {
    const daylongData = {
      organizationName: data.organizationName,
      bookingDate: data.selectdate,
      previousDate: previousDate,
      customerName: data.customerName,
      customerNumber: data.customerNumber,
      authentication: data.authentication,
      authenticationNumber: data.authenticationNumber,
      adult: adult,
      adultPrice: adult * adultPrice,
      children: children,
      childrenPrice: children * childrenPrice,
      driver: driver,
      driverPrice: driver * driverPrice,
      percentagediscount: data.percentagediscount,
      flatDiscount: data.flatDiscount,
      // paymentmethod: data.paymentmethod,
      // transactionId: data.transactionId || "",
      // checkNumber: data.checkNumber || "",
      payment: {
        paymentmethod: data.paymentmethod,
        payNumber: data.payNumber || "",
      },
      paidAmount: data.paidAmount,
      dueAmount: discountvalue() - data.paidAmount,
      bookedFrom: "Daylong Package",
    };
    try {
      Axios.post(FetchUrls("daylong/createdaylong"), daylongData).then((res) => {
        if (res.status === 200) {
          Swal.fire({
            title: "Success!",
            text: "Added Successfully!",
            icon: "success",
          }).then(() => {
            setshowDaylongModal(false);
            reset();
          });
        } else {
          Swal.fire({
            title: "Error!",
            text: "Something Went Wrong!",
            icon: "error",
          });
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  const daylongFormData = [
    {
      label: "Organization Name",
      type: "text",
      placeholder: "Organization Name",
      name: "organizationName",
      required: false,
    },
    {
      label: "Guest's Name",
      type: "text",
      placeholder: "Guest's Name",
      name: "customerName",
      required: true,
    },
    {
      label: "Phone Number",
      type: "number",
      placeholder: "Phone Number",
      name: "customerNumber",
      required: true,
    },
    {
      label: "Select Authentication",
      type: "select",
      placeholder: "Select",
      name: "authentication",
      values: ["NID", "Passport", "Driving Licence number"],
      required: false,
    },
    {
      label: "Authentication Number",
      type: "text",
      placeholder: "Authentication Number",
      name: "authenticationNumber",
      required: false,
    },
    {
      label: "Date",
      type: "date",
      placeholder: "Date",
      name: "selectdate",
      onchange: (e) => {
        const selectedDate = new Date(e.target.value);
        const previousDate = new Date(selectedDate);
        previousDate.setDate(selectedDate.getDate() - 1);
        const previousDateString = previousDate.toISOString().split("T")[0];
        setPreviousDate(previousDateString);
      },
      required: true,
    },
    {
      label: "No of Adults",
      type: "number",
      placeholder: "No of Adults",
      name: "adult",
      onchange: (e) => setAdult(e.target.value),
      required: false,
    },
    {
      label: "Adult Price",
      type: "number",
      placeholder: "Adult Price",
      name: "adultprice",
      onchange: (e) => setAdultPrice(e.target.value),
      required: false,
    },
    {
      label: "No of Children 4-11",
      type: "number",
      placeholder: "No of Children 4-11",
      name: "children",
      onchange: (e) => setChildren(e.target.value),
      required: false,
    },
    {
      label: "Children Price (4-11)",
      type: "number",
      placeholder: "Children Price (4-11)",
      name: "childrenprice",
      onchange: (e) => setChildrenPrice(e.target.value),
      required: false,
    },
    {
      label: "ECO Package",
      type: "number",
      placeholder: "ECO Package",
      name: "driver",
      onchange: (e) => setdriver(e.target.value),
      required: false,
    },
    {
      label: "ECO Package Price",
      type: "number",
      placeholder: "ECO Package Price",
      name: "driverprice",
      onchange: (e) => setdriverPrice(e.target.value),
      required: false,
    },
    {
      label: "Total Person",
      type: "number",
      placeholder: "Total Person",
      name: "totalPerson",
      value: Number(adult) + Number(children) + Number(driver),
      read: true,
      required: false,
    },
    {
      label: "Discount",
      // type: "number",
      placeholder: "Discount",
      name: "discount",
      onchange: (e) => setDiscount(Number(e.target.value)),
      onflatchange: (e) => setFlatDiscount(Number(e.target.value)),
      required: false,
    },
    {
      label: "Payment Method",
      placeholder: "Payment Method",
      name: "paymentmethod",
      values: ["Cash", "Bkash", "Check", "City Bank", "Prime Bank"],
      onchange: (e) => setpayment(e.target.value),
      required: false,
    },
    {
      label: `Paid Amount (${discountvalue()})`,
      type: "number",
      placeholder: "Paid Amount",
      name: "paidAmount",
      required: false,
    },
    {
      label: "Remarks",
      type: "text",
      placeholder: "Remarks",
      name: "remarks",
      required: false,
    },
  ];

  const handleKeyCheck = (e) => {
    const isAllowedKey =
      (e.key >= "0" && e.key <= "9") ||
      e.key === "ArrowLeft" ||
      e.key === "ArrowRight" ||
      e.key === "Backspace" ||
      e.key === "Delete";

    if (!isAllowedKey) {
      e.preventDefault();
    }

    return isAllowedKey;
  };
  return (
    <section>
      {/* <div className="bg-secondary bg-opacity-25 p-2 text-center rounded-lg border">
        <h1 className="text-lg font-bold">Day Long Package</h1>
        <button
          onClick={() => {
            setshowDaylongModal(true);
          }}
          className="bg-secondary text-sm p-2 text-white rounded-md hover:bg-accent duration-300 mt-2"
        >
          Book Now
        </button>
      </div> */}
      <Modal isVisible={daylongModal} onClose={() => setshowDaylongModal(false)}>
        <section className="p-5 relative">
          <h1 className="text-2xl font-bold pb-8">Add Package</h1>
          <button
            className=" text-red-500 font-bold text-lg w-7 h-7 rounded-full bg-gray-200 absolute top-2 right-2"
            onClick={() => {
              setshowDaylongModal(false);
            }}
          >
            X
          </button>
          <form onSubmit={handleSubmit(ondaylongsubmit)}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {daylongFormData?.map((data, index) => {
                return (
                  <div
                    key={index}
                    className={`${data?.name === "paymentmethod" && "col-span-2"} ${
                      data?.name === "discount" && "col-span-2"
                    }`}
                  >
                    <label className="text-xs block">{data?.label}</label>
                    {data.type === "select" ? (
                      <select
                        {...register(`${data?.name}`, { required: data?.required })}
                        onChange={data?.onchange}
                        name={data.name}
                        className="w-full text-xs rounded-lg border-[1.5px] bg-transparent md:py-2 md:px-3 font-medium outline-none transition focus:border-primary"
                      >
                        <option value="">{data?.placeholder}</option>
                        {data?.values?.map((value, index) => (
                          <option key={index} value={value}>
                            {value}
                          </option>
                        ))}
                      </select>
                    ) : data?.name === "discount" ? (
                      <div className="flex gap-2">
                        <div className="w-full relative">
                          <input
                            {...register("percentagediscount")}
                            onChange={data?.onchange}
                            type="text"
                            onKeyDown={(e) => handleKeyCheck(e)}
                            placeholder="Percentage"
                            className="w-full text-xs rounded-lg border-[1.5px] bg-transparent md:py-2 md:px-3 font-medium outline-none transition focus:border-primary"
                          />
                          <span className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600">
                            %
                          </span>
                        </div>
                        <div className="w-full relative">
                          <input
                            {...register("flatDiscount")}
                            onChange={data?.onflatchange}
                            type="text"
                            onKeyDown={(e) => handleKeyCheck(e)}
                            placeholder="Flat"
                            className="w-full text-xs rounded-lg border-[1.5px] bg-transparent md:py-2 md:px-3 font-medium outline-none transition focus:border-primary"
                          />
                          <span className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600">
                            BDT
                          </span>
                        </div>
                      </div>
                    ) : data.name === "paymentmethod" ? (
                      <div className="flex gap-4">
                        <select
                          {...register(`${data?.name}`, { required: data?.required })}
                          onChange={data?.onchange}
                          name={data.name}
                          className="w-full text-xs rounded-lg border-[1.5px] bg-transparent md:py-2 md:px-3 font-medium outline-none transition focus:border-primary"
                        >
                          <option value="">{data?.placeholder}</option>
                          {data?.values?.map((value, index) => (
                            <option key={index} value={value}>
                              {value}
                            </option>
                          ))}
                        </select>
                        {payment && payment !== "Cash" && (
                          <div className="w-full">
                            <input
                              {...register("payNumber", { required: "Pay Number is Required" })}
                              type="text"
                              placeholder={`${payment} Number`}
                              className="w-full rounded-lg border-[1.5px] bg-transparent md:py-2 md:px-3 font-medium outline-none transition focus:border-primary"
                            />
                          </div>
                        )}
                      </div>
                    ) : (
                      <input
                        {...register(`${data?.name}`, { required: data?.required })}
                        type={data?.type}
                        placeholder={data?.placeholder}
                        min={(data?.type === "date" && formattedDate) || 0}
                        onChange={data?.onchange}
                        readOnly={data?.read}
                        value={data?.value}
                        className="w-full text-xs rounded-lg border-[1.5px] bg-transparent md:py-2 md:px-3 font-medium outline-none transition focus:border-primary"
                      />
                    )}
                  </div>
                );
              })}
            </div>

            <button
              type="submit"
              onSubmit={handleSubmit}
              className="flex uppercase text-sm text-white justify-center rounded-md bg-primary p-2 font-semibold mt-3"
            >
              Add Guest
            </button>
          </form>
        </section>
      </Modal>
    </section>
  );
};

export default DaylongPackage;
