const PDFDocument = require("pdfkit");
const Appointment = require("../models/appointment.model");
const Admin = require("../models/admin.model");

const generateInvoiceController = async (req, res) => {
  try {
    const { aid } = req.params;
    const { uid } = req.query;

    const appointment = await Appointment.findOne({ _id: aid, tenant: uid })
      .populate("service")
      .populate("client");

    const adminDetails = await Admin.findOne({ tenant: uid });
    const doc = new PDFDocument({ margin: 50 });

    let buffers = [];
    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", () => {
      const pdfData = Buffer.concat(buffers);
      res
        .writeHead(200, {
          "Content-Type": "application/pdf",
          "Content-Disposition": "inline; filename=invoice.pdf",
          "Content-Length": pdfData.length,
        })
        .end(pdfData);
    });

    // ------------- BUSINESS HEADER -------------
    doc
      .fontSize(16)
      .font("Helvetica-Bold")
      .text(`${adminDetails.legalName}`, { align: "left" });
    doc
      .fontSize(10)
      .font("Helvetica")
      .text(`${adminDetails.address}`, { align: "left" })
      .text(`Phone: ${adminDetails.phone}`, { align: "left" })
      .text(`Email: ${adminDetails.email}`, { align: "left" })
      .text(`GST: ${adminDetails.gstNo}`, { align: "left" });

    doc.moveDown(1);

    // ------------- INVOICE TITLE -------------
    doc
      .fontSize(14)
      .font("Helvetica-Bold")
      .text("APPOINTMENT INVOICE", { align: "center", underline: true });

    doc.moveDown(1);

    // ------------- INVOICE INFO -------------
    const invoiceNo = `${appointment._id}`;
    const formattedDate = new Date().toLocaleString("en-IN");

    doc
      .fontSize(10)
      .font("Helvetica")
      .text(`Invoice No: ${invoiceNo}`, { continued: true })
      .text(`   Date: ${formattedDate}`, { align: "right" });

    doc
      .text(`Appointment ID: ${appointment._id || "N/A"}`, { continued: true })
      .text(`   Client ID: ${appointment.client._id || "N/A"}`, {
        align: "right",
      });

    doc.moveDown(1);

    // ------------- CLIENT DETAILS -------------
    doc.fontSize(12).font("Helvetica-Bold").text("Billed To:");

    doc
      .fontSize(10)
      .font("Helvetica")
      .text(`Name: ${appointment.client?.name || "N/A"}`)
      .text(`Email: ${appointment.client?.email || "N/A"}`)
      .text(`Phone: ${appointment.client?.phone || "N/A"}`);

    doc.moveDown(2);

    // ------------- SERVICES TABLE -------------
    generateTable(doc, appointment);

    // ------------- END / FOOTER -------------
    doc.moveDown(3);
    doc
      .fontSize(10)
      .text("Thank you for your appointment!", { align: "center" });

    doc.end();
  } catch (error) {
    console.error(error);
    res.status(500).send("Error generating invoice");
  }
};

function generateTable(doc, appointment) {
  const tableTop = doc.y;
  const snX = 50;
  const descriptionX = 100;
  const amountX = 450;

  // ---------- Table Header ----------
  doc
    .fontSize(12)
    .text("S.No", snX, tableTop)
    .text("Service", descriptionX, tableTop)
    .text("Charges (Rs)", amountX, tableTop, { align: "right" });

  doc
    .moveTo(50, tableTop + 15)
    .lineTo(550, tableTop + 15)
    .stroke();

  // ---------- Services Rows ----------
  const services = Array.isArray(appointment.service)
    ? appointment.service
    : [appointment.service];

  const gstRate = 0.18; // 18% GST
  let subtotal = 0;
  let rowY = tableTop + 25;

  services.forEach((srv, index) => {
    const serviceName = srv?.name || "Unknown Service";
    let amountInclGST = Number(srv?.charges);
    if (!isFinite(amountInclGST)) amountInclGST = 0;

    // Calculate amount exclusive of GST
    let amountExclGST = amountInclGST / (1 + gstRate);

    doc
      .fontSize(10)
      .text(index + 1, snX, rowY)
      .text(serviceName, descriptionX, rowY)
      .text(`Rs ${amountExclGST.toFixed(2)}`, amountX, rowY, {
        align: "right",
      });

    rowY += 20;
    subtotal += amountExclGST;
  });

  // ---------- Subtotal ----------
  doc.moveTo(50, rowY).lineTo(550, rowY).stroke();

  doc
    .fontSize(10)
    .text("Subtotal", descriptionX, rowY + 10)
    .text(`Rs ${subtotal.toFixed(2)}`, amountX, rowY + 10, { align: "right" });

  rowY += 25;

  // ---------- GST ----------
  const gstAmount = subtotal * gstRate;

  doc
    .fontSize(10)
    .text(`GST (${gstRate * 100}%)`, descriptionX, rowY)
    .text(`Rs ${gstAmount.toFixed(2)}`, amountX, rowY, { align: "right" });

  rowY += 20;

  // ---------- Grand Total (Inclusive of GST) ----------
  const grandTotal = subtotal + gstAmount;

  doc
    .fontSize(12)
    .font("Helvetica-Bold")
    .text("Grand Total (Incl. GST)", descriptionX, rowY)
    .text(`Rs ${grandTotal.toFixed(2)}`, amountX, rowY, { align: "right" });

  // reset font
  doc.font("Helvetica");
}

module.exports = generateInvoiceController;
