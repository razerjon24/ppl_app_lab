const ParaleloModel = require('../models/paralelo.model');
var respuesta = require('../utils/responses');

const obtenerTodosParalelos = (req, res) => {
  ParaleloModel.obtenerTodosParalelos((err,paralelos) => {
    if(err) return respuesta.serverError(res);
    return respuesta.ok(res, paralelos);
  })
}

// TODO: si el paralelo no existe
const obtenerParalelo = (req, res) => {
  ParaleloModel.obtenerParalelo(req.params.id_paralelo, (err, paralelo) => {
    if (err) return respuesta.serverError(res);
    return respuesta.ok(res, paralelo)
  })
}

// TODO: Verificar que existe profesor y estudiante
const crearParalelo = (req, res) => {
  let paralelo = new ParaleloModel({
    nombre: req.body.nombre,
    limiteEstudiantes: req.body.limiteEstudiantes,
    profesor: req.body.idProfesor,
    estudiante: req.body.idEstudiante,
  })
  paralelo.crearParalelo((err, doc) => {
	  if (err) return respuesta.serverError(res);
	  return respuesta.ok(res, paralelo)
  })
}

// TODO: devolver el dato actuzalidado
const actualizarParalelo = (req, res) => {
  let datos = {
    nombre: req.body.nombre,
    limiteEstudiantes: req.body.limiteEstudiantes
  }
  ParaleloModel.actualizarParalelo(req.params.id_paralelo, datos,(err, doc) => {
    if (!doc.nModified) return respuesta.mongoError(res, 'El paralelo no existe');
    if (err) return respuesta.serverError(res);
    return respuesta.okActualizado(res);
  })
}

const eliminarParalelo = (req, res) => {
  ParaleloModel.eliminarParalelo(req.params.id_paralelo, (err,doc) => {
    if (!doc) return respuesta.mongoError(res, 'El paralelo no exite');
    if (err) return respuesta.serverError(res);
    return respuesta.okEliminado(res);
  })
}

/*
* Grupos
 */

// TODO: si ya existe este grupo en el paralelo
const anadirGrupoAParalelo = (req, res) => {
  ParaleloModel.anadirGrupoAParalelo(req.params.id_paralelo,req.params.id_grupo, (err, paralelo) => {
    if (err) return respuesta.serverError(res);
    return respuesta.okAnadido(res)
  })
}

// TODO: verificar si existe el paralelo y el grupo
const eliminarGrupoDeParalelo = (req, res) => {
  ParaleloModel.eliminarGrupoDeParalelo(req.params.id_paralelo, req.params.id_grupo, (err, doc) => {
    if (!doc) return respuesta.mongoError(res, 'El paralelo no existe');
    if (err) return respuesta.serverError(res);
    return respuesta.okEliminado(res);
  })
}

/*
* Profesores
 */

// TODO: si ya hay profesor en paralelo
const anadirProfesorAParalelo = (req, res) => {
  ParaleloModel.anadirProfesorAParalelo(req.params.id_paralelo, req.params.id_profesor, (err, doc) => {
    if (!doc) return respuesta.mongoError(res, 'El paralelo no existe');
    if (err) return respuesta.serverError(res);
    return respuesta.okAnadido(res);
  })
}

// TODO: si ya hay profesor, si el paralelo existe
const eliminarProfesorDeParalelo = (req, res) => {
  ParaleloModel.eliminarProfesorDeParalelo(req.params.id_paralelo, (err, doc) => {
    if (!doc) return respuesta.mongoError(res, 'El paralelo no existe');
    if (err) return respuesta.serverError(res);
    return respuesta.okEliminado(res);
  })
}

/*
* Estudiantes
 */
// TODO: si el estudiante existe en otro paralelo
// TODO: si el paralelo existe, si el estudiante existe
const anadirEstudianteAParalelo = (req, res) => {
  ParaleloModel.anadirEstudianteAParalelo(req.params.id_paralelo, req.params.id_estudiante, (err, doc) => {
    if(!doc) return respuesta.mongoError(res, 'El paralelo no existe');
    if (err) return respuesta.serverError(res);
    return respuesta.okAnadido(res);
  })
}

// TODO: si el estudiante no existe, si el paralelo no existe
const eliminarEstudianteDeParalelo = (req, res) => {
  ParaleloModel.eliminarEstudianteDeParalelo(req.params.id_paralelo, req.params.id_estudiante, (err, doc) => {
    if (!doc) return respuesta.mongoError(res, 'El paralelo no existe');
    if (err) return respuesta.serverError(res);
    return respuesta.okEliminado(res);
  })
}

module.exports = {
  obtenerTodosParalelos,
  crearParalelo,
  actualizarParalelo,
  eliminarParalelo,
  obtenerParalelo,
  // paralelos
  anadirGrupoAParalelo,
  eliminarGrupoDeParalelo,
  // profesor
  anadirProfesorAParalelo,
  eliminarProfesorDeParalelo,
  // estudiante
  anadirEstudianteAParalelo,
  eliminarEstudianteDeParalelo
}