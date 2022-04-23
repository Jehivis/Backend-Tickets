const express = require('express');
const router = express.Router();

// const passport = require("passport");
// const GoogleStrategy = require("passport-google-oauth2");

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
//Models
const User = require('../models/User');
//Controllers
const userController = require('../controllers/UserController');
const ticketController = require('../controllers/TicketController');
const collaboratorController = require('../controllers/CollaboratorController');
const binnacleSaleController = require('../controllers/BinnacleSaleController');
const DamagedMerchandiseController = require('../controllers/DamagedMerchandiseController');
const CertificateController = require('../controllers/CertificateController');
const RetreatsController = require('../controllers/RetreatsController');
const SettingController = require('../controllers/SettingController');

const ChangeDataController = require('../controllers/ChangeDataController');

const routesProtected = express.Router();

routesProtected.use((req, res, next) => {

    const token = req.headers.token;
    if (token) {
        console.log(token)
        jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
            console.log("1")
            if (err) {
                console.log("2")
                res.json({ message: 'Token Inválida.' });
            } else {
                console.log("3")
                req.decoded = decoded;
                next();
            }
        });
    } else {
        res.status(400).json({ message: 'No se envio Token.' });
        console.log("Murio")
    }
});

router.get('/', userController.getUsers);

router.post('/login', userController.Login);


router.post('/login/google', async (req, res) => {
    console.log(req.body.user);
    User.findOne({
        email: req.body.user
    })
        .then(user => {
            console.log(user);
            if (user) {
                const payload = {
                    check: true,
                    user_data: user
                };
                let token = jwt.sign(payload, process.env.SECRET_KEY, {
                    expiresIn: 1440
                })
                res.send({ token, user })
            } else {
                console.log('Usuario Incorrecto');
                res.status(400).json({ err: '2', message: 'Usuario Incorrecto' })
            }
        })
        .catch(err => {
            console.log(err);
            res.status(400).json({ error: err })
        })
})

/*-------------------------------------------
----------------- TOCKETS -------------------
---------------------------------------------*/
router.get('/binnacles/sales/report/:dateIn/:dateOut', binnacleSaleController.getBinnacleSaleReportDate)
router.get('/binnacles/sales/report/methods/:dateIn/:dateOut', binnacleSaleController.getBinnacleSaleMethodReportDate)
router.get('/binnacles/sales_show_report', binnacleSaleController.getBinnacleSaleReport)
router.post('/binnacles/sales_show', binnacleSaleController.getBinnacleSale)
router.post('/binnacles/sales_show_by_id', binnacleSaleController.getBinnacleSaleById)
router.get('/binnacles/sales/:id', binnacleSaleController.getBinnacleSaleReportBefore)
router.get('/binnacles/sales_totals', binnacleSaleController.getBinnacleSaleReportTotal)
router.get('/binnacles/sales_totals_send_firebase', binnacleSaleController.getBinnacleSaleReportTotalSendFirebase)
//ReporteLourdes
router.get('/binnacles/ticketsInmediate', ticketController.getTicketsInmediate)
router.get('/binnacles/ticketsInmediate2', ticketController.getTicketsInmediate2)
router.get('/binnacles/ticketsInmediate_sendFirebase', ticketController.getTicketsInmediateSendFirebase)
router.post('/binnacles_dailies/show', binnacleSaleController.getBinnacleDailies);
router.post('/binnacles_dailies/delete',binnacleSaleController.deleteBinnacleDailies);
router.post('/binnacles_dailies/created',binnacleSaleController.creatBinnacleDailies);
router.post('/binnacles_dailies/report/:date_start/:date_end',binnacleSaleController.getDataReportDailies);
/*-------------------------------------------
----------------- TICKETS -------------------
---------------------------------------------*/
router.post('/tickets/add/transfer', ticketController.storeTicketSystemTransfer);
router.post('/tickets/add/inmediates', ticketController.storeTicketInmediates);
router.post('/tickets/add/photo_retreats', ticketController.storeTicketPhotoRetreats);
router.post('/tickets/add/external_retreats', ticketController.storeTicketExternalRetreats);
router.post('/tickets/transfer', ticketController.getAllTicketsSystemTransfer);
router.post('/tickets/transfer_created', ticketController.getSystemTransferCreate);
router.post('/tickets/transfer_assigned', ticketController.getSystemTransferAssigned);
router.post('/tickets/immediate_deliveries', ticketController.getAllTicketsInmediates);
router.post('/tickets/immediate_deliveries_assigned', ticketController.getTicketsInmediatesAssigned);
router.post('/tickets/immediate_deliveries_created', ticketController.getTicketsInmediatesCreated);
router.post('/tickets/all/photo_retreats', ticketController.getAllPhotoRetreats);
router.post('/tickets/photo_retreats', ticketController.getPhotoRetreats);
router.post('/tickets/all/external_retreats', ticketController.getAllExernalRetreats);
router.post('/tickets/external_retreats', ticketController.getExernalRetreats);
router.post('/tickets/report/:date_start/:date_end', ticketController.getDataReport);
router.put('/ticket/inactive/:id', ticketController.inactivateTicket);
router.put('/ticket/immediate_deliveries/inactive/:id', ticketController.inactivateTicketInmediate);
router.put('/ticket/photo_retreats/inactive/:id', ticketController.inactivatePhotoRetreats);
router.put('/ticket/external_retreats/inactive/:id', ticketController.inactivateExternalRetreats);
router.put('/ticket/complete/:id', ticketController.completeTicket);
router.put('/ticket/immediate_deliveries/complete/:id', ticketController.completeTicketInmediate);
router.put('/ticket/photo_retreats/complete/:id', ticketController.completePhotoRetreats);
router.get('/tickets/stores', ticketController.getStore);
router.get('/tickets/stores_actives', ticketController.getStoreActive);
router.post('/user/store', ticketController.getOneStoreActive);



