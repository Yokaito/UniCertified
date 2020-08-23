import path from 'path'
import fs from 'fs'

module.exports = {
    deletarCertificado: (name) => {
        var estado = false
        fs.readdirSync(path.resolve(__dirname, '..', 'public', 'tmp', 'uploads' )).forEach(file => {
            if(file == name){
                estado = true
                fs.unlinkSync(path.resolve(__dirname, '..', 'public', 'tmp', 'uploads')+'/'+file)
            }                
        })
        return estado
    }
}