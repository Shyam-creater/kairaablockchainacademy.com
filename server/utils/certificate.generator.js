import PDFDocument from "pdfkit";
import QRCode from "qrcode";
import fs from "fs";
import path from "path";

/**
 * Generates a Data URI for a QR code.
 */
export const generateCertificateQR = async (certificateNumber) => {
  try {
    const verifyUrl = `${process.env.FRONTEND_URL || "http://localhost:3000"}/verify-certificate/${certificateNumber}`;
    const qrDataUri = await QRCode.toDataURL(verifyUrl, {
      color: {
        dark: "#000000",
        light: "#ffffff",
      },
      width: 150,
    });
    return qrDataUri;
  } catch (error) {
    console.error("QR Generation Error:", error);
    return null;
  }
};

/**
 * Generates a PDF buffer for the certificate.
 */
export const generateCertificatePDF = async (certificateData) => {
  return new Promise(async (resolve, reject) => {
    try {
      const doc = new PDFDocument({
        layout: "landscape",
        size: "A4",
        margins: { top: 50, bottom: 50, left: 50, right: 50 },
      });

      const buffers = [];
      doc.on("data", buffers.push.bind(buffers));
      doc.on("end", () => resolve(Buffer.concat(buffers)));
      doc.on("error", reject);

      // Background / Border
      doc.rect(20, 20, doc.page.width - 40, doc.page.height - 40)
         .lineWidth(5)
         .stroke("#00f2fe"); // Primary accent color

      // Inner border
      doc.rect(30, 30, doc.page.width - 60, doc.page.height - 60)
         .lineWidth(1)
         .stroke("#333333");

      // Title
      doc.font("Helvetica-Bold")
         .fontSize(40)
         .fillColor("#1a1a1a")
         .text("CERTIFICATE OF COMPLETION", 0, 100, { align: "center" });

      doc.font("Helvetica")
         .fontSize(16)
         .fillColor("#666666")
         .text("This is to certify that", 0, 160, { align: "center" });

      // Student Name
      doc.font("Helvetica-Bold")
         .fontSize(32)
         .fillColor("#00f2fe")
         .text(certificateData.studentName.toUpperCase(), 0, 210, { align: "center" });

      doc.font("Helvetica")
         .fontSize(16)
         .fillColor("#666666")
         .text("has successfully completed the comprehensive course:", 0, 270, { align: "center" });

      // Course Name
      doc.font("Helvetica-Bold")
         .fontSize(24)
         .fillColor("#1a1a1a")
         .text(certificateData.courseName, 0, 310, { align: "center" });

      // Dates and Details
      const issueDateStr = new Date(certificateData.issueDate).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
      
      doc.font("Helvetica")
         .fontSize(14)
         .fillColor("#333333")
         .text(`Granted on this day, ${issueDateStr}`, 0, 370, { align: "center" });

      // Signatures
      doc.moveTo(150, 480).lineTo(350, 480).lineWidth(1).stroke("#000");
      doc.font("Helvetica-Bold").fontSize(12).text("Course Instructor", 150, 490, { width: 200, align: "center" });

      doc.moveTo(doc.page.width - 350, 480).lineTo(doc.page.width - 150, 480).lineWidth(1).stroke("#000");
      doc.font("Helvetica-Bold").fontSize(12).text("Academy Director", doc.page.width - 350, 490, { width: 200, align: "center" });

      // Bottom Metadata & QR
      doc.font("Helvetica").fontSize(10).fillColor("#999999")
         .text(`Certificate No: ${certificateData.certificateNumber}`, 50, doc.page.height - 80);
      
      doc.text(`Verify at: ${process.env.FRONTEND_URL || "http://localhost:3000"}/verify-certificate/${certificateData.certificateNumber}`, 50, doc.page.height - 65);

      // Embed QR Code if generated
      if (certificateData.qrCodeUrl) {
        // qrcode.toDataURL creates a base64 png string
        const base64Data = certificateData.qrCodeUrl.replace(/^data:image\/png;base64,/, "");
        const imgBuffer = Buffer.from(base64Data, "base64");
        
        doc.image(imgBuffer, doc.page.width / 2 - 40, 420, { width: 80 });
      }

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};
