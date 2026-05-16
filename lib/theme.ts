export function toggleDarkMode(): void {
  const html = document.documentElement
  if (html.classList.contains('dark')) {
    html.classList.remove('dark')
    localStorage.setItem('theme', 'light')
  } else {
    html.classList.add('dark')
    localStorage.setItem('theme', 'dark')
  }
}

export function isDarkMode(): boolean {
  if (typeof window === 'undefined') return false
  return document.documentElement.classList.contains('dark')
}
