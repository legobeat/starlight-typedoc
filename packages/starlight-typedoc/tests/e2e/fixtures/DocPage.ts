import type { Locator, Page } from '@playwright/test'

export class DocPage {
  title: string | null = null

  #useMultipleEntryPoints = false

  constructor(public readonly page: Page) {}

  async goto(url: string) {
    const baseUrl = `http://localhost:${this.#useMultipleEntryPoints ? 3001 : 3000}/${
      this.#useMultipleEntryPoints ? 'api-multiple-entrypoints' : 'api'
    }`

    await this.page.goto(`${baseUrl}${url.startsWith('/') ? url : `/${url}`}${url.endsWith('/') ? '' : '/'}`)

    const title = await this.content.getByRole('heading', { level: 1 }).textContent()
    this.title = title ? title.trim() : null
  }

  useMultipleEntryPoints() {
    this.#useMultipleEntryPoints = true
  }

  get content() {
    return this.page.getByRole('main')
  }

  get #sidebar() {
    return this.page.getByRole('navigation', { name: 'Main' }).locator('div.sidebar')
  }

  get typeDocSidebarLabel() {
    return this.#typeDocSidebarRootDetails.getByRole('heading', {
      exact: true,
      level: 2,
      name: this.#expectedTypeDocSidebarLabel,
    })
  }

  get #expectedTypeDocSidebarLabel() {
    return this.#useMultipleEntryPoints ? 'API' : 'API (auto-generated)'
  }

  get #typeDocSidebarRootDetails() {
    return this.#sidebar
      .getByRole('listitem')
      .locator(`details:has(summary > h2:has-text("${this.#expectedTypeDocSidebarLabel}"))`)
  }

  getTypeDocSidebarItems() {
    return this.#getTypeDocSidebarChildrenItems(this.#typeDocSidebarRootDetails.locator('> ul'))
  }

  async #getTypeDocSidebarChildrenItems(list: Locator): Promise<TypeDocSidebarItem[]> {
    const items: TypeDocSidebarItem[] = []

    for (const category of await list.locator('> li > details').all()) {
      items.push({
        collapsed: !(await category.getAttribute('open')),
        label: await category.locator(`> summary > h2`).textContent(),
        items: await this.#getTypeDocSidebarChildrenItems(category.locator('> ul')),
      })
    }

    for (const link of await list.locator('> li > a').all()) {
      const name = await link.textContent()

      items.push({ name: name ? name.trim() : null })
    }

    return items
  }

  async isTypeDocSidebarCollapsed() {
    return (await this.#typeDocSidebarRootDetails.getAttribute('open')) === null
  }
}

type TypeDocSidebarItem = TypeDocSidebarItemGroup | TypeDocSidebarItemLink

interface TypeDocSidebarItemLink {
  name: string | null
}

interface TypeDocSidebarItemGroup {
  collapsed: boolean
  items: (TypeDocSidebarItemGroup | TypeDocSidebarItemLink)[]
  label: string | null
}
