import React from "react"
import { graphql } from "gatsby"
import { Helmet } from "react-helmet"
import Layout from "../components/layout"
import { GatsbyImage, getImage } from "gatsby-plugin-image"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTags } from '@fortawesome/free-solid-svg-icons'
import { Disqus, CommentCount } from 'gatsby-plugin-disqus'
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

export default function BlogPost({ location, data }) {
  const post = data.markdownRemark
  const image = getImage(data.image)
  const disqusConfig = {
    url: location.href,
    identifier: post.id,
    title: post.title,
  }

  console.log(location)
  return (
    <Layout>
      <Helmet>
        <meta property="og:title" content={post.frontmatter.title} />
        <meta property="og:url" content={location.pathname} />
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
      <Disqus config={disqusConfig} />
    </Layout>
  )
}

export const query = graphql`
  query BlogQuery($parentId: String!, $parentDirectory: String!) {
    markdownRemark(parent: { id: { eq: $parentId } }) {
      html
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
    image: file(relativeDirectory: {eq: $parentDirectory}, name: {eq: "hero"}) {
      childImageSharp {
        gatsbyImageData(layout: CONSTRAINED)
      }
    }
  }
`