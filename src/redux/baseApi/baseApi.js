import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://hotel-management-backend-v1.vercel.app/",
    // baseUrl: "http://localhost:5000/api",
  }),

  tagTypes: [
    "Registeration",
    "Bookings",
    "Customer",
    "Housekeeping",
    "CompaintRoom",
    "Reports",
    "LogBook",
    "ExtraPayment",
    "ExtraPaymentItem",
    "CardPaymentItem",
    "GenerateReport",
  ],
  endpoints: (builder) => ({
    addRegisteration: builder.mutation({
      query: (data) => {
        return {
          url: `/bookings/add-bookings`,
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["Registeration", "Bookings", "Reports", "Customer"],
    }),
    addPayment: builder.mutation({
      query: ({ id, data }) => {
        return {
          url: `/bookings/allbookings/${id}`,
          method: "PATCH",
          body: data,
        };
      },
      invalidatesTags: ["Registeration", "Bookings", "Reports", "Customer"],
    }),
    getLastRegisteredId: builder.query({
      query: () => `/bookings/lastRegisteredId`,
      providesTags: ["Registeration"],
    }),
    getRoomColorStatus: builder.query({
      query: (date) => `/bookings/color-status/${date}`,
      providesTags: ["Registeration", "Bookings"],
    }),

    // Report
    getLiveReport: builder.query({
      query: (date) => `/reports/live-report`,
      providesTags: ["Registeration", "Customer", "Bookings", "Reports"],
    }),
    getTodayCheckoutReport: builder.query({
      query: () => `/reports/today-checkout-report`,
      providesTags: ["Registeration", "Customer", "Bookings", "Reports"],
    }),
    getDailyReport: builder.query({
      query: () => `/reports/daily-report`,
      providesTags: ["Registeration", "Customer", "Bookings", "Reports"],
    }),
    getDateRangeReport: builder.query({
      query: (params) => {
        const { startDate, endDate } = params;
        return `/reports/filter-report?startDate=${startDate}&endDate=${endDate}`;
      },
      providesTags: ["Registeration", "Customer", "Bookings", "Reports"],
    }),

    // generate report
    createGenerateReport: builder.mutation({
      query: (data) => {
        return {
          url: `/generate-report/create`,
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["Customer", "Bookings", "Reports"],
    }),
    getGenerateReport: builder.query({
      query: () => `/generate-report/generated-report`,
      providesTags: ["Customer", "Bookings", "Reports"],
    }),
    getSingleGenerateReport: builder.query({
      query: (id) => `/generate-report/generated-report/${id}`,
      providesTags: ["Reports", "GenerateReport"],
    }),
    deleteGenerateReport: builder.mutation({
      query: (id) => {
        return {
          url: `/generate-report/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["Customer", "Bookings", "Reports", "GenerateReport"],
    }),

    //  Housekeeping
    addHousekeeping: builder.mutation({
      query: (data) => {
        return {
          url: `/housekeeping/add-housekeeping`,
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["Housekeeping"],
    }),
    updateHousekeeping: builder.mutation({
      query: (data) => {
        return {
          url: `/housekeeping/${data.roomName}`,
          method: "PATCH",
          body: data,
        };
      },
      invalidatesTags: ["Housekeeping"],
    }),

    getComplaintRoomByRoomName: builder.query({
      query: (roomName) => `/complaints/${roomName}`,
      providesTags: ["CompaintRoom", "Housekeeping"],
    }),
    deleteComplaintRoomByRoomName: builder.mutation({
      query: (roomName) => ({
        url: `/complaints/${roomName}`,
        method: "DELETE",
      }),
      providesTags: ["CompaintRoom", "Housekeeping"],
    }),

    // Complaint Room
    addComplaintRoom: builder.mutation({
      query: ({ roomName, data }) => {
        // ✅ Destructured object parameter
        return {
          url: `/complaints/${roomName}`,
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: [
        "CompaintRoom",
        "Housekeeping",
        "Bookings",
        "Reports",
        "Customer",
        "Registeration",
      ],
    }),

    // arrival guest
    getAllArrivalGuest: builder.query({
      query: () => `/onlinebooking/allonlinebookings`,
      invalidatesTags: ["Bookings", "Reports", "Customer", "Registeration"],
    }),
    // getAllArrivalGuest: builder.mutation({
    //   // query: () =>  "/onlinebooking/allonlinebookings",
    //   query: () => "/onlinebooking/allonlinebookings",
    //   invalidatesTags: ["Bookings", "Reports", "Customer", "Registeration"],
    // }),
    deleteBookingRoomByRoomName: builder.mutation({
      query: (roomNumber) => ({
        url: `/onlinebooking/allonlinebookings/${roomNumber}`,
        method: "DELETE",
      }),
      providesTags: ["Bookings", "Registeration", "customer"],
    }),
    deleteBookingRoomById: builder.mutation({
      query: (id) => ({
        url: `/onlinebooking/allonlinebookings-without-room/${id}`,
        method: "DELETE",
      }),
      providesTags: ["Bookings", "Registeration", "customer"],
    }),

    // payment
    updateAndAddPayment: builder.mutation({
      query: ({ id, data }) => ({
        url: `/bookings/updatepayment/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Bookings", "Reports", "Customer", "Registeration"],
    }),

    // customer
    getTodayCheckOutCustomer: builder.query({
      query: () => `/customers/today-checkout`,
      invalidatesTags: ["Bookings", "Reports", "Customer", "Registeration"],
    }),
    getTodayCheckOutCustomerCount: builder.query({
      query: () => `/customers/room-booking-count`,
      invalidatesTags: ["Bookings", "Reports", "Customer", "Registeration"],
    }),
    getDueCheckoutCustomer: builder.query({
      query: () => `/customers/due-checkout-customer`,
      invalidatesTags: ["Bookings", "Reports", "Customer", "Registeration"],
    }),
    addPaymentFromCustomer: builder.mutation({
      query: ({ id, data }) => ({
        url: `/customers/add-due-amount/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Bookings", "Reports", "Customer", "Registeration"],
    }),

    // Log book
    createLogBook: builder.mutation({
      query: (data) => ({
        url: `/logbooks/addlogbook`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["LogBook"],
    }),
    getLogBook: builder.query({
      query: () => `/logbooks/all-logbooks`,
      providesTags: ["LogBook"],
    }),
    deleteLogBook: builder.mutation({
      query: (id) => ({
        url: `/logbooks/delete-logbook/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["LogBook"],
    }),
    updateLogBook: builder.mutation({
      query: (id, data) => ({
        url: `/logbooks/update-logbook/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["LogBook"],
    }),

    // Extra Payment
    createExtraPayment: builder.mutation({
      query: (data) => {
        return {
          url: `/extrapayment/add-extrapayment`,
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["Bookings", "Reports", "Customer", "Registeration"],
    }),
    // Extra Payment Item
    createExtraPaymentItem: builder.mutation({
      query: (data) => {
        return {
          url: `/extrapayment-item/add-item`,
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["Bookings", "Registeration", "Reports"],
    }),
    getExtraPaymentItems: builder.query({
      query: () => `/extrapayment-item`,
      invalidatesTags: ["Bookings", "Reports", "Customer", "Registeration"],
    }),

    // Card Payment Item
    getCardPaymentItems: builder.query({
      query: () => `/card-payment-item`,
      providesTags: ["CardPaymentItem"],
    }),
    createCardPaymentItem: builder.mutation({
      query: (data) => {
        return {
          url: `/card-payment-item/add-item`,
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["CardPaymentItem"],
    }),
  }),
});

export const {
  useAddRegisterationMutation,
  useAddPaymentMutation,
  useGetLastRegisteredIdQuery,
  useGetRoomColorStatusQuery,

  // Report
  useGetLiveReportQuery,
  useGetTodayCheckoutReportQuery,
  useGetDailyReportQuery,
  useGetDateRangeReportQuery,

  // generate report
  useCreateGenerateReportMutation,
  useGetGenerateReportQuery,
  useGetSingleGenerateReportQuery,
  useDeleteGenerateReportMutation,

  // Housekeeping
  useAddHousekeepingMutation,
  useUpdateHousekeepingMutation,
  useGetComplaintRoomByRoomNameQuery,
  useDeleteComplaintRoomByRoomNameMutation,

  // Complaint Room
  useAddComplaintRoomMutation,

  // arrival guest
  useGetAllArrivalGuestQuery,
  useDeleteBookingRoomByIdMutation,
  useDeleteBookingRoomByRoomNameMutation,
  useUpdateAndAddPaymentMutation,
  useGetTodayCheckOutCustomerQuery,
  useGetTodayCheckOutCustomerCountQuery,
  useCreateLogBookMutation,
  useGetLogBookQuery,
  useDeleteLogBookMutation,
  useUpdateLogBookMutation,

  // Customer
  useGetDueCheckoutCustomerQuery,
  useAddPaymentFromCustomerMutation,

  // Extra Payment
  useCreateExtraPaymentMutation,
  useCreateExtraPaymentItemMutation,
  useGetExtraPaymentItemsQuery,

  // Card Payment Item
  useGetCardPaymentItemsQuery,
  useCreateCardPaymentItemMutation,
} = baseApi;
