const {createLogger, transports, format} = require('winston')
const { formSchema } = require("@whatsapp-clone/common-validate")

const dbLogger = (req, res) => {
    //console.log(req)
    const formData = req.body;
    formSchema
        .validate(formData)
        .catch(err => {
            res.status(422).send();
            // createLogger(
            //     transports [
            //         new transports.File({
            //             filename: 'db-error.log',
            //             level: 'error',
            //             format: format.combine(format.timestamp(),format.json())
            //         }),
            //         new transports.File({
            //             filename: 'db.log',
            //             level: 'info',
            //             format: format.combine(format.timestamp(),format.json())
            //         })
            //     ])
            console.log(err.errors);
        })
        .then(valid => {
            if (valid) {
                console.log("Form is good")
            }
        })    
}

module.exports = dbLogger;