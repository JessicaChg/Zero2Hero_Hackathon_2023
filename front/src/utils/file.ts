export const generateTextFile = (content: string, filename: string) => {
  return new File([new Blob([content])], filename, {
    type: 'text/plain',
  })
}
