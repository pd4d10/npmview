import { CSSProperties } from 'react'

// FIXME:
// https://docs.npmjs.com/files/package.json#repository
export const getRepositoryUrl = (repository: any) => {
  if (typeof repository === 'string') {
    return `https://github.com/${repository}`
  } else if (typeof repository === 'object' && repository.url) {
    return repository.url
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

export const fetchPackageJson = async (packageName: string) => {
  const res = await fetch(`https://unpkg.com/${packageName}/package.json`)
  return res.json()
}

export const fetchMeta = async (packageName: string) => {
  const res = await fetch(`https://unpkg.com/${packageName}/?meta`)
  const json = await res.json()
  return json as PackageMetaDirectory
}

export const fetchCode = async (packageName: string, path: string) => {
  // await new Promise(r => setTimeout(r, 4000)) // For testing
  const res = await fetch(`https://unpkg.com/${packageName}${path}`)
  return res.text()
}

export const centerStyles: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}

export const HEADER_HEIGHT = 40
