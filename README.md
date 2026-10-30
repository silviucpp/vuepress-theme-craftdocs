# Craft Documentation Theme for VuePress

This is the [VuePress](https://vuepress.vuejs.org/) theme used for [Craft CMS documentation](https://docs.craftcms.com/).

## Changes

Works with Vuepress 1.x

You will have the following to you vuepress `config.js`

```
  alias: {
    "@AlgoliaSearchBox": path.resolve(__dirname,'noop.js'),
  },
```

## Setup

1. [Install](https://vuepress.vuejs.org/guide/getting-started.html) VuePress like normal
2. Require this theme

    ```
    yarn add -D vuepress-theme-craftdocs
    ```

3. Set these things in `.vuepress/config.js`:

    ```js
    module.exports = {
        // ...
        theme: 'craftdocs',
        themeConfig: {
            // ...
            codeLanguages: {
                php: 'PHP',
                twig: 'Twig',
                // any other code language labels you want to include in code toggles...
            }
        },
        markdown: {
            anchor: { level: [2, 3] },
            config(md) {
                let markup = require('vuepress-theme-craftdocs/markup')
                md.use(markup)
            }
        }
    }
    ```

## Code Toggles

You can create code toggles by wrapping multiple fenced code blocks with a `code` container:

````markdown
::: code

```php
echo "Hey, $name";
```

```twig
Hey, {{ name }}
```

:::
````
You can assign same code block to multiple toggles:

````markdown
::: code

```php twig
{
    "is_public": true,
    "url": "/3.0",
    "version": "3.0"
}
```
:::
````

Also you can specify what language to use for highlighting. Usefull when you want to render same code in multiple toggles (an API response for example):

````markdown
::: code

```json -> php twig
{
    "is_public": true,
    "url": "/3.0",
    "version": "3.0"
}
```
:::
````

## Right Column: Code Section or Table of Contents

A page can use a three-column layout: menu on the left, text in the middle and a fixed panel on the right. The panel is either a **code section** or a **table of contents**. Choose one in the page's frontmatter; a page with neither is a normal centered page.

There is no `split` setting: the layout is turned on by `code_section` or `toc`.

### Table of contents

```yaml
---
toc: true
---
```

The right panel lists the `##` headings of the page, with the `###` headings indented under them, and highlights the section being read. It is hidden on narrow screens.

### Code section

```yaml
---
code_section:
  - php
  - twig
---
```

`code_section` is the list of languages of the code toggles of the page. They share a single toggle UI, floated at the top of the right-hand panel. (Use the same language handles defined by `themeConfig.codeLanguages` in `.vuepress/config.js`.)

Any content that contains a horizontal rule (`---`) is divided into `left` and `right` portions, starting and ending at the closest H2/H3 headings. The right portion is shown in the panel.

```markdown
## Cool Headings

Left-side content

---

Right-side content
```

## Sidebar Groups

The sidebar groups of a page are written inline, as `::: group Title` on a line of its own, before the `##` heading that starts the group:

```markdown
::: group API Reference

## Get Event
```

The marker is rendered in the page as a small label above the heading, and the sidebar shows the title as a group title for the headings that follow, up to the next marker. The `sidebarGroups` map of the frontmatter still works and wins when both are used.

## Page Sets

A topic can be split in several pages that share one sidebar. List the pages, in order, in `themeConfig.pageSets` of `.vuepress/config.js`:

```js
themeConfig: {
    pageSets: [
        [
            "/api-reference/device-intelligence/",
            "/api-reference/device-intelligence/signals/"
        ]
    ]
}
```

- The sidebar of every page of the set is the same: one group per page, with all of its headings. The group title is the first `::: group` title of the page.
- The previous and next links at the bottom of a page follow the order of the list.
- Every group follows the `sidebarDepth` of its own page: `1` lists the `##` headings, `2` also lists the `###` headings.

## Inline Code and Links

A paragraph, list or table that contains inline code is not compiled by Vue, so `{{ }}` in code is shown as it is. Only the `<code>` element is protected, so links in the same paragraph still work.
