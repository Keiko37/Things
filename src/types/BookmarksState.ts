interface BookmarksState {
  isBookmarks: boolean
  isBookmarkEditing: boolean
  bookmarks: Bookmark[]
  moreModalNumber: number
  editableBookmark: Bookmark | null
}

interface Bookmark {
  id: number
  name: string
  link: string
  icon: string
}

export type { BookmarksState, Bookmark }
