import React from "react"
import { graphql } from "gatsby"
import Header from "../components/header"
import Home from "../components/home"
import Footer from "../components/footer"

export default function IndexPage({ data }) {
  const { posts } = data.blog

  return (
    <div>
      <Header />
      <div>
        <h1>My blog posts</h1>

        {posts.map(post => (
          <article key={post.id}>
            <h2>{post.frontmatter.title}</h2>
            <small>
              {post.frontmatter.author}, {post.frontmatter.date}
            </small>
            <p>{post.excerpt}</p>
          </article>
        ))}
      </div>
      <Footer />
    </div>
  )
}

export const pageQuery = graphql`
  query MyQuery {
    blog: allMarkdownRemark {
      posts: nodes {
        frontmatter {
          date(fromNow: true)
          title
        }
        id
      }
    }
  }
`
