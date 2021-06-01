import React from "react"
import Header from "../components/header"
import Footer from "../components/footer"
import { container, wrapper } from './layout.module.css'

const Layout = ({ children }) => {

    return (
        <div className={container}>
            <Header />
            <main className={wrapper}>
                {children}
            </main>
            <Footer />
        </div>
    )
}

export default Layout