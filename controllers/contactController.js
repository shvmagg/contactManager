const asyncHandler = require("express-async-handler"); // Handles async function try catch on its own(express middleware)
const Contact = require("../models/contactModel");

// @desciption Get all contacts
// @routes GET api/contacts
// @access Private

const getContacts = asyncHandler(async (req,res) => {
    const contacts = await Contact.find({user_id:req.user.id});
    res.status(200).json(contacts);
});

// @desciption create new contact
// @routes POST api/contacts
// @access Private

const createContact = asyncHandler(async (req,res) => {
    console.log("This is post method body", req.body)
    const {name, email, phone} = req.body;
    if(!name || !email || !phone){
        res.status(404);
        throw new Error("All fields are mandatory");
    }

    const contact = await Contact.create({
        name,
        email,
        phone,
        user_id:req.user.id
    });
    res.status(201).json({contact}); //201-> response created
});

// @desciption Get specific contact
// @routes GET api/contacts/:id
// @access Private

const getContact = asyncHandler(async (req,res) => {
    const contact = await Contact.findById(req.params.id);
    if(!contact){
        res.status(404);
        throw new Error("Contact not found");
    }
    res.status(200).json(contact);
});

// @desciption update contact
// @routes PUT api/contacts/:id
// @access Private

const updateContact = asyncHandler(async (req,res) => {
    const contact = await Contact.findById(req.params.id);
    if(!contact){
        res.status(404);
        throw new Error("Contact not found");
    }
    if (contact.user_id.toString() !== req.user.id){
        res.status(403);
        throw new Error("User dont have permission to update other user contacts");
    }
    const updatedContact = await Contact.findByIdAndUpdate(
        req.params.id,
        req.body,
        {new : true}
    )
    res.status(200).json(updatedContact);
});

// @desciption delete contact
// @routes PUT api/contacts/:id
// @access Private

const deleteContact = asyncHandler(async (req,res) => {
    const contact = await Contact.findById(req.params.id);
    if(!contact){
        res.status(404);
        throw new Error("Contact not found");
    }
    if (contact.user_id.toString() !== req.user.id){
        res.status(403);
        throw new Error("User dont have permission to update other user contacts");
    }
    await Contact.deleteOne({"_id":req.params.id });
    res.status(200).json(contact);
});

module.exports = {
    getContacts,
    createContact, 
    getContact, 
    updateContact, 
    deleteContact
};