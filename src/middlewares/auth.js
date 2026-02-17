const jwt = require("jsonwebtoken");
const User = require("../models/User.js");

// verificar si el usurario esta autenticdo
const verifyAuth = async (req, res, next) => {
  try {
    // capturamos el token desde el req
    const authHeader = req.headers.authorization; // desde el header de la consulta, no de cookies

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      // vemos si trae token o empeiza con Bearer
      return res.status(401).json({
        ok: false,
        message: "No autorizado. Token no proporcionado",
      });
    }
    const token = authHeader.split(" ")[1]; //['Bearer', "token"]

    // decodificamos el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // verifico el token con la palabra secreta-- arroja un booleano
    const user = await User.findById(decoded.id).select("-password"); // aqui no quiero la password

    // si el usuarioya no existe, validamos lo  siguiente
    if (!user) {
      return res.status(401).json({
        ok: false,
        message: "Usuario no encontrado",
      });
    }
    // guardamos la informacion de usuario en el req para usarla en las rutas protegidas
    req.user = user;

    // si todo es correcto, pasamos al siguiente middleware o ruta
    next();
  } catch (error) {
    return res.status(401).json({
      ok: false,
      message: "Token invalido o expirado",
    });
  }
};

// verificar el rol del usuario
const verificarRol = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        ok: false,
        message: "No autenticado",
      });
    }
  }
  
// verificar si el usuario es admin
const verifyAdmin=(req, res, next)=>{
    if(req.user.role !== process.env.ADMIN_ROLE){
        return res.status(403).json({
            ok: false,
            message:'Acceso denegado. Solo los administradores pueden acceder a esta ruta'
        })
    if (!roles.includes(req.user.rol)) {
      return res.status(403).json({
        ok: false,
        message: "No tienes permisos para acceder a esta ruta",
      });
    }

    next();
}

// verificar si el ususario es superAdmin

const verifySuperAdmin=(req, res, next)=>{
    if(req.user.role !==process.env.SUPER_ADMIN_ROLE){
        return res.status(403).JSON({
            ok:false,
            message:'acceso denagado, se reuqiee permisos de super admin'
            
        })
    }
    next();

}
  };
};

// exportamos la funcion de verificacion de autenticacion
module.exports={
    verifyAuth,
    verifyAdmin,
    verifySuperAdmin,
}
module.exports = {
  verifyAuth,
  verificarRol,
};
