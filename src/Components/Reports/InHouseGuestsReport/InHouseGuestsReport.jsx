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
  tableColGuestName: {
    width: "28%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "gray",
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableColName: {
    width: "18%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "gray",
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableColRoomNo: {
    width: "8%",
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
    width: "12%",
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

const InHouseGuestsReport = () => {
  const { data: todayCheckedOutCustomer, isLoading } =
    useGetTodayCheckoutReportQuery();
  const location = useLocation();

  const InHouseReportData = location?.state?.inHouseGuest || null;

  console.log(InHouseReportData);

  const todayCheckeOutCustomerReport = location?.state?.reportData;

  // console.log(InHouseReportData, "InHouseReportData");
  const totalPerson = InHouseReportData?.reduce(
    (acc, customer) => acc + customer.person,
    0
  );
  console.log(totalPerson);

  // Get current date for the report
  const today = new Date();
  const formattedDate = format(today, "dd-MM-yyyy");

  if (isLoading) {
    return <div>Loading checkout report data...</div>;
  }

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
              Breakfast List
              <Text style={styles.titleDate}>
                {" "}
                [ {format(new Date(), "dd-MM-yyyy")} (
                {format(new Date(), "hh:mm aaa")}) ]
              </Text>
            </Text>
          </View>

          {/* Checkout Customers Table */}
          {InHouseReportData?.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>Today's Running Guests:</Text>
              <View style={styles.mainTable}>
                <View style={[styles.tableRow, styles.tableHeader]}>
                  <View style={styles.tableColSL}>
                    <Text style={styles.headertableCell}>SL</Text>
                  </View>
                  <View style={styles.tableColName}>
                    <Text style={styles.headertableCell}>Room</Text>
                  </View>
                  <View style={styles.tableColGuestName}>
                    <Text style={styles.headertableCell}>Guset Name</Text>
                  </View>
                  <View style={styles.tableColName}>
                    <Text style={styles.smallTableHeaderText}>Company</Text>
                  </View>
                  <View style={styles.tableColName}>
                    <Text style={styles.headertableCell}>Arr. Date</Text>
                  </View>

                  <View style={styles.tableColPayment}>
                    <Text style={styles.headertableCell}>Pax</Text>
                  </View>
                </View>

                {InHouseReportData?.map((customer, index) => (
                  <View style={styles.tableRow} key={customer._id}>
                    <View style={styles.tableColSL}>
                      <Text style={styles.tableCell}>{index + 1}</Text>
                    </View>

                    {/* room number */}
                    <View style={styles.tableColName}>
                      <Text style={styles.tableCell}>
                        {customer?.roomNumber?.join(", ")}
                      </Text>
                    </View>
                    {/* Guest Name */}
                    <View style={styles.tableColGuestName}>
                      <Text style={styles.tableCell}>
                        {customer.customerName?.length > 20
                          ? `${customer.customerName.slice(0, 20)}...`
                          : customer.customerName}
                        {customer.discountFlat > 0 && (
                          <Text style={styles.discountText}>
                            ({customer.discountFlat})
                          </Text>
                        )}
                      </Text>
                    </View>
                    {/* room type */}
                    <View style={styles.tableColName}>
                      <Text style={styles.tableCell}>
                        {/* {customer?.bookingroom?.[0] === "Deluxe Single/Couple"
                          ? customer.isSingle === "isSingle"
                            ? "Deluxe Single"
                            : "Deluxe Couple"
                          : customer?.bookingroom?.[0] === "Deluxe Twin"
                          ? "Deluxe Twin"
                          : customer?.bookingroom?.[0] === "Executive Suite"
                          ? "Executive Suite"
                          : customer?.bookingroom?.[0] === "Orion Suite"
                          ? "Orion Suite"
                          : customer?.bookingroom?.[0] === "Royal Suite"
                          ? "Royal Suite"
                          : customer?.bookingroom?.[0] || "N/A"} */}
                        {/* {customer?.addressOrCompanyName || "N/A"} */}
                        <Text style={styles.tableCell}>
                          {customer?.addressOrCompanyName?.length > 15
                            ? `${customer.addressOrCompanyName.slice(0, 15)}...`
                            : customer.addressOrCompanyName}
                        </Text>
                      </Text>
                    </View>

                    <View style={styles.tableColName}>
                      {/* <Text style={styles.tableCell}>{customer?.bookingId || "N/A"}</Text> */}
                      <Text style={styles.tableCell}>
                        {format(new Date(customer?.createdAt), "dd-MM-yyyy") ||
                          "N/A"}
                      </Text>
                    </View>

                    <View style={styles.tableColMethod}>
                      <Text style={styles.tableCell}>{customer?.person}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </>
          )}

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
                  Total Room Booked:{" "}
                  <Text style={{ fontSize: 15 }}>
                    {InHouseReportData?.length}
                  </Text>
                </Text>
              </View>
              <View style={{ width: "50%", padding: 4, textAlign: "right" }}>
                <Text style={{ fontWeight: "bold", fontSize: 12 }}>
                  Total Person:{" "}
                  <Text style={{ fontSize: 15 }}>{totalPerson || 0}</Text>
                </Text>
              </View>
            </View>
          </View>

          {/* Footer */}
          {/* <View style={styles.footerContainer} fixed={true}>
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
          </View> */}
        </Page>
      </Document>
    </PDFViewer>
  );
};

export default InHouseGuestsReport;
