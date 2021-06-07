import React from "react"
import { graphql, Link } from "gatsby"
import Layout from "../components/layout"

export default function IndexPage({ data }) {
  const { posts } = data.blog

  return (
    <Layout>
      <div style={{ display: "block", marginBottom: "30px" }}></div>
      {posts.map(post => (
        <article key={post.id}>
          <small> {post.frontmatter.date} </small>
          <Link className="post-link" to={post.fields.slug}>
            <p className="post-title">{post.frontmatter.title}</p>
          </Link>
          <p>{post.excerpt}</p>
        </article>
      ))}
    </Layout>
  )
}

export const pageQuery = graphql`
  query MyQuery {
    blog: allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC }
    ) {
      posts: nodes {
        fields {
          slug
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
