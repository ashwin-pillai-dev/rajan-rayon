'use client'
import { useState } from "react";
import NavBarNew from "./navbar/NavBarNew";
import DefaultSidebar from "./sidebar/sideBar";



export default function NavSideWrapper(user:any ) {
    const [drawerVisible, setDrawerVisible] = useState(false)

    const drawerClicked = () => {
        setDrawerVisible(!drawerVisible)

    }

    return (
    
        <>
     
            <NavBarNew onDrawerClick={drawerClicked} user={null} />

            <DefaultSidebar sidebarVisible={drawerVisible} />
        </>
    )
}