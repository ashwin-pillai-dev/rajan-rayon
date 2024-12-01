'use client';

import { Sidebar } from 'flowbite-react';
import { HiChartPie } from 'react-icons/hi';
import { MdOutlineInventory2 } from 'react-icons/md';
import { TbTableShare } from 'react-icons/tb';
import { FaPeopleCarry } from "react-icons/fa";
import { FaBoxes } from "react-icons/fa";
import { MdFormatColorFill } from "react-icons/md";
import { GiChemicalDrop } from "react-icons/gi";
import { IoIosColorPalette } from "react-icons/io";
import { TbNeedleThread } from "react-icons/tb";



type PropType = {
    sidebarVisible: boolean

}


const DefaultSidebar: React.FC<PropType> = ({ sidebarVisible }) => {
    return (
        <aside
            className={`fixed top-0 left-0 z-40 w-72 h-screen pt-14 transition-transform ${!sidebarVisible ? '-translate-x-full' : 'translate-x-0'} bg-white border-r border-gray-200 md:translate-x-0 dark:bg-gray-800 dark:border-gray-700`}
            aria-label="Sidenav"
            id="drawer-navigation"
        >
            <div className="overflow-y-auto py-5 px-3 h-full bg-white dark:bg-gray-800">
                <Sidebar aria-label="Default sidebar example">
                    <Sidebar.Items>
                        <Sidebar.ItemGroup>
                            <Sidebar.Item
                                href="/admin"
                                icon={HiChartPie}
                            >
                                <p>
                                    Dashboard
                                </p>
                            </Sidebar.Item>

                            <Sidebar.Collapse
                                icon={TbTableShare}
                                label="Masters"
                            >
                                <Sidebar.Item
                                    icon={FaPeopleCarry}
                                    href="/admin/suppliers/list"
                                >
                                    Suppliers
                                </Sidebar.Item>
                                <Sidebar.Item
                                    href="/admin/shades/list"
                                    icon={IoIosColorPalette}
                                >
                                    <p>
                                        Shades
                                    </p>
                                </Sidebar.Item>
                            </Sidebar.Collapse>


                            <Sidebar.Collapse
                                icon={MdOutlineInventory2}
                                label="Stocks"
                            >
                                <Sidebar.Item href="/admin/material/list" icon={FaBoxes}>
                                    Materials
                                </Sidebar.Item>
                                <Sidebar.Item href="/admin/colors/list" icon={MdFormatColorFill}>
                                    Colors
                                </Sidebar.Item>
                                <Sidebar.Item href="/admin/chemicals/list" icon={GiChemicalDrop}>
                                    Chemicals
                                </Sidebar.Item>
                            </Sidebar.Collapse>

                            <Sidebar.Item
                                href="/admin/production/list"
                                icon={TbNeedleThread}
                            >
                                <p>
                                    Production
                                </p>
                            </Sidebar.Item>



                        </Sidebar.ItemGroup>
                    </Sidebar.Items>
                </Sidebar>
            </div>
        </aside>
    )
}

export default DefaultSidebar


