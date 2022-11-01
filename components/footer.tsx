import Container from "react-bootstrap/Container"
import site from "../config/site"
import Link from "next/link"

export default function Footer() {
  return (
    <footer className="pt-4 pb-3 border-top bg-light">
      <Container>
        <p>
          Copyright &copy; {new Date().getFullYear()}{" "}
          <Link href="/">
            {site.title}
          </Link>{" "}
          v2 alpha
        </p>
      </Container>
    </footer>
  );
}
