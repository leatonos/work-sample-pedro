import React, { ReactNode } from 'react'
import Link from 'next/link'
import Head from 'next/head'

type Props = {
  children?: ReactNode
  title?: string
}

const Layout = ({ children, title = 'This is the default title' }: Props) => (
  <div>
    <Head>
      <title>{title}</title>
      <meta charSet="utf-8" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    </Head>
    <header>
      <div className='page-title-container'>
        <h1>Risk Thinking AI - Work Sample</h1>
      </div>
      <nav>
        <ul>
          <li><a href='#map'>Map</a></li>
          <li><a href='#table'>Table</a></li>
          <li><a href='#map'>Graph</a></li>
          <li><a href='#map'>About</a></li>
        </ul>
      </nav>
    </header>
    {children}
    <footer>
      <hr />
      <span>I'm here to stay (Footer)</span>
    </footer>
  </div>
)

export default Layout
