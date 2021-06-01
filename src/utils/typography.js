import Typography from "typography"
import twinPeaksTheme from "typography-theme-twin-peaks"
twinPeaksTheme.overrideThemeStyles = () => ({
  a: {
    textShadow: `none`,
    backgroundImage: `none`,
  },
})

const typography = new Typography(twinPeaksTheme)

export default typography
