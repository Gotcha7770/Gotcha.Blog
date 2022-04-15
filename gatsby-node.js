const path = require(`path`)
const { createFilePath } = require(`gatsby-source-filesystem`)

exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions

  if (node.internal.type === `MarkdownRemark`) {
    const filePath = createFilePath({ node, getNode })
    const slug = path.dirname(filePath)
  }
}

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions
  const result = await graphql(`
    query {
      allMarkdownRemark {
        edges {
          node {
            parent {
              ... on File {
                id
                name
                relativeDirectory
              }
            }
          }
        }
      }
    }
  `)

  result.data.allMarkdownRemark.edges.forEach(({ node }) => {
    createPage({
      path: `/${node.parent.name}`,
      component: path.resolve(`./src/components/blog-post.jsx`),
      context: {
        // Data passed to context is available
        // in page queries as GraphQL variables.
        parentId: node.parent.id,
        parentDirectory: node.parent.relativeDirectory
      },
    })
  })
}
