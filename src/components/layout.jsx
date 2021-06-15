import React from "react"
import { Helmet } from "react-helmet"
import Header from "../components/header"
import Footer from "../components/footer"
import { container, pageContent } from './layout.module.css'

const Layout = ({ children }) => {

    return (
        <div className={container}>
            <Helmet>
                <html lang="ru" amp />
                <title>Gotcha.Blog</title>
                <meta name="description" content="Очередной блог программиста" />
                <meta property="og:title" content="Gotcha.Blog" />
                <meta property="og:site_name" content="Gotcha.Blog" />
                <meta property="og:description" content="Очередной блог программиста" />
            </Helmet>
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