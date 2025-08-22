import Image from 'next/image'
import Link from 'next/link'

interface INavLinkProps {
  href: string
  icon: string
  alt: string
}
export const NavLink = (props: INavLinkProps) => {
  return (
    <Link href={props.href}>
      <Image
        src={props.icon}
        alt={props.alt}
        className="my-1 mx-1 grow-0 w-6"
      />
    </Link>
  )
}
