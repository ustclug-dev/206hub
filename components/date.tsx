import { parseISO, format } from "date-fns"
import site from "../config/site" // TODO: timezone

export interface DateProps {
  dateString: string
  formatFunc?: (arg0: string) => string
}

export default function Date(props: DateProps) {
  const func =
    props.formatFunc || ((x) => format(parseISO(x), "yyyy/MM/dd HH:mm"))
  const dateObj = props.dateString
  return <time dateTime={dateObj}>{func(dateObj)}</time>
}
