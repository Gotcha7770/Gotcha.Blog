import { Link } from 'gatsby'
import * as React from 'react'
import { container, home } from './header.module.css'

const Header = () => {

  return (
    <header className={container}>
      <div className="wrapper">
        <Link className={home} to="/">Gotcha.Blog</Link>
      </div>
    </header>
  )
}

export default Header