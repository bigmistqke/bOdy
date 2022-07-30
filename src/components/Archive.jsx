import { createEffect } from "solid-js";
import { onMount } from "solid-js";
import { getDate, getMonth, skeletonToPose } from "../helpers/helpers";
import { setStore, store } from "../Store";
import { header, panel } from "../styles";
import { sum } from "../helpers/sum";
import { scale } from "../helpers/scale";

import autoAnimate from "@formkit/auto-animate";
import {
  dirty,
  setMorphsDictionary,
  setPose,
  tweenMorphsDictionaries,
  tweenPose,
} from "../actions";

const Archive = () => {
  let ref;

  const displayDiaryEntry = ({ pose, morphs, text }, tween = true) => {
    if (tween) {
      tweenPose(skeletonToPose(store.skeleton), pose);
      tweenMorphsDictionaries(store.morphs.dictionary, morphs.dictionary);
    } else {
      setPose(pose);
      setMorphsDictionary(morphs.dictionary);
    }
    dirty();
  };

  const calculateAverage = () =>
    scale(store.entries.reduce(sum), 1 / store.entries.length);

  const displayAverage = () => {
    let { morphs, pose } = calculateAverage();
    tweenPose(skeletonToPose(store.skeleton), pose);
    tweenMorphsDictionaries(store.morphs.dictionary, morphs.dictionary);
  };

  let initialized = false;

  createEffect(() => {
    if (!store.model || initialized || !store.entries) return;
    setTimeout(() => {
      const lastEntry = store.entries.slice(-1)[0];
      if (getDate() !== lastEntry.name) return;
      displayDiaryEntry(lastEntry, false);
      setStore("text", lastEntry.text);
      dirty();
    }, 0);
    initialized = true;
  });

  onMount(() => autoAnimate(ref));

  return (
    <div class={"flex-1 w-full " + panel}>
      <h3 class={"flex " + header}>
        <span class="flex-1">archive</span>
        <button class="text-xs hover:underline" onClick={displayAverage}>
          average
        </button>
      </h3>
      <div ref={ref} class="flex-1 overflow-auto">
        <Show when={store.entries}>
          <For each={[...store.entries].reverse()}>
            {(entry, index) => {
              const [day, month, year] = entry.name.split("_");
              return (
                <button
                  class="hover:bg-gray-50 hover:text-gray-500 text-gray-400 text-left p-2 border-b-2 flex w-full flex-col"
                  onClick={() => displayDiaryEntry(entry)}
                >
                  <div class="flex">
                    <span class="flex-1 text-sm p-1 text-gray-600 tracking-wide">
                      {day} {getMonth(month)} {year}
                    </span>
                    <Show when={entry.name === getDate()}>
                      <span class="text-xs self-center">⬤</span>
                    </Show>
                  </div>
                  <span class="font-mono text-xs p-1 text-right whitespace-pre-line">
                    {entry.text}
                  </span>
                </button>
              );
            }}
          </For>
        </Show>
      </div>
    </div>
  );
};
export default Archive;
