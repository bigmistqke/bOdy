import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { scale } from "./scale";
import { sum } from "./sum";

const MODEL_PATH = "./human.fbx";
export const fbxLoader = new FBXLoader();

export const preprocessMorphs = (dictionary) => {
  const morphs = {};

  Object.entries(dictionary).forEach(([name, index]) => {
    const [area, type] = name.split("___");

    if (!(area in morphs)) {
      morphs[area] = {
        value: 0,
        types: {},
      };
    }

    morphs[area].types[type] = index;
  });

  return morphs;
};


export const loadModel = async () =>
  new Promise((resolve) => {
    fbxLoader.load(MODEL_PATH, (object) => {
      resolve(object)
    });
  });

export function flattenHierarchy(node) {
  const stack = [];
  const walk = (node) => {
    stack.push(node)
    node.children.forEach(node => walk(node))
  }
  walk(node);
  return stack;
}

export function skeletonToPose(skeleton) {
  const serialized = [];

  const walk = (skeleton, serialized) => {
    const new_node = {
      position: skeleton.position,
      rotation: skeleton.rotation,
      scale: skeleton.scale,
      name: skeleton.name,
      children: [],
    };
    serialized.push(new_node);
    skeleton.children.forEach(node => walk(node, new_node.children))
  }
  walk(skeleton, serialized)
  return clone(serialized[0])
}

export async function fetchEntries() {
  const response = await fetch("http://localhost:8080/getDiaryEntries");
  if (response.status !== 200) {
    console.error(response);
    return;
  }
  return await response.json();
};

export const getMonth = (index) =>
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
  ][index];

export const clone = (element) => JSON.parse(JSON.stringify(element))

export function getDate() {
  let date = new Date();
  return `${date.getDate()}_${date.getMonth() + 1}_${date.getFullYear()}`;
};