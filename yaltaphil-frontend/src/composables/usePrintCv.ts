let installed = false
let wasDark = false

// Print output must be light whatever the on-screen theme is. `dark:` variants are
// class-based, so dropping the class for the duration of the print is both cheaper and
// more reliable than fighting utility specificity inside `@media print`.
const onBeforePrint = () => {
  wasDark = document.documentElement.classList.contains('dark')
  if (wasDark) document.documentElement.classList.remove('dark')
}

const onAfterPrint = () => {
  if (wasDark) document.documentElement.classList.add('dark')
}

export function usePrintCv() {
  // Both the hero and the footer ask for this; the listeners live for the page lifetime.
  if (!installed) {
    installed = true
    window.addEventListener('beforeprint', onBeforePrint)
    window.addEventListener('afterprint', onAfterPrint)
  }

  const printCv = () => window.print()

  return { printCv }
}
