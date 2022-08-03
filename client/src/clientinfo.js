import axios from 'axios'
import React from 'react'
import './clientinfo.css'
import { MyModal } from './modal'


export function ClientInfo({openModal, closeModal, getNewUser, forceupdate, isModalOpen}) {
    const clientIds = React.useRef([])
    const [filesrc,setsrc] = React.useState('')
    const [modalinfo,setmodalinfo] = React.useState({
        fileForm: false,
        clientIds: [],
        fileData: ''
    })
    // const [shldgetclnt,setgetclient] = React.useState(false)
    const [clients,setclients] = React.useState([])
    
    const HandleClientSelection = (e) => {
        let idthere = false
        console.log(e.target.id)
        console.log("ClientIds before: ", clientIds.current)
        if(clientIds.current.length !== 0) {           

            for (let index = 0; index < clientIds.current.length; index++) {
                const id = clientIds.current[index];
                console.log("Current Id on: ", id)
                if(e.target.id === id) {
                    console.log("Id is same")
                    idthere = true
                    break
                } else {
                    console.log("Id is not same")
                    idthere = false
                }
            }
            console.log("otuasd: ", idthere)
            
            if(idthere) {
                clientIds.current = clientIds.current.filter(id => id !== e.target.id)
            } else {
                clientIds.current.push(e.target.id)
            }

        } else {
            console.log("length is 0")
            clientIds.current = [...clientIds.current, e.target.id]
            
        }
        console.log("ClientIds after: ", clientIds.current)
    }


    React.useEffect(() => {
            axios.get('/api/getallclient').then(res => {
                console.log("response after getting user: ", res.data)
                setclients(res.data)
            })
    },[forceupdate])

   
    const UpdateUser = (e) => {
        e.preventDefault()
        if (clientIds.current.length === 0) return console.log('No Client Selected')
            openModal()
            setmodalinfo({clientIds: [...clientIds.current], fileForm: false})
            
    }
    const DeleteUser = (e) => {
        e.preventDefault()
        if (clientIds.current.length === 0) return console.log('No Client Selected') 
        for (let index = 0; index < clientIds.current.length; index++) {
            axios.delete(`/api/deleteclient/id/${clientIds.current[index]}`).then(res => {
                console.log("Response after deleting user: ", res)
                // setgetclient(res.clientDeleted)
                getNewUser()
            })
        }
       
    }

    const HandleFileInput = (e) => {
        e.preventDefault()
        if (clientIds.current.length === 0) return console.log('No Client Selected')
        openModal()
        setmodalinfo({clientIds: [...clientIds.current], fileForm: true})
    }

    const ViewFile = (e) => {
        e.preventDefault()
        console.log("Viewing File")
        axios.get(`/api/getclientfile/query?path=${e.target.id}`).then(res => {
            console.log("response after getting file: ", res.data)
            console.log("res.data type: " ,typeof res.data)
            // setsrc(res.data)
            openModal()
            setmodalinfo({...modalinfo, fileData: res.data})
        })
    }


    return (

        
        <section>
        <div className='btn-holder'>
                <button onClick={UpdateUser}>Update</button>
                <button onClick={DeleteUser}>Delete</button>
                <button onClick={HandleFileInput}>UploadFile</button>
        </div>
        {
          clients.map(({_id,Name,Country,City,Number,File}) => {
                return (
                    <div key={_id} className='client-data-holder'>
                    <input id={_id} onClick={HandleClientSelection} className='select-box' type='checkbox'/>
                    <h4>{Name}</h4>
                    <h4>{Number}</h4>
                    <h4>{Country}</h4>
                    <h4>{City}</h4>
                    <button id={File} onClick={ViewFile} disabled={File === 'no path provided'? true :false}>{File === 'no path provided'?'No File': 'View File'}</button>
                </div>
                )
            })
        }
        {isModalOpen && <MyModal fileData={modalinfo.fileData} openModal={openModal} closeModal={closeModal} clientIds={modalinfo.clientIds} isModalOpen={isModalOpen} fileForm={modalinfo.fileForm}/>}
        </section>
    )
}