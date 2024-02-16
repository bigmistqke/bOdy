import { createEffect, For, onMount, Show } from 'solid-js'
import { getDate, getMonth, MorphsDictionary, PoseNode, skeletonToPose } from '../helpers/helpers'
import { scale } from '../lib/transforms/scale'
import { sum } from '../lib/transforms/sum'
import { setStore, store } from '../Store'
import { header, panel } from '../styles'

import autoAnimate from '@formkit/auto-animate'
import { dirty, setMorphsDictionary, setPose, tweenMorphsDictionaries, tweenPose } from '../actions'

const Archive = () => {
  let ref: HTMLDivElement | undefined = undefined

  const displayDiaryEntry = (
    {
      pose,
      morphs: { dictionary },
    }: {
      pose: PoseNode
      morphs: { dictionary: MorphsDictionary }
    },
    tween = true,
  ) => {
    if (!store.skeleton || !store.morphs?.dictionary) return
    if (tween) {
      tweenPose(skeletonToPose(store.skeleton), pose)
      tweenMorphsDictionaries(store.morphs.dictionary, dictionary)
    } else {
      setPose(pose)
      setMorphsDictionary(dictionary)
    }
    dirty()
  }

  const calculateAverage = () => scale(store.entries.reduce(sum), 1 / store.entries.length)

  const displayAverage = () => {
    if (!store.skeleton || !store.morphs?.dictionary) return false
    let { morphs, pose } = calculateAverage()
    tweenPose(skeletonToPose(store.skeleton), pose)
    tweenMorphsDictionaries(store.morphs.dictionary, morphs.dictionary)
  }

  let initialized = false

  createEffect(() => {
    if (!store.model || initialized || store.entries?.length == 0) return
    setTimeout(() => {
      const lastEntry = store.entries.slice(-1)[0]
      if (getDate() !== lastEntry.name) return
      displayDiaryEntry(lastEntry, false)
      setStore('text', lastEntry.text)
      dirty()
    }, 0)
    initialized = true
  })

  onMount(() => autoAnimate(ref as HTMLElement))

  return (
    <div class={'flex-1 w-full ' + panel}>
      <h3 class={'flex ' + header}>
        <span class="flex-1">archive</span>
        <button class="text-xs hover:underline" onClick={displayAverage}>
          average
        </button>
      </h3>
      <div ref={ref} class="flex-1 overflow-auto">
        <Show when={store.entries}>
          <For each={[...store.entries].reverse()}>
            {(entry, index) => {
              const [day, month, year] = entry.name.split('_')
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
              )
            }}
          </For>
        </Show>
      </div>
    </div>
  )
}
export default Archive
