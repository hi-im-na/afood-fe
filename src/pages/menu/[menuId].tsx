import FoodsInMenu from '@/components/menus/FoodsInMenu'
import { IFood } from '@/models/models'
import { fetchFoodsByMenuId, fetchMenus } from '@/services/publicApi'
import { GetStaticProps } from 'next'
import { ParsedUrlQuery } from 'querystring'

interface MenuInfoProps {
  foodsInMenu: IFood[]
}

interface IParams extends ParsedUrlQuery {
  menuId: string
}

export async function getStaticPaths() {
  // Fetch all the available menu IDs
  const menus = await fetchMenus()

  // Generate the paths based on the menu IDs
  const paths = menus.map((menu) => ({
    params: { menuId: menu.id.toString() },
  }))

  return { paths, fallback: false }
}

export const getStaticProps: GetStaticProps = async (context) => {
  const { menuId } = context.params as IParams
  const foodsInMenu = await fetchFoodsByMenuId(Number(menuId))

  return { props: { foodsInMenu } }
}

export default function MenuInfo({ foodsInMenu }: MenuInfoProps) {
  return (
    <>
      <FoodsInMenu foodsInMenu={foodsInMenu} />
    </>
  )
}
