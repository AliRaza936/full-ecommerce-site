"use client"
import React from 'react'
import {Provider} from 'react-redux'
import { store } from './store'
import { PersistGate } from 'redux-persist/integration/react'
import { persistStore } from 'redux-persist'



function StoreProvider({children}:{children:React.ReactNode}) {
  let persiststore = persistStore(store)
  return (
   <Provider store={store}>
    <PersistGate  loading={null} persistor={persiststore}>

    {children}
    </PersistGate>
   </Provider>
  )
}

export default StoreProvider
