import React from 'react'
import { Outlet } from 'react-router-dom'
import './defaultLayout.scss'
import Menu from '../../common/menu'
export default function DefaultLayout() {
    return (
        <div className='default-layout'>
            <div className='default-layout__header'>
                <Menu />
            </div>
            <div className='default-layout__content'>
                <Outlet />
            </div>
        </div>
    )
}
