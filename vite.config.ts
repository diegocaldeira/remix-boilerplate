import { vitePlugin as remix } from "@remix-run/dev"
import { installGlobals } from "@remix-run/node"
import { flatRoutes } from "remix-flat-routes"
import { defineConfig, loadEnv } from "vite"
import tsconfigPaths from "vite-tsconfig-paths"

installGlobals()

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "")

  return {
    server: {
      port: 3000,
      host: true,
    },
    define: {
      "process.env.REACT_APP_AWS_ACCESS_KEY_ID": JSON.stringify(
        env.REACT_APP_AWS_ACCESS_KEY_ID
      ),
      "process.env.REACT_APP_AWS_SECRET_ACCESS_KEY": JSON.stringify(
        env.REACT_APP_AWS_SECRET_ACCESS_KEY
      ),
    },
    plugins: [
      remix({
        ignoredRouteFiles: ["**/*"],
        routes: async (defineRoutes) => {
          return flatRoutes("routes", defineRoutes, {
            ignoredRouteFiles: [
              ".*",
              "**/*.css",
              "**/*.test.{js,jsx,ts,tsx}",
              "**/__*.*",
            ],
          })
        },
      }),
      tsconfigPaths(),
    ],
  }
})
