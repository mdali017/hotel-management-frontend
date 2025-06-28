import React, { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import orionlogo from "../../assets/hotel-orion-logo.png";
import { Link, useLocation } from "react-router-dom";
import { format, differenceInDays, parseISO } from "date-fns";
import converter from "number-to-words";

const HotelInvoice = () => {
  const componentRef = useRef();
  const location = useLocation();
  const [extraCost, setExtraCost] = useState(0);
  const [nightStay, setNightStay] = useState(1); // State for night stay count
  const invoiceInfo = location?.state?.data;

  console.log(invoiceInfo?.checkoutStatus);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Hotel Orion Invoice",
  });

  let amountWithBeforeDiscountCost;
  if (invoiceInfo?.checkoutStatus === "Early CheckIn" || invoiceInfo?.checkoutStatus === "Late CheckOut") {
    amountWithBeforeDiscountCost =
      invoiceInfo?.beforeDiscountCost + invoiceInfo?.roomRent / 2;
  }else {
    amountWithBeforeDiscountCost = invoiceInfo?.beforeDiscountCost;
  }
  console.log(amountWithBeforeDiscountCost);

  // Calculate night stay based on check-in and check-out dates
  useEffect(() => {
    if (invoiceInfo?.firstDate && invoiceInfo?.lastDate) {
      try {
        const firstDate = parseISO(invoiceInfo.firstDate);
        const lastDate = parseISO(invoiceInfo.lastDate);
        const nights = differenceInDays(lastDate, firstDate);
        setNightStay(nights > 0 ? nights : 1); // Ensure at least 1 night
      } catch (error) {
        console.error("Error calculating night stay:", error);
        setNightStay(1); // Default to 1 night if calculation fails
      }
    }
  }, [invoiceInfo?.firstDate, invoiceInfo?.lastDate]);

  // Calculate room cost (beforeDiscountCost minus addon totals)
  useEffect(() => {
    const calculateRoomCost = () => {
      const addonTotal =
        invoiceInfo?.addons?.reduce(
          (sum, addon) => sum + Number(addon.itemPrice),
          0
        ) || 0;

      console.log(addonTotal, 28);

      setExtraCost(addonTotal);
    };
    calculateRoomCost();
  }, [
    invoiceInfo?.addons,
    invoiceInfo?.beforeDiscountCost,
    invoiceInfo?.discountFlat,
    invoiceInfo?.discountPercentage,
  ]);

  // Calculate total cost (beforeDiscountCost minus addon totals)
  const calculateRoomRentAmount = () => {
    if (invoiceInfo?.discountFlat) {
      return invoiceInfo?.beforeDiscountCost - invoiceInfo?.discountFlat;
    }
    if (invoiceInfo?.discountPercentage) {
      return (
        invoiceInfo?.beforeDiscountCost -
        (invoiceInfo?.beforeDiscountCost * invoiceInfo?.discountPercentage) /
          100
      );
    }
    return invoiceInfo?.beforeDiscountCost;
  };

  return (
    <div className="p-4">
      <div className="flex justify-end mb-4">
        <button
          onClick={handlePrint}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 mr-3"
        >
          Print
        </button>
        <Link to={"/dashboard"}>
          {" "}
          <button className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700">
            Back
          </button>
        </Link>
      </div>

      <div className="max-w-4xl mx-auto shadow-lg border border-gray-400 p-1 bg-white">
        <div ref={componentRef} className="p-6">
          {/* Header */}
          <div className="flex flex-col items-center">
            <div className="flex items-center justify-center">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-white mr-2">
                <div>
                  <img src={orionlogo} alt="" />
                </div>
              </div>
              <div className="flex-1">
                <h1 className="text-4xl font-bold text-amber-800">
                  HOTEL MANAGEMENT
                </h1>
              </div>
            </div>
            <p className="text-gray-600 text-sm font-semibold">
              Orion City, Rail Road, Jashore, Bangladesh
            </p>
            <p className="text-gray-600 text-sm font-semibold">
              Tel: 0421-65226, Hotline: 01981-333444, Email:
              info@hotelorioninternational.com
            </p>
          </div>
          <div className=" mt-10">
            <div className="flex  justify-between  p-2 rounded">
              <p className="">
                <span className="font-semibold text-sm">CSL:</span>{" "}
                <span className="font-bold text-xl">
                  {invoiceInfo?.bookingId}
                </span>
              </p>
              <div>
                <p className="text-sm">
                  <span className="font-semibold">Date:</span>{" "}
                  {invoiceInfo?.bookingDate}
                </p>
                <p className="text-sm">
                  <span className="font-semibold">Booked From:</span>{" "}
                  {invoiceInfo?.bookedFrom}
                </p>
              </div>
            </div>
            {/* <h2 className="mt-2 text-xl font-bold text-center">INVOICE</h2> */}
          </div>

          {/* Customer Information */}
          <div className="mt-6 border border-gray-200 rounded">
            <div className="grid grid-cols-2 border-b">
              <div className="p-3 border-r">
                <p className="font-semibold">Guest Name:</p>
                <p>
                  {invoiceInfo.customerTitle} {invoiceInfo.customerName}
                </p>
              </div>
              <div className="p-3">
                <p className="font-semibold">Address/Company:</p>
                <p>{invoiceInfo?.addressOrCompanyName || "N/A"}</p>
              </div>
              {/* <div className="p-3">
                <p className="font-semibold">Phone Numner:</p>
                <p>+880 {invoiceInfo?.customerNumber || "N/A"}</p>
              </div> */}
            </div>
            <div className="grid grid-cols-2">
              <div className="p-3 border-r">
                <p className="font-semibold">Check IN:</p>
                <p>
                  {invoiceInfo?.firstDate && invoiceInfo?.checkInTime
                    ? format(
                        new Date(
                          `${invoiceInfo.firstDate}T${invoiceInfo.checkInTime}`
                        ),
                        "dd-MM-yyyy (hh:mm a)"
                      )
                    : "N/A"}
                </p>
              </div>
              <div className="p-3">
                <p className="font-semibold">Check Out:</p>
                <p>
                  {invoiceInfo?.lastDate
                    ? `${format(
                        new Date(invoiceInfo.lastDate),
                        "dd-MM-yyyy"
                      )} (${format(new Date(invoiceInfo.lastDate), "hh:mm a")})`
                    : "N/A"}
                </p>
              </div>
              {/* <div className="p-3">
                <p className="font-semibold">Status:</p>
                <p>{invoiceInfo?.checkoutStatus || "N/A"}</p>
              </div> */}
            </div>
          </div>

          {/* Room Charges */}
          <div className="mt-6">
            <h3 className="text-lg font-bold mb-2">Room Charges</h3>
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2 text-center">
                    Particulars of Bill
                  </th>
                  <th className="border p-2 text-center">Room Type</th>
                  <th className="border p-2 text-center">Room Number</th>
                  <th className="border p-2 text-center">Night Stay</th>
                  <th className="border p-2 text-center">Amount </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2 text-center">
                    Room Rent ({invoiceInfo?.roomRent}TK)
                  </td>
                  <td className="border p-2 text-center">
                    {invoiceInfo?.bookingroom?.map((item) => {
                      if (
                        item === "Deluxe Single/Couple" &&
                        (invoiceInfo?.isSingle === "isSingle" ||
                          invoiceInfo?.isSingle === "true")
                      ) {
                        return "Deluxe Single";
                      } else if (
                        item === "Deluxe Single/Couple" &&
                        (invoiceInfo?.isSingle === "isCouple" ||
                          invoiceInfo?.isSingle === "false")
                      ) {
                        return "Deluxe Couple";
                      } else {
                        return item;
                      }
                    })}
                  </td>
                  <td className="border p-2 text-center">
                    {invoiceInfo?.roomNumber?.map((item) => item)}
                  </td>
                  <td className="border p-2 text-center">{nightStay}</td>
                  <td className="border p-2 text-center">
                    {invoiceInfo?.beforeDiscountCost * nightStay} TK
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Extra Services */}
          {invoiceInfo?.addons && invoiceInfo.addons.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-bold mb-2">Extra Services</h3>
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border p-2 text-center">Date</th>
                    <th className="border p-2 text-center">Service Name</th>
                    <th className="border p-2 text-center">Room Number</th>
                    <th className="border p-2 text-center">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {invoiceInfo.addons.map((addon, index) => (
                    <tr key={`addon-${index}`}>
                      <td className="border p-2 text-center">
                        {addon?.itemDate
                          ? format(new Date(addon?.itemDate), "dd-MM-yyyy")
                          : "N/A"}
                      </td>
                      <td className="border p-2 text-center">
                        {addon.itemName}
                      </td>
                      <td className="border p-2 text-center">{addon.item}</td>
                      <td className="border p-2 text-center">
                        {addon.itemPrice} TK
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Totals */}
          <div className="mt-6 flex justify-end">
            <div className="w-1/3">
              {/* Show discount section only if discount exists */}
              {(invoiceInfo.discountPercentage > 0 ||
                invoiceInfo.discountFlat > 0) && (
                <>
                  {/* <div className="flex justify-between border-b pb-2">
                    <span className="font-semibold">Total Cost:</span>
                    <span>{invoiceInfo.beforeDiscountCost} Tk.</span>
                  </div> */}

                  <div className="flex justify-between border-b py-2">
                    <span className="font-semibold">
                      Discount{" "}
                      {invoiceInfo.discountPercentage > 0
                        ? `(${invoiceInfo.discountPercentage}%)`
                        : ""}
                      :
                    </span>
                    <span>
                      {invoiceInfo.discountPercentage > 0
                        ? (
                            (invoiceInfo.beforeDiscountCost *
                              invoiceInfo.discountPercentage) /
                            100
                          ).toFixed(2)
                        : invoiceInfo.discountFlat}{" "}
                      Tk.
                    </span>
                  </div>
                </>
              )}

              <div className="flex justify-between border-b py-2">
                <span className="font-semibold">Paid Amount:</span>
                <span>{invoiceInfo.paidAmount} Tk.</span>
              </div>

              <div className="flex justify-between border-b py-2">
                <span className="font-semibold">Due Amount:</span>
                <span>
                  {calculateRoomRentAmount() +
                    // (invoiceInfo?.dueAmount || 0) +
                    extraCost -
                    invoiceInfo?.paidAmount}{" "}
                  Tk.
                </span>
              </div>

              <div className="flex justify-between border-b py-2">
                <span className="font-semibold">VAT 0% =</span>
                <span>0 Tk.</span>
              </div>

              <div className="flex justify-between py-2 font-bold">
                <span>Total Amount =</span>
                <span>
                  {calculateRoomRentAmount() +
                    // (invoiceInfo?.dueAmount || 0) +
                    extraCost}{" "}
                  Tk.
                </span>
              </div>
            </div>
          </div>
          <div className="mt-2  pl-2 bg-gray-50 flex gap-2">
            <p className="font-semibold">Taka (In words):</p>
            <p className="capitalize font-semibold">
              {converter.toWords(
                calculateRoomRentAmount() +
                  // (invoiceInfo?.dueAmount || 0) +
                  extraCost || 0
              ) || 0}{" "}
              Taka only
            </p>
          </div>

          {/* Signatures */}
          <div className="mt-16 flex justify-between">
            <div className="text-center">
              <div className="border-t border-black mt-6 pt-1 w-48">
                <p>Guest's Signature</p>
              </div>
            </div>
            <div className="text-center relative">
              <div className="border-t border-black mt-6 pt-1 w-48">
                <p>Prepared by</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelInvoice;
