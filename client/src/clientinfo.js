import axios from 'axios'
import React from 'react'
import './clientinfo.css'
import { MyModal } from './modal'




export function ClientInfo({NPage, PPage, openModal, closeModal, getNewUser, state}) {
    const clientIds = React.useRef([])

    const RemoveClientIds = (myid) => {
        clientIds.current = clientIds.current.filter(id => id !== myid)
    }
    
    const [modalinfo,setmodalinfo] = React.useState({
        fileForm: false,
        clientIds: [],
        fileData: ''
    })
   
    const HandleClientSelection = (e) => {
        let idthere = false
        if(clientIds.current.length !== 0) {           
            for (let index = 0; index < clientIds.current.length; index++) {
                const id = clientIds.current[index];  
                if(e.target.id === id) {
                    idthere = true
                    break
                } else {    
                    idthere = false
                }
            }
         
            if(idthere) {
                clientIds.current = clientIds.current.filter(id => id !== e.target.id)
            } else {
                clientIds.current.push(e.target.id)
            }
        } else {
            clientIds.current = [...clientIds.current, e.target.id]
            
        }
    }

    React.useEffect(() => {
        getNewUser()
    },[state.page])
    
   
    const UpdateUser = (e) => {
        e.preventDefault()
        if (clientIds.current.length === 0) return console.log('No Client Selected')
            openModal()
            setmodalinfo({clientIds: [...clientIds.current], fileForm: false})
           
    }
    const DeleteUser = (e) => {
        e.preventDefault()
        if (clientIds.current.length === 0) return console.log('No Client Selected') 
        for (let index = 0; index < clientIds.current.length;index++) {     
            axios.delete(`/api/deleteclient/id/${clientIds.current[index]}`).then(res => {
                clientIds.current.filter(id => id !== clientIds.current[index])
                if(index === clientIds.current.length - 1) {
                    getNewUser()
                    clientIds.current = []
                }
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
        
        axios.get(`/api/getclientfile/query?path=${e.target.id}`).then(res => {
           
            openModal()
            setmodalinfo({...modalinfo, fileData: res.data})
        })
    }


    const NextPage = (e) => {
        e.preventDefault()
        console.log("PAge Before: ", state.page)
        NPage()
        console.log("PAge AFter: ", state.page)
    
    }

    const PrevPage = (e) => {
        e.preventDefault()
        
        console.log("PAge Before: ", state.page)
        PPage()
        console.log("PAge AFter: ", state.page)
     
    }

    return (

        
        <section className='main-display'>
            <div className='btn-holder'>
                <button  className='cl-edit-btn' onClick={UpdateUser}>Update</button>
                <button  className='cl-edit-btn' onClick={DeleteUser}>Delete</button>
                <button  className='cl-edit-btn' onClick={HandleFileInput}>UploadFile</button>
            </div>
            {
            state.clients.map(({_id,Name,Country,City,Number,File}) => {
                    return (
                        <div key={_id} className='client-data-holder'>
                        <input id={_id} onClick={HandleClientSelection} className='select-box' type='checkbox'/>
                        <span><h4>Name:</h4> {Name}</span>
                        <span><h4>Number:</h4> {Number}</span>
                        <span><h4>Country:</h4> {Country}</span>
                        <span><h4>City:</h4> {City}</span>
                        <button className='vw-file-btn' id={File} onClick={ViewFile} disabled={File === 'no path provided'? true :false}>{File === 'no path provided'?'No File': 'View File'}</button>
                    </div>
                    )
                })
            }
            {state.isModalOpen && <MyModal RemoveClientIds={RemoveClientIds} openModal={openModal} getNewUser={getNewUser} closeModal={closeModal} state={state} fileData={modalinfo.fileData} clientIds={modalinfo.clientIds} fileForm={modalinfo.fileForm}/>}
            
            <div className='page-changer'>
                <button disabled={state.page === 1? true: false} className='prv-btn' onClick={PrevPage}>Previous</button>
                <button disabled={state.clients.length === 10? false: true } className='prv-btn' onClick={NextPage}>Next</button>
            </div>
            
        </section>

        
    )
}