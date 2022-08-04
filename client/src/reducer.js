import axios from "axios"

export const reducer = (state,action) => {
    if(action.type === "CLOSEMODAL")  {
        return {...state, forceupdate: true, isModalOpen: false, clients: action.clients}
      }
      else if(action.type === "OPENMODAL")  {
        return {...state, forceupdate: false, isModalOpen: true}
      }
      else if(action.type === "OPENMODALWFILE")  {
        return {...state, forceupdate: false, isModalOpen: true}
      }
      else if(action.type === "GETNEWUSERS")  {
      
        return {...state, clients: action.clients}
      }
      else if(action.type === "NEXTPAGE")  {
        return {...state, page: state.page + 1}
      }
      else if(action.type === "PREVPAGE")  {
        return {...state, page: state.page - 1}
      }
}