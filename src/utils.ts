import { CSSProperties } from 'react'

const REG_GIT_URL = /^(?:[^@]+)@([^:/]+):/
const REG_WEB_URL = /^(\w+):\/\//
const isGitUrl = (url: string) => REG_GIT_URL.test(url)
const isWebUrl = (url: string) => REG_WEB_URL.test(url)

/**
 * Parse repository url by git protocol
 * @param gitUrl string
 * https://git-scm.com/book/en/v2/Git-on-the-Server-The-Protocols
 */
function parseGitUrl(gitUrl: string) {
  if (!gitUrl) return ''

  if (isGitUrl(gitUrl)) {
    /**
     * The SSH Protocol
     * - git@gitee.com:facebook/react.git
     * - git@gitlab.com:facebook/react.git
     * - git@github.com:facebook/react.git
     */
    // https://github.com/npm/init-package-json/blob/latest/default-input.js#L208-L209
    gitUrl = gitUrl.replace(REG_GIT_URL, ($1, $2) => `https://${$2}/`)
  } else if (isWebUrl(gitUrl)) {
    /**
     * HTTP Protocols
     * - git+https://github.com/facebook/react.git
     * - git+http://github.com/facebook/react.git
     * - https://github.com/facebook/react.git
     */
    const url = new URL(gitUrl)
    url.protocol = 'https' // Forced HTTPS protocol
    gitUrl = url.toString()
  } else {
    /**
     * Local protocol
     * /srv/git/project.git
     */
    gitUrl = ''
  }

  return gitUrl
}

// FIXME:
// https://docs.npmjs.com/files/package.json#repository
export const getRepositoryUrl = (repository: any) => {
  if (typeof repository === 'string') {
    return parseGitUrl(repository)
  } else if (typeof repository === 'object' && repository.url) {
    return parseGitUrl(repository.url)
  }
}

export interface PackageMetaFile {
  path: string
  type: 'file'
  contentType: string
  integrity: string
  lastModified: string
  size: number
}

export interface PackageMetaDirectory {
  path: string
  type: 'directory'
  files: PackageMetaItem[]
}

export type PackageMetaItem = PackageMetaFile | PackageMetaDirectory

const UNPKG_URL = import.meta.env.VITE_UNPKG_URL ?? 'https://unpkg.com'

export const fetchPackageJson = async (packageName: string) => {
  const res = await fetch(`${UNPKG_URL}/${packageName}/package.json`)
  return res.json()
}

export const fetchMeta = async (packageName: string) => {
  const res = await fetch(`${UNPKG_URL}/${packageName}/?meta`)
  const json = await res.json()
  return json as PackageMetaDirectory
}

export const fetchCode = async (packageName: string, path: string) => {
  // await new Promise(r => setTimeout(r, 4000)) // For testing
  const res = await fetch(`${UNPKG_URL}/${packageName}${path}`)
  return res.text()
}

export const centerStyles: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}

export const HEADER_HEIGHT = 40
