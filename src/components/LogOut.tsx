import { setLoggedIn } from '../routes/LogIn'
import { headerButton, panel } from '../styles'

export const LogOut = () => {
  return (
    <div class={panel}>
      <button class={headerButton} innerHTML="logout" onClick={() => setLoggedIn(false)} />
    </div>
  )
}
