// FIXME:
// https://docs.npmjs.com/files/package.json#repository
export const getRepositoryUrl = (repository: any) => {
  if (typeof repository === 'string') {
    return `https://github.com/${repository}`
  } else if (typeof repository === 'object' && repository.url) {
    return repository.url
  }
}
