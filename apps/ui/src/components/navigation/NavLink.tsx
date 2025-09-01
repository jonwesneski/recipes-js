import Link from 'next/link'

interface INavLinkProps {
  href: string
  svgIcon: React.FC<React.SVGProps<SVGSVGElement>>
}
export const NavLink = (props: INavLinkProps) => {
  return (
    <Link href={props.href}>
      <props.svgIcon className="my-1 mx-1 grow-0 w-6 h-6 fill-text" />
    </Link>
  )
}
