import { Link } from 'gatsby'
import * as React from 'react'
import { title, wrapper, home } from './header.module.css'

const Header = () => {

  return (
    <header className={title}>
      <div className={wrapper}>
        <Link className={home} to="/">Gotcha.Blog</Link>
      </div>
    </header>
  )
}

export default Header