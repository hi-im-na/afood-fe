import { Container, Link, Typography } from '@mui/material'

function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary">
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Ngoc Anh Le
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  )
}
export default function Footer() {
  return (
    <>
      <Container
        maxWidth={false}
        component="footer"
        sx={{
          bgcolor: 'primary.main',
        }}
      >
        <Container>
          <Typography variant="body1" align="center">
            My sticky footer can be found here.
          </Typography>
          <Copyright />
        </Container>
      </Container>
    </>
  )
}
