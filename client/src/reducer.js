export const reducer = (state,action) => {
    if(action.type === "CLOSEMODAL")  {
        return {...state, forceupdate: true, isModalOpen: false}
      }
      else if(action.type === "OPENMODAL")  {
        return {...state, forceupdate: false, isModalOpen: true}
      }
      else if(action.type === "OPENMODALWFILE")  {
        return {forceupdate: false, isModalOpen: true, filedata: action.filedata}
      }
      else if(action.type === "GETNEWUSERS")  {
        return {...state, forceupdate: true}
      }
}