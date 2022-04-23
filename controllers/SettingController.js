'use strict'
const bcrypt = require('bcrypt-nodejs');
const Status = require('../models/Status');
const User = require('../models/User');
const Collaborator = require('../models/Collaborator');

const Subsidiaria = require('../models/Subsidiaria');
const Store = require('../models/Store');
const Email_template = require('../models/Email_template');
const TemplateAsignationEmail = require('../models/TemplateAsignationEmail');

async function showStatus(req, res) {
    let showStatusInfo = await Status.find();
    return res.json({ showStatusInfo });
}

async function createStatus(req, res) {
    const creatStatusInfo = Status({
        name: req.body.name,
        status: req.body.status,
        createdAt: new Date()
    });
    await creatStatusInfo.save();
    return res.status(200).json({ error: 0, message: "Estado Ingresado" });
}

async function updateStatus(req, res) {
    var myquery = { _id: req.body.id };
    const updatetaStusInfo = {
        name: req.body.name,
        status: req.body.status.label ? req.body.status.label : req.body.status,
        updatedAt: new Date(),
    };

    await Status.updateOne(myquery, updatetaStusInfo);
    return res.status(200).json({ error: 0, message: "Estado Actualizado" });
}

async function showUser(req, res) {
    let showUserInfo = await User.find();
    return res.json({ showUserInfo });
}

async function createUser(req, res) {
    
    const creatStatusInfo = User({
        email: req.body.email,
        name: req.body.name,
        password: req.body.password,
        status: req.body.status,
        type: req.body.type,
        change_date: req.body.change_date,
        store: req.body.store,
        createdAt: new Date(),
        updatedAt: new Date()
    });
    await creatStatusInfo.save();
    return res.status(200).json({ error: 0, message: "Usuario Ingresado" });
}

async function updateUser(req, res) {

    var myquery = { _id: req.body.id };
    var contra;
    if (req.body.password === req.body.passwordC) {
        var contra = req.body.password;
        const updatetaStusInfo = {
            email: req.body.email,
            name: req.body.name,
            password: contra,
            status: req.body.status.label ? req.body.status.label : req.body.status,
            type: req.body.typeUser.label ? req.body.typeUser.label : req.body.typeUser,
            change_date: req.body.change_date,
            store: req.body.store.label ? req.body.store.label : req.body.store,
            updatedAt: new Date()
        };


        await User.updateOne(myquery, updatetaStusInfo);

        return res.status(200).json({ error: 0, message: "Usuario Actualizado" });
    } else {
        bcrypt.genSalt(10, (err, salt) => {
            if (err) {
                next(err);
            }
            bcrypt.hash(req.body.password, salt, null, async (err, hash) => {
                if (err) {
                    return res.status(500).json({ error: 1, message: "Error al actualizar usuario" });
                }


                const updatetaStusInfo = {
                    email: req.body.email,
                    name: req.body.name,
                    password: hash,
                    status: req.body.status.label ? req.body.status.label : req.body.status,
                    type: req.body.typeUser.label ? req.body.typeUser.label : req.body.typeUser,
                    change_date: req.body.change_date,
                    store: req.body.store.label ? req.body.store.label : req.body.store,
                    updatedAt: new Date()
                };

                await User.updateOne(myquery, updatetaStusInfo);

                return res.status(200).json({ error: 0, message: "Usuario Actualizado" });
            });
        });
    }
}

async function showCollaborator(req, res) {
    let showCollaboratorInfo = await Collaborator.find({}, { name: 1, status: 1, timestamp: 1, store_asigned: 1 });
    return res.json({ showCollaboratorInfo });
}

async function createCollaborator(req, res) {

    const creatCollaboratorInfo = Collaborator({
        name: req.body.name,
        store_asigned: req.body.store,
        status: req.body.status,
        createdAt: new Date(),
        updatedAt: new Date(),
    });
    await creatCollaboratorInfo.save();
    return res.status(200).json({ error: 0, message: "Colaborador Ingresado", data: creatCollaboratorInfo });
}

async function updateCollaborator(req, res) {
    await Collaborator.findByIdAndUpdate(req.body.id, {
        name: req.body.name,
        store_asigned: req.body.store,
        status: req.body.status,
        updatedAt: new Date(),
    }, (error, response) => {
        if (error) return res.status(500).json({ error: 1, message: "Error en el servidor", textError: error });
        return res.status(200).json({ error: 0, message: "Colaborador Actualizado", data: response });
    });
}

async function showUser(req, res) {
    let showUserInfo = await User.find();
    return res.json({ showUserInfo });
}

async function showSubsidiaria(req, res) {
    let showSubsidiariaInfo = await Subsidiaria.find();
    return res.json({ subsidiarias: showSubsidiariaInfo });
}

async function getSubsidiariaActives(req, res) {
    await Subsidiaria.find({ status: 'Activo' }, (err, subsidiarias) => {
        if (err) { console.log(err); return }
        return res.json({ subsidiarias });
    });
}

async function createSubsidiaria(req, res) {

    const creatSubsidiaria = Subsidiaria({
        name: req.body.name,
        status: req.body.status,
        createdAt: new Date(),
        updatedAt: new Date(),
    });
    await creatSubsidiaria.save();
    return res.status(200).json({ error: 0, message: "Subsidiaria Creada" });
}

async function updateSubsidiaria(req, res) {
    await Subsidiaria.findByIdAndUpdate(req.body.id, {
        name: req.body.name,
        status: req.body.status,
        updatedAt: new Date(),
    }, (error, response) => {
        if (error) return res.status(500).json({ error: 1, message: "Error en el servidor", textError: error });
        return res.status(200).json({ error: 0, message: "Subsidiaria Actualizada", data: response });
    });
}

async function createStore(req, res) {

    const creatStoreInfo = Store({
        name: req.body.name,
        sbs: req.body.sbs,
        status: req.body.status,
        createdAt: new Date(),
        updatedAt: new Date(),
    });
    await creatStoreInfo.save();
    return res.status(200).json({ error: 0, message: "Tienda Ingresado" });
}

async function updateStore(req, res) {

    //
    var showStoreAfter = await Store.findById(req.body.id);
    console.log(1, showStoreAfter);

    var showUserInfo = await User.find({store:showStoreAfter.name});
    console.log(2,showUserInfo)


    showUserInfo.map(async (userData)=>{
        await User.findByIdAndUpdate(userData._id,{
            store:req.body.name,
        }, (error, response) => {
            if (error) return false
            return true
        }); 
    });

    console.log(updateUser);

    await Store.findByIdAndUpdate(req.body.id, {
        name: req.body.name,
        sbs: req.body.sbs,
        status: req.body.status,
        updatedAt: new Date(),
    }, async(error, response) => {
        if (error) return res.status(500).json({ error: 1, message: "Error en el servidor", textError: error });
        return res.status(200).json({ error: 0, message: "Tienda Actualizada", data: response });
    });
}

async function showEmailtemplate(req, res) {
    let showUserInfo = await Email_template.find();
    return res.json({ showUserInfo });
}

async function createEmailtemplate(req, res) {
    const creatEmailtemplateInfo = Email_template({
        email: req.body.email,
        template: req.body.template.value ? req.body.template.value : req.body.template,
        status: req.body.status.value ? req.body.status.value : req.body.status,
        date_at: new Date(),
        date_update: new Date(),
    });
    await creatEmailtemplateInfo.save();
    return res.status(200).json({ error: 0, message: "Email Ingresado" });
}

async function updateEmailtemplate(req, res) {
    await Email_template.findByIdAndUpdate(req.body.id, {
        email: req.body.email,
        template: req.body.template.value ? req.body.template.value : req.body.template,
        status: req.body.status.value ? req.body.status.value : req.body.status,
        date_update: new Date()
    }, (error, response) => {
        if (error) return res.status(500).json({ error: 1, message: "Error en el servidor", textError: error });
        return res.status(200).json({ error: 0, message: "Email Actualizada", data: response });
    });
}

/* Template Asigned Email*/
async function showTemplateAsignedEmail(req, res) {
    let showTemplateAsignationEmail = await TemplateAsignationEmail.find();
    return res.json({ showTemplateAsignationEmail });
}

async function createTemplateAsignedEmail(req, res) {
    const createTemplateAsignationEmail = TemplateAsignationEmail({
        name: req.body.name,
        status: req.body.status.value ? req.body.status.value : req.body.status,
        date_at: new Date(),
        date_update: new Date(),
    });
    await createTemplateAsignationEmail.save();
    return res.status(200).json({ error: 0, message: "Template Ingresado" });
}

async function updateTemplateAsignedEmail(req, res) {

    await TemplateAsignationEmail.findByIdAndUpdate(req.body.id, {
        name: req.body.name,
        status: req.body.status.value ? req.body.status.value : req.body.status,
        date_update: new Date()
    }, (error, response) => {
        if (error) return res.status(500).json({ error: 1, message: "Error en el servidor", textError: error });
        return res.status(200).json({ error: 0, message: "Template Actualizada", data: response });
    });
}

/*Retorna Email Asignados*/

async function returnEmailsAsigned(req, res) {
    const { template } = req.body;
    var emails = [];
    let showUserInfo = await Email_template.find({ template: template, status: "Activo" });
    showUserInfo.map((elementos) => {
        return emails.push(elementos.email)
    })
    return res.json({ emails });
}

module.exports = {
    showStatus,
    createStatus,
    updateStatus,
    showUser,
    createUser,
    updateUser,
    showCollaborator,
    createCollaborator,
    updateCollaborator,
    showSubsidiaria,
    getSubsidiariaActives,
    createSubsidiaria,
    updateSubsidiaria,
    createStore,
    updateStore,
    showEmailtemplate,
    createEmailtemplate,
    updateEmailtemplate,
    showTemplateAsignedEmail,
    createTemplateAsignedEmail,
    updateTemplateAsignedEmail,
    returnEmailsAsigned
}
