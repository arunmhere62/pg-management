'use client';

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFDownloadLink,
  PDFViewer,
  pdf,
  Image
} from '@react-pdf/renderer';
import { Font } from '@react-pdf/renderer';
import React, { useState, useEffect } from 'react';
import { IPaymentProps } from '../rent-payment-list/RentPaymentTable';
import { formatDateToDDMMYYYY } from '@/services/utils/formaters';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';

// Font.register({ family: 'FamilyName', src: source, fontStyle: 'normal', fontWeight: 'normal', fonts?: [] });
// Define styles
const styles = StyleSheet.create({
  section: {
    marginBottom: 10
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10
  },
  text: {
    fontSize: 12
  },
  table: {
    display: 'flex', // Change from "table" to "flex"
    flexDirection: 'column',
    borderStyle: 'solid',
    borderWidth: 0.5,
    marginBottom: 10
  },
  row: {
    flexDirection: 'row',
    borderStyle: 'solid',
    borderWidth: 0.5
  },
  cell: {
    padding: 5,
    fontSize: 12,
    flex: 1, // Ensure cells stretch evenly
    textAlign: 'center'
  }
});

// PDF Component
const InvoicePdf = ({
  tenantPaymentDetails
}: {
  tenantPaymentDetails?: IPaymentProps;
}) => {
  console.log('Invoice pdf', tenantPaymentDetails);

  return (
    <Document>
      <Page
        size={{ width: 595.28, height: 520 }}
        style={{
          padding: '40px'
        }}
      >
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            gap: 10,
            justifyContent: 'space-between',
            borderBottom: '1px solid black',
            paddingBottom: '30px'
          }}
        >
          <View
            style={{
              marginBottom: 10
            }}
          >
            <Text
              style={{
                fontSize: '30px',
                fontWeight: '900',
                marginBottom: 10
              }}
            >
              Rent Payment Receipt
            </Text>
            <View
              style={{
                display: 'flex',

                flexDirection: 'row',
                width: '100px',
                justifyContent: 'space-between'
              }}
            >
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: 'bold'
                }}
              >
                Date:
              </Text>
              <Text
                style={{
                  fontSize: 12
                }}
              >
                {format(new Date(), 'dd-MM-yyyy')}
              </Text>
            </View>
          </View>
          <View
            render={({ pageNumber }) =>
              pageNumber === 1 && (
                <Image
                  style={{ width: 80, height: 50 }}
                  src={
                    tenantPaymentDetails?.pgLocations?.images?.[0] ||
                    '/placeholder.png'
                  }
                />
              )
            }
          />
        </View>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 10,
            gap: '40px',
            marginTop: '25x'
          }}
        >
          {/* Left Column */}
          <View style={{ width: '50%', marginBottom: 10 }}>
            <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
              <Text style={{ fontWeight: 'bold', fontSize: 12, width: 80 }}>
                Billed To:{' '}
              </Text>
              <Text style={{ fontSize: 12, flex: 1 }}>
                {tenantPaymentDetails?.tenants?.name}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'flex-start',
                marginTop: '5px'
              }}
            >
              <Text style={{ fontWeight: 'bold', fontSize: 12, width: 80 }}>
                Contact:{' '}
              </Text>
              <Text style={{ fontSize: 12, flex: 1 }}>
                {tenantPaymentDetails?.tenants?.phoneNo}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'flex-start',
                marginTop: '5px'
              }}
            >
              <Text style={{ fontWeight: 'bold', fontSize: 12, width: 80 }}>
                Email:{' '}
              </Text>
              <Text style={{ fontSize: 12, flex: 1 }}>
                {tenantPaymentDetails?.tenants?.email}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'flex-start',
                marginTop: '5px'
              }}
            >
              <Text style={{ fontWeight: 'bold', fontSize: 12, width: 80 }}>
                Address:{' '}
              </Text>
              <Text style={{ fontSize: 12, flex: 1 }}>
                1/305, Pandiyan Street, Manampoondi, Villupuram 605757
              </Text>
            </View>
          </View>

          {/* Right Column */}
          <View style={{ width: '50%', marginBottom: 10 }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'flex-start',
                marginTop: '5px'
              }}
            >
              <Text style={{ fontWeight: 'bold', fontSize: 12, width: 80 }}>
                PG Location:{' '}
              </Text>
              <Text style={{ fontSize: 12, flex: 1 }}>
                {tenantPaymentDetails?.pgLocations.locationName}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'flex-start',
                marginTop: '5px'
              }}
            >
              <Text style={{ fontWeight: 'bold', fontSize: 12, width: 80 }}>
                Room No:{' '}
              </Text>
              <Text style={{ fontSize: 12, flex: 1 }}>
                {tenantPaymentDetails?.rooms.roomNo}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'flex-start',
                marginTop: '5px'
              }}
            >
              <Text style={{ fontWeight: 'bold', fontSize: 12, width: 80 }}>
                Bed No:{' '}
              </Text>
              <Text style={{ fontSize: 12, flex: 1 }}>
                {tenantPaymentDetails?.beds.bedNo}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'flex-start',
                marginTop: '5px'
              }}
            >
              <Text style={{ fontWeight: 'bold', fontSize: 12, width: 80 }}>
                PG Address:{' '}
              </Text>
              <Text style={{ fontSize: 12, flex: 1 }}>
                {tenantPaymentDetails?.pgLocations.address}
              </Text>
            </View>
          </View>
        </View>

        {/* Table */}
        <Text style={{ fontWeight: 'bold', fontSize: 12, width: 130 }}>
          Payment Details:{' '}
        </Text>
        <View
          style={{
            display: 'flex', // Change from "table" to "flex"
            flexDirection: 'column',
            borderStyle: 'solid',
            borderWidth: 0.5,
            marginBottom: 10,
            marginTop: 10
          }}
        >
          <View style={styles.row}>
            <Text style={styles.cell}>Payment Date</Text>
            <Text style={styles.cell}>Start Date</Text>
            <Text style={styles.cell}>End Date</Text>
            <Text style={styles.cell}>Payment Type</Text>
            <Text style={styles.cell}>Paid Amount</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.cell}>
              {formatDateToDDMMYYYY(
                tenantPaymentDetails?.tenants?.tenantPayments[0]?.paymentDate.toString() ||
                  ''
              )}
            </Text>
            <Text style={styles.cell}>
              {formatDateToDDMMYYYY(
                tenantPaymentDetails?.tenants.tenantPayments[0]?.startDate.toString() ||
                  ''
              )}
            </Text>
            <Text style={styles.cell}>
              {formatDateToDDMMYYYY(
                tenantPaymentDetails?.tenants.tenantPayments[0].endDate.toString() ||
                  ''
              )}
            </Text>
            <Text style={styles.cell}>
              {tenantPaymentDetails?.tenants.tenantPayments[0].paymentMethod}
            </Text>
            <Text style={styles.cell}>
              Rs {tenantPaymentDetails?.tenants.tenantPayments[0].amountPaid}/-
            </Text>
          </View>
        </View>

        <View
          style={{
            marginTop: '25px'
          }}
        >
          <Text style={{ fontWeight: 'bold', fontSize: 12, width: 100 }}>
            Payment Terms:{' '}
          </Text>
          <Text style={{ fontSize: 12, flex: 1, marginTop: 5 }}>
            This receipt confirms the payment for the mentioned period. Any
            disputes must be reported within 7 days. This receipt is proof of
            payment. Please retain it for future reference. Duplicates will not
            be issued.
          </Text>
        </View>
        <View
          style={{
            marginTop: '5px'
          }}
        >
          <Text
            style={{
              textAlign: 'center',
              marginTop: 50,
              fontSize: 14,
              fontWeight: 'bold'
            }}
          >
            Thanks For Your Payment
          </Text>
        </View>
      </Page>
    </Document>
  );
};
const InvoiceReceipt = ({
  tenantPaymentDetails
}: {
  tenantPaymentDetails?: IPaymentProps;
}) => {
  const [pdfUrl, setPdfUrl] = useState('');

  console.log('Invoice receipt', tenantPaymentDetails);

  useEffect(() => {
    const generatePdf = async () => {
      const blob = await pdf(
        <InvoicePdf tenantPaymentDetails={tenantPaymentDetails} />
      ).toBlob();
      setPdfUrl(URL.createObjectURL(blob));
    };
    generatePdf();
  }, []);
  return (
    <div className='grid p-6 text-right'>
      {pdfUrl && (
        <iframe
          src={pdfUrl}
          width='100%'
          height='400px'
          style={{ border: 'none' }} // Removes border
        />
      )}

      {/* Download Button */}
      <PDFDownloadLink
        document={<InvoicePdf tenantPaymentDetails={tenantPaymentDetails} />}
        fileName='invoice_receipt.pdf'
      >
        {({ loading }) => (
          <Button className='mt-3' variant='outline'>
            {loading ? 'Generating PDF...' : 'Quick Download PDF'}
          </Button>
        )}
      </PDFDownloadLink>
    </div>
  );
};

export default InvoiceReceipt;
