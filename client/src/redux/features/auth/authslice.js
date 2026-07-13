import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    token: localStorage.getItem("token") || "",
    user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : "",
}

const authSlice = createSlice({
    name:"auth",
    initialState,
    reducers:{
        userRegistration:(state, action)=>{
            state.token = action.payload.token;
        },
        userLoggedIn:(state, action)=>{
            state.token = action.payload.token;
            state.user = action.payload.user;

            localStorage.setItem("token", action.payload.token);
            localStorage.setItem("user", JSON.stringify(action.payload.user));
        },
        userLoggedOut:(state)=>{
            state.token="";
            state.user="";
            
            localStorage.removeItem("token");
            localStorage.removeItem("user");
        }
    }
})

export const {userRegistration, userLoggedIn, userLoggedOut} = authSlice.actions;
export default authSlice.reducer;