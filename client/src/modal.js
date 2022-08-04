import axios from "axios"
import React from "react"





export function MyModal ({getNewUser,state, openModal, closeModal, clientIds, fileForm, fileData}) {
    
   
    const [clientdetail,setclientdetail] = React.useState({
        City: '',
        Country: '',
        Name: '',
        Number: 0,
        _id: '',
        
    })

    

    React.useEffect(() => {
      

      
        if(fileForm && !fileData) console.log('FileForm is true')
        if(state.isModalOpen) {
            openModal()
            document.getElementById('modal').showModal()
        }
        if((fileForm || state.isModalOpen) && !fileData) GetNextUser(0)
        
    },[state.isModalOpen])
   
    const GetNextUser = (idpos) => {
        
  
        if(idpos > clientIds.length - 1) {
            closeModal()
            return document.getElementById('modal').close()
            
        }
        axios.get(`/api/getoneclient/id/${clientIds[idpos]}`).then(res => {
            if(res.status === 200) {
                console.log("data from getting one client: ", res.data)
                setclientdetail(res.data.client)
                // console.log("Cliendetails value: ", clientdetail.current)
            }
        })
    }

    const UpdateUser = (e) => {
        e.preventDefault()
        
      
            axios.patch(`/api/updateclient/id/${clientdetail._id}`, clientdetail).then((res) => {
                if(res.status === 201) {
                    
                    if(clientIds.length > 1) {
                       
                        for(let i=0; i < clientIds.length;i++) {
                            if(res.data.id === clientIds[i]) {
                                GetNextUser(i + 1)
                                break
                            }
                        }
                    } else {
                        
                        document.getElementById('modal').close()
                        closeModal()
                       
                    }
                }
            })
       
    }

    const UploadUserFile = (e) => {
            console.log("e: ", e)
            if(clientIds.length > 1)  e.preventDefault()
            console.log('in file form')
            const file = document.getElementById('myfileinp')
            const formData = new FormData()
            formData.append(file.name, file.files[0])

            axios.post(`/api/updateclientfile/id/${clientdetail._id}`, formData).then(res => {
                if(res.status === 201) {
                    
                    if(clientIds.length > 1) {
                       
                        for(let i=0; i < clientIds.length;i++) {
                            console.log("In For Loop")
                            if(res.data.id === clientIds[i]) {
                                GetNextUser(i + 1)
                                break
                            }
                        }
                    } else {
                        
                        document.getElementById('modal').close()
                        closeModal()
                        e.defaultPrevented = false
                    }
                }
            })
            
        
    }

    if(fileData) {
      
        return (
            <dialog className="modal" id='modal'>
                <object data={`data:application/pdf;base64,${fileData}`} type="application/pdf" width={500} height={500}></object>
                <button onClick={() => {
                    document.getElementById('modal').close()
                    closeModal()}}>
                    Close
                </button>
            </dialog>
        )
    }

    return (
        <>
            <dialog className="modal" id='modal'>
                <form onSubmit={fileForm? UploadUserFile : UpdateUser}>
                {fileForm? 
                <>
                    <h4>User {clientdetail.Name} with Number {clientdetail.Number}</h4>
                    <label>
                        <input  type='file' accept="application/pdf" id="myfileinp" name="myfileinp" className="myfileinp" required/>
                    </label>
                </>
                : 
                    <>
                        <label> 
                            Name
                            <input type='text' value={clientdetail.Name} onChange={(e) => setclientdetail({...clientdetail, Name: e.target.value})}/>
                        </label>    
                        <label>
                            Country
                            <input type='text' value={clientdetail.Country} onChange={(e) => setclientdetail({...clientdetail, Country: e.target.value})}/>
                        </label>    
                        <label>
                            City
                            <input type='text' value={clientdetail.City} onChange={(e) => setclientdetail({...clientdetail, City: e.target.value})}/>
                        </label>    
                        <label>
                            Number
                            <input type='Number' value={clientdetail.Number} onChange={(e) => setclientdetail({...clientdetail, Number: e.target.value})}/>
                        </label>
                    </>
                }
                <input type='submit' value={fileForm? 'Upload PDF': 'Update User'}/>
                </form>
                <button onClick={() => {

                document.getElementById('modal').close()
                closeModal()}}>Close</button>
            </dialog>
            
        </>
    )
}