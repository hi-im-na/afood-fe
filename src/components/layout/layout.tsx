import { Props } from '@/utils/interfaces'
import { Box } from '@mui/material'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import scss from './Layout.module.scss'
import SideMenu from './SideMenu'
export default function Layout({ children }: Props) {
  const { data: session } = useSession()
  return (
    <>
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          bottom: 0,
          right: 0,
          left: 0,
          overflow: 'hidden',
          zIndex: -999,
          opacity: 0.8,
        }}
      >
        <Image
          src={'/images/restaurant2.webp'}
          alt="restaurant"
          width={0}
          height={0}
          sizes="100vw"
          style={{ width: '100%', height: 'auto' }} // optional
        />
      </Box>

      <main
        className={scss.layout}
        style={{
          padding: session ? '0 24px 0 80px' : 0,
          height: 'calc(100vh - 104px)',
        }}
      >
        {session && <SideMenu role={session.user.role} />}
        {children}
        {/* <Footer /> */}
      </main>
    </>
  )
}