/*-------------------------------------------
----------------- COLLABORATOR --------------
---------------------------------------------*/

router.get('/collaborator/get', collaboratorController.getCollaborator);


/*-------------------------------------------
-----------------Datos De Ventas-------------
---------------------------------------------*/

router.post('/sales/create',binnacleSaleController.setBinnacleSalesCreate);
router.post('/sales/delete',binnacleSaleController.deleteDataSale);
router.post('/sales/update', binnacleSaleController.setBinnacleSalesUpdate);
router.post('/sales/validationDataSale',binnacleSaleController.validationDataSale);
router.post('/sales/report/:date_start/:date_end',binnacleSaleController.getDataReport);
router.post('/sales/payment_methods/report/:date_start/:date_end',binnacleSaleController.getDataReportMethods);

/*-----------------------------------------------------
----------------- MERCADERIA DAÑADA -------------------
-------------------------------------------------------*/
router.post('/damaged_merchandise/create', DamagedMerchandiseController.storeDamagedMerchandise);
router.post('/damaged_merchandise', DamagedMerchandiseController.getDamageMerchandise);
router.post('/damaged_merchandise/report/:date_start/:date_end', DamagedMerchandiseController.getDataReport);

/*------------------------------------------------
----------------- CERTIFICADOS -------------------
--------------------------------------------------*/
router.post('/certificate/create', CertificateController.store_certificate);
router.post('/certificates/actives', CertificateController.getCertificatesActives);
router.post('/certificates/exchange', CertificateController.getCertificates);
router.put('/certificate/exchange', CertificateController.updateCertificate);
router.post('/certificates/report/:date_start/:date_end', CertificateController.getDataReport);
/*-----------------------------------------------------
----------------------- RETREATS ----------------------
-------------------------------------------------------*/

router.post('/retreatsShow', RetreatsController.showRetreats);
router.post('/retreatsDebtShowList', RetreatsController.showRetreatsDebtList);
router.post('/retreatsDebtShowListHistory', RetreatsController.showRetreatsDebtListHistory);
router.post('/retreatsBinacleList', RetreatsController.showRetreatsBinacleList);
router.post('/retreatsUpdate', RetreatsController.updateRetreats);
router.post('/retreatsUpdateRove', RetreatsController.updateRetreatsRemove);
router.post('/createdUpdate', RetreatsController.createdRetreats);
router.post('/retreats/report/:date_start/:date_end', RetreatsController.getDataReport);
/*-----------------------------------------------------
----------------------- SETITNGS ----------------------
-------------------------------------------------------*/
router.post('/statusShow', SettingController.showStatus);
router.post('/statusCreate', SettingController.createStatus);
router.post('/statusUpdate', SettingController.updateStatus);

router.post('/userShow', SettingController.showUser);
router.post('/userCreate', SettingController.createUser);
router.post('/userUpdate', SettingController.updateUser);

/* COLABORADORES */
router.post('/collaboratorShow', SettingController.showCollaborator);
router.post('/collaboratorCreate', SettingController.createCollaborator);
router.put('/collaboratorUpdate', SettingController.updateCollaborator);

router.post('/userShow', SettingController.showUser);
/* SUBSIDIARIA */
router.get('/subsidiarias_actives', SettingController.getSubsidiariaActives);
router.post('/subsidiariaShow', SettingController.showSubsidiaria);
router.post('/subsidiariaCreate', SettingController.createSubsidiaria);
router.put('/subsidiariaUpdate', SettingController.updateSubsidiaria);
/* TIENDA */
router.post('/storeCreate', SettingController.createStore);
router.put('/storeUpdate', SettingController.updateStore);

/* EMAIL TEMPLATE */
router.post('/emailTemplateShow', SettingController.showEmailtemplate);
router.post('/emailTemplateCreate', SettingController.createEmailtemplate);
router.put('/emailTemplateUpdate', SettingController.updateEmailtemplate);

/* TEMPLATE  ASIGNED EMAIL*/
router.post('/templateAsignedEmaileShow', SettingController.showTemplateAsignedEmail);
router.post('/templateAsignedEmailCreate', SettingController.createTemplateAsignedEmail);
router.put('/templateAsignedEmailUpdate', SettingController.updateTemplateAsignedEmail);

/*Optiene emails asignados al correo*/
router.post('/emailsAsigned', SettingController.returnEmailsAsigned);


/* Cambio de nombres historico*/
router.post('/changeNameStore', ChangeDataController.changeNameStore);
router.get('/getDateBefore', ChangeDataController.getDateBefore);
module.exports = router;