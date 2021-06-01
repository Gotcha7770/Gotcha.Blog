import * as React from 'react'
import { container, wrapper } from './footer.module.css'

const Footer = () => {
  return (
    <footer className={container}>
      <div className={wrapper}>
        <div>
          <p>© 2021 by Gotcha. All rights reserved</p>
        </div>
        <div>
          <p>built with Gatsby, delivered by Netlify</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer