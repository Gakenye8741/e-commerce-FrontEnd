import { configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import authReducer from "../Features/Auth/AuthSlice"
import { userApi } from "../Features/Apis/userApi";
import { categoryApi } from "../Features/Apis/categoryApi";
import { subcategoryApi } from "../Features/Apis/SubCategoryApi";
import { productApi } from "../Features/Apis/ProductApi";
import { mediaApi } from "../Features/Apis/MediaApi";
import { ordersApi } from "../Features/Apis/ordersApi";
import { reviewApi } from "../Features/Apis/ReviewApi";
import { orderItemsApi } from "../Features/Apis/OrderItemApis";
import { mpesaApi } from "../Features/Apis/MpesaApi";


// Create Persist Configuration for auth Slice

 const authPersistConfiguration ={
    key: 'auth',
    storage,
    whitelist: ['user','token','isAuthenticated','role']
 }
//  Create A persistent Reducer for the AUTH
const persistedAuthReducer =persistReducer(authPersistConfiguration,authReducer)


export const store = configureStore({
    reducer: {
        [userApi.reducerPath]: userApi.reducer,
        [categoryApi.reducerPath]: categoryApi.reducer,
        [subcategoryApi.reducerPath]: subcategoryApi.reducer,
        [productApi.reducerPath]: productApi.reducer,
        [mediaApi.reducerPath]: mediaApi.reducer,
        [ordersApi.reducerPath]: ordersApi.reducer,
        [reviewApi.reducerPath]: reviewApi.reducer,
        [orderItemsApi.reducerPath]: orderItemsApi.reducer,
        [mpesaApi.reducerPath]: mpesaApi.reducer,
        auth: persistedAuthReducer,

    },
    middleware: (getDefaultMiddleware)=>
        getDefaultMiddleware({
            serializableCheck: false
        }).concat(userApi.middleware,categoryApi.middleware,subcategoryApi.middleware,productApi.middleware,mediaApi.middleware,ordersApi.middleware,reviewApi.middleware,orderItemsApi.middleware,mpesaApi.middleware)
})

export const persister = persistStore(store);
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch