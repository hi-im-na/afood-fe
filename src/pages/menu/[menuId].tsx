import FoodsInMenu from '@/components/menus/FoodsInMenu'
import { IFood } from '@/models/IFood'
import { IMenu } from '@/models/IMenu'
import { fetchFoodsByMenuId, fetchMenus } from '@/services/publicApi'
import { GetStaticPaths, GetStaticProps } from 'next'
import { useRouter } from 'next/router'
import { ParsedUrlQuery } from 'querystring'
import useSWR from 'swr'

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
  return <FoodsInMenu foodsInMenu={foodsInMenu} />
}
