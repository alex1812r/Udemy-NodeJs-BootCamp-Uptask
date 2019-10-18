//helper para visualizar algun objeto como string
//como parametros el objeto, sin campos nulos, con 2 de espaciado
exports.vardump = (object) => JSON.stringify(object, null,2)