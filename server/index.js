const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const fs = require('fs')
const path = require('path')
const multer = require('multer')
const ClientModel = require('./model/clientmodel')
const MyAsyncWrapper = require('./asyncwrapper.js')
const MyErrorHandler = require('./errorhandler.js')
require('./connect/connectdb')
const PORT = process.env.PORT || 5000

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

const storagesetting = multer.diskStorage({
    destination: function(req,file,cb) {
        if(!file) return console.log("NO FIle  PRIVdas")
        cb(null,path.resolve(path.join('../pdf')))
    },
    
    filename: function (req, file, cb) {  
        if(!file) return cb(new Error('No File Provided'), null)
        let i = 0
        while (fs.existsSync(path.resolve(path.join('../pdf',`${file.originalname.replace( /\.(pdf)$/, '')}`+ `(${i})`+ file.originalname.replace(file.originalname.replace( /\.(pdf)$/,''),'') )))  == true) {
          i = i + 1   
        }
       
       
        cb(null, file.originalname.replace( /\.(pdf)$/, '') + `(${i})` + file.originalname.replace(file.originalname.replace( /\.(pdf)$/,''),'') )
      },
  
})

const PdfFileFilter = (req,file,cb) => {

    if(!file) return cb(new Error('No File Provided'), null)

    if(!file.originalname.match(/\.(pdf)$/)) {
        cb(new Error("Only Image File "), false)
        next()
      }  
      // To accept the file pass `true`, like so:
      cb(null, true)
    
}

const upload = multer({storage: storagesetting, fileFilter: PdfFileFilter})

app.use(MyErrorHandler)
app.use(express.static(path.resolve(__dirname, '../client/build')));

app.get('/api/getallclient/query?',MyAsyncWrapper( async(req,res) => {
    console.log("getting Client")
    const skip = (Number(req.query.page) - 1) * 10
    const foundedClient = await ClientModel.find({}).skip(skip).limit(10)
    console.log("FOunded CLient:", foundedClient)
    res.status(200).json(foundedClient)
})
)

app.get('/api/getoneclient/id/:clientid', MyAsyncWrapper( async (req,res) => {  
    const foundedClient = await ClientModel.findById(req.params.clientid).select({__v: false})
    res.status(200).json({msg: 'Client Founded', client: foundedClient})
})
)

app.get('/api/getclientfile/query?', MyAsyncWrapper( async (req,res) => {    
    const readingFile = fs.createReadStream(path.join(req.query.path), {encoding: 'base64'})
    readingFile.on('open', () => {
        readingFile.pipe(res)
    })
  
})
)

app.post('/api/addclient' , MyAsyncWrapper( async (req,res) => {  
    console.log("ADDED CLIENT")
    const clientCraeted = await ClientModel.create(req.body)
    res.status(201).json({msg: "Client Added"})
})
)


app.patch('/api/updateclient/id/:clientid' , MyAsyncWrapper( async (req,res) => {
    const updateObj = {
        Name: req.body.Name,
        City: req.body.City,
        Country: req.body.Country,
        Number: req.body.Number
    }
    const clientUpdated = await ClientModel.findByIdAndUpdate(req.params.clientid, updateObj, {new: true})
    res.status(201).json({msg: "Client Updated", id: clientUpdated._id})
})
)


app.post('/api/updateclientfile/id/:clientid', upload.single('myfileinp') , MyAsyncWrapper( async (req,res) => {       
        const UpdateClientFile = await ClientModel.findByIdAndUpdate(req.params.clientid, {File: req.file.path}, {new: true})     
        res.status(201).json({msg: 'File uploaded', id: UpdateClientFile._id})
})
)

app.delete('/api/deleteclient/id/:clientid' , MyAsyncWrapper( async (req,res) => {
    const clientFoundToDelete = await ClientModel.findById(req.params.clientid)
    if(clientFoundToDelete.File != 'no path provided') {
        fs.unlink(clientFoundToDelete.File, () => {
            console.log("UNLINK successfull")
        })
    }
    const clientDeleted = await ClientModel.deleteOne({_id: req.params.clientid})
    res.status(200).json({clientDeleted: true, msg: "Client Deleted", id: req.params.clientid})
})
)

app.listen(PORT, () => console.log(`Server Listening on Port ${PORT}`))