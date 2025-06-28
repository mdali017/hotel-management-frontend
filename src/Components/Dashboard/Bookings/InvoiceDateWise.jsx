import { useRef } from "react";
import { useLocation } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import logo from "../../../assets/hotel-orion-logo.png";

const InvoiceDateWise = () => {
  const location = useLocation();
  const invoiceData = location?.state?.data?.data;

  const componentRef = useRef();

  // react-to-print
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "choti-resort",

    // onAfterPrint: () => {
    //   Swal.fire({

    //     icon: "success",
    //     title: "Your invoice has been saved",
    //     showConfirmButton: false,
    //     timer: 1500,
    //   });
    // },
  });
  return (
    <>
      <div className="flex justify-end mb-2">
        <button
          onClick={handlePrint}
          className="border px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Print
        </button>
      </div>
      <div className="mb-20">
        <div ref={componentRef} className="  actual-receipt border p-4">
          <header className="m-4  mx-auto">
            <div className="bg-black  flex justify-center items-center mx-auto text-white py-5 ">
              <h1 className=" rounded-lg text-2xl font-semibold tracking-widest">
                Checkout Report
              </h1>
            </div>
            <div className="flex container mx-auto justify-between items-center  ">
              <address className="font-md">
                <p>HOTEL MANAGEMENT </p>
                <p> Rail Road, Jessore, Bangladesh, 7400</p>
                <p> info.hotelorionint@gmail.com</p>
                <p> +880 1981-333444</p>
              </address>

              <span className="">
                <img
                  alt="Chuti Resort"
                  src={logo}
                  className="rounded float-right align-top h-40 w-40"
                />
              </span>
            </div>
          </header>
          <div className="flex justify-end my-20">
            <table className="border-collapse mr-10 w-[50%] bg-white shadow-md firstTable">
              <thead>
                <tr className="border">
                  <th className="py-2 px-4 bg-gray-100">
                    <span className="font-semibold">Total Income</span>
                  </th>
                  <td className="py-2 px-4">
                    <span>
                      {invoiceData?.reduce((acc, item) => acc + item.paidAmount, 0)}/- Taka
                    </span>
                  </td>
                </tr>
                <tr>
                  <th className="py-2 px-4 bg-gray-100">
                    <span className="font-semibold">Total Due</span>
                  </th>
                  <td className="py-2 px-4">
                    <span className="font-semibold">
                      {invoiceData?.reduce((acc, item) => acc + item.dueAmount, 0)}/- Taka
                    </span>
                  </td>
                </tr>
              </thead>
            </table>
          </div>
          <main className="">
            <hr />
            <table className="secondTable text-left text-xs w-full border-collapse">
              <thead>
                <tr className="bg-gray-200">
                  <th className="py-2 px-4">
                    <span className="font-semibold">Date</span>
                  </th>
                  <th className="py-2 px-4">
                    <span className="font-semibold">Guest's Name</span>
                  </th>
                  <th className="py-2 px-4">
                    <span className="font-semibold">Room No.</span>
                  </th>
                  <th className="py-2 px-4">
                    <span className="font-semibold">Total Cost</span>
                  </th>
                  <th className="py-2 px-4">
                    <span className="font-semibold">Paid Amount</span>
                  </th>
                  <th className="py-2 px-4">
                    <span className="font-semibold">Total Due</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {invoiceData?.map((item) => {
                  return (
                    <tr key={item._id}>
                      <td className="py-2 px-4">
                        <span className="ml-2">{item?.lastDate}</span>
                      </td>
                      <td className="py-2 px-4">
                        <span>{item?.customerName}</span>
                      </td>
                      <td className="py-2 px-4">
                        <span>{item?.roomNumber}</span>
                      </td>
                      <td className="py-2 px-4">
                        <span className="font-semibold">
                          {item?.paidAmount + item?.dueAmount} Taka
                        </span>
                      </td>
                      <td className="py-2 px-4">
                        <span>{item.paidAmount} Taka</span>
                      </td>
                      <td className="py-2 px-4">
                        <span className="font-semibold text-red-500">
                          {item?.paidAmount + item?.dueAmount - item.paidAmount} Taka
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {/* <div className="flex justify-between px-10 text-center mb-10 text-lg">
              <div>
                <p>_________________</p>
                <p>Manager's SignAture</p>
              </div>
              <div>
                <p>_________________</p>
                <p>Customer's SignAture</p>
              </div>
            </div> */}
            {/* <aside className="bg-gray-200 py-7 px-5">
              <h1 className="text-center tracking-[4px] font-semibold text-2xl border-b-2 border-black py-3">
                Additional Notes
              </h1>
              <div className="text-center py-2">
                <p>A finance charge of 1.5% will be made on unpaid balances after 30 days.</p>
              </div>
            </aside> */}
          </main>
        </div>
      </div>
    </>
  );
};

export default InvoiceDateWise;
