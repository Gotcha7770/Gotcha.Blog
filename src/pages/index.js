import React from "react"
import { graphql, Link } from "gatsby"
import Layout from "../components/layout"

export default function IndexPage({ data }) {
  const { posts } = data.blog

  return (
    <Layout>
      <h2>Все записи</h2>
      {posts.map(post => (
        <article key={post.id}>
          <Link to={post.fields.slug}>
            <h3>{post.frontmatter.title}</h3>
          </Link>
          <small>
            {post.frontmatter.author}, {post.frontmatter.date}
          </small>
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
          date(fromNow: true)
          title
        }
        id
      }
    }
  }
`
