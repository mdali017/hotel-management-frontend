import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  PDFViewer,
  Image,
} from "@react-pdf/renderer";
import { useGetTodayCheckoutReportQuery } from "../../../redux/baseApi/baseApi";
import { format, differenceInDays } from "date-fns";
import orionLogo from "../../../assets/hotel-orion-logo.jpg";
import { useLocation } from "react-router-dom";

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#ffffff",
    padding: 30,
    color: "#000000",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  titleDate: {
    fontSize: 12,
  },
  headerContainer: {
    marginBottom: 4,
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  logo: {
    width: 60,
    height: 60,
  },
  headerTextContainer: {
    marginLeft: 10,
    flexDirection: "column",
  },
  hotelName: {
    fontSize: "23px",
    fontWeight: "600",
  },
  hotelAddress: {
    fontSize: "10px",
    color: "#555555",
  },
  hotelContact: {
    fontSize: "10px",
    color: "#555555",
  },
  sectionTitle: {
    marginBottom: 10,
    marginTop: 20,
    fontSize: 12,
    fontWeight: "bold",
  },
  mainTable: {
    display: "table",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "gray",
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    margin: "auto",
    flexDirection: "row",
  },
  tableColSL: {
    width: "6%", // Reduced width for SL column
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "gray",
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableColRT: {
    width: "7%", // Reduced width for SL column
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "gray",
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableColName: {
    width: "18%", // Kept the same size
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "gray",
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableColRoomNo: {
    width: "8%", // Reduced width for Room No
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "gray",
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableColRoomType: {
    width: "15%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "gray",
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableColPayment: {
    width: "12%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "gray",
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableColMethod: {
    width: "12%", // Added new column for payment method
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "gray",
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableColDue: {
    width: "12%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "gray",
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableColDate: {
    width: "17%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "gray",
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableCell: {
    margin: "auto",
    fontSize: 10,
    padding: "2px 5px",
  },
  headertableCell: {
    margin: "auto",
    fontSize: 11,
    padding: "2px 5px",
    fontWeight: "bold",
  },
  tableHeader: {
    backgroundColor: "#f3f4f6",
    fontWeight: "bold",
  },
  footerContainer: {
    marginTop: "auto",
    paddingTop: 20,
  },
  signatureSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 30,
    marginBottom: 20,
  },
  signatureBox: {
    width: "30%",
    alignItems: "center",
  },
  signatureLine: {
    width: "80%",
    borderBottomWidth: 1,
    borderBottomColor: "#000000",
    borderBottomStyle: "solid",
    marginBottom: 5,
  },
  signatureTitle: {
    fontSize: 10,
    fontWeight: "bold",
  },
  discountText: {
    color: "red",
    fontSize: 8,
  },
  header: {
    position: "absolute",
    top: 30,
    left: 30,
    right: 30,
    flexDirection: "column",
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 30,
    right: 30,
    paddingTop: 20,
  },
  pageContent: {
    marginTop: 100, // Adjust based on your header height
    marginBottom: 100, // Adjust based on your footer height
  },
  // New style for smaller RT heading
  smallTableHeaderText: {
    margin: "auto",
    fontSize: 9,
    padding: "2px 5px",
    fontWeight: "bold",
  },
});

const CheckoutReports = () => {
  const { data: todayCheckedOutCustomer, isLoading } =
    useGetTodayCheckoutReportQuery();
  const location = useLocation();

  const generatedReportData =
    location?.state?.reportData?.checkoutCustomers || null;

  const todayCheckeOutCustomerReport = location?.state?.reportData;

  const roomTypeSummary = [
    { type: "DS", count: 5 },
    { type: "DC", count: 3 },
    { type: "DT", count: 2 },
    { type: "ES", count: 4 },
    { type: "OS", count: 1 },
    { type: "RS", count: 6 },
  ];

  // console.log(todayCheckeOutCustomerReport, "todayCheckedOut Customer");

  // console.log(generatedReportData, "generatedReportData");
  const totalReportAmount = generatedReportData?.reduce(
    (acc, customer) => acc + customer.paidAmount,
    0
  );

  // Get current date for the report
  const today = new Date();
  const formattedDate = format(today, "dd-MM-yyyy");

  if (isLoading) {
    return <div>Loading checkout report data...</div>;
  }

  // Process customer data for display
  const processCustomerData = (customer) => {
    const lastPayment = customer.payment?.at(-1);
    const roomType =
      customer.bookingroom?.[0] === "Deluxe Single/Couple"
        ? customer.isSingle === "isSingle"
          ? "Deluxe Single"
          : "Deluxe Couple"
        : customer.bookingroom?.[0] || "N/A";

    return {
      ...customer,
      displayRoomType: roomType,
      paymentMethod: lastPayment?.paymentmethod || "N/A",
      lastPaymentAmount: lastPayment?.amount || 0,
      lastPaymentDate: lastPayment?.paymentDate
        ? format(new Date(lastPayment.paymentDate), "dd-MM-yyyy")
        : "N/A",
    };
  };

  // Calculate night stay (difference between firstDate and lastDate)
  const calculateNightStay = (firstDate, lastDate) => {
    if (!firstDate || !lastDate) return "N/A";

    try {
      const start = new Date(firstDate);
      const end = new Date(lastDate);
      const nights = differenceInDays(end, start);
      return nights > 0 ? `${nights}` : "1";
    } catch (error) {
      return "N/A";
    }
  };

  // Process all customers
  const processedCustomers =
    todayCheckedOutCustomer?.data?.customers?.map(processCustomerData) || [];
  const processedEarlyCustomers =
    todayCheckedOutCustomer?.data?.earlyCheckedOutCustomers?.map(
      processCustomerData
    ) || [];

  // Calculate totals
  const totalCheckouts =
    processedCustomers.length + processedEarlyCustomers.length;
  const totalAmount = (
    todayCheckedOutCustomer?.data?.grandTotal || 0
  ).toLocaleString();

  // Function to get payment method for a customer
  const getPaymentMethod = (customer) => {
    const lastPayment = customer.payment?.at(-1);
    return lastPayment?.paymentmethod || "N/A";
  };

  return (
    <PDFViewer style={{ width: "100%", height: "100vh" }}>
      <Document>
        <Page size="A4" style={styles.page}>
          {/* Header */}
          <View style={styles.headerContainer} fixed={true}>
            <View style={styles.logoContainer}>
              <Image style={styles.logo} src={orionLogo} />
              <View style={styles.headerTextContainer}>
                <Text style={styles.hotelName}>HOTEL MANAGEMENT</Text>
                <Text style={styles.hotelAddress}>
                  Rail Road, Jessore, Bangladesh, 7400
                </Text>
                <Text style={styles.hotelContact}>
                  Phone: +880 1981-333444 | Email:
                  info@hotelorioninternational.com
                </Text>
              </View>
            </View>
          </View>

          {/* Report Title */}
          <View>
            <Text style={styles.title}>
              Checkout Report
              <Text style={styles.titleDate}>
                {" "}
                [ {formattedDate} (
                {todayCheckeOutCustomerReport?.reportTimeRange}) ]
              </Text>
            </Text>
          </View>

          <View
            style={
              todayCheckeOutCustomerReport?.customerList?.length > 21
                ? { minHeight: "600px" }
                : { minHeight: "400px" }
            }
          >
            {/* Checkout Customers Table */}
            {todayCheckeOutCustomerReport?.customerList?.length > 0 && (
              <>
                <Text style={styles.sectionTitle}>
                  Today's Checkout Guests:
                </Text>
                <View style={styles.mainTable}>
                  <View style={[styles.tableRow, styles.tableHeader]}>
                    <View style={styles.tableColSL}>
                      <Text style={styles.headertableCell}>SL</Text>
                    </View>
                    <View style={styles.tableColName}>
                      <Text style={styles.headertableCell}>Name</Text>
                    </View>
                    <View style={styles.tableColRT}>
                      {/* Make RT smaller */}
                      <Text style={styles.smallTableHeaderText}>RT</Text>
                    </View>
                    <View style={styles.tableColRoomNo}>
                      <Text style={styles.headertableCell}>Room</Text>
                    </View>
                    <View style={styles.tableColRT}>
                      <Text style={styles.headertableCell}>NS </Text>
                    </View>

                    <View style={styles.tableColPayment}>
                      <Text style={styles.headertableCell}>
                        Payment Method{" "}
                      </Text>
                    </View>

                    <View style={styles.tableColMethod}>
                      <Text style={styles.headertableCell}>Paid Amount</Text>
                    </View>
                    <View style={styles.tableColDue}>
                      <Text style={styles.headertableCell}>Due Amount</Text>
                    </View>
                    <View style={styles.tableColDate}>
                      <Text style={styles.headertableCell}>Payment Date</Text>
                    </View>
                  </View>

                  {todayCheckeOutCustomerReport?.customerList?.map(
                    (customer, index) => (
                      <View style={styles.tableRow} key={customer._id}>
                        <View style={styles.tableColSL}>
                          <Text style={styles.tableCell}>{index + 1}</Text>
                        </View>
                        <View style={styles.tableColName}>
                          <Text style={styles.tableCell}>
                            {customer.customerName?.length <= 25
                              ? customer.customerName
                              : `${customer.customerName.slice(0, 25)}...`}
                            {customer.discountFlat > 0 && (
                              <Text style={styles.discountText}>
                                ({customer.discountFlat})
                              </Text>
                            )}
                          </Text>
                        </View>
                        <View style={styles.tableColRT}>
                          <Text style={styles.tableCell}>
                            {customer?.bookingroom?.[0] ===
                            "Deluxe Single/Couple"
                              ? customer.isSingle === "isSingle"
                                ? "DS"
                                : "DC"
                              : customer?.bookingroom?.[0] === "Deluxe Twin"
                              ? "DT"
                              : customer?.bookingroom?.[0] === "Executive Suite"
                              ? "ES"
                              : customer?.bookingroom?.[0] === "Orion Suite"
                              ? "OS"
                              : customer?.bookingroom?.[0] === "Royal Suite"
                              ? "RS"
                              : customer?.bookingroom?.[0] || "N/A"}
                          </Text>
                        </View>
                        <View style={styles.tableColRoomNo}>
                          <Text style={styles.tableCell}>
                            {customer?.roomNumber?.join(", ")}
                          </Text>
                        </View>
                        <View style={styles.tableColRT}>
                          {/* Display night stay calculation here */}
                          <Text style={styles.tableCell}>
                            {calculateNightStay(
                              customer.firstDate,
                              customer.lastDate
                            )}
                          </Text>
                        </View>

                        <View style={styles.tableColMethod}>
                          <Text style={styles.tableCell}>
                            {customer.payment?.at(-1)?.paymentmethod ===
                            "Card Payment"
                              ? customer.payment?.at(-1)?.bankName
                              : customer.payment?.at(-1)?.paymentmethod}
                          </Text>
                        </View>

                        <View style={styles.tableColPayment}>
                          <Text style={styles.tableCell}>
                            {customer.paidAmount} Taka
                          </Text>
                        </View>

                        <View style={styles.tableColDue}>
                          <Text style={styles.tableCell}>
                            {customer?.dueAmount} Taka
                          </Text>
                        </View>
                        <View style={styles.tableColDate}>
                          <Text style={styles.tableCell}>
                            {format(new Date(customer.lastDate), "dd-MM-yyyy")}
                          </Text>
                        </View>
                      </View>
                    )
                  )}
                </View>
              </>
            )}

            {/* Early Checkout Customers Table */}
            {processedEarlyCustomers.length > 0 && (
              <>
                <Text style={styles.sectionTitle}>
                  Today's Early Checkout Guests:
                </Text>
                <View style={styles.mainTable}>
                  <View style={[styles.tableRow, styles.tableHeader]}>
                    <View style={styles.tableColSL}>
                      <Text style={styles.headertableCell}>SL</Text>
                    </View>
                    <View style={styles.tableColName}>
                      <Text style={styles.headertableCell}>Name</Text>
                    </View>
                    <View style={styles.tableColRoomNo}>
                      <Text style={styles.headertableCell}>Room</Text>
                    </View>
                    <View style={styles.tableColRoomType}>
                      <Text style={styles.smallTableHeaderText}>RT</Text>
                    </View>
                    <View style={styles.tableColPayment}>
                      <Text style={styles.headertableCell}>Paid Amount</Text>
                    </View>
                    <View style={styles.tableColMethod}>
                      <Text style={styles.headertableCell}>Payment Method</Text>
                    </View>
                    <View style={styles.tableColDue}>
                      <Text style={styles.headertableCell}>Due Amount</Text>
                    </View>
                    <View style={styles.tableColDate}>
                      <Text style={styles.headertableCell}>Payment Date</Text>
                    </View>
                  </View>

                  {processedEarlyCustomers.map((customer, index) => (
                    <View style={styles.tableRow} key={customer._id}>
                      <View style={styles.tableColSL}>
                        <Text style={styles.tableCell}>{index + 1}</Text>
                      </View>
                      <View style={styles.tableColName}>
                        <Text style={styles.tableCell}>
                          {customer.customerName}
                          {customer.discountFlat > 0 && (
                            <Text style={styles.discountText}>
                              ({customer.discountFlat})
                            </Text>
                          )}
                        </Text>
                      </View>
                      <View style={styles.tableColRoomNo}>
                        <Text style={styles.tableCell}>
                          {customer.roomNumber?.join(", ")}
                        </Text>
                      </View>
                      <View style={styles.tableColRoomType}>
                        <Text style={styles.tableCell}>
                          {customer?.bookingroom?.[0] === "Deluxe Single/Couple"
                            ? customer.isSingle === "isSingle"
                              ? "DS"
                              : "DC"
                            : customer?.bookingroom?.[0] === "Deluxe Twin"
                            ? "DT"
                            : customer?.bookingroom?.[0] === "Executive Suite"
                            ? "ES"
                            : customer?.bookingroom?.[0] === "Orion Suite"
                            ? "OS"
                            : customer?.bookingroom?.[0] === "Royal Suite"
                            ? "RS"
                            : customer?.bookingroom?.[0] || "N/A"}
                        </Text>
                      </View>
                      <View style={styles.tableColPayment}>
                        <Text style={styles.tableCell}>
                          {customer.lastPaymentAmount} Taka
                        </Text>
                      </View>
                      <View style={styles.tableColMethod}>
                        <Text style={styles.tableCell}>
                          {customer.paymentMethod}
                        </Text>
                      </View>
                      <View style={styles.tableColDue}>
                        <Text style={styles.tableCell}>
                          {customer.dueAmount} Taka
                        </Text>
                      </View>
                      <View style={styles.tableColDate}>
                        <Text style={styles.tableCell}>
                          {customer.lastPaymentDate}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              </>
            )}
          </View>

          {/* Summary Section */}
          <View
            style={{
              marginTop: 30,
              marginBottom: 30,
              border: "1px solid green",
              paddingVertical: 5,
              paddingHorizontal: 4,
            }}
          >
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <View style={{ width: "50%", padding: 4 }}>
                <Text style={{ fontWeight: "bold", fontSize: 12 }}>
                  Total Amount:{" "}
                  <Text style={{ fontSize: 15 }}>
                    {todayCheckeOutCustomerReport?.totalAmount} Taka
                  </Text>
                </Text>
              </View>
              <View style={{ width: "50%", padding: 4, textAlign: "right" }}>
                <Text style={{ fontWeight: "bold", fontSize: 12 }}>
                  Total Checkouts:{" "}
                  <Text style={{ fontSize: 15 }}>
                    {todayCheckeOutCustomerReport?.customerList?.length}
                  </Text>
                </Text>
              </View>
            </View>
          </View>

          {/* Combined Summary Section */}
          <View
            style={{
              marginTop: 2,
              flexDirection: "row",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            {/* Payment Summary - now takes 48% width */}
            <View style={{ width: "48%" }}>
              <Text
                style={{ fontWeight: "bold", fontSize: 12, marginBottom: 5 }}
              >
                Payment Summary:
              </Text>
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
                    width: "50%",
                    padding: 4,
                    borderRightWidth: 1,
                    borderBottomWidth: 1,
                    borderColor: "gray",
                    backgroundColor: "#f8f8f8",
                  }}
                >
                  <Text style={{ fontWeight: "bold", fontSize: 10 }}>
                    Cash Amount:{" "}
                    <Text style={{ fontSize: 11 }}>
                      {
                        todayCheckeOutCustomerReport?.paymentMethodTotals
                          ?.cashAmount
                      }{" "}
                      Tk
                    </Text>
                  </Text>
                </View>
                {/* Card Amount */}
                <View
                  style={{
                    width: "50%",
                    padding: 4,
                    borderBottomWidth: 1,
                    borderColor: "gray",
                    backgroundColor: "#f8f8f8",
                  }}
                >
                  <Text style={{ fontWeight: "bold", fontSize: 10 }}>
                    Card Amount:{" "}
                    <Text style={{ fontSize: 11 }}>
                      {
                        todayCheckeOutCustomerReport?.paymentMethodTotals
                          ?.cardAmount
                      }{" "}
                      Tk
                    </Text>
                  </Text>
                </View>
                {/* Bkash Amount */}
                <View
                  style={{
                    width: "50%",
                    padding: 4,
                    borderRightWidth: 1,
                    borderColor: "gray",
                    backgroundColor: "#f8f8f8",
                  }}
                >
                  <Text style={{ fontWeight: "bold", fontSize: 10 }}>
                    Bkash Amount:{" "}
                    <Text style={{ fontSize: 11 }}>
                      {
                        todayCheckeOutCustomerReport?.paymentMethodTotals
                          ?.bkashAmount
                      }{" "}
                      Tk
                    </Text>
                  </Text>
                </View>
                {/* Other Bank Amount */}
                <View
                  style={{
                    width: "50%",
                    padding: 4,
                    borderColor: "gray",
                    backgroundColor: "#f8f8f8",
                  }}
                >
                  <Text style={{ fontWeight: "bold", fontSize: 10 }}>
                    Another Bank:{" "}
                    <Text style={{ fontSize: 11 }}>
                      {
                        todayCheckeOutCustomerReport?.paymentMethodTotals
                          ?.otherAmount
                      }{" "}
                      Tk
                    </Text>
                  </Text>
                </View>
              </View>
            </View>

            {/* Room Type Summary - now takes 48% width */}
            <View style={{ width: "48%" }}>
              <Text
                style={{ fontWeight: "bold", fontSize: 12, marginBottom: 5 }}
              >
                Room Type Summary:
              </Text>
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
                {todayCheckeOutCustomerReport?.roomsTypeSummary?.map(
                  (roomType, index) => (
                    <View
                      key={index}
                      style={{
                        width: "16.666%",
                        padding: 2,
                        borderRightWidth: 1,
                        borderColor: "gray",
                        backgroundColor: "#f8f8f8",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 12,
                          borderBottomWidth: 1,
                          borderBottomColor: "lightgray",
                          paddingBottom: 2,
                          marginBottom: 2,
                        }}
                      >
                        {roomType.type}
                      </Text>
                      <Text
                        style={{
                          fontSize: 14,
                          fontWeight: "bold",
                        }}
                      >
                        {roomType.count}
                      </Text>
                    </View>
                  )
                )}
              </View>
            </View>
          </View>

          {/* Footer */}
          <View style={styles.footerContainer} fixed={true}>
            <View style={styles.signatureSection}>
              <View style={styles.signatureBox}>
                <View style={styles.signatureLine}></View>
                <Text style={styles.signatureTitle}>Prepared By</Text>
              </View>
              <View style={styles.signatureBox}>
                <View style={styles.signatureLine}></View>
                <Text style={styles.signatureTitle}>Accounts Dept.</Text>
              </View>
              <View style={styles.signatureBox}>
                <View style={styles.signatureLine}></View>
                <Text style={styles.signatureTitle}>
                  Managing Director / CEO
                </Text>
              </View>
            </View>
          </View>
        </Page>
      </Document>
    </PDFViewer>
  );
};

export default CheckoutReports;
