import React from "react"
import Header from "../components/header"
import Footer from "../components/footer"
import { container, pageContent } from './layout.module.css'

const Layout = ({ children }) => {

    return (
        <div className={container}>
            <Header />
            <main className={pageContent}>
                <div className="wrapper">
                    {children}
                </div>
            </main>
            <Footer />
        </div>
    )
}

export default Layout