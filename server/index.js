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
// app.use(express.static(path.resolve(__dirname, '../client/build')));

app.get('/api/getallclient',MyAsyncWrapper( async(req,res) => {
    // console.log('request made')
    const foundedClient = await ClientModel.find({})
    // console.log(foundedClient)
    res.status(200).json(foundedClient)
})
)

app.get('/api/getoneclient/id/:clientid', MyAsyncWrapper( async (req,res) => {
    console.log('request made to get a client: ', req.params)
    const foundedClient = await ClientModel.findById(req.params.clientid).select({__v: false})
    // console.log(foundedClient)
    res.status(200).json({msg: 'Client Founded', client: foundedClient})
})
)

app.get('/api/getclientfile/query?', MyAsyncWrapper( async (req,res) => {
    console.log("Response From User: ", req.query.path)
    const readingFile = fs.createReadStream(path.join(req.query.path), {encoding: 'base64'})
    readingFile.on('open', () => {
        readingFile.pipe(res)
    })
    // console.log(req.get('path'))
})
)

app.post('/api/addclient' , MyAsyncWrapper( async (req,res) => {
    console.log(req.body)
    const clientCraeted = await ClientModel.create(req.body)
    // console.log(clientCraeted)
    res.status(201).json({msg: "Client Added"})
})
)


app.patch('/api/updateclient/id/:clientid' , MyAsyncWrapper( async (req,res) => {
    console.log("update body",req.body)
    // console.log('update params', req.params)
    const updateObj = {
        Name: req.body.Name,
        City: req.body.City,
        Country: req.body.Country,
        Number: req.body.Number
    }
    console.log('updateUserObj: ', updateObj)
    const clientUpdated = await ClientModel.findByIdAndUpdate(req.params.clientid, updateObj, {new: true})
    console.log("Updated Client",clientUpdated)
    console.log("Updated Client Id: ", clientUpdated._id)
    res.status(201).json({msg: "Client Updated", id: clientUpdated._id})
})
)


app.post('/api/updateclientfile/id/:clientid', upload.single('myfileinp') , MyAsyncWrapper( async (req,res) => {
    
        console.log("fileBody: ", req.file)
        const UpdateClientFile = await ClientModel.findByIdAndUpdate(req.params.clientid, {File: req.file.path}, {new: true})
        console.log('FileUploaded: ', UpdateClientFile)
        res.status(201).json({msg: 'File uploaded', id: UpdateClientFile._id})
})
)

app.delete('/api/deleteclient/id/:clientid' , MyAsyncWrapper( async (req,res) => {
    // console.log(req.params)
    const clientFoundToDelete = await ClientModel.findById(req.params.clientid)
    console.log('clientFoundToDelete', clientFoundToDelete)
    if(clientFoundToDelete.File != 'no path provided') {
        fs.unlink(clientFoundToDelete.File, () => {
            console.log("UNLINK successfull")
        })
    }
    const clientDeleted = await ClientModel.deleteOne({_id: req.params.clientid})
    // console.log("DELETED CLIENT: ",clientDeleted)
    res.status(200).json({clientDeleted: true, msg: "Client Deleted", id: req.params.clientid})
})
)

app.listen(PORT, () => console.log(`Server Listening on Port ${PORT}`))