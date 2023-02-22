import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader"
import { scale } from "../lib/transforms/scale"
import { sum } from "../lib/transforms/sum"

const MODEL_PATH = "./human.fbx"
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
  types: { [key: string]: number }
}
export type MorphsDictionary = {
  [key: string]: MorphsDictionaryNode
}

export const preprocessMorphs = (dictionary: { [key: string]: number }) => {
  const morphs: MorphsDictionary = {}

  Object.entries(dictionary).forEach(([name, index]) => {
    const [area, type] = name.split("__")

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
    fbxLoader.load(MODEL_PATH, (object) => {
      resolve(object)
    })
  })

export function flattenHierarchy(node: THREE.Object3D) {
  const stack: THREE.Object3D[] = []
  const walk = (node: THREE.Object3D) => {
    stack.push(node)
    node.children.forEach((node) => walk(node))
  }
  console.log("NODE IS", node)
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
    skeleton.children.forEach((node) => walk(node, new_node.children))
  }
  walk(skeleton, serialized)
  return clone(serialized[0])
}

export async function fetchEntries() {
  const response = await fetch("http://localhost:8080/api/getDiaryEntries")
  if (response.status !== 200) {
    console.error(response)
    return
  }
  return await response.json()
}

export const getMonth = (index: number) =>
  [
    "January",
    "Februari",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ][index - 1]

export const clone = <T>(element: T): T => JSON.parse(JSON.stringify(element))

export function getDate() {
  let date = new Date()
  return `${date.getDate()}_${date.getMonth() + 1}_${date.getFullYear()}`
}
