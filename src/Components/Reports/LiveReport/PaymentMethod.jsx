import { Text, View } from "@react-pdf/renderer";
import React from "react";

const PaymentMethod = ({
  newBookings,
  previousBookings,
  checkoutCustomer,
  dueCheckoutCustomer,
  cashInHandData,
}) => {
  // Function to calculate payment totals from booking array
  const calculatePaymentTotals = (bookings) => {
    if (!bookings || !Array.isArray(bookings)) {
      return {
        cashAmount: 0,
        cardAmount: 0,
        bkashAmount: 0,
        otherAmount: 0,
      };
    }

    const totals = {
      cashAmount: 0,
      cardAmount: 0,
      bkashAmount: 0,
      otherAmount: 0,
    };

    bookings.forEach((booking) => {
      if (booking.payment && Array.isArray(booking.payment)) {
        booking.payment.forEach((payment) => {
          const amount = payment.amount || 0;
          const method = payment.paymentmethod?.toLowerCase() || "";

          switch (method) {
            case "cash":
              totals.cashAmount += amount;
              break;
            case "card":
            case "card payment":
              totals.cardAmount += amount;
              break;
            case "bkash":
              totals.bkashAmount += amount;
              break;
            default:
              // Any other payment method goes to "other"
              if (
                method &&
                method !== "cash" &&
                method !== "card" &&
                method !== "bkash" &&
                method !== "card payment"
              ) {
                totals.otherAmount += amount;
              }
              break;
          }
        });
      }
    });

    return totals;
  };

  // Function to calculate payment totals for previous guests (only today's payments)
  const calculatePreviousGuestTodayPayments = (bookings) => {
    if (!bookings || !Array.isArray(bookings)) {
      return {
        cashAmount: 0,
        cardAmount: 0,
        bkashAmount: 0,
        otherAmount: 0,
      };
    }

    const totals = {
      cashAmount: 0,
      cardAmount: 0,
      bkashAmount: 0,
      otherAmount: 0,
    };

    const today = new Date().toDateString();

    bookings.forEach((booking) => {
      if (booking.payment && Array.isArray(booking.payment)) {
        booking.payment.forEach((payment) => {
          // Check if payment was made today
          const paymentDate = new Date(payment.paymentDate).toDateString();
          if (paymentDate === today) {
            const amount = payment.amount || 0;
            const method = payment.paymentmethod?.toLowerCase() || "";

            switch (method) {
              case "cash":
                totals.cashAmount += amount;
                break;
              case "card":
              case "card payment":
                totals.cardAmount += amount;
                break;
              case "bkash":
                totals.bkashAmount += amount;
                break;
              default:
                // Any other payment method goes to "other"
                if (
                  method &&
                  method !== "cash" &&
                  method !== "card" &&
                  method !== "bkash" &&
                  method !== "card payment"
                ) {
                  totals.otherAmount += amount;
                }
                break;
            }
          }
        });
      }
    });

    return totals;
  };

  // Calculate totals for each section
  const newGuestTotals = calculatePaymentTotals(newBookings);
  const previousGuestTodayTotals =
    calculatePreviousGuestTodayPayments(previousBookings);
  const checkoutGuestTotals = calculatePaymentTotals(checkoutCustomer);
  const dueCheckoutGuestTotals = calculatePaymentTotals(dueCheckoutCustomer);

  // For cash in hand, you might want to pass specific data or calculate differently
  const cashInHandTotals = cashInHandData || {
    cashAmount: 0,
    cardAmount: 0,
    bkashAmount: 0,
    otherAmount: 0,
  };

  const paymentSections = [
    {
      title: "New Guests:",
      data: {
        cashAmount: `${newGuestTotals.cashAmount} Tk`,
        cardAmount: `${newGuestTotals.cardAmount} Tk`,
        bkashAmount: `${newGuestTotals.bkashAmount} Tk`,
        otherAmount: `${newGuestTotals.otherAmount} Tk`,
      },
      isFullWidth: false,
    },
    {
      title: "Previous Guests:",
      data: {
        cashAmount: `${previousGuestTodayTotals.cashAmount} Tk`,
        cardAmount: `${previousGuestTodayTotals.cardAmount} Tk`,
        bkashAmount: `${previousGuestTodayTotals.bkashAmount} Tk`,
        otherAmount: `${previousGuestTodayTotals.otherAmount} Tk`,
      },
      isFullWidth: false,
    },
    {
      title: "Checkout Guests:",
      data: {
        cashAmount: `${checkoutGuestTotals.cashAmount} Tk`,
        cardAmount: `${checkoutGuestTotals.cardAmount} Tk`,
        bkashAmount: `${checkoutGuestTotals.bkashAmount} Tk`,
        otherAmount: `${checkoutGuestTotals.otherAmount} Tk`,
      },
      isFullWidth: false,
    },
    {
      title: "Due Checkout Guests:",
      data: {
        cashAmount: `${dueCheckoutGuestTotals.cashAmount} Tk`,
        cardAmount: `${dueCheckoutGuestTotals.cardAmount} Tk`,
        bkashAmount: `${dueCheckoutGuestTotals.bkashAmount} Tk`,
        otherAmount: `${dueCheckoutGuestTotals.otherAmount} Tk`,
      },
      isFullWidth: false,
    },
  ];

  // CashInHand section as separate full-width section
  const cashInHandSection = {
    title: "CashInHand Payment Summary:",
    data: {
      cashAmount: `${
        newGuestTotals.cashAmount +
        previousGuestTodayTotals.cashAmount +
        checkoutGuestTotals.cashAmount +
        dueCheckoutGuestTotals.cashAmount
      } Tk`,
      cardAmount: `${
        newGuestTotals.cardAmount +
        previousGuestTodayTotals.cardAmount +
        checkoutGuestTotals.cardAmount +
        dueCheckoutGuestTotals.cardAmount
      } Tk`,
      bkashAmount: `${
        newGuestTotals.bkashAmount +
        previousGuestTodayTotals.bkashAmount +
        checkoutGuestTotals.bkashAmount +
        dueCheckoutGuestTotals.bkashAmount
      } Tk`,
      otherAmount: `${
        newGuestTotals.otherAmount +
        previousGuestTodayTotals.otherAmount +
        checkoutGuestTotals.otherAmount +
        dueCheckoutGuestTotals.otherAmount
      } Tk`,
    },
    isFullWidth: true,
  };

  const renderPaymentGrid = (data, isFullWidth = false) => {
    return (
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          borderWidth: 1,
          borderColor: "gray",
          borderRadius: 4,
          overflow: "hidden",
        }}
      >
        {/* Cash Amount */}
        <View
          style={{
            width: isFullWidth ? "25%" : "50%",
            padding: isFullWidth ? 6 : 4,
            borderRightWidth: 1,
            borderBottomWidth: isFullWidth ? 0 : 1,
            borderColor: "gray",
            backgroundColor: "#f8f8f8",
          }}
        >
          <Text style={{ fontWeight: "bold", fontSize: 10 }}>
            Cash Amount: <Text style={{ fontSize: 11 }}>{data.cashAmount}</Text>
          </Text>
        </View>

        {/* Card Amount */}
        <View
          style={{
            width: isFullWidth ? "25%" : "50%",
            padding: 4,
            borderRightWidth: isFullWidth ? 1 : 0,
            borderBottomWidth: isFullWidth ? 0 : 1,
            borderColor: "gray",
            backgroundColor: "#f8f8f8",
          }}
        >
          <Text style={{ fontWeight: "bold", fontSize: 10 }}>
            Card Amount: <Text style={{ fontSize: 11 }}>{data.cardAmount}</Text>
          </Text>
        </View>

        {/* Bkash Amount */}
        <View
          style={{
            width: isFullWidth ? "25%" : "50%",
            padding: 4,
            borderRightWidth: isFullWidth ? 1 : 1,
            borderBottomWidth: 0,
            borderColor: "gray",
            backgroundColor: "#f8f8f8",
          }}
        >
          <Text style={{ fontWeight: "bold", fontSize: 10 }}>
            Bkash Amount:{" "}
            <Text style={{ fontSize: 11 }}>{data.bkashAmount}</Text>
          </Text>
        </View>

        {/* Other Bank Amount */}
        <View
          style={{
            width: isFullWidth ? "25%" : "50%",
            padding: 4,
            borderColor: "gray",
            backgroundColor: "#f8f8f8",
          }}
        >
          <Text style={{ fontWeight: "bold", fontSize: 10 }}>
            Another Bank:{" "}
            <Text style={{ fontSize: 11 }}>{data.otherAmount}</Text>
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View>
      {/* Full-width CashInHand section */}
      <View style={{ width: "100%", paddingVertical: 10 }}>
        <Text style={{ fontWeight: "bold", fontSize: 12, marginBottom: 5, }}>
          {cashInHandSection.title}
        </Text>
        {renderPaymentGrid(
          cashInHandSection.data,
          cashInHandSection.isFullWidth
        )}
      </View>
      {/* Regular payment sections in 2x2 grid */}
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "space-between",
          gap: 10,
          marginBottom: 15,
        }}
      >
        {paymentSections.map((section, index) => (
          <View key={index} style={{ width: "48%" }}>
            <Text style={{ fontWeight: "bold", fontSize: 12, marginBottom: 5 }}>
              {section.title}
            </Text>
            {renderPaymentGrid(section.data, section.isFullWidth)}
          </View>
        ))}
      </View>
    </View>
  );
};

export default PaymentMethod;
