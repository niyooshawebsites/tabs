const mailer = require("nodemailer");
const moment = require("moment");

const sendAppointmentBookingEmail = (client, appointment, admin) => {
  const msg = `
    <div style="max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9; font-family: Arial, sans-serif; color: #333;">
    <h1 style="color: #000; text-align:center">IABS</h1>

    <hr style="margin: 30px 0"/>

      <h4 style="color: #000; text-align:center">Hello Mr./Miss. ${
        client.name
      },</h4>

      <p style="font-size: 16px; color: #555; text-align:center">
        Your appointment status for
        <strong style="color: #FF6600;">${appointment.service.name}</strong>
        on
        <strong style="color: #FF6600;">
          ${moment(appointment.date).format("DD-MM-YYYY")}
        </strong>
        at
        <strong style="color: #FF6600;">${appointment.time}</strong>
        with
        <strong style="color: #FF6600;">${admin.legalName}</strong>
        is <strong style="color: #FF6600;">${appointment.status}</strong>.
      </p>

      <p style="font-size: 16px; color: #555; text-align:center">
        Your appointment ID is
        <strong style="color: #FF6600;">${appointment._id}</strong>
      </p>

      <p style="font-size: 14px; color: #555; margin-top: 30px; text-align: center">
        Thank you for choosing our service.
      </p>

      <p style="font-size: 12px; color: #aaa; margin-top: 40px; text-align: center;">
        If you have any questions, feel free to reach us.
      </p>
    </div>
  `;

  // Create the transporter
  const transporter = mailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  // Set email options
  const mailOptions = {
    from: process.env.ADMIN_EMAIL,
    to: client.email,
    subject: "New Appointment",
    html: msg,
  };

  // Send the email
  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log("❌ Email send failed:", err);
    } else {
      console.log(`✅ Email sent: ${info.response}`);
    }
  });
};

const sendAppointmentStatusChangeEmail = (client, appointment, admin) => {
  const generalMsg = `
    <div style="max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9; font-family: Arial, sans-serif; color: #333;">
    <h1 style="color: #000; text-align:center">IABS</h1>

    <hr style="margin: 30px 0"/>

      <h4 style="color: #000; text-align:center">Hello Mr./Miss. ${
        client.name
      },</h4>

      <p style="font-size: 16px; color: #555; text-align:center">
        Appointment ID is
        <strong style="color: #FF6600;">${appointment._id}</strong>
      </p>

      <p style="font-size: 16px; color: #555; text-align:center">
        Your appointment status for
        <strong style="color: #FF6600;">${appointment.service.name}</strong>
        on
        <strong style="color: #FF6600;">
          ${moment(appointment.date).format("DD-MM-YYYY")}
        </strong>
        at
        <strong style="color: #FF6600;">${appointment.time}</strong>
        with
        <strong style="color: #FF6600;">${admin.legalName}</strong>
        is <strong style="color: #FF6600;">${appointment.status}</strong>.
      </p>

      <p style="font-size: 14px; color: #555; margin-top: 30px; text-align: center">
        Thank you for choosing our service.
      </p>

      <p style="font-size: 12px; color: #aaa; margin-top: 40px; text-align: center;">
        If you have any questions, feel free to reach us.
      </p>
    </div>
  `;

  const RescheduledMsg = `
    <div style="max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9; font-family: Arial, sans-serif; color: #333;">
    <h1 style="color: #000; text-align:center">IABS</h1>

    <hr style="margin: 30px 0"/>

      <h4 style="color: #000; text-align:center">Hello Mr./Miss. ${
        client.name
      },</h4>

      <p style="font-size: 16px; color: #555; text-align:center">
        Appointment ID is
        <strong style="color: #FF6600;">${appointment._id}</strong>
      </p>

      <p style="font-size: 16px; color: #555; text-align:center">
        Your appointment for 
        <strong style="color: #FF6600;">${
          appointment.service.name
        }</strong>        with
        <strong style="color: #FF6600;">${admin.legalName}</strong>
        has been rescheduled on <strong style="color: #FF6600;">
          ${moment(appointment.date).format("DD-MM-YYYY")}
        </strong>
        at
        <strong style="color: #FF6600;">${appointment.time}</strong>
      </p>

      <p style="font-size: 14px; color: #555; margin-top: 30px; text-align: center">
        Thank you for choosing our service.
      </p>

      <p style="font-size: 12px; color: #aaa; margin-top: 40px; text-align: center;">
        If you have any questions, feel free to reach us.
      </p>
    </div>
  `;

  const NoShowMsg = `
    <div style="max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9; font-family: Arial, sans-serif; color: #333;">
    <h1 style="color: #000; text-align:center">IABS</h1>

    <hr style="margin: 30px 0"/>

      <h4 style="color: #000; text-align:center">Hello Mr./Miss. ${
        client.name
      },</h4>

      <p style="font-size: 16px; color: #555; text-align:center">
        Appointment ID is
        <strong style="color: #FF6600;">${appointment._id}</strong>
      </p>

      <p style="font-size: 16px; color: #555; text-align:center">
        Your appointment for 
        <strong style="color: #FF6600;">${
          appointment.service.name
        }</strong> on <strong style="color: #FF6600;">
          ${moment(appointment.date).format("DD-MM-YYYY")}
        </strong>
        at <strong style="color: #FF6600;">${
          appointment.time
        }</strong>        with
        <strong style="color: #FF6600;">${
          admin.legalName
        }</strong> is <strong style="color: #FF6600;">${
    appointment.staus
  }</strong>
      </p>

      <p>Request you to kindly rebook the appointment or pay us a visit</p>

      <p style="font-size: 14px; color: #555; margin-top: 30px; text-align: center">
        Thank you for choosing our service.
      </p>

      <p style="font-size: 12px; color: #aaa; margin-top: 40px; text-align: center;">
        If you have any questions, feel free to reach us.
      </p>
    </div>
  `;

  let msg;
  if (appointment.status == "Rescheduled") {
    msg = RescheduledMsg;
  } else if (appointment.status == "No-Show") {
    msg = NoShowMsg;
  } else {
    msg = generalMsg;
  }

  // Create the transporter
  const transporter = mailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  // Set email options
  const mailOptions = {
    from: process.env.ADMIN_EMAIL,
    to: client.email,
    subject: "Appointment Status Change",
    html: msg,
  };

  // Send the email
  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log("❌ Email send failed:", err);
    } else {
      console.log(`✅ Email sent: ${info.response}`);
    }
  });
};

module.exports = {
  sendAppointmentBookingEmail,
  sendAppointmentStatusChangeEmail,
};
