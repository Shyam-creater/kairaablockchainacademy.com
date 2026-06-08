import {createSlice} from "@reduxjs/toolkit";

const initialState={
    token:"",
    user:"",
}
 const authSlice = createSlice({
    name:"auth",
    initialState,
    reducers:{
        userRegistration:(state, action)=>{
            state.token = action.payload.token;
        },
        userLoggedIn:(state, action)=>{
            console.log(`action ${JSON.stringify(action)}`)
            console.log(`token ${JSON.stringify(action.payload.token)}`)
            state.token = action.payload.token;
            state.user = action.payload.user;

            // localStorage.setItem("token", action.payload.token);
        },
        userLoggedOut:(state)=>{

            state.token="";
            state.user="";
            // localStorage.removeItem("token");
        }
    }
})

export const  {userRegistration,userLoggedIn,userLoggedOut} = authSlice.actions;
export default authSlice.reducer;