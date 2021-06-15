import React from "react"
import { graphql } from "gatsby"
import { Helmet } from "react-helmet"
import Layout from "../components/layout"
import { GatsbyImage, getImage } from "gatsby-plugin-image"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTags } from '@fortawesome/free-solid-svg-icons'
import {
  heroContainer,
  hero,
  emojiContainer,
  emoji,
  postHeader,
  title,
  meta,
  tagSpan
} from "./blog-post.module.css"

export default function BlogPost({ data }) {
  const post = data.markdownRemark
  console.log(data.image)
  const image = getImage(data.image)

  return (
    <Layout>
      <Helmet>
        <meta property="og:title" content={post.frontmatter.title} />
        <meta property="og:url" content={post.fields.slug} />
        <meta property="og:type" content="article" />
      </Helmet>
      <div className={heroContainer}>
        <GatsbyImage image={image} className={hero} alt="post title image" />
      </div>
      <div className={emojiContainer}>
        <span className={emoji} role="image" aria-label={post.frontmatter.icon}>
          {post.frontmatter.icon}
        </span>
      </div>
      <div className={postHeader}>
        <h1 className={title}>
          {post.frontmatter.title}
        </h1>
        <p className={meta}>
          <time dateTime={post.frontmatter.date} itemProp="datePublished">
            {post.frontmatter.date}
          </time>
        </p>
        <div>
          <FontAwesomeIcon icon={faTags} />
          {post.frontmatter.tags.map(tag => (
            <span key={tag.id} className={`${tagSpan} ${tag.style}`} bgolor="red">
              {tag.id}
            </span>
          ))}
        </div>
      </div>
      <div dangerouslySetInnerHTML={{ __html: post.html }} />
    </Layout>
  )
}

export const query = graphql`
  query BlogQuery($slug: String!, $pageName: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      fields {
        slug
      }
      frontmatter {
        icon
        title
        date(formatString: "MMMM DD, yyyy")
        tags {
          id
          style
        }
      }
    }
    image: file(relativeDirectory: {eq: $pageName}, name: {eq: "hero"}) {
      childImageSharp {
        gatsbyImageData(layout: CONSTRAINED)
      }
    }
  }
`