import multer from 'multer' 
import path from 'path'
import crypto from 'crypto'

module.exports = {
    dest: path.resolve(__dirname, '..', 'public', 'tmp', 'uploads' ),
    storage: multer.diskStorage({
        destination: (req, file, callback) => {
            callback(null, path.resolve(__dirname, '..', 'public', 'tmp', 'uploads'))
        },
        filename: (req, file, callback) => {
            crypto.randomBytes(8, (err, hash) => {
                if (err) callback(err)

                const FileName = `${req.session.user.id}-${hash.toString('hex')}-${file.originalname}`
                
                callback(null, FileName)
            })
        }
    }),

    limits: {
        fileSize: 5 * 1024 * 1024
    },

    fileFilter: (req, file, callback) => {
        const allowedMimes = [
            'image/jpeg',
            'image/pjpeg',
            'image/png',
        ]

        if(allowedMimes.includes(file.mimetype)){
            callback(null, true)
        }else{
            callback(new Error('Arquivo invalido'))
        }
    }   
}