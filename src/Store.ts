import { createStore } from 'solid-js/store'
import * as THREE from 'three'
import { MorphsDictionary, PoseNode } from './helpers/helpers'

const [store, setStore] = createStore<{
  mode: string
  model: THREE.Object3D
  skeleton?: THREE.Object3D
  defaultPose?: PoseNode
  flatHierarchy: THREE.Object3D[]
  entries: any
  morphs: {
    targets: number[]
    dictionary: MorphsDictionary
  }
  dirty: boolean
  text: string
  selectedNode: THREE.Object3D | false
  isTextFocused: boolean
  isSpacePressed: boolean
  transform: {
    space: 'local' | 'world'
    mode: 'translate' | 'rotate' | 'scale'
  }
}>({
  mode: 'navigation',
  model: new THREE.Object3D(),
  flatHierarchy: [],
  entries: [],
  morphs: {
    targets: [],
    dictionary: {},
  },
  dirty: false,
  text: '',
  isTextFocused: false,
  isSpacePressed: false,
  selectedNode: false,
  transform: {
    space: 'local',
    mode: 'translate',
  },
})

export { setStore, store }
