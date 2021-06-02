import * as React from 'react'
import { siteFooter, container } from './footer.module.css'

const Footer = () => {
  return (
    <footer className={siteFooter}>
      <div className={`wrapper ${container}`}>
        <div>
          <p>© {new Date().getFullYear()} by Gotcha. All rights reserved</p>
        </div>
        <div>
          <p>built with <a href="https://www.gatsbyjs.com/">Gatsby</a>, delivered by <a href="https://www.netlify.com/">Netlify</a></p>
        </div>
      </div>
    </footer>
  )
}

export default Footer