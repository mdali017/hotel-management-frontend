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
import {
  useGetDailyReportQuery,
  useGetLiveReportQuery,
} from "../../../redux/baseApi/baseApi";
import { format } from "date-fns";
import orionLogo from "../../../assets/hotel-orion-logo.jpg";

// Customer Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#ffffff",
    padding: 5,
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
  // divider: {
  //   borderBottomWidth: 1,
  //   borderBottomColor: "#000000",
  //   marginBottom: 20,
  // },
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
  tableCol: {
    width: "7.2%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "gray",
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  customerTableCol: {
    width: "20%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "gray",
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableCell: {
    margin: "auto",
    fontSize: 10,
    // padding: "2px 5px",
  },
  headertableCell: {
    margin: "auto",
    fontSize: 10,
    padding: "2px 3px",
    fontWeight: "bold",
  },
  tableHeader: {
    backgroundColor: "#f3f4f6",
    fontWeight: "bold",
  },
  sectionTitle: {
    marginBottom: 10,
    fontSize: 12,
    fontWeight: "bold",
  },
  summaryContainer: {
    display: "flex",
    flexDirection: "row",
    gap: 10,
    marginBottom: 20,
  },
  summaryTable: {
    marginBottom: 20,
    border: "1px solid gray",
    borderRadius: 5,
    width: "50%",
  },
  summaryRow: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    borderBottom: "1px solid gray",
  },
  summaryLastRow: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  summaryHeader: {
    flex: 1,
    fontWeight: "bold",
    backgroundColor: "#f0f0f0",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRight: "1px solid gray",
    fontSize: 12,
  },
  summaryCell: {
    flex: 1,
    textAlign: "left",
    paddingVertical: 6,
    paddingHorizontal: 12,
    fontSize: 12,
  },

  // Footer an Header
  // for header part
  headerContainer: {
    marginBottom: 4,
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
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
    // paddingTop: 20,
    // borderTopWidth: 1,
    // borderTopColor: "#CCCCCC",
    // borderTopStyle: "solid",
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
  sectionSpacer: {
    height: 15,
  },
});

const DailyReportPrint = () => {
  // Use the daily report query instead of the live report
  const { data: dailyReportData, isLoading } = useGetDailyReportQuery();

  console.log(dailyReportData?.data);

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
    bookingsCount,
    roomStats,
    paymentSummary,
    bookings = [],
    customers = [],
    customersCount,
  } = dailyReportData?.data || {};

  // Format number as currency
  const formatCurrency = (amount) => {
    return Number(amount || 0).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
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
                  HOTEL MANAGEMENT
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
              Daily Report {""}
              <Text style={styles.titleDate}>({date || formattedDate})</Text>
            </Text>
            <View style={styles.divider} />
          </View>

          <Text style={styles.sectionTitle}>Front Office Cash Summary</Text>
          <View style={styles.summaryContainer}>
            {/* Cash Summary Table */}
            <View style={styles.summaryTable}>
              {/* Row 1 */}
              <View style={styles.summaryRow}>
                <Text style={styles.summaryHeader}>Total Sale</Text>
                <Text style={styles.summaryCell}>
                  {formatCurrency(paymentSummary?.totalAmount)}
                </Text>
              </View>

              {/* Row 2 */}
              <View style={styles.summaryRow}>
                <Text style={styles.summaryHeader}>Cash Receive</Text>
                <Text style={styles.summaryCell}>
                  {formatCurrency(paymentSummary?.cashAmount)}
                </Text>
              </View>
              {/* Row 2 */}
              <View style={styles.summaryRow}>
                <Text style={styles.summaryHeader}>Due Amount Receive</Text>
                <Text style={styles.summaryCell}>0</Text>
              </View>

              {/* Row 3 */}
              <View style={styles.summaryRow}>
                <Text style={styles.summaryHeader}>Bank Transfer</Text>
                <Text style={styles.summaryCell}>
                  {formatCurrency(paymentSummary?.bankTransferAmount)}
                </Text>
              </View>

              {/* Row 4 */}
              <View style={styles.summaryRow}>
                <Text style={styles.summaryHeader}>Credit Card</Text>
                <Text style={styles.summaryCell}>
                  {formatCurrency(paymentSummary?.creditCardAmount)}
                </Text>
              </View>

              {/* Row 5 */}
              <View style={styles.summaryRow}>
                <Text style={styles.summaryHeader}>Bkash</Text>
                <Text style={styles.summaryCell}>
                  {formatCurrency(paymentSummary?.bkashAmount)}
                </Text>
              </View>

              {/* Row 6 (Last Row) */}
              <View style={styles.summaryLastRow}>
                <Text style={styles.summaryHeader}>Due Amount</Text>
                <Text style={styles.summaryCell}>
                  {formatCurrency(paymentSummary?.duePaymentAmount)}
                </Text>
              </View>
            </View>

            {/* Selling Room Table */}
            <View style={styles.summaryTable}>
              {/* Row 1 */}
              <View style={styles.summaryRow}>
                <Text style={styles.summaryHeader}>DS</Text>
                <Text style={styles.summaryCell}>{roomStats?.DS || 0}</Text>
              </View>

              {/* Row 2 */}
              <View style={styles.summaryRow}>
                <Text style={styles.summaryHeader}>DT</Text>
                <Text style={styles.summaryCell}>{roomStats?.DT || 0}</Text>
              </View>

              {/* Row 3 */}
              <View style={styles.summaryRow}>
                <Text style={styles.summaryHeader}>OS</Text>
                <Text style={styles.summaryCell}>{roomStats?.OS || 0}</Text>
              </View>

              {/* Row 4 */}
              <View style={styles.summaryRow}>
                <Text style={styles.summaryHeader}>ES</Text>
                <Text style={styles.summaryCell}>{roomStats?.ES || 0}</Text>
              </View>

              {/* Row 5 */}
              <View style={styles.summaryRow}>
                <Text style={styles.summaryHeader}>RS</Text>
                <Text style={styles.summaryCell}>{roomStats?.RS || 0}</Text>
              </View>

              {/* Row 6 (Last Row) */}
              <View style={styles.summaryLastRow}>
                <Text style={styles.summaryHeader}>Total</Text>
                <Text style={styles.summaryCell}>{roomStats?.total || 0}</Text>
              </View>
            </View>
          </View>

          {/* Bookings Table */}
          <Text style={styles.sectionTitle}>New Guests Details: </Text>
          <View style={styles.mainTable}>
            <View style={styles.tableRow}>
              <View style={styles.tableCol}>
                <Text style={styles.headertableCell}>SL No</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.headertableCell}>CSL</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.headertableCell}>RT</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.headertableCell}>RN</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.headertableCell}>Guest Name</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.headertableCell}>Room Rent</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.headertableCell}>Pay Rent</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.headertableCell}>Cash</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.headertableCell}>Bkash</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.headertableCell}>Card</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.headertableCell}>Bank</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.headertableCell}>Due</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.headertableCell}>Night</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.headertableCell}>Remark</Text>
              </View>
            </View>

            {bookings && bookings.length > 0 ? (
              bookings.map((booking, index) => (
                <View key={index} style={styles.tableRow}>
                  <View style={styles.tableCol}>
                    <Text style={styles.tableCell}>{index + 1}</Text>
                  </View>
                  <View style={styles.tableCol}>
                    <Text style={styles.tableCell}>{booking.csl}</Text>
                  </View>
                  <View style={styles.tableCol}>
                    <Text style={styles.tableCell}>{booking.rt}</Text>
                  </View>
                  <View style={styles.tableCol}>
                    <Text style={styles.tableCell}>{booking.rn}</Text>
                  </View>
                  <View style={styles.tableCol}>
                    <Text style={styles.tableCell}>{booking.guestName}</Text>
                  </View>
                  <View style={styles.tableCol}>
                    <Text style={styles.tableCell}>{booking.roomRent}</Text>
                  </View>
                  <View style={styles.tableCol}>
                    <Text style={styles.tableCell}>{booking.payRent}</Text>
                  </View>
                  <View style={styles.tableCol}>
                    <Text style={styles.tableCell}>{booking.cash}</Text>
                  </View>
                  <View style={styles.tableCol}>
                    <Text style={styles.tableCell}>{booking.bkash}</Text>
                  </View>
                  <View style={styles.tableCol}>
                    <Text style={styles.tableCell}>{booking.card}</Text>
                  </View>
                  <View style={styles.tableCol}>
                    <Text style={styles.tableCell}>{booking.bank}</Text>
                  </View>
                  <View style={styles.tableCol}>
                    <Text style={styles.tableCell}>{booking.due}</Text>
                  </View>
                  <View style={styles.tableCol}>
                    <Text style={styles.tableCell}>{booking.night}</Text>
                  </View>
                  <View style={styles.tableCol}>
                    <Text style={styles.tableCell}>{booking.remark}</Text>
                  </View>
                </View>
              ))
            ) : (
              <View style={styles.tableRow}>
                <View style={[styles.tableCol, { width: "100%" }]}>
                  <Text style={styles.tableCell}>No booking records found</Text>
                </View>
              </View>
            )}
          </View>

          {/* Add spacing between tables */}
          <View style={styles.sectionSpacer}></View>

          {/* Customers Table */}
          <Text style={styles.sectionTitle}>Checkout Guests Details: </Text>
          <View style={styles.mainTable}>
            <View style={styles.tableRow}>
              <View style={styles.customerTableCol}>
                <Text style={styles.headertableCell}>SL No</Text>
              </View>
              {/* <View style={styles.customerTableCol}>
                <Text style={styles.headertableCell}>Customer ID</Text>
              </View> */}
              <View style={styles.customerTableCol}>
                <Text style={styles.headertableCell}>Customer Name</Text>
              </View>
              <View style={styles.customerTableCol}>
                <Text style={styles.headertableCell}>Room Type</Text>
              </View>
              <View style={styles.customerTableCol}>
                <Text style={styles.headertableCell}>Room Number</Text>
              </View>
              {/* <View style={styles.customerTableCol}>
                <Text style={styles.headertableCell}>Contact Info</Text>
              </View> */}
              <View style={styles.customerTableCol}>
                <Text style={styles.headertableCell}>Cash</Text>
              </View>
            </View>

            {customers && customers.length > 0 ? (
              customers.map((customer, index) => (
                <View key={index} style={styles.tableRow}>
                  <View style={styles.customerTableCol}>
                    <Text style={styles.tableCell}>{index + 1}</Text>
                  </View>

                  <View style={styles.customerTableCol}>
                    <Text style={styles.tableCell}>
                      {customer.customerName}
                    </Text>
                  </View>
                  <View style={styles.customerTableCol}>
                    <Text style={styles.tableCell}>
                      {customer?.bookingroom?.map((item) => item)}
                    </Text>
                  </View>
                  <View style={styles.customerTableCol}>
                    <Text style={styles.tableCell}>
                      {customer?.roomNumber?.map((item) => item)}
                    </Text>
                  </View>
                  {/* <View style={styles.customerTableCol}>
                    <Text style={styles.tableCell}>
                      {customer.customerNumber}
                    </Text>
                  </View> */}
                  <View style={styles.customerTableCol}>
                    <Text style={styles.tableCell}>
                      {formatCurrency(customer.paidAmount)}
                    </Text>
                  </View>
                </View>
              ))
            ) : (
              <View style={styles.tableRow}>
                <View style={[styles.customerTableCol, { width: "100%" }]}>
                  <Text style={styles.tableCell}>
                    No customer records found
                  </Text>
                </View>
              </View>
            )}
          </View>

          {/* Footer */}
          <View style={styles.footerContainer}>
            <View style={styles.signatureSection}>
              <View style={styles.signatureBox}>
                {/* <Text style={styles.signatureLabel}>Prepared By</Text> */}
                <View style={styles.signatureLine}></View>
                <Text style={styles.signatureTitle}>Prepared By</Text>
              </View>

              <View style={styles.signatureBox}>
                {/* <Text style={styles.signatureLabel}>Verified By</Text> */}
                <View style={styles.signatureLine}></View>
                <Text style={styles.signatureTitle}>Accounts Dept.</Text>
              </View>

              <View style={styles.signatureBox}>
                {/* <Text style={styles.signatureLabel}>Approved By</Text> */}
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

export default DailyReportPrint;
