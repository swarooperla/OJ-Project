import React from "react";
import NavigationBar from "./NavigationBar";
import {Outlet} from 'react-router-dom'


function RootLayout() {
  return (
    <div>
      <NavigationBar />
      <div style={{minHeight : '85vh', backgroundColor : 'white'}}>
      <Outlet />
      </div>
    </div>
  )
}
export default RootLayout