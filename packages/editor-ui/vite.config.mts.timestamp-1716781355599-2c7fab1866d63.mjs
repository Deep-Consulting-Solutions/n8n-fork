// vite.config.mts
import vue2 from "file:///C:/Users/HP/Desktop/fix/latest/n8n-fork/node_modules/.pnpm/@vitejs+plugin-vue@5.0.4_vite@5.1.6_vue@3.4.21/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import { resolve as resolve2 } from "path";
import { defineConfig as defineConfig2, mergeConfig as mergeConfig2 } from "file:///C:/Users/HP/Desktop/fix/latest/n8n-fork/node_modules/.pnpm/vite@5.1.6_sass@1.64.1/node_modules/vite/dist/node/index.js";
import { sentryVitePlugin } from "file:///C:/Users/HP/Desktop/fix/latest/n8n-fork/node_modules/.pnpm/@sentry+vite-plugin@2.5.0/node_modules/@sentry/vite-plugin/dist/esm/index.mjs";
import checker2 from "file:///C:/Users/HP/Desktop/fix/latest/n8n-fork/node_modules/.pnpm/vite-plugin-checker@0.6.4_patch_hash=emhml6hz55p6dz7xjncbjppjdm_typescript@5.4.2_vite@5.1.6_vue-tsc@2.0.6/node_modules/vite-plugin-checker/dist/esm/main.js";

// package.json
var package_default = {
  name: "n8n-editor-ui",
  version: "1.41.0",
  description: "Workflow Editor UI for n8n",
  license: "SEE LICENSE IN LICENSE.md",
  homepage: "https://n8n.io",
  author: {
    name: "Jan Oberhauser",
    email: "jan@n8n.io"
  },
  main: "index.js",
  repository: {
    type: "git",
    url: "git+https://github.com/n8n-io/n8n.git"
  },
  scripts: {
    clean: "rimraf dist .turbo",
    build: 'cross-env VUE_APP_PUBLIC_PATH="/{{BASE_PATH}}/" NODE_OPTIONS="--max-old-space-size=8192" vite build',
    typecheck: "vue-tsc --noEmit",
    dev: "pnpm serve",
    lint: "eslint src --ext .js,.ts,.vue --quiet",
    lintfix: "eslint src --ext .js,.ts,.vue --fix",
    format: "prettier --write . --ignore-path ../../.prettierignore",
    serve: "cross-env VUE_APP_URL_BASE_API=http://localhost:5678/ vite --host 0.0.0.0 --port 8080 dev",
    test: "vitest run",
    "test:dev": "vitest"
  },
  dependencies: {
    "@codemirror/autocomplete": "^6.11.1",
    "@codemirror/commands": "^6.3.2",
    "@codemirror/lang-javascript": "^6.2.1",
    "@codemirror/lang-json": "^6.0.1",
    "@codemirror/lang-python": "^6.1.3",
    "@codemirror/language": "^6.9.3",
    "@codemirror/lint": "^6.4.2",
    "@codemirror/state": "^6.3.3",
    "@codemirror/view": "^6.22.3",
    "@fontsource/open-sans": "^4.5.0",
    "@jsplumb/browser-ui": "^5.13.2",
    "@jsplumb/common": "^5.13.2",
    "@jsplumb/connector-bezier": "^5.13.2",
    "@jsplumb/core": "^5.13.2",
    "@jsplumb/util": "^5.13.2",
    "@lezer/common": "^1.0.4",
    "@n8n/chat": "workspace:*",
    "@n8n/codemirror-lang-sql": "^1.0.2",
    "@n8n/permissions": "workspace:*",
    "@vueuse/components": "^10.5.0",
    "@vueuse/core": "^10.5.0",
    axios: "1.6.7",
    "chart.js": "^4.4.0",
    "codemirror-lang-html-n8n": "^1.0.0",
    "codemirror-lang-n8n-expression": "^0.3.0",
    dateformat: "^3.0.3",
    "email-providers": "^2.0.1",
    "esprima-next": "5.8.4",
    "fast-json-stable-stringify": "^2.1.0",
    "file-saver": "^2.0.2",
    flatted: "^3.2.4",
    "humanize-duration": "^3.27.2",
    jsonpath: "^1.1.1",
    "lodash-es": "^4.17.21",
    luxon: "^3.3.0",
    "n8n-design-system": "workspace:*",
    "n8n-workflow": "workspace:*",
    pinia: "^2.1.6",
    prettier: "^3.1.0",
    "qrcode.vue": "^3.3.4",
    "stream-browserify": "^3.0.0",
    "timeago.js": "^4.0.2",
    uuid: "^8.3.2",
    "v3-infinite-loading": "^1.2.2",
    vue: "^3.4.21",
    "vue-agile": "^2.0.0",
    "vue-chartjs": "^5.2.0",
    "vue-i18n": "^9.2.2",
    "vue-json-pretty": "2.2.4",
    "vue-markdown-render": "^2.0.1",
    "vue-router": "^4.2.2",
    "vue3-touch-events": "^4.1.3",
    xss: "^1.0.14"
  },
  devDependencies: {
    "@faker-js/faker": "^8.0.2",
    "@pinia/testing": "^0.1.3",
    "@sentry/vite-plugin": "^2.5.0",
    "@types/dateformat": "^3.0.0",
    "@types/file-saver": "^2.0.1",
    "@types/humanize-duration": "^3.27.1",
    "@types/jsonpath": "^0.2.0",
    "@types/lodash-es": "^4.17.6",
    "@types/luxon": "^3.2.0",
    "@types/qrcode": "^1.5.0",
    "@types/swagger-ui": "^3.52.0",
    "@types/uuid": "^8.3.2",
    miragejs: "^0.1.48",
    "unplugin-icons": "^0.17.0"
  },
  peerDependencies: {
    "@fortawesome/fontawesome-svg-core": "*",
    "@fortawesome/free-regular-svg-icons": "*",
    "@fortawesome/free-solid-svg-icons": "*",
    "@fortawesome/vue-fontawesome": "*"
  }
};

// ../design-system/vite.config.mts
import vue from "file:///C:/Users/HP/Desktop/fix/latest/n8n-fork/node_modules/.pnpm/@vitejs+plugin-vue@5.0.4_vite@5.1.6_vue@3.4.21/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import { resolve } from "path";
import { defineConfig, mergeConfig } from "file:///C:/Users/HP/Desktop/fix/latest/n8n-fork/node_modules/.pnpm/vite@5.1.6_sass@1.64.1/node_modules/vite/dist/node/index.js";
import checker from "file:///C:/Users/HP/Desktop/fix/latest/n8n-fork/node_modules/.pnpm/vite-plugin-checker@0.6.4_patch_hash=emhml6hz55p6dz7xjncbjppjdm_typescript@5.4.2_vite@5.1.6_vue-tsc@2.0.6/node_modules/vite-plugin-checker/dist/esm/main.js";
import { defineConfig as defineVitestConfig } from "file:///C:/Users/HP/Desktop/fix/latest/n8n-fork/node_modules/.pnpm/vitest@1.3.1/node_modules/vitest/dist/config.js";
var __vite_injected_original_dirname = "C:\\Users\\HP\\Desktop\\fix\\latest\\n8n-fork\\packages\\design-system";
var vitestConfig = defineVitestConfig({
  test: {
    silent: true,
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/__tests__/setup.ts"],
    ...process.env.COVERAGE_ENABLED === "true" ? {
      coverage: {
        enabled: true,
        provider: "v8",
        reporter: process.env.CI === "true" ? "cobertura" : "text-summary",
        all: true
      }
    } : {},
    css: {
      modules: {
        classNameStrategy: "non-scoped"
      }
    }
  }
});
var plugins = [vue()];
if (process.env.ENABLE_TYPE_CHECKING === "true") {
  plugins.push(checker({ vueTsc: true }));
}
var vite_config_default = mergeConfig(
  defineConfig({
    plugins,
    resolve: {
      alias: {
        "@": resolve(__vite_injected_original_dirname, "src"),
        "n8n-design-system": resolve(__vite_injected_original_dirname, "src"),
        lodash: "lodash-es"
      }
    },
    build: {
      lib: {
        entry: resolve(__vite_injected_original_dirname, "src", "main.ts"),
        name: "N8nDesignSystem",
        fileName: (format) => `n8n-design-system.${format}.js`
      },
      rollupOptions: {
        // make sure to externalize deps that shouldn't be bundled
        // into your library
        external: ["vue"],
        output: {
          exports: "named",
          // Provide global variables to use in the UMD build
          // for externalized deps
          globals: {
            vue: "Vue"
          }
        }
      }
    }
  }),
  vitestConfig
);

// vite.config.mts
import icons from "file:///C:/Users/HP/Desktop/fix/latest/n8n-fork/node_modules/.pnpm/unplugin-icons@0.17.4/node_modules/unplugin-icons/dist/vite.mjs";
var __vite_injected_original_dirname2 = "C:\\Users\\HP\\Desktop\\fix\\latest\\n8n-fork\\packages\\editor-ui";
var vendorChunks = ["vue", "vue-router"];
var n8nChunks = ["n8n-workflow", "n8n-design-system", "@n8n/chat"];
var ignoreChunks = [
  "@fontsource/open-sans",
  "@vueuse/components",
  // TODO: remove this. It's currently required by xml2js in NodeErrors
  "stream-browserify",
  "vue-markdown-render"
];
var isScopedPackageToIgnore = (str) => /@codemirror\//.test(str);
function renderChunks() {
  const { dependencies } = package_default;
  const chunks = {};
  Object.keys(dependencies).forEach((key) => {
    if ([...vendorChunks, ...n8nChunks, ...ignoreChunks].includes(key)) {
      return;
    }
    if (isScopedPackageToIgnore(key))
      return;
    chunks[key] = [key];
  });
  return chunks;
}
var publicPath = process.env.VUE_APP_PUBLIC_PATH || "/";
var { NODE_ENV } = process.env;
var alias = [
  { find: "@", replacement: resolve2(__vite_injected_original_dirname2, "src") },
  { find: "stream", replacement: "stream-browserify" },
  {
    find: /^n8n-design-system$/,
    replacement: resolve2(__vite_injected_original_dirname2, "..", "design-system", "src", "main.ts")
  },
  {
    find: /^n8n-design-system\//,
    replacement: resolve2(__vite_injected_original_dirname2, "..", "design-system", "src") + "/"
  },
  {
    find: /^@n8n\/chat$/,
    replacement: resolve2(__vite_injected_original_dirname2, "..", "@n8n", "chat", "src", "index.ts")
  },
  {
    find: /^@n8n\/chat\//,
    replacement: resolve2(__vite_injected_original_dirname2, "..", "@n8n", "chat", "src") + "/"
  },
  ...["orderBy", "camelCase", "cloneDeep", "startCase"].map((name) => ({
    find: new RegExp(`^lodash.${name}$`, "i"),
    replacement: `lodash-es/${name}`
  })),
  {
    find: /^lodash\.(.+)$/,
    replacement: "lodash-es/$1"
  }
];
var plugins2 = [
  icons({
    compiler: "vue3"
  }),
  vue2()
];
if (process.env.ENABLE_TYPE_CHECKING === "true") {
  plugins2.push(checker2({ vueTsc: true }));
}
var { SENTRY_AUTH_TOKEN: authToken, RELEASE: release } = process.env;
if (release && authToken) {
  plugins2.push(
    sentryVitePlugin({
      org: "n8nio",
      project: "instance-frontend",
      // Specify the directory containing build artifacts
      include: "./dist",
      // Auth tokens can be obtained from https://sentry.io/settings/account/api/auth-tokens/
      // and needs the `project:releases` and `org:read` scopes
      authToken,
      telemetry: false,
      release
    })
  );
}
var vite_config_default2 = mergeConfig2(
  defineConfig2({
    define: {
      // This causes test to fail but is required for actually running it
      // ...(NODE_ENV !== 'test' ? { 'global': 'globalThis' } : {}),
      ...NODE_ENV === "development" ? { "process.env": {} } : {},
      BASE_PATH: `'${publicPath}'`
    },
    plugins: plugins2,
    resolve: { alias },
    base: publicPath,
    envPrefix: "VUE_APP",
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '\n@use "@/n8n-theme-variables.scss" as *;\n'
        }
      }
    },
    build: {
      assetsInlineLimit: 0,
      minify: !!release,
      sourcemap: !!release,
      rollupOptions: {
        treeshake: !!release,
        output: {
          manualChunks: {
            vendor: vendorChunks,
            n8n: n8nChunks,
            ...renderChunks()
          }
        }
      }
    }
  }),
  vitestConfig
);
export {
  vite_config_default2 as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcubXRzIiwgInBhY2thZ2UuanNvbiIsICIuLi9kZXNpZ24tc3lzdGVtL3ZpdGUuY29uZmlnLm10cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXEhQXFxcXERlc2t0b3BcXFxcZml4XFxcXGxhdGVzdFxcXFxuOG4tZm9ya1xcXFxwYWNrYWdlc1xcXFxlZGl0b3ItdWlcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXEhQXFxcXERlc2t0b3BcXFxcZml4XFxcXGxhdGVzdFxcXFxuOG4tZm9ya1xcXFxwYWNrYWdlc1xcXFxlZGl0b3ItdWlcXFxcdml0ZS5jb25maWcubXRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy9IUC9EZXNrdG9wL2ZpeC9sYXRlc3QvbjhuLWZvcmsvcGFja2FnZXMvZWRpdG9yLXVpL3ZpdGUuY29uZmlnLm10c1wiO2ltcG9ydCB2dWUgZnJvbSAnQHZpdGVqcy9wbHVnaW4tdnVlJztcclxuaW1wb3J0IHsgcmVzb2x2ZSB9IGZyb20gJ3BhdGgnO1xyXG5pbXBvcnQgeyBkZWZpbmVDb25maWcsIG1lcmdlQ29uZmlnIH0gZnJvbSAndml0ZSc7XHJcbmltcG9ydCB7IHNlbnRyeVZpdGVQbHVnaW4gfSBmcm9tICdAc2VudHJ5L3ZpdGUtcGx1Z2luJztcclxuaW1wb3J0IGNoZWNrZXIgZnJvbSAndml0ZS1wbHVnaW4tY2hlY2tlcic7XHJcblxyXG5pbXBvcnQgcGFja2FnZUpTT04gZnJvbSAnLi9wYWNrYWdlLmpzb24nO1xyXG5pbXBvcnQgeyB2aXRlc3RDb25maWcgfSBmcm9tICcuLi9kZXNpZ24tc3lzdGVtL3ZpdGUuY29uZmlnLm10cyc7XHJcbmltcG9ydCBpY29ucyBmcm9tICd1bnBsdWdpbi1pY29ucy92aXRlJztcclxuXHJcbmNvbnN0IHZlbmRvckNodW5rcyA9IFsndnVlJywgJ3Z1ZS1yb3V0ZXInXTtcclxuY29uc3QgbjhuQ2h1bmtzID0gWyduOG4td29ya2Zsb3cnLCAnbjhuLWRlc2lnbi1zeXN0ZW0nLCAnQG44bi9jaGF0J107XHJcbmNvbnN0IGlnbm9yZUNodW5rcyA9IFtcclxuXHQnQGZvbnRzb3VyY2Uvb3Blbi1zYW5zJyxcclxuXHQnQHZ1ZXVzZS9jb21wb25lbnRzJyxcclxuXHQvLyBUT0RPOiByZW1vdmUgdGhpcy4gSXQncyBjdXJyZW50bHkgcmVxdWlyZWQgYnkgeG1sMmpzIGluIE5vZGVFcnJvcnNcclxuXHQnc3RyZWFtLWJyb3dzZXJpZnknLFxyXG5cdCd2dWUtbWFya2Rvd24tcmVuZGVyJyxcclxuXTtcclxuXHJcbmNvbnN0IGlzU2NvcGVkUGFja2FnZVRvSWdub3JlID0gKHN0cjogc3RyaW5nKSA9PiAvQGNvZGVtaXJyb3JcXC8vLnRlc3Qoc3RyKTtcclxuXHJcbmZ1bmN0aW9uIHJlbmRlckNodW5rcygpIHtcclxuXHRjb25zdCB7IGRlcGVuZGVuY2llcyB9ID0gcGFja2FnZUpTT047XHJcblx0Y29uc3QgY2h1bmtzOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmdbXT4gPSB7fTtcclxuXHJcblx0T2JqZWN0LmtleXMoZGVwZW5kZW5jaWVzKS5mb3JFYWNoKChrZXkpID0+IHtcclxuXHRcdGlmIChbLi4udmVuZG9yQ2h1bmtzLCAuLi5uOG5DaHVua3MsIC4uLmlnbm9yZUNodW5rc10uaW5jbHVkZXMoa2V5KSkge1xyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKGlzU2NvcGVkUGFja2FnZVRvSWdub3JlKGtleSkpIHJldHVybjtcclxuXHJcblx0XHRjaHVua3Nba2V5XSA9IFtrZXldO1xyXG5cdH0pO1xyXG5cclxuXHRyZXR1cm4gY2h1bmtzO1xyXG59XHJcblxyXG5jb25zdCBwdWJsaWNQYXRoID0gcHJvY2Vzcy5lbnYuVlVFX0FQUF9QVUJMSUNfUEFUSCB8fCAnLyc7XHJcblxyXG5jb25zdCB7IE5PREVfRU5WIH0gPSBwcm9jZXNzLmVudjtcclxuXHJcbmNvbnN0IGFsaWFzID0gW1xyXG5cdHsgZmluZDogJ0AnLCByZXBsYWNlbWVudDogcmVzb2x2ZShfX2Rpcm5hbWUsICdzcmMnKSB9LFxyXG5cdHsgZmluZDogJ3N0cmVhbScsIHJlcGxhY2VtZW50OiAnc3RyZWFtLWJyb3dzZXJpZnknIH0sXHJcblx0e1xyXG5cdFx0ZmluZDogL15uOG4tZGVzaWduLXN5c3RlbSQvLFxyXG5cdFx0cmVwbGFjZW1lbnQ6IHJlc29sdmUoX19kaXJuYW1lLCAnLi4nLCAnZGVzaWduLXN5c3RlbScsICdzcmMnLCAnbWFpbi50cycpLFxyXG5cdH0sXHJcblx0e1xyXG5cdFx0ZmluZDogL15uOG4tZGVzaWduLXN5c3RlbVxcLy8sXHJcblx0XHRyZXBsYWNlbWVudDogcmVzb2x2ZShfX2Rpcm5hbWUsICcuLicsICdkZXNpZ24tc3lzdGVtJywgJ3NyYycpICsgJy8nLFxyXG5cdH0sXHJcblx0e1xyXG5cdFx0ZmluZDogL15AbjhuXFwvY2hhdCQvLFxyXG5cdFx0cmVwbGFjZW1lbnQ6IHJlc29sdmUoX19kaXJuYW1lLCAnLi4nLCAnQG44bicsICdjaGF0JywgJ3NyYycsICdpbmRleC50cycpLFxyXG5cdH0sXHJcblx0e1xyXG5cdFx0ZmluZDogL15AbjhuXFwvY2hhdFxcLy8sXHJcblx0XHRyZXBsYWNlbWVudDogcmVzb2x2ZShfX2Rpcm5hbWUsICcuLicsICdAbjhuJywgJ2NoYXQnLCAnc3JjJykgKyAnLycsXHJcblx0fSxcclxuXHQuLi5bJ29yZGVyQnknLCAnY2FtZWxDYXNlJywgJ2Nsb25lRGVlcCcsICdzdGFydENhc2UnXS5tYXAoKG5hbWUpID0+ICh7XHJcblx0XHRmaW5kOiBuZXcgUmVnRXhwKGBebG9kYXNoLiR7bmFtZX0kYCwgJ2knKSxcclxuXHRcdHJlcGxhY2VtZW50OiBgbG9kYXNoLWVzLyR7bmFtZX1gLFxyXG5cdH0pKSxcclxuXHR7XHJcblx0XHRmaW5kOiAvXmxvZGFzaFxcLiguKykkLyxcclxuXHRcdHJlcGxhY2VtZW50OiAnbG9kYXNoLWVzLyQxJyxcclxuXHR9LFxyXG5dO1xyXG5cclxuY29uc3QgcGx1Z2lucyA9IFtcclxuXHRpY29ucyh7XHJcblx0XHRjb21waWxlcjogJ3Z1ZTMnLFxyXG5cdH0pLFxyXG5cdHZ1ZSgpLFxyXG5dO1xyXG5pZiAocHJvY2Vzcy5lbnYuRU5BQkxFX1RZUEVfQ0hFQ0tJTkcgPT09ICd0cnVlJykge1xyXG5cdHBsdWdpbnMucHVzaChjaGVja2VyKHsgdnVlVHNjOiB0cnVlIH0pKTtcclxufVxyXG5cclxuY29uc3QgeyBTRU5UUllfQVVUSF9UT0tFTjogYXV0aFRva2VuLCBSRUxFQVNFOiByZWxlYXNlIH0gPSBwcm9jZXNzLmVudjtcclxuaWYgKHJlbGVhc2UgJiYgYXV0aFRva2VuKSB7XHJcblx0cGx1Z2lucy5wdXNoKFxyXG5cdFx0c2VudHJ5Vml0ZVBsdWdpbih7XHJcblx0XHRcdG9yZzogJ244bmlvJyxcclxuXHRcdFx0cHJvamVjdDogJ2luc3RhbmNlLWZyb250ZW5kJyxcclxuXHRcdFx0Ly8gU3BlY2lmeSB0aGUgZGlyZWN0b3J5IGNvbnRhaW5pbmcgYnVpbGQgYXJ0aWZhY3RzXHJcblx0XHRcdGluY2x1ZGU6ICcuL2Rpc3QnLFxyXG5cdFx0XHQvLyBBdXRoIHRva2VucyBjYW4gYmUgb2J0YWluZWQgZnJvbSBodHRwczovL3NlbnRyeS5pby9zZXR0aW5ncy9hY2NvdW50L2FwaS9hdXRoLXRva2Vucy9cclxuXHRcdFx0Ly8gYW5kIG5lZWRzIHRoZSBgcHJvamVjdDpyZWxlYXNlc2AgYW5kIGBvcmc6cmVhZGAgc2NvcGVzXHJcblx0XHRcdGF1dGhUb2tlbixcclxuXHRcdFx0dGVsZW1ldHJ5OiBmYWxzZSxcclxuXHRcdFx0cmVsZWFzZSxcclxuXHRcdH0pLFxyXG5cdCk7XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IG1lcmdlQ29uZmlnKFxyXG5cdGRlZmluZUNvbmZpZyh7XHJcblx0XHRkZWZpbmU6IHtcclxuXHRcdFx0Ly8gVGhpcyBjYXVzZXMgdGVzdCB0byBmYWlsIGJ1dCBpcyByZXF1aXJlZCBmb3IgYWN0dWFsbHkgcnVubmluZyBpdFxyXG5cdFx0XHQvLyAuLi4oTk9ERV9FTlYgIT09ICd0ZXN0JyA/IHsgJ2dsb2JhbCc6ICdnbG9iYWxUaGlzJyB9IDoge30pLFxyXG5cdFx0XHQuLi4oTk9ERV9FTlYgPT09ICdkZXZlbG9wbWVudCcgPyB7ICdwcm9jZXNzLmVudic6IHt9IH0gOiB7fSksXHJcblx0XHRcdEJBU0VfUEFUSDogYCcke3B1YmxpY1BhdGh9J2AsXHJcblx0XHR9LFxyXG5cdFx0cGx1Z2lucyxcclxuXHRcdHJlc29sdmU6IHsgYWxpYXMgfSxcclxuXHRcdGJhc2U6IHB1YmxpY1BhdGgsXHJcblx0XHRlbnZQcmVmaXg6ICdWVUVfQVBQJyxcclxuXHRcdGNzczoge1xyXG5cdFx0XHRwcmVwcm9jZXNzb3JPcHRpb25zOiB7XHJcblx0XHRcdFx0c2Nzczoge1xyXG5cdFx0XHRcdFx0YWRkaXRpb25hbERhdGE6ICdcXG5AdXNlIFwiQC9uOG4tdGhlbWUtdmFyaWFibGVzLnNjc3NcIiBhcyAqO1xcbicsXHJcblx0XHRcdFx0fSxcclxuXHRcdFx0fSxcclxuXHRcdH0sXHJcblx0XHRidWlsZDoge1xyXG5cdFx0XHRhc3NldHNJbmxpbmVMaW1pdDogMCxcclxuXHRcdFx0bWluaWZ5OiAhIXJlbGVhc2UsXHJcblx0XHRcdHNvdXJjZW1hcDogISFyZWxlYXNlLFxyXG5cdFx0XHRyb2xsdXBPcHRpb25zOiB7XHJcblx0XHRcdFx0dHJlZXNoYWtlOiAhIXJlbGVhc2UsXHJcblx0XHRcdFx0b3V0cHV0OiB7XHJcblx0XHRcdFx0XHRtYW51YWxDaHVua3M6IHtcclxuXHRcdFx0XHRcdFx0dmVuZG9yOiB2ZW5kb3JDaHVua3MsXHJcblx0XHRcdFx0XHRcdG44bjogbjhuQ2h1bmtzLFxyXG5cdFx0XHRcdFx0XHQuLi5yZW5kZXJDaHVua3MoKSxcclxuXHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0fSxcclxuXHRcdFx0fSxcclxuXHRcdH0sXHJcblx0fSksXHJcblx0dml0ZXN0Q29uZmlnLFxyXG4pO1xyXG4iLCAie1xyXG4gIFwibmFtZVwiOiBcIm44bi1lZGl0b3ItdWlcIixcclxuICBcInZlcnNpb25cIjogXCIxLjQxLjBcIixcclxuICBcImRlc2NyaXB0aW9uXCI6IFwiV29ya2Zsb3cgRWRpdG9yIFVJIGZvciBuOG5cIixcclxuICBcImxpY2Vuc2VcIjogXCJTRUUgTElDRU5TRSBJTiBMSUNFTlNFLm1kXCIsXHJcbiAgXCJob21lcGFnZVwiOiBcImh0dHBzOi8vbjhuLmlvXCIsXHJcbiAgXCJhdXRob3JcIjoge1xyXG4gICAgXCJuYW1lXCI6IFwiSmFuIE9iZXJoYXVzZXJcIixcclxuICAgIFwiZW1haWxcIjogXCJqYW5AbjhuLmlvXCJcclxuICB9LFxyXG4gIFwibWFpblwiOiBcImluZGV4LmpzXCIsXHJcbiAgXCJyZXBvc2l0b3J5XCI6IHtcclxuICAgIFwidHlwZVwiOiBcImdpdFwiLFxyXG4gICAgXCJ1cmxcIjogXCJnaXQraHR0cHM6Ly9naXRodWIuY29tL244bi1pby9uOG4uZ2l0XCJcclxuICB9LFxyXG4gIFwic2NyaXB0c1wiOiB7XHJcbiAgICBcImNsZWFuXCI6IFwicmltcmFmIGRpc3QgLnR1cmJvXCIsXHJcbiAgICBcImJ1aWxkXCI6IFwiY3Jvc3MtZW52IFZVRV9BUFBfUFVCTElDX1BBVEg9XFxcIi97e0JBU0VfUEFUSH19L1xcXCIgTk9ERV9PUFRJT05TPVxcXCItLW1heC1vbGQtc3BhY2Utc2l6ZT04MTkyXFxcIiB2aXRlIGJ1aWxkXCIsXHJcbiAgICBcInR5cGVjaGVja1wiOiBcInZ1ZS10c2MgLS1ub0VtaXRcIixcclxuICAgIFwiZGV2XCI6IFwicG5wbSBzZXJ2ZVwiLFxyXG4gICAgXCJsaW50XCI6IFwiZXNsaW50IHNyYyAtLWV4dCAuanMsLnRzLC52dWUgLS1xdWlldFwiLFxyXG4gICAgXCJsaW50Zml4XCI6IFwiZXNsaW50IHNyYyAtLWV4dCAuanMsLnRzLC52dWUgLS1maXhcIixcclxuICAgIFwiZm9ybWF0XCI6IFwicHJldHRpZXIgLS13cml0ZSAuIC0taWdub3JlLXBhdGggLi4vLi4vLnByZXR0aWVyaWdub3JlXCIsXHJcbiAgICBcInNlcnZlXCI6IFwiY3Jvc3MtZW52IFZVRV9BUFBfVVJMX0JBU0VfQVBJPWh0dHA6Ly9sb2NhbGhvc3Q6NTY3OC8gdml0ZSAtLWhvc3QgMC4wLjAuMCAtLXBvcnQgODA4MCBkZXZcIixcclxuICAgIFwidGVzdFwiOiBcInZpdGVzdCBydW5cIixcclxuICAgIFwidGVzdDpkZXZcIjogXCJ2aXRlc3RcIlxyXG4gIH0sXHJcbiAgXCJkZXBlbmRlbmNpZXNcIjoge1xyXG4gICAgXCJAY29kZW1pcnJvci9hdXRvY29tcGxldGVcIjogXCJeNi4xMS4xXCIsXHJcbiAgICBcIkBjb2RlbWlycm9yL2NvbW1hbmRzXCI6IFwiXjYuMy4yXCIsXHJcbiAgICBcIkBjb2RlbWlycm9yL2xhbmctamF2YXNjcmlwdFwiOiBcIl42LjIuMVwiLFxyXG4gICAgXCJAY29kZW1pcnJvci9sYW5nLWpzb25cIjogXCJeNi4wLjFcIixcclxuICAgIFwiQGNvZGVtaXJyb3IvbGFuZy1weXRob25cIjogXCJeNi4xLjNcIixcclxuICAgIFwiQGNvZGVtaXJyb3IvbGFuZ3VhZ2VcIjogXCJeNi45LjNcIixcclxuICAgIFwiQGNvZGVtaXJyb3IvbGludFwiOiBcIl42LjQuMlwiLFxyXG4gICAgXCJAY29kZW1pcnJvci9zdGF0ZVwiOiBcIl42LjMuM1wiLFxyXG4gICAgXCJAY29kZW1pcnJvci92aWV3XCI6IFwiXjYuMjIuM1wiLFxyXG4gICAgXCJAZm9udHNvdXJjZS9vcGVuLXNhbnNcIjogXCJeNC41LjBcIixcclxuICAgIFwiQGpzcGx1bWIvYnJvd3Nlci11aVwiOiBcIl41LjEzLjJcIixcclxuICAgIFwiQGpzcGx1bWIvY29tbW9uXCI6IFwiXjUuMTMuMlwiLFxyXG4gICAgXCJAanNwbHVtYi9jb25uZWN0b3ItYmV6aWVyXCI6IFwiXjUuMTMuMlwiLFxyXG4gICAgXCJAanNwbHVtYi9jb3JlXCI6IFwiXjUuMTMuMlwiLFxyXG4gICAgXCJAanNwbHVtYi91dGlsXCI6IFwiXjUuMTMuMlwiLFxyXG4gICAgXCJAbGV6ZXIvY29tbW9uXCI6IFwiXjEuMC40XCIsXHJcbiAgICBcIkBuOG4vY2hhdFwiOiBcIndvcmtzcGFjZToqXCIsXHJcbiAgICBcIkBuOG4vY29kZW1pcnJvci1sYW5nLXNxbFwiOiBcIl4xLjAuMlwiLFxyXG4gICAgXCJAbjhuL3Blcm1pc3Npb25zXCI6IFwid29ya3NwYWNlOipcIixcclxuICAgIFwiQHZ1ZXVzZS9jb21wb25lbnRzXCI6IFwiXjEwLjUuMFwiLFxyXG4gICAgXCJAdnVldXNlL2NvcmVcIjogXCJeMTAuNS4wXCIsXHJcbiAgICBcImF4aW9zXCI6IFwiMS42LjdcIixcclxuICAgIFwiY2hhcnQuanNcIjogXCJeNC40LjBcIixcclxuICAgIFwiY29kZW1pcnJvci1sYW5nLWh0bWwtbjhuXCI6IFwiXjEuMC4wXCIsXHJcbiAgICBcImNvZGVtaXJyb3ItbGFuZy1uOG4tZXhwcmVzc2lvblwiOiBcIl4wLjMuMFwiLFxyXG4gICAgXCJkYXRlZm9ybWF0XCI6IFwiXjMuMC4zXCIsXHJcbiAgICBcImVtYWlsLXByb3ZpZGVyc1wiOiBcIl4yLjAuMVwiLFxyXG4gICAgXCJlc3ByaW1hLW5leHRcIjogXCI1LjguNFwiLFxyXG4gICAgXCJmYXN0LWpzb24tc3RhYmxlLXN0cmluZ2lmeVwiOiBcIl4yLjEuMFwiLFxyXG4gICAgXCJmaWxlLXNhdmVyXCI6IFwiXjIuMC4yXCIsXHJcbiAgICBcImZsYXR0ZWRcIjogXCJeMy4yLjRcIixcclxuICAgIFwiaHVtYW5pemUtZHVyYXRpb25cIjogXCJeMy4yNy4yXCIsXHJcbiAgICBcImpzb25wYXRoXCI6IFwiXjEuMS4xXCIsXHJcbiAgICBcImxvZGFzaC1lc1wiOiBcIl40LjE3LjIxXCIsXHJcbiAgICBcImx1eG9uXCI6IFwiXjMuMy4wXCIsXHJcbiAgICBcIm44bi1kZXNpZ24tc3lzdGVtXCI6IFwid29ya3NwYWNlOipcIixcclxuICAgIFwibjhuLXdvcmtmbG93XCI6IFwid29ya3NwYWNlOipcIixcclxuICAgIFwicGluaWFcIjogXCJeMi4xLjZcIixcclxuICAgIFwicHJldHRpZXJcIjogXCJeMy4xLjBcIixcclxuICAgIFwicXJjb2RlLnZ1ZVwiOiBcIl4zLjMuNFwiLFxyXG4gICAgXCJzdHJlYW0tYnJvd3NlcmlmeVwiOiBcIl4zLjAuMFwiLFxyXG4gICAgXCJ0aW1lYWdvLmpzXCI6IFwiXjQuMC4yXCIsXHJcbiAgICBcInV1aWRcIjogXCJeOC4zLjJcIixcclxuICAgIFwidjMtaW5maW5pdGUtbG9hZGluZ1wiOiBcIl4xLjIuMlwiLFxyXG4gICAgXCJ2dWVcIjogXCJeMy40LjIxXCIsXHJcbiAgICBcInZ1ZS1hZ2lsZVwiOiBcIl4yLjAuMFwiLFxyXG4gICAgXCJ2dWUtY2hhcnRqc1wiOiBcIl41LjIuMFwiLFxyXG4gICAgXCJ2dWUtaTE4blwiOiBcIl45LjIuMlwiLFxyXG4gICAgXCJ2dWUtanNvbi1wcmV0dHlcIjogXCIyLjIuNFwiLFxyXG4gICAgXCJ2dWUtbWFya2Rvd24tcmVuZGVyXCI6IFwiXjIuMC4xXCIsXHJcbiAgICBcInZ1ZS1yb3V0ZXJcIjogXCJeNC4yLjJcIixcclxuICAgIFwidnVlMy10b3VjaC1ldmVudHNcIjogXCJeNC4xLjNcIixcclxuICAgIFwieHNzXCI6IFwiXjEuMC4xNFwiXHJcbiAgfSxcclxuICBcImRldkRlcGVuZGVuY2llc1wiOiB7XHJcbiAgICBcIkBmYWtlci1qcy9mYWtlclwiOiBcIl44LjAuMlwiLFxyXG4gICAgXCJAcGluaWEvdGVzdGluZ1wiOiBcIl4wLjEuM1wiLFxyXG4gICAgXCJAc2VudHJ5L3ZpdGUtcGx1Z2luXCI6IFwiXjIuNS4wXCIsXHJcbiAgICBcIkB0eXBlcy9kYXRlZm9ybWF0XCI6IFwiXjMuMC4wXCIsXHJcbiAgICBcIkB0eXBlcy9maWxlLXNhdmVyXCI6IFwiXjIuMC4xXCIsXHJcbiAgICBcIkB0eXBlcy9odW1hbml6ZS1kdXJhdGlvblwiOiBcIl4zLjI3LjFcIixcclxuICAgIFwiQHR5cGVzL2pzb25wYXRoXCI6IFwiXjAuMi4wXCIsXHJcbiAgICBcIkB0eXBlcy9sb2Rhc2gtZXNcIjogXCJeNC4xNy42XCIsXHJcbiAgICBcIkB0eXBlcy9sdXhvblwiOiBcIl4zLjIuMFwiLFxyXG4gICAgXCJAdHlwZXMvcXJjb2RlXCI6IFwiXjEuNS4wXCIsXHJcbiAgICBcIkB0eXBlcy9zd2FnZ2VyLXVpXCI6IFwiXjMuNTIuMFwiLFxyXG4gICAgXCJAdHlwZXMvdXVpZFwiOiBcIl44LjMuMlwiLFxyXG4gICAgXCJtaXJhZ2Vqc1wiOiBcIl4wLjEuNDhcIixcclxuICAgIFwidW5wbHVnaW4taWNvbnNcIjogXCJeMC4xNy4wXCJcclxuICB9LFxyXG4gIFwicGVlckRlcGVuZGVuY2llc1wiOiB7XHJcbiAgICBcIkBmb3J0YXdlc29tZS9mb250YXdlc29tZS1zdmctY29yZVwiOiBcIipcIixcclxuICAgIFwiQGZvcnRhd2Vzb21lL2ZyZWUtcmVndWxhci1zdmctaWNvbnNcIjogXCIqXCIsXHJcbiAgICBcIkBmb3J0YXdlc29tZS9mcmVlLXNvbGlkLXN2Zy1pY29uc1wiOiBcIipcIixcclxuICAgIFwiQGZvcnRhd2Vzb21lL3Z1ZS1mb250YXdlc29tZVwiOiBcIipcIlxyXG4gIH1cclxufVxyXG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXEhQXFxcXERlc2t0b3BcXFxcZml4XFxcXGxhdGVzdFxcXFxuOG4tZm9ya1xcXFxwYWNrYWdlc1xcXFxkZXNpZ24tc3lzdGVtXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxIUFxcXFxEZXNrdG9wXFxcXGZpeFxcXFxsYXRlc3RcXFxcbjhuLWZvcmtcXFxccGFja2FnZXNcXFxcZGVzaWduLXN5c3RlbVxcXFx2aXRlLmNvbmZpZy5tdHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL0hQL0Rlc2t0b3AvZml4L2xhdGVzdC9uOG4tZm9yay9wYWNrYWdlcy9kZXNpZ24tc3lzdGVtL3ZpdGUuY29uZmlnLm10c1wiO2ltcG9ydCB2dWUgZnJvbSAnQHZpdGVqcy9wbHVnaW4tdnVlJztcclxuaW1wb3J0IHsgcmVzb2x2ZSB9IGZyb20gJ3BhdGgnO1xyXG5pbXBvcnQgeyBkZWZpbmVDb25maWcsIG1lcmdlQ29uZmlnIH0gZnJvbSAndml0ZSc7XHJcbmltcG9ydCBjaGVja2VyIGZyb20gJ3ZpdGUtcGx1Z2luLWNoZWNrZXInO1xyXG5pbXBvcnQgeyB0eXBlIFVzZXJDb25maWcgfSBmcm9tICd2aXRlc3QnO1xyXG5pbXBvcnQgeyBkZWZpbmVDb25maWcgYXMgZGVmaW5lVml0ZXN0Q29uZmlnIH0gZnJvbSAndml0ZXN0L2NvbmZpZyc7XHJcblxyXG5leHBvcnQgY29uc3Qgdml0ZXN0Q29uZmlnID0gZGVmaW5lVml0ZXN0Q29uZmlnKHtcclxuXHR0ZXN0OiB7XHJcblx0XHRzaWxlbnQ6IHRydWUsXHJcblx0XHRnbG9iYWxzOiB0cnVlLFxyXG5cdFx0ZW52aXJvbm1lbnQ6ICdqc2RvbScsXHJcblx0XHRzZXR1cEZpbGVzOiBbJy4vc3JjL19fdGVzdHNfXy9zZXR1cC50cyddLFxyXG5cdFx0Li4uKHByb2Nlc3MuZW52LkNPVkVSQUdFX0VOQUJMRUQgPT09ICd0cnVlJ1xyXG5cdFx0XHQ/IHtcclxuXHRcdFx0XHRcdGNvdmVyYWdlOiB7XHJcblx0XHRcdFx0XHRcdGVuYWJsZWQ6IHRydWUsXHJcblx0XHRcdFx0XHRcdHByb3ZpZGVyOiAndjgnLFxyXG5cdFx0XHRcdFx0XHRyZXBvcnRlcjogcHJvY2Vzcy5lbnYuQ0kgPT09ICd0cnVlJyA/ICdjb2JlcnR1cmEnIDogJ3RleHQtc3VtbWFyeScsXHJcblx0XHRcdFx0XHRcdGFsbDogdHJ1ZSxcclxuXHRcdFx0XHRcdH0sXHJcblx0XHRcdCAgfVxyXG5cdFx0XHQ6IHt9KSxcclxuXHRcdGNzczoge1xyXG5cdFx0XHRtb2R1bGVzOiB7XHJcblx0XHRcdFx0Y2xhc3NOYW1lU3RyYXRlZ3k6ICdub24tc2NvcGVkJyxcclxuXHRcdFx0fSxcclxuXHRcdH0sXHJcblx0fSxcclxufSkgYXMgVXNlckNvbmZpZztcclxuXHJcbmNvbnN0IHBsdWdpbnMgPSBbdnVlKCldO1xyXG5pZiAocHJvY2Vzcy5lbnYuRU5BQkxFX1RZUEVfQ0hFQ0tJTkcgPT09ICd0cnVlJykge1xyXG5cdHBsdWdpbnMucHVzaChjaGVja2VyKHsgdnVlVHNjOiB0cnVlIH0pKTtcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgbWVyZ2VDb25maWcoXHJcblx0ZGVmaW5lQ29uZmlnKHtcclxuXHRcdHBsdWdpbnMsXHJcblx0XHRyZXNvbHZlOiB7XHJcblx0XHRcdGFsaWFzOiB7XHJcblx0XHRcdFx0J0AnOiByZXNvbHZlKF9fZGlybmFtZSwgJ3NyYycpLFxyXG5cdFx0XHRcdCduOG4tZGVzaWduLXN5c3RlbSc6IHJlc29sdmUoX19kaXJuYW1lLCAnc3JjJyksXHJcblx0XHRcdFx0bG9kYXNoOiAnbG9kYXNoLWVzJyxcclxuXHRcdFx0fSxcclxuXHRcdH0sXHJcblx0XHRidWlsZDoge1xyXG5cdFx0XHRsaWI6IHtcclxuXHRcdFx0XHRlbnRyeTogcmVzb2x2ZShfX2Rpcm5hbWUsICdzcmMnLCAnbWFpbi50cycpLFxyXG5cdFx0XHRcdG5hbWU6ICdOOG5EZXNpZ25TeXN0ZW0nLFxyXG5cdFx0XHRcdGZpbGVOYW1lOiAoZm9ybWF0KSA9PiBgbjhuLWRlc2lnbi1zeXN0ZW0uJHtmb3JtYXR9LmpzYCxcclxuXHRcdFx0fSxcclxuXHRcdFx0cm9sbHVwT3B0aW9uczoge1xyXG5cdFx0XHRcdC8vIG1ha2Ugc3VyZSB0byBleHRlcm5hbGl6ZSBkZXBzIHRoYXQgc2hvdWxkbid0IGJlIGJ1bmRsZWRcclxuXHRcdFx0XHQvLyBpbnRvIHlvdXIgbGlicmFyeVxyXG5cdFx0XHRcdGV4dGVybmFsOiBbJ3Z1ZSddLFxyXG5cdFx0XHRcdG91dHB1dDoge1xyXG5cdFx0XHRcdFx0ZXhwb3J0czogJ25hbWVkJyxcclxuXHRcdFx0XHRcdC8vIFByb3ZpZGUgZ2xvYmFsIHZhcmlhYmxlcyB0byB1c2UgaW4gdGhlIFVNRCBidWlsZFxyXG5cdFx0XHRcdFx0Ly8gZm9yIGV4dGVybmFsaXplZCBkZXBzXHJcblx0XHRcdFx0XHRnbG9iYWxzOiB7XHJcblx0XHRcdFx0XHRcdHZ1ZTogJ1Z1ZScsXHJcblx0XHRcdFx0XHR9LFxyXG5cdFx0XHRcdH0sXHJcblx0XHRcdH0sXHJcblx0XHR9LFxyXG5cdH0pLFxyXG5cdHZpdGVzdENvbmZpZyxcclxuKTtcclxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFvWCxPQUFPQSxVQUFTO0FBQ3BZLFNBQVMsV0FBQUMsZ0JBQWU7QUFDeEIsU0FBUyxnQkFBQUMsZUFBYyxlQUFBQyxvQkFBbUI7QUFDMUMsU0FBUyx3QkFBd0I7QUFDakMsT0FBT0MsY0FBYTs7O0FDSnBCO0FBQUEsRUFDRSxNQUFRO0FBQUEsRUFDUixTQUFXO0FBQUEsRUFDWCxhQUFlO0FBQUEsRUFDZixTQUFXO0FBQUEsRUFDWCxVQUFZO0FBQUEsRUFDWixRQUFVO0FBQUEsSUFDUixNQUFRO0FBQUEsSUFDUixPQUFTO0FBQUEsRUFDWDtBQUFBLEVBQ0EsTUFBUTtBQUFBLEVBQ1IsWUFBYztBQUFBLElBQ1osTUFBUTtBQUFBLElBQ1IsS0FBTztBQUFBLEVBQ1Q7QUFBQSxFQUNBLFNBQVc7QUFBQSxJQUNULE9BQVM7QUFBQSxJQUNULE9BQVM7QUFBQSxJQUNULFdBQWE7QUFBQSxJQUNiLEtBQU87QUFBQSxJQUNQLE1BQVE7QUFBQSxJQUNSLFNBQVc7QUFBQSxJQUNYLFFBQVU7QUFBQSxJQUNWLE9BQVM7QUFBQSxJQUNULE1BQVE7QUFBQSxJQUNSLFlBQVk7QUFBQSxFQUNkO0FBQUEsRUFDQSxjQUFnQjtBQUFBLElBQ2QsNEJBQTRCO0FBQUEsSUFDNUIsd0JBQXdCO0FBQUEsSUFDeEIsK0JBQStCO0FBQUEsSUFDL0IseUJBQXlCO0FBQUEsSUFDekIsMkJBQTJCO0FB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QVEsSUFBSSx5QkFBeUIsUUFBUTtBQUNoRCxFQUFBRCxTQUFRLEtBQUtFLFNBQVEsRUFBRSxRQUFRLEtBQUssQ0FBQyxDQUFDO0FBQ3ZDO0FBRUEsSUFBTSxFQUFFLG1CQUFtQixXQUFXLFNBQVMsUUFBUSxJQUFJLFFBQVE7QUFDbkUsSUFBSSxXQUFXLFdBQVc7QUFDekIsRUFBQUYsU0FBUTtBQUFBLElBQ1AsaUJBQWlCO0FBQUEsTUFDaEIsS0FBSztBQUFBLE1BQ0wsU0FBUztBQUFBO0FBQUEsTUFFVCxTQUFTO0FBQUE7QUFBQTtBQUFBLE1BR1Q7QUFBQSxNQUNBLFdBQVc7QUFBQSxNQUNYO0FBQUEsSUFDRCxDQUFDO0FBQUEsRUFDRjtBQUNEO0FBRUEsSUFBT0csdUJBQVFDO0FBQUEsRUFDZEMsY0FBYTtBQUFBLElBQ1osUUFBUTtBQUFBO0FBQUE7QUFBQSxNQUdQLEdBQUksYUFBYSxnQkFBZ0IsRUFBRSxlQUFlLENBQUMsRUFBRSxJQUFJLENBQUM7QUFBQSxNQUMxRCxXQUFXLElBQUksVUFBVTtBQUFBLElBQzFCO0FBQUEsSUFDQSxTQUFBTDtBQUFBLElBQ0EsU0FBUyxFQUFFLE1BQU07QUFBQSxJQUNqQixNQUFNO0FBQUEsSUFDTixXQUFXO0FBQUEsSUFDWCxLQUFLO0FBQUEsTUFDSixxQkFBcUI7QUFBQSxRQUNwQixNQUFNO0FBQUEsVUFDTCxnQkFBZ0I7QUFBQSxRQUNqQjtBQUFBLE1BQ0Q7QUFBQSxJQUNEO0FBQUEsSUFDQSxPQUFPO0FBQUEsTUFDTixtQkFBbUI7QUFBQSxNQUNuQixRQUFRLENBQUMsQ0FBQztBQUFBLE1BQ1YsV0FBVyxDQUFDLENBQUM7QUFBQSxNQUNiLGVBQWU7QUFBQSxRQUNkLFdBQVcsQ0FBQyxDQUFDO0FBQUEsUUFDYixRQUFRO0FBQUEsVUFDUCxjQUFjO0FBQUEsWUFDYixRQUFRO0FBQUEsWUFDUixLQUFLO0FBQUEsWUFDTCxHQUFHLGFBQWE7QUFBQSxVQUNqQjtBQUFBLFFBQ0Q7QUFBQSxNQUNEO0FBQUEsSUFDRDtBQUFBLEVBQ0QsQ0FBQztBQUFBLEVBQ0Q7QUFDRDsiLAogICJuYW1lcyI6IFsidnVlIiwgInJlc29sdmUiLCAiZGVmaW5lQ29uZmlnIiwgIm1lcmdlQ29uZmlnIiwgImNoZWNrZXIiLCAiX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUiLCAicmVzb2x2ZSIsICJfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSIsICJwbHVnaW5zIiwgInZ1ZSIsICJjaGVja2VyIiwgInZpdGVfY29uZmlnX2RlZmF1bHQiLCAibWVyZ2VDb25maWciLCAiZGVmaW5lQ29uZmlnIl0KfQo=
