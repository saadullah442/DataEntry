
import axios from "axios";
import React from "react";

import { ClientInfo } from "./clientinfo";
import { reducer } from "./reducer";

const currentstate = {
  page: 1,
  clients: [],
  isModalOpen: false
}



function App() {
  const [state,executer] = React.useReducer(reducer,currentstate)
  const [name,setname] = React.useState('')
  const [num,setnum] = React.useState()
  const [city,setcity] = React.useState('')
  const [country,setcountry] = React.useState('')
  
  const NextPage = () => {
    executer({type: 'NEXTPAGE'})
  }

  const PrevPage = () => {
    executer({type: 'PREVPAGE'})
  }

  const closeModal= () => {
    axios.get(`/api/getallclient/query?page=${state.page}`).then(res => {
        // executer({type: 'GETNEWUSERS', clients: res.data})
        executer({type: "CLOSEMODAL", clients: res.data})
      })
     
  }

  const openModal = () => {
      executer({type: "OPENMODAL"})
  }

  const getNewUser = () => {
      axios.get(`/api/getallclient/query?page=${state.page}`).then(res => {
          executer({type: 'GETNEWUSERS', clients: res.data})
        })
      
  }
 



  const SubmitClient = (e) => {
    e.preventDefault()

    axios.post('/api/addclient', {Name: name, Number: num, City: city, Country: country}).then(res =>{
      if(res.status === 201) {
        setname('')
        setnum('')
        setcity('')
        setcountry('')
        getNewUser()
      }
    })

 
  



 }

  return (
    <>
      <div>
        <h1>Insert Data</h1>
        <form onSubmit={SubmitClient} className='client-sub-form'>
          <label>
            Name 
            <input type='text' placeholder="Enter Name" value={name} onChange={(e) => setname(e.target.value)} required/>
          </label>
          <label>
            City 
            <input type='text' placeholder="Enter City" value={city} onChange={(e) => setcity(e.target.value)}  required/>
          </label>
          <label>
            Number 
            <input type='Number' placeholder="Enter Number" value={num} onChange={(e) => setnum(Number(e.target.value))} required/>
          </label>
          <label>
            Country
            <input type='text' placeholder="Enter Country" value={country} onChange={(e) => setcountry(e.target.value)} required/>
          </label>
          <input type="submit" value='Add Client'/>
        </form>
      </div>
      <ClientInfo NPage={NextPage} PPage={PrevPage} closeModal={closeModal} openModal={openModal} getNewUser={getNewUser} state={state}/>

   
      
    </>
  );
}

export default App;
