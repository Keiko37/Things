interface BookmarksState {
  isBookmarks: boolean
  isBookmarkEditing: boolean
  bookmarks: Bookmark[]
  moreModalNumber: number
  editableBookmark: Bookmark | null
}

interface Bookmark {
  name: string
  link: string
}

export type { BookmarksState, Bookmark }
