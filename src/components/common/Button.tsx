import type { ButtonHTMLAttributes,ReactNode } from 'react';
type Props=ButtonHTMLAttributes<HTMLButtonElement>&{variant?:'primary'|'secondary'|'forest'|'ivory'|'dark'|'outline';size?:'sm'|'md'|'lg';fullWidth?:boolean;children:ReactNode};
export default function Button({variant='dark',size,fullWidth,children,className='',...props}:Props){void size;const mapped=variant==='primary'?'dark':variant==='secondary'?'forest':variant;return <button className={`btn btn--${mapped} ${fullWidth?'btn--wide':''} ${className}`} {...props}>{children}</button>}
