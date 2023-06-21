import { Props } from '@/utils/interfaces'
import { useSession } from 'next-auth/react'
import scss from './Layout.module.scss'
import SideMenu from './SideMenu'

export default function Layout({ children }: Props) {
  const { data: session } = useSession()
  return (
    <>
      <main
        className={scss.layout}
        style={{ padding: session ? '0 24px 0 80px' : 0 }}
      >
        {session && <SideMenu />}
        {children}
        {/* <Footer /> */}
      </main>
    </>
  )
}
