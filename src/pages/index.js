import React from "react"
import { graphql, Link } from "gatsby"
import { Helmet } from "react-helmet"
import Layout from "../components/layout"

export default function IndexPage({ data }) {
  const { posts } = data.blog

  return (
    <Layout>
      <Helmet>
        <meta property="og:url" content="/" />
      </Helmet>
      <div style={{ display: "block", marginBottom: "30px" }}></div>
      {posts.map(post => (
        <article key={post.id}>
          <small> {post.frontmatter.date} </small>
          <Link className="post-link" to={`/${post.parent.name}`}>
            <p className="post-title">{post.frontmatter.title}</p>
          </Link>
          <p>{post.excerpt}</p>
        </article>
      ))}
    </Layout>
  )
}

export const pageQuery = graphql`
  query IndexQuery {
    blog: allMarkdownRemark(
      filter: { frontmatter: { draft: { ne: true } } }
      sort: { fields: [frontmatter___date], order: DESC }
    ) {
      posts: nodes {
        parent {
          ... on File {
            name
          }
        }
        frontmatter {
          date(formatString: "MMMM DD, yyyy")
          title
        }
        id
      }
    }
  }
`
