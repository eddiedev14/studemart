import { logoMarkFillClasses, logoMarkStrokeClasses, type LogoMarkTone } from './logoMark.styles'

type LogoMarkProps = {
  bag: LogoMarkTone
  letter: LogoMarkTone
}

export function LogoMark({ bag, letter }: LogoMarkProps) {
  return (
    <>
      <path
        d="M26 56h68l8 54H18z"
        className={logoMarkFillClasses[bag]}
        strokeWidth="6"
        strokeLinejoin="round"
      />
      <path
        d="M42 56V46a18 18 0 0 1 36 0v10"
        className={logoMarkStrokeClasses[bag]}
        strokeWidth="7"
        strokeLinecap="round"
      />
      <path
        d="M60 4 86 14 60 24 34 14Z"
        className={logoMarkFillClasses[bag]}
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path
        d="M72 76C72 69 48 67 48 78c0 11 24 9 24 21 0 12-24 10-25 2"
        className={logoMarkStrokeClasses[letter]}
        strokeWidth="9"
        strokeLinecap="round"
      />
    </>
  )
}
