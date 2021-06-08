import React from "react"
import { graphql } from "gatsby"
import Layout from "../components/layout"
import { GatsbyImage, getImage } from "gatsby-plugin-image"

export default function BlogPost({ data }) {
  const post = data.markdownRemark
  console.log(data.image)
  const image = getImage(data.image)

  return (
    <Layout>
      <div>
        <GatsbyImage image={image} alt="post title image" />
      </div>
      <h1>{post.frontmatter.title}</h1>
      <small>{post.frontmatter.date}</small>
      <div dangerouslySetInnerHTML={{ __html: post.html }} />
    </Layout>
  )
}

export const query = graphql`
  query BlogQuery($slug: String!, $pageName: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      frontmatter {
        title
        date
      }
    }
    image: file(relativeDirectory: {eq: $pageName}, name: {eq: "hero"}) {
      childImageSharp {
        gatsbyImageData(layout: FULL_WIDTH)
      }
    }
  }
`