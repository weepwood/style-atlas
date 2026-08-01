import type { RefObject } from 'react'

interface FilterBarProps {
  categories: readonly string[]
  activeCategory: string
  query: string
  resultCount: number
  searchRef: RefObject<HTMLInputElement | null>
  onCategoryChange: (category: string) => void
  onQueryChange: (query: string) => void
}

export function FilterBar({ categories, activeCategory, query, resultCount, searchRef, onCategoryChange, onQueryChange }: FilterBarProps) {
  return (
    <section className="control-panel" aria-label="筛选风格">
      <label className="search-box">
        <span aria-hidden="true">⌕</span>
        <input
          ref={searchRef}
          type="search"
          value={query}
          placeholder="搜索风格、场景或关键词…"
          autoComplete="off"
          onChange={(event) => onQueryChange(event.target.value)}
        />
        <kbd>/</kbd>
      </label>
      <div className="filter-list" role="group" aria-label="风格分类">
        {categories.map((category) => (
          <button
            key={category}
            className={`filter-button ${activeCategory === category ? 'active' : ''}`}
            type="button"
            aria-pressed={activeCategory === category}
            onClick={() => onCategoryChange(category)}
          >
            {category}
          </button>
        ))}
      </div>
      <div className="result-count" aria-live="polite"><strong>{resultCount}</strong> 个结果</div>
    </section>
  )
}
