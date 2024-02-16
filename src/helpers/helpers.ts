import * as THREE from 'three'

import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'

const MODEL_PATH = './hannah.fbx'
export const fbxLoader = new FBXLoader()

export type PoseNode = {
  position: THREE.Vector3
  rotation: THREE.Euler | { _x: number; _y: number; _z: number }
  scale: THREE.Vector3
  name: string
  children: PoseNode[]
}
export type MorphsDictionaryNode = {
  value: number
  types: Record<string, number>
}
export type MorphsDictionary = {
  [key: string]: MorphsDictionaryNode
}

export const preprocessMorphs = (dictionary: { [key: string]: number }) => {
  const morphs: MorphsDictionary = {}

  Object.entries(dictionary).forEach(([name, index]) => {
    const [area, type] = name.split('__')

    if (!(area in morphs)) {
      morphs[area] = {
        value: 0,
        types: {},
      }
    }

    morphs[area].types[type] = index
  })

  return morphs
}

export const loadModel = async () =>
  new Promise((resolve: (object: THREE.Group) => void) => {
    fbxLoader.load(MODEL_PATH, object => {
      resolve(object)
    })
  })

export function flattenHierarchy(node: THREE.Object3D) {
  const stack: THREE.Object3D[] = []
  const walk = (node: THREE.Object3D) => {
    stack.push(node)
    node.children.forEach(node => walk(node))
  }
  walk(node)
  return stack
}

export function skeletonToPose(skeleton: THREE.Object3D) {
  const serialized: PoseNode[] = []

  const walk = (skeleton: THREE.Object3D, serialized: PoseNode[]) => {
    const new_node = {
      position: skeleton.position,
      rotation: skeleton.rotation,
      scale: skeleton.scale,
      name: skeleton.name,
      children: [],
    }
    serialized.push(new_node)
    skeleton.children.forEach(node => walk(node, new_node.children))
  }
  walk(skeleton, serialized)
  return clone(serialized[0])
}

export async function fetchEntries() {
  const response = await fetch('./getDiaryEntries.php')
  if (response.status !== 200) {
    console.error(response)
    return
  }
  return await response.json()
}

export const getMonth = (index: number) =>
  [
    'January',
    'Februari',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ][index - 1]

export const clone = <T>(element: T): T => JSON.parse(JSON.stringify(element))

export function getDate() {
  let date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}_${month}_${day}`
}
