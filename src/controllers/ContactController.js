const ContactService = require("../services/ContactService");

const createContact = async (req, res) => {
  try {
    const { name, email, contactmessenger, phone, subject } = req.body;
    const reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
    const isCheckEmail = reg.test(email);
    if (!name || !email || !contactmessenger || !phone) {
      return res.status(400).json({
        status: "ERR",
        message: "All fields are required",
      });
    } else if (!isCheckEmail) {
      return res.status(400).json({
        status: "ERR",
        message: "Please enter a valid email address",
      });
    }
    const result = await ContactService.createContact({ name, email, contactmessenger, phone, subject });
    return res.status(201).json({
      status: "OK",
      message: "Contact created successfully",
      data: result,
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      status: "ERR",
      message: "An error occurred while creating the contact",
    });
  }
};

const getAllContacts = async (req, res) => {
  try {
    const contacts = await ContactService.getAllContacts();
    return res.status(200).json({
      status: "OK",
      data: contacts,
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      status: "ERR",
      message: "An error occurred while fetching contacts",
    });
  }
};

const getContactById = async (req, res) => {
  try {
    const { id } = req.params;
    const contact = await ContactService.getContactById(id);
    return res.status(200).json({
      status: "OK",
      data: contact,
    });
  } catch (e) {
    console.error(e);
    return res.status(404).json({
      status: "ERR",
      message: e.message,
    });
  }
};

const updateContact = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const updatedContact = await ContactService.updateContact(id, updateData);
    return res.status(200).json({
      status: "OK",
      message: "Contact updated successfully",
      data: updatedContact,
    });
  } catch (e) {
    console.error(e);
    return res.status(404).json({
      status: "ERR",
      message: e.message,
    });
  }
};

const deleteContact = async (req, res) => {
  try {
    const { id } = req.params;
    await ContactService.deleteContact(id);
    return res.status(200).json({
      status: "OK",
      message: "Contact deleted successfully",
    });
  } catch (e) {
    console.error(e);
    return res.status(404).json({
      status: "ERR",
      message: e.message,
    });
  }
};
const deleteMultipleContacts = async (req, res) => {
  try {
    const { ids } = req.body;
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        status: "ERR",
        message: "Invalid input: ids must be a non-empty array",
      });
    }
    const result = await ContactService.deleteMultipleContacts(ids);
    return res.status(200).json({
      status: "OK",
      message: `Successfully deleted ${result.deletedCount} contacts`,
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      status: "ERR",
      message: e.message,
    });
  }
};
module.exports = {
  createContact,
  getAllContacts,
  getContactById,
  updateContact,
  deleteContact,
	deleteMultipleContacts
};