import Card from "react-bootstrap/Card"
import Head from "next/head"
import site from "../config/site"

export interface SimpleCardProps {
  title: string
  textColor?: string
  color?: string
  children: any
}

export default function SimpleCard(props: SimpleCardProps) {
  const color = props.color ? props.color : "white"
  const textColor = props.textColor ? props.textColor : "white"
  return (
    <Card bg="light" className={`shadow-sm mb-3 border-${color}`}>
      <Card.Header className={`text-${textColor} bg-${color} text-center py-3`}>
        <h1 className="mb-0">{props.title}</h1>
      </Card.Header>
      <Card.Body>{props.children}</Card.Body>
    </Card>
  )
}
