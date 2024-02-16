import { makePersisted } from '@solid-primitives/storage'
import clsx from 'clsx'
import { Show, createSignal } from 'solid-js'

import Editor from './Editor'

import styles from './LogIn.module.css'

export const [loggedIn, setLoggedIn] = makePersisted(createSignal(false))

export const LogIn = () => {
  const [error, setError] = createSignal<string>()

  let usernameInput: HTMLInputElement
  let passwordInput: HTMLInputElement
  const logIn = (e: SubmitEvent) => {
    e.preventDefault()
    const username = usernameInput.value
    const password = passwordInput.value
    if (username === 'hannah' && password === 'body') {
      setLoggedIn(true)
    } else {
      console.log('error')
      setError('incorrect username/password')
    }
    return false
  }
  return (
    <Show
      when={loggedIn()}
      fallback={
        <div class={styles['form-container']}>
          <form onSubmit={logIn} class={clsx(styles.form, error() ? styles.error : undefined)}>
            <Show when={error()}>
              <div class={styles.errorInfo}>{error()}</div>
            </Show>
            <label>username</label>
            <input ref={usernameInput!} />
            <label>password</label>
            <input ref={passwordInput!} />
            <input type="submit">log in</input>
          </form>
        </div>
      }
    >
      <Editor />
    </Show>
  )
}
