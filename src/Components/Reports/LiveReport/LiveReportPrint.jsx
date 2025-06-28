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
import { useGetLiveReportQuery } from "../../../redux/baseApi/baseApi";
import { format } from "date-fns";
import orionLogo from "../../../assets/hotel-orion-logo.jpg";
import PaymentMethod from "./PaymentMethod";

// Customer Create styles
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
  infoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  address: {
    fontSize: 12,
  },
  tableContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 20,
  },
  table: {
    width: "80%",
    borderWidth: 1,
    margin: "0 auto",
    borderColor: "#000000",
  },
  tableRowupper: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#000000",
  },
  tableHeaderupper: {
    width: "50%",
    backgroundColor: "#f3f4f6",
    padding: 4,
  },
  tableCellupper: {
    width: "50%",
    padding: 4,
  },
  headerText: {
    fontWeight: "bold",
    fontSize: 12,
  },
  priceText: {
    fontWeight: "bold",
    fontSize: 15,
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
  // Updated column widths
  tableColSL: {
    width: "8%", // Smaller for SL No
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "gray",
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableColName: {
    width: "18%", // Bigger for Name
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "gray",
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableColRoomNo: {
    width: "10%", // Smaller for Room No
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "gray",
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableColRoomType: {
    width: "12%", // Smaller for Room Type
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "gray",
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableColMethod: {
    width: "10%", // Smaller for Method
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "gray",
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableCol: {
    width: "14%", // Default width for other columns
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "gray",
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableColRM: {
    width: "10.28%",
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
  sectionTitle: {
    marginBottom: 10,
    marginTop: 20,
    fontSize: 12,
    fontWeight: "bold",
  },

  // for header part
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
    fontSize: 16,
    fontWeight: "bold",
    color: "#1F456E", // Deep blue color
  },
  hotelAddress: {
    fontSize: 10,
    color: "#555555",
  },
  hotelContact: {
    fontSize: 10,
    color: "#555555",
  },
  reportTitleContainer: {
    alignItems: "center",
    marginTop: 10,
    marginBottom: 5,
  },
  reportTitle: {
    fontSize: 14,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  reportDate: {
    fontSize: 12,
    fontWeight: "normal",
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: "#1F456E",
    borderBottomStyle: "solid",
    marginVertical: "5px",
  },

  // Footer
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
  signatureLabel: {
    fontSize: 10,
    marginBottom: 40, // Space for actual signature
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
  footerInfo: {
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#EEEEEE",
    paddingTop: 10,
    alignItems: "center",
  },
  footerText: {
    fontSize: 8,
    color: "#777777",
    textAlign: "center",
    marginBottom: 2,
  },
});

const LiveReportPrint = () => {
  const { data: liveReportData, isLoading } = useGetLiveReportQuery();

  // Get current date for the report
  const today = new Date();
  const formattedDate = format(today, "dd-MM-yyyy");

  // If data is loading, show loading message
  if (isLoading) {
    return <div>Loading report data...</div>;
  }

  // Destructure the data from the API response
  const {
    date,
    customersCount,
    earlyCheckoutCount,
    bookingsCount,
    previousBookings,
    previousBookingsRoomsCount,
    newRoomAmount,
    previousRoomAmount,
    dueCollectionAmount,
    todayPayments,
    customerRevenue,
    totalRevenue,
    recentBookings = [],
    recentCustomers = [],
    todayCheckedOutCustomersCount,
    earlyCheckedOutCustomersCount,
    dueCollectionList = [],
  } = liveReportData?.data || {};

  const totalCashInHand =
    liveReportData?.data?.newRoomAmount +
      liveReportData?.data?.previousRoomAmount +
      liveReportData?.data?.customerRevenue + dueCollectionAmount || 0;

  const totalDueAmount =
    liveReportData?.data?.previousGuestsDueAmount +
    liveReportData?.data?.newGuestsDueAmount;

  // Helper function to check if a payment was made today
  const isPaymentFromToday = (paymentDate) => {
    if (!paymentDate) return false;

    const paymentDateObj = new Date(paymentDate);
    const todayDate = new Date();

    return (
      paymentDateObj.getDate() === todayDate.getDate() &&
      paymentDateObj.getMonth() === todayDate.getMonth() &&
      paymentDateObj.getFullYear() === todayDate.getFullYear()
    );
  };

  return (
    <PDFViewer style={{ width: "100%", height: "100vh" }}>
      <Document>
        <Page size="A4" style={styles.page}>
          {/* Header */}
          <View
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: "20px",
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Image style={{ width: "40px" }} src={orionLogo} />
              <View style={styles.headerTextContainer}>
                <Text style={{ fontSize: "23px", fontWeight: "600" }}>
                  HOTEL Management
                </Text>
              </View>
            </View>
            <View
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: "10px", color: "#555555" }}>
                Rail Road, Jessore, Bangladesh, 7400
              </Text>
              <Text style={{ fontSize: "10px", color: "#555555" }}>
                Phone: +880 1981-333444 | Email: info.hotelorionint@gmail.com
              </Text>
            </View>
          </View>

          <View>
            <Text style={styles.title}>
              Live Report
              <Text style={styles.titleDate}>({formattedDate})</Text>
            </Text>
          </View>

          <View style={styles.tableContainer}>
            <View style={styles.table}>
              {/* row 1 */}
              <View style={styles.tableRowupper}>
                <View style={styles.tableHeaderupper}>
                  <Text style={styles.headerText}>Total Room Booked</Text>
                </View>
                <View style={styles.tableCellupper}>
                  <Text style={styles.priceText}>
                    {bookingsCount + previousBookingsRoomsCount} {"  "}[
                    <Text style={{ fontSize: 12 }}> New </Text>({bookingsCount})
                    +<Text style={{ fontSize: 12 }}> Previous </Text> (
                    {previousBookingsRoomsCount}) ]
                  </Text>
                </View>
              </View>

              {/* row 2 */}
              <View style={styles.tableRowupper}>
                <View style={styles.tableHeaderupper}>
                  <Text style={styles.headerText}>Today's Checkout</Text>
                </View>
                <View style={styles.tableCellupper}>
                  <Text style={styles.priceText}>
                    {todayCheckedOutCustomersCount +
                      earlyCheckedOutCustomersCount}
                    {"   "}[ {todayCheckedOutCustomersCount} +{" "}
                    <Text style={{ fontSize: 12 }}>Early</Text> (
                    {earlyCheckedOutCustomersCount}) ]
                  </Text>
                </View>
              </View>

              {/* row 3 */}
              <View style={styles.tableRowupper}>
                <View style={styles.tableHeaderupper}>
                  <Text style={styles.headerText}>
                    Received Amount(New Guests){" "}
                  </Text>
                </View>
                <View style={styles.tableCellupper}>
                  <Text style={styles.priceText}>
                    {newRoomAmount || 0} Taka
                  </Text>
                </View>
              </View>

              <View style={styles.tableRowupper}>
                <View style={styles.tableHeaderupper}>
                  <Text style={styles.headerText}>
                    Received Amount(Previous Guests){" "}
                  </Text>
                </View>
                <View style={styles.tableCellupper}>
                  <Text style={styles.priceText}>
                    {previousRoomAmount || 0} Taka (
                    <Text style={{ fontSize: 10 }}>Today Payment</Text>)
                  </Text>
                </View>
              </View>
              <View style={styles.tableRowupper}>
                <View style={styles.tableHeaderupper}>
                  <Text style={styles.headerText}>Received Due Amount</Text>
                </View>
                <View style={styles.tableCellupper}>
                  <Text style={styles.priceText}>
                    {dueCollectionAmount || 0} Taka (
                    <Text style={{ fontSize: 10 }}>Today Payment</Text>)
                  </Text>
                </View>
              </View>
              {/* row 4 */}
              <View style={styles.tableRowupper}>
                <View style={styles.tableHeaderupper}>
                  <Text style={styles.headerText}>Checkout Amount</Text>
                </View>
                <View style={styles.tableCellupper}>
                  <Text style={styles.priceText}>
                    {customerRevenue || 0} Taka
                  </Text>
                </View>
              </View>

              {/* Total Revenue */}
              <View style={styles.tableRowupper}>
                <View style={styles.tableHeaderupper}>
                  <Text style={styles.headerText}>Total Cash In Hand</Text>
                </View>
                <View style={styles.tableCellupper}>
                  <Text style={styles.priceText}>
                    {totalCashInHand || 0} Taka
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Payment Methods */}
          <PaymentMethod
            newBookings={recentBookings}
            previousBookings={previousBookings}
            checkoutCustomer={recentCustomers}
            dueCheckoutCustomer={dueCollectionList}
          />

          {/* New Guests Table */}
          <Text style={styles.sectionTitle}>Received Amount (New Guests):</Text>
          <View style={styles.mainTable}>
            <View style={styles.tableRow}>
              <View style={styles.tableColSL}>
                <Text style={styles.headertableCell}>SL No</Text>
              </View>
              <View style={styles.tableColName}>
                <Text style={styles.headertableCell}>Name</Text>
              </View>
              <View style={styles.tableColRoomNo}>
                <Text style={styles.headertableCell}>Room No</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.headertableCell}>Total Cost</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.headertableCell}>Paid Amount</Text>
              </View>
              <View style={styles.tableColMethod}>
                <Text style={styles.headertableCell}>Method</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.headertableCell}>Total Due</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.headertableCell}>Check In</Text>
              </View>
            </View>

            {recentBookings?.map((booking, index) => (
              <View style={styles.tableRow} key={index}>
                <View style={styles.tableColSL}>
                  <Text style={styles.tableCell}>{index + 1}</Text>
                </View>
                <View style={styles.tableColName}>
                  <Text style={styles.tableCell}>
                    {booking.customerName}
                    {booking.discountFlat > 0 && (
                      <Text style={{ color: "red", fontSize: "10px" }}>
                        ({booking.discountFlat})
                      </Text>
                    )}
                  </Text>
                </View>
                <View style={styles.tableColRoomNo}>
                  <Text style={styles.tableCell}>
                    {booking?.roomNumber?.join(", ")}
                  </Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>
                    {booking.beforeDiscountCost} Taka
                  </Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>
                    {booking.paidAmount} Taka
                  </Text>
                </View>
                <View style={styles.tableColMethod}>
                  <Text style={styles.tableCell}>
                    {booking?.payment?.at(-1)?.paymentmethod || "N/A"}
                  </Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>{booking.dueAmount} Taka</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>{booking.firstDate}</Text>
                </View>
              </View>
            ))}

            {recentBookings.length === 0 && (
              <View style={styles.tableRow}>
                <View style={[styles.tableCol, { width: "100%" }]}>
                  <Text style={styles.tableCell}>No bookings found</Text>
                </View>
              </View>
            )}
          </View>

          {/* Previous Guests Table */}
          {previousBookings && previousBookings.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>
                Received Amount (Previous Guests):
              </Text>
              <View style={styles.mainTable}>
                <View style={styles.tableRow}>
                  <View style={styles.tableColSL}>
                    <Text style={styles.headertableCell}>SL No</Text>
                  </View>
                  <View style={styles.tableColName}>
                    <Text style={styles.headertableCell}>Name</Text>
                  </View>
                  <View style={styles.tableColRoomNo}>
                    <Text style={styles.headertableCell}>Room No</Text>
                  </View>
                  <View style={styles.tableCol}>
                    <Text style={styles.headertableCell}>Total Cost</Text>
                  </View>
                  <View style={styles.tableCol}>
                    <Text style={styles.headertableCell}>Paid Amount</Text>
                  </View>
                  <View style={styles.tableColMethod}>
                    <Text style={styles.headertableCell}>Method</Text>
                  </View>
                  <View style={styles.tableCol}>
                    <Text style={styles.headertableCell}>Total Due</Text>
                  </View>
                  <View style={styles.tableCol}>
                    <Text style={styles.headertableCell}>Check In</Text>
                  </View>
                </View>

                {previousBookings?.map((booking, index) => (
                  <View style={styles.tableRow} key={index}>
                    <View style={styles.tableColSL}>
                      <Text style={styles.tableCell}>{index + 1}</Text>
                    </View>
                    <View style={styles.tableColName}>
                      <Text style={styles.tableCell}>
                        {booking.customerName}
                        {booking.discountFlat > 0 && (
                          <Text style={{ color: "red", fontSize: "10px" }}>
                            ({booking.discountFlat})
                          </Text>
                        )}
                      </Text>
                    </View>
                    <View style={styles.tableColRoomNo}>
                      <Text style={styles.tableCell}>
                        {booking?.roomNumber?.join(", ")}
                      </Text>
                    </View>
                    <View style={styles.tableCol}>
                      <Text style={styles.tableCell}>
                        {booking.beforeDiscountCost} Taka
                      </Text>
                    </View>
                    <View style={styles.tableCol}>
                      <Text style={styles.tableCell}>
                        {booking.paidAmount} Taka
                      </Text>
                    </View>
                    <View style={styles.tableColMethod}>
                      <Text style={styles.tableCell}>
                        {booking?.payment?.at(-1)?.paymentmethod || "N/A"}
                      </Text>
                    </View>
                    <View style={styles.tableCol}>
                      <Text style={styles.tableCell}>
                        {booking.dueAmount} Taka
                      </Text>
                    </View>
                    <View style={styles.tableCol}>
                      <Text style={styles.tableCell}>{booking.firstDate}</Text>
                    </View>
                  </View>
                ))}

                {previousBookings.length === 0 && (
                  <View style={styles.tableRow}>
                    <View style={[styles.tableCol, { width: "100%" }]}>
                      <Text style={styles.tableCell}>No bookings found</Text>
                    </View>
                  </View>
                )}
              </View>
            </>
          )}

          {/* Recent Customers Table */}
          {recentCustomers && recentCustomers.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>Today's Checkout Guests:</Text>
              <View style={styles.mainTable}>
                <View style={styles.tableRow}>
                  <View style={styles.tableColSL}>
                    <Text style={styles.headertableCell}>SL No</Text>
                  </View>
                  <View style={styles.tableColName}>
                    <Text style={styles.headertableCell}>Name</Text>
                  </View>
                  <View style={styles.tableColRoomNo}>
                    <Text style={styles.headertableCell}>Room No</Text>
                  </View>
                  <View style={styles.tableColRoomType}>
                    <Text style={styles.headertableCell}>Room Type</Text>
                  </View>
                  <View style={styles.tableCol}>
                    <Text style={styles.headertableCell}>Paid Amount</Text>
                  </View>
                  <View style={styles.tableColMethod}>
                    <Text style={styles.headertableCell}>Method</Text>
                  </View>
                  <View style={styles.tableCol}>
                    <Text style={styles.headertableCell}>Due Amount</Text>
                  </View>
                  <View style={styles.tableCol}>
                    <Text style={styles.headertableCell}>Payment Date</Text>
                  </View>
                </View>

                {recentCustomers?.map((customer, index) => (
                  <View style={styles.tableRow} key={index}>
                    <View style={styles.tableColSL}>
                      <Text style={styles.tableCell}>{index + 1}</Text>
                    </View>
                    <View style={styles.tableColName}>
                      <Text style={styles.tableCell}>
                        {customer.customerName}
                        {customer.discountFlat > 0 && (
                          <Text style={{ color: "red", fontSize: "10px" }}>
                            ({customer.discountFlat})
                          </Text>
                        )}
                      </Text>
                    </View>
                    <View style={styles.tableColRoomNo}>
                      <Text style={styles.tableCell}>
                        {customer?.roomNumber?.join(", ")}
                      </Text>
                    </View>
                    <View style={styles.tableColRoomType}>
                      <Text style={styles.tableCell}>
                        {customer?.bookingroom?.includes("Deluxe Single/Couple")
                          ? customer?.isSingle === "isSingle"
                            ? "Deluxe Single"
                            : "Deluxe Couple"
                          : customer?.bookingroom?.join(", ")}
                      </Text>
                    </View>
                    <View style={styles.tableCol}>
                      <Text style={styles.tableCell}>
                        {customer?.payment?.at(-1)?.amount} Taka
                      </Text>
                    </View>
                    <View style={styles.tableColMethod}>
                      <Text style={styles.tableCell}>
                        {customer?.payment?.at(-1)?.paymentmethod || "N/A"}
                      </Text>
                    </View>
                    <View style={styles.tableCol}>
                      <Text style={styles.tableCell}>
                        {customer.dueAmount} Taka
                      </Text>
                    </View>
                    <View style={styles.tableCol}>
                      <Text style={styles.tableCell}>
                        {format(
                          new Date(customer?.payment?.at(-1)?.paymentDate),
                          "dd-MM-yyyy"
                        )}
                      </Text>
                    </View>
                  </View>
                ))}

                {recentCustomers.length === 0 && (
                  <View style={styles.tableRow}>
                    <View style={[styles.tableCol, { width: "100%" }]}>
                      <Text style={styles.tableCell}>
                        No checkout guests found
                      </Text>
                    </View>
                  </View>
                )}
              </View>
            </>
          )}

          {/* Due Customers Table */}
          {dueCollectionList && dueCollectionList.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>Today's Due Collections:</Text>
              <View style={styles.mainTable}>
                <View style={styles.tableRow}>
                  <View style={styles.tableColSL}>
                    <Text style={styles.headertableCell}>SL No</Text>
                  </View>
                  <View style={styles.tableColName}>
                    <Text style={styles.headertableCell}>Name</Text>
                  </View>
                  <View style={styles.tableColRoomNo}>
                    <Text style={styles.headertableCell}>Room No</Text>
                  </View>
                  <View style={styles.tableColRoomType}>
                    <Text style={styles.headertableCell}>Room Type</Text>
                  </View>
                  <View style={styles.tableCol}>
                    <Text style={styles.headertableCell}>Paid Amount</Text>
                  </View>
                  <View style={styles.tableColMethod}>
                    <Text style={styles.headertableCell}>Method</Text>
                  </View>
                  <View style={styles.tableCol}>
                    <Text style={styles.headertableCell}>Due Amount</Text>
                  </View>
                  <View style={styles.tableCol}>
                    <Text style={styles.headertableCell}>Date</Text>
                  </View>
                </View>

                {dueCollectionList?.map((customer, index) => (
                  <View style={styles.tableRow} key={index}>
                    <View style={styles.tableColSL}>
                      <Text style={styles.tableCell}>{index + 1}</Text>
                    </View>
                    <View style={styles.tableColName}>
                      <Text style={styles.tableCell}>
                        {customer.customerName}
                        {customer.discountFlat > 0 && (
                          <Text style={{ color: "red", fontSize: "10px" }}>
                            ({customer.discountFlat})
                          </Text>
                        )}
                      </Text>
                    </View>
                    <View style={styles.tableColRoomNo}>
                      <Text style={styles.tableCell}>
                        {customer?.roomNumber?.join(", ")}
                      </Text>
                    </View>
                    <View style={styles.tableColRoomType}>
                      <Text style={styles.tableCell}>
                        {customer?.bookingroom?.join(", ")}
                      </Text>
                    </View>
                    <View style={styles.tableCol}>
                      <Text style={styles.tableCell}>
                        {customer.paidAmount} Taka
                      </Text>
                    </View>
                    <View style={styles.tableColMethod}>
                      <Text style={styles.tableCell}>
                        {customer?.payment?.at(-1)?.paymentmethod || "N/A"}
                      </Text>
                    </View>
                    <View style={styles.tableCol}>
                      <Text style={styles.tableCell}>
                        {customer.dueAmount} Taka
                      </Text>
                    </View>
                    <View style={styles.tableCol}>
                      <Text style={styles.tableCell}>
                        {format(new Date(customer.createdAt), "dd-MM-yyyy")}
                      </Text>
                    </View>
                  </View>
                ))}

                {dueCollectionList.length === 0 && (
                  <View style={styles.tableRow}>
                    <View style={[styles.tableCol, { width: "100%" }]}>
                      <Text style={styles.tableCell}>
                        No due collections found
                      </Text>
                    </View>
                  </View>
                )}
              </View>
            </>
          )}

          {/* Footer */}
          <View style={styles.footerContainer}>
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

export default LiveReportPrint;