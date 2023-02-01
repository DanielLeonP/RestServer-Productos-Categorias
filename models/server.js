const express = require('express')
const cors = require('cors');
const { dbConection } = require('../database/config');
const fileUpload = require('express-fileupload');
const app = express()

class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT;

        this.paths = {
            usuariosPath: '/api/users',
            authPath: '/api/auth',
            categorias: '/api/categorias',
            productos: '/api/productos',
            buscar: '/api/buscar',
            upload: '/api/upload'
        }
        // this.usuariosPath = '/api/users';
        // this.authPath = '/api/auth';
        // this.categorias = 'api/categorias';

        //DB Conection
        this.conectarDB();
        // Midlewares
        this.midlewares();
        // Routes
        this.routes();
    }
    async conectarDB() {
        await dbConection();
    }
    midlewares() {
        // CORS
        this.app.use(cors());
        // Public Directory
        this.app.use(express.static('public'));
        // Body Parser 
        this.app.use(express.json());
        // FileUpload - Carga de archivos
        this.app.use(fileUpload({
            useTempFiles: true,
            tempFileDir: '/tmp/',
            createParentPath: true
        }));
    }
    routes() {
        this.app.use(this.paths.authPath, require('../routes/auth'));
        this.app.use(this.paths.usuariosPath, require('../routes/user'));
        this.app.use(this.paths.categorias, require('../routes/categorias'));
        this.app.use(this.paths.productos, require('../routes/productos'));
        this.app.use(this.paths.buscar, require('../routes/buscar'));
        this.app.use(this.paths.upload, require('../routes/upload'))
    }
    listen() {
        this.app.listen(this.port, () => {
            console.log('Servidor corriendo en puerto ', this.port)
        })
    }
}
module.exports = Server;