import React from "react"
import { graphql, Link } from "gatsby"
import Layout from "../components/layout"
import "../styles/index.css"

export default function IndexPage({ data }) {
  const { posts } = data.blog

  return (
    <Layout>
      <h2>Все записи</h2>
      {posts.map(post => (
        <article key={post.id}>
          <small> {post.frontmatter.date} </small>
          <Link className="post-link" to={post.fields.slug}>
            <h3 className="post-title">{post.frontmatter.title}</h3>
          </Link>
          <p>{post.excerpt}</p>
        </article>
      ))}
    </Layout>
  )
}

export const pageQuery = graphql`
  query MyQuery {
    blog: allMarkdownRemark {
      posts: nodes {
        fields {
          slug
        }
        frontmatter {
          date(formatString: "MMMM d, yyyy")
          title
        }
        id
      }
    }
  }
`
