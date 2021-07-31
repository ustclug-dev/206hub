import Navbar from "react-bootstrap/Navbar"
import site from "../config/site"
import Link from "next/link"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faBug,
  faHome,
  faTags,
  faSearch,
  faFolder,
  faRss,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons"
import Nav from "react-bootstrap/Nav"
import NavDropdown from "react-bootstrap/NavDropdown"
import { useRouter } from "next/router"

export default function Header({ collections }) {
  const router = useRouter()
  const activeKey = router.pathname.startsWith("/tag/")
    ? "/tag"
    : router.pathname

  return (
    <Navbar bg="light" expand="md" className="shadow-sm">
      <Link href="/" passHref>
        <Navbar.Brand>
          <FontAwesomeIcon icon={faBug} fixedWidth size="lg" /> {site.title}
        </Navbar.Brand>
      </Link>
      <Navbar.Toggle />
      <Navbar.Collapse>
        <Nav className="me-auto" activeKey={activeKey}>
          <Nav.Item>
            <Link href="/" passHref>
              <Nav.Link>
                <FontAwesomeIcon icon={faHome} fixedWidth /> 主页
              </Nav.Link>
            </Link>
          </Nav.Item>
          <Nav.Item>
            <Link href="/tag/" passHref>
              <Nav.Link>
                <FontAwesomeIcon icon={faTags} fixedWidth /> 标签
              </Nav.Link>
            </Link>
          </Nav.Item>
          <Nav.Item>
            <Link href="/search/" passHref>
              <Nav.Link>
                <FontAwesomeIcon icon={faSearch} fixedWidth /> 搜索
              </Nav.Link>
            </Link>
          </Nav.Item>
          <NavDropdown
            title={
              <>
                <FontAwesomeIcon icon={faFolder} fixedWidth /> 分类
              </>
            }
            id="navbarDropdown"
          >
            {collections.map((collection) => (
              <Link
                href={`/${collection.slug}/`}
                key={collection.slug}
                passHref
              >
                <NavDropdown.Item>{collection.name}</NavDropdown.Item>
              </Link>
            ))}
          </NavDropdown>
          <Nav.Item>
            <Nav.Link href="/atom.xml">
              <FontAwesomeIcon icon={faRss} fixedWidth /> RSS
            </Nav.Link>
          </Nav.Item>
        </Nav>
        <Nav className="my-2 my-lg-0" activeKey={router.pathname}>
          <Nav.Item>
            <Link href="/about/" passHref>
              <Nav.Link>
                <FontAwesomeIcon icon={faInfoCircle} fixedWidth /> 关于
              </Nav.Link>
            </Link>
          </Nav.Item>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  )
}
