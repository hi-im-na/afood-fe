import { Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'

interface PageProps {
  title: string
}

export default function PageTitle({ title }: PageProps) {
  const theme = useTheme()
  return (
    <>
      <div
        style={{ display: 'flex', alignItems: 'center', marginBottom: '2em' }}
      >
        <div
          style={{
            flex: 1,
            backgroundColor: theme.palette.secondary.main,
            height: '.2em',
          }}
        />

        <Typography
          variant="h3"
          textAlign="center"
          sx={{ m: '0 1rem' }}
          color={theme.palette.primary.main}
        >
          {title}
        </Typography>
        <div
          style={{
            flex: 1,
            backgroundColor: theme.palette.secondary.main,
            height: '.2em',
          }}
        />
      </div>
    </>
  )
}
