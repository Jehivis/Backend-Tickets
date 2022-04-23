'use strict'

const Collaborator = require('../models/Collaborator');

//Obtiene los colaboradores7
//OJO NO BORRAR EL FILTRO POR QUE LA HUELLA TARDAR UN MONTON EN IR A TRAER
async function getCollaborator(req, res) {
    let collaborator = await Collaborator.find({
        status: "Activo"
    }, { name: 1 });
    return res.json({ collaborator });
}

module.exports = {
    getCollaborator
}