import { createEffect } from 'solid-js'
import { setStore, store } from '../Store'

import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { TransformControls } from 'three/examples/jsm/controls/TransformControls'
import { dirty } from '../actions'
import { flattenHierarchy, preprocessMorphs, skeletonToPose } from '../helpers/helpers'

export const initScene = (canvas: HTMLCanvasElement) => {
  const width = canvas.parentElement?.clientWidth || window.innerWidth
  const height = canvas.parentElement?.clientHeight || window.innerHeight

  const scene = new THREE.Scene()

  const aspectRatio = width / height
  const fieldOfView = 50
  const nearPlane = 0.1
  const farPlane = 10000
  const camera = new THREE.PerspectiveCamera(fieldOfView, aspectRatio, nearPlane, farPlane)
  camera.position.set(0, 80, 230)

  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
  })
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(width, height)
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap

  const target = new THREE.Vector3(0, 65, 0)

  const cameraControl = new OrbitControls(camera, renderer.domElement)
  cameraControl.target = target
  cameraControl.maxDistance = 2000
  camera.updateProjectionMatrix()

  cameraControl.update()

  const transformControls = new TransformControls(camera, renderer.domElement)
  transformControls.addEventListener('dragging-changed', e => {
    cameraControl.enabled = !e.value
  })
  scene.add(transformControls)

  const size = 1000
  const divisions = 10

  const gridHelper = new THREE.GridHelper(size, divisions)
  scene.add(gridHelper)

  const lights = new THREE.Group()

  const ambient = new THREE.AmbientLight('white')
  ambient.intensity = 0.8
  lights.add(ambient)

  const light = new THREE.PointLight('white')
  light.position.set(500, 500, 500)
  light.intensity = 0.3
  lights.add(light)

  scene.add(lights)

  return { scene, renderer, camera, cameraControl, transformControls, lights }
}

export const initInteractions = ({
  canvas,
  camera,
  renderer,
  transformControls,
  cameraControl,
  lights,
}: {
  canvas: HTMLCanvasElement
  camera: THREE.PerspectiveCamera
  renderer: THREE.Renderer
  transformControls: TransformControls
  cameraControl: OrbitControls
  lights: THREE.Group
}) => {
  let mousedown = false
  let startTime: number, startY: number

  window.addEventListener('mousemove', ({ clientX }) => {
    if (!store.isSpacePressed || !mousedown) return
    const delta = ((startTime - clientX) / window.innerWidth) * 10
    lights.rotation.y = startY + delta
    dirty()
  })

  canvas.addEventListener('mousemove', ({ clientX }) => {
    if (!mousedown) return
    if (!store.dirty) dirty()
  })

  canvas.addEventListener('mousedown', ({ clientX }) => {
    startTime = clientX
    startY = lights.rotation.y
    mousedown = true
  })
  canvas.addEventListener('wheel', () => setStore('dirty', true))
  window.addEventListener('mouseup', () => {
    mousedown = false
  })
  canvas.addEventListener('dblclick', () => setStore('selectedNode', false))

  window.addEventListener('resize', () => {
    const width = canvas.parentElement?.clientWidth || window.innerWidth
    const height = canvas.parentElement?.clientHeight || window.innerHeight
    renderer.setSize(width, height)
    camera.aspect = width / height
    camera.updateProjectionMatrix()
    dirty()
  })

  const incrementSelectionIndex = (increment = true) => {
    if (!store.selectedNode) return false

    const index = store.flatHierarchy.findIndex(el => el === store.selectedNode)
    if (index === -1) return false

    let newIndex = increment ? index + 1 : index - 1
    newIndex = newIndex % (store.flatHierarchy.length - 1)
    if (newIndex < 0) newIndex = store.flatHierarchy.length - 1

    setStore('selectedNode', store.flatHierarchy[newIndex])

    return true
  }

  const processKeyInput = ({ code, key }: { code: string; key: string }) => {
    switch (code) {
      case 'KeyQ':
        transformControls.setSpace(transformControls.space === 'local' ? 'world' : 'local')
        return true
      case 'KeyW':
        transformControls.setMode('translate')
        return true
      case 'KeyE':
        transformControls.setMode('rotate')
        return true
      case 'KeyR':
        transformControls.setMode('scale')
        return true
      case 'KeyS':
        return incrementSelectionIndex()
      case 'KeyA':
        return incrementSelectionIndex(false)
      case 'ShiftLeft':
        if (cameraControl.enabled) cameraControl.enabled = false
        setStore('isSpacePressed', true)
        return
    }
    switch (key) {
      case '+':
        return incrementSelectionIndex()
      case '-':
        return incrementSelectionIndex(false)
    }
  }

  window.addEventListener('keydown', function (event) {
    if (store.isTextFocused) return false
    if (processKeyInput(event)) dirty()
  })
  window.addEventListener('keyup', function (event) {
    switch (event.code) {
      case 'ShiftLeft':
        if (!transformControls.enabled) cameraControl.enabled = true
        event.preventDefault()
        setStore('isSpacePressed', false)
        break
    }
  })
}

const bool = <T>(x: T) => x

export const initSideEffects = ({
  scene,
  transformControls,
}: {
  scene: THREE.Scene
  transformControls: TransformControls
}) => {
  //  TODO: a bit unsure about this whole
  //  loading model in App -> adding it to the scene through an effect
  createEffect(() => {
    if (!store.model) return

    store.model.scale.set(0.35, 0.35, 0.35)
    store.model.translateX(-1)

    console.log(store.model)

    scene.add(store.model)
    store.model.visible = true
    dirty()
    // TODO: figure out a better way to register when texture has loaded
    setTimeout(() => setStore('dirty', true), 500)
  })

  createEffect(() => {
    // if you select a node in hierarchy
    // => make joint transformable
    if (!store.selectedNode) {
      transformControls.detach()
      transformControls.enabled = false
    } else {
      transformControls.attach(store.selectedNode)
      transformControls.enabled = true
    }
    dirty()
  })

  let timeout: ReturnType<typeof setTimeout>

  createEffect(() => {
    // reset dirty to false every time dirty gets set
    if (!store.dirty) return
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => setStore('dirty', false), 500)
  })
}

export const initRender = ({
  scene,
  renderer,
  camera,
}: {
  scene: THREE.Scene
  renderer: THREE.Renderer
  camera: THREE.PerspectiveCamera
}) => {
  const render = () => {
    if (store.dirty || store.selectedNode) renderer.render(scene, camera)
    requestAnimationFrame(render)
  }
  dirty()
  render()
}

const findBones = (model: THREE.Object3D) => {
  const walk = (node: THREE.Object3D): THREE.Object3D | void => {
    let temp_node
    for (let i = 0; i < node.children.length; i++) {
      temp_node = node.children[i]
      if (temp_node.type === 'Bone') {
        return temp_node
      } else {
        const result = walk(temp_node)
        if (result) return result
      }
    }
  }
  return walk(model)
}

const findSkinnedMesh = (model: THREE.Object3D): THREE.Mesh | void => {
  const walk = (node: THREE.Object3D): THREE.Mesh | void => {
    let temp_node
    for (let i = 0; i < node.children.length; i++) {
      temp_node = node.children[i]
      if (temp_node.type === 'SkinnedMesh' || 'morphTargetInfluences' in temp_node) {
        return temp_node as THREE.Mesh
      } else {
        const result = walk(temp_node)
        if (result) return result
      }
    }
  }

  if (model.type === 'SkinnedMesh' || 'morphTargetInfluences' in model) {
    return model as THREE.Mesh
  }
  return walk(model)
}

export function addLoadedModelToScene(model: THREE.Object3D) {
  model.visible = false
  const skinnedMesh = findSkinnedMesh(model)
  const skeleton = findBones(model)

  if (!skinnedMesh) return

  if (store.model) {
    store.model.parent?.remove(store.model)
    setStore('entries', [])
  }

  if (skeleton) {
    const defaultPose = skeleton.clone()
    setStore('skeleton', skeleton as THREE.Object3D)
    setStore('flatHierarchy', flattenHierarchy(skeleton))
    setStore('defaultPose', skeletonToPose(defaultPose))
  }

  setStore('model', model)
  setStore('morphs', {
    targets: skinnedMesh.morphTargetInfluences,
    dictionary: skinnedMesh.morphTargetDictionary
      ? preprocessMorphs(skinnedMesh.morphTargetDictionary)
      : {},
  })
}
