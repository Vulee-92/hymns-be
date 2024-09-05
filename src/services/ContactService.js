const Contact = require("../models/ContactModel");
const nodemailer = require("nodemailer");

const createContact = async (contactData) => {
  try {
    const newContact = await Contact.create(contactData);
    await sendContactEmail(newContact);
    return newContact;
  } catch (error) {
    throw new Error("Error creating contact: " + error.message);
  }
};

const getAllContacts = async () => {
  try {
    return await Contact.find().sort({ createdAt: -1 });
  } catch (error) {
    throw new Error("Error fetching contacts: " + error.message);
  }
};

const getContactById = async (id) => {
  try {
    const contact = await Contact.findById(id);
    if (!contact) throw new Error("Contact not found");
    return contact;
  } catch (error) {
    throw new Error("Error fetching contact: " + error.message);
  }
};

const updateContact = async (id, updateData) => {
  try {
    const updatedContact = await Contact.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedContact) throw new Error("Contact not found");
    return updatedContact;
  } catch (error) {
    throw new Error("Error updating contact: " + error.message);
  }
};

const deleteContact = async (id) => {
  try {
    const deletedContact = await Contact.findByIdAndDelete(id);
    if (!deletedContact) throw new Error("Contact not found");
    return deletedContact;
  } catch (error) {
    throw new Error("Error deleting contact: " + error.message);
  }
};

const sendContactEmail = async (contactInfo) => {
  const { name, email, phone, contactmessenger, subject } = contactInfo;

  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.MAIL_ACCOUNT,
        pass: process.env.MAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.MAIL_ACCOUNT,
      to: "hymnscenter@gmail.com",
      subject: subject || "New contact message from your website",
      text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nMessage: ${contactmessenger}`,
    };

    await transporter.sendMail(mailOptions);

    return {
      status: "OK",
      message: "Your message has been sent successfully",
    };
  } catch (error) {
    console.error(error);
    throw new Error("An error occurred while sending the message");
  }
};
const deleteMultipleContacts = async (ids) => {
	console.log("ids", ids);
  try {
    const result = await Contact.deleteMany({ _id: { $in: ids } });
    if (result.deletedCount === 0) {
      throw new Error("No contacts found with the given ids");
    }
    return result;
  } catch (error) {
    throw new Error("Error deleting multiple contacts: " + error.message);
  }
};
module.exports = {
  createContact,
  getAllContacts,
  getContactById,
  updateContact,
  deleteContact,
  sendContactEmail,
	deleteMultipleContacts
};