<div align="center">
  <h1>starlight-typedoc 📚</h1>
  <p>Astro integration for Starlight to generate documentation from TypeScript using TypeDoc.</p>
  <p>
    <a href="https://github.com/HiDeoo/vercel-env-push/assets/494699/dd06da84-d28a-4d09-b9ee-a716ebf5bbbf" title="Screenshot of starlight-typedoc">
      <img alt="Screenshot of starlight-typedoc" src="https://github.com/HiDeoo/vercel-env-push/assets/494699/dd06da84-d28a-4d09-b9ee-a716ebf5bbbf" width="520" />
    </a>
  </p>
</div>

<div align="center">
  <a href="https://github.com/HiDeoo/starlight-typedoc/actions/workflows/integration.yml">
    <img alt="Integration Status" src="https://github.com/HiDeoo/starlight-typedoc/actions/workflows/integration.yml/badge.svg" />
  </a>
  <a href="https://github.com/HiDeoo/starlight-typedoc/blob/main/LICENSE">
    <img alt="License" src="https://badgen.net/github/license/HiDeoo/starlight-typedoc" />
  </a>
  <br />
</div>

## Features

An [Astro](https://astro.build) _integration<sup>\*</sup>_ for [Starlight](https://starlight.astro.build) using [TypeDoc](https://typedoc.org) and [typedoc-plugin-markdown](https://github.com/tgreyuk/typedoc-plugin-markdown) to generate documentation from TypeScript code.

Some [TSDoc](https://tsdoc.org) tags uses a custom Markdown syntax, e.g. the `@deprecated`, `@alpha`, `@beta` and `@experimental` tags using Starlight [asides](https://starlight.astro.build/guides/authoring-content/#asides):

<img alt="Screenshot of a deprecated tag in Starlight" src="https://github.com/HiDeoo/vercel-env-push/assets/494699/27036add-e111-46c2-93df-1459ce82be59" width="652" />

<br />
<br />

<sup>\*: `starlight-astro` is currently not available as an [Astro Integration](https://docs.astro.build/en/reference/integrations-reference/) due to current Starlight limitations but the goal is to make it available as one in the future.</sup>

## Installation

Install the Starlight TypeDoc package and its peer dependencies using your favorite package manager, e.g. with [pnpm](https://pnpm.io):

```shell
pnpm add starlight-typedoc typedoc typedoc-plugin-markdown@next
```

Update your [Astro configuration](https://docs.astro.build/en/guides/configuring-astro/#supported-config-file-types) to generate documentation from your TypeScript code:

```diff
  import starlight from '@astrojs/starlight'
  import { defineConfig } from 'astro/config'
+ import { generateTypeDoc } from 'starlight-typedoc'

+ const typeDocSidebarGroup = await generateTypeDoc({
+   entryPoints: ['../path/to/entry-point.ts'],
+   tsconfig: '../path/to/tsconfig.json',
+ })

  export default defineConfig({
    // …
    integrations: [
      starlight({
        sidebar: [
          {
            label: 'Guides',
            items: [{ label: 'Example Guide', link: '/guides/example/' }],
          },
+         typeDocSidebarGroup,
        ],
        title: 'My Docs',
      }),
    ],
  })
```

## Configuration

The `generateTypeDoc` function returns a [`SidebarGroup`](https://starlight.astro.build/reference/configuration/#sidebargroup) object containing the generated documentation sidebar navigation items and can be used in the Starlight configuration. It accepts an object with the following properties:

| Name           | Description                                                                                                               | Required |
| -------------- | ------------------------------------------------------------------------------------------------------------------------- | :------: |
| `entryPoints`  | The path(s) to the entry point(s) to document.                                                                            |    ✅    |
| `tsconfig`     | The path to the `tsconfig.json` file to use for the documentation generation.                                             |    ✅    |
| `output`       | The output directory containing the generated documentation markdown files relative to the `src/content/docs/` directory. |          |
| `sidebarLabel` | The generated documentation sidebar group label.                                                                          |          |
| `typeDoc`      | Additional [TypeDoc configuration](https://typedoc.org/options).                                                          |          |
| `watch`        | Whether to watch the entry point(s) for changes and regenerate the documentation when needed.                             |          |

## License

Licensed under the MIT License, Copyright © HiDeoo.

See [LICENSE](https://github.com/HiDeoo/starlight-typedoc/blob/main/LICENSE) for more information.
