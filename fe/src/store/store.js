import {createStore} from "@reduxjs/toolkit";
import rootReducer from "./reducers/RootReducer";

const store = createStore(rootReducer);
store.subscribe(()=> {
    // console.log('State update: ',store.getState());
})
export default store;