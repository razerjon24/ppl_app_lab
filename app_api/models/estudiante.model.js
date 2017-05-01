const mongoose = require('mongoose');
const shortid = require('shortid');
var jwt             = require('jsonwebtoken');
var config = require('../config/main')
mongoose.Promise = global.Promise;
var moment = require('moment')
var tz = require('moment-timezone')
const EstudianteSchema = mongoose.Schema({
	_id: {
		type: String,
		unique: true,
		'default': shortid.generate
	},
	nombres: {
		type: String
	},
	apellidos: {
		type: String
	},
	correo: {
		type: String
	},
	matricula: {
		type: String
	},
	foto: {
		type: String
	},
	grupo: {
		type: String,
    ref: 'Grupo'
	},
  dandoLeccion: {
    type: Boolean,
    'default': false
  },
  leccion: { // que leccion esta dando estudiante en realtime
    type: String,
    ref: 'Leccion'
  },
	lecciones: [{
		leccion: {
			type: String,
			ref: 'Leccion'
		},
		calificado: {
			type: Boolean,
      'default': false
		},
		calificacion: {
			type: Number
		},
    fechaEmpezado: {
      type: Date
    },
    fechaTerminado: {
      type: Date
    },
    grupo: {
      type: String,
      ref: 'Grupo'
    }
	}]
},{timestamps: true, versionKey: false, collection: 'estudiantes'})

EstudianteSchema.methods.generarJwt = function() {
  var expiracion = new Date();
  expiracion.setDate(expiracion.getDate() + 5);
  return jwt.sign({
    _id: this._id,
    correo: this.correo,
    nombres: this.nombres,
    apellidos: this.apellidos,
    exp: parseInt(expiracion.getTime() / 1000),
  }, config.secret );// process.env.JWT_SECRET
};

EstudianteSchema.statics.obtenerTodosEstudiantes = function(callback) {
  this.find({}).populate({path: 'lecciones.leccion'}).exec(callback);
}

EstudianteSchema.statics.obtenerTodosEstudiantesNoPopulate = function(callback) {
  this.find({},callback)
}

EstudianteSchema.methods.crearEstudiante = function(callback) {
  this.save(callback)
}

EstudianteSchema.statics.obtenerEstudiante = function(id_estudiante, callback) {
  this.findOne({_id: id_estudiante}).populate({path: 'lecciones.leccion'}).exec(callback);
}

EstudianteSchema.statics.obtenerEstudianteNoPopulate = function(id_estudiante, callback) {
  this.findOne({_id: id_estudiante},callback);
}

EstudianteSchema.statics.obtenerEstudiantePorCorreo = function(correo_estudiante, callback) {
  this.findOne({correo: correo_estudiante}).populate({path: 'lecciones.leccion'}).exec(callback);
}

EstudianteSchema.statics.obtenerEstudiantePorCorreoNoPopulate = function(correo_estudiante, callback) {
  this.findOne({correo: correo_estudiante},callback)
}

EstudianteSchema.statics.eliminarEstudiante = function(id_estudiante, callback) {
  this.findOneAndRemove({_id: id_estudiante}, callback)
}

// Realtime

// usada cuando se ingresa el codigo de la leccion
EstudianteSchema.statics.anadirEstudianteDandoLeccion = function(id_estudiante,id_leccion,callback) {
  let fecha = moment();
  let current_time_guayaquil = moment(fecha.tz('America/Guayaquil').format())
  let leccion_nueva = {
    leccion: id_leccion,
    fechaEmpezado: current_time_guayaquil,
  }
  this.update({_id: id_estudiante}, {$set: {dandoLeccion: true}, $addToSet: {lecciones: leccion_nueva}},callback)
}

EstudianteSchema.statics.anadirLeccionActualDando = function(id_estudiante, id_leccion, callback) {
  this.update({_id: id_estudiante}, {$set: {leccion: id_leccion}}, callback)
}

EstudianteSchema.statics.anadirEstudianteLeccion = function(id_estudiante, id_leccion,callback) {
  this.update({_id: id_estudiante}, {$set: {'lecciones': id_leccion}},{ safe: true, upsert: true },callback)
}

// para middleware y no va en realtime
EstudianteSchema.statics.veficarPuedeDarLeccion = function(id_estudiante, callback) {
  this.findOne({_id:id_estudiante}, callback)
}

EstudianteSchema.statics.anadirEstudianteTerminoLeccion = function(id_estudiante,callback) {
  this.update({_id: id_estudiante}, {$set: {dandoLeccion: false}},callback)
}

EstudianteSchema.statics.leccionTerminada = function(id_estudiante, callback) {
  this.update({_id: id_estudiante}, {$set: {dandoLeccion: false}}, callback)
}

EstudianteSchema.statics.obtenerLeccionEstudianteRealtime = function(id_estudiante, callback) {
  this.findOne({_id: id_estudiante}, callback)
}


EstudianteSchema.statics.calificarLeccion = function(id_estudiante, id_leccion, calificacion_nueva, callback){
  this.update({_id: id_estudiante, "lecciones.leccion": id_leccion}, {$set: {"lecciones.$.calificacion": calificacion_nueva}}, callback);
}


module.exports = mongoose.model('Estudiante', EstudianteSchema)
