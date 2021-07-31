import { GetStaticProps } from "next"
import { getAppProps } from "../libs/data"
import SimpleCard from "../components/simpleCard"

export const getStaticProps: GetStaticProps = async (context) => {
  return {
    props: {
      ...getAppProps(),
    },
  }
}

export default function AboutPage() {
  return (
    <SimpleCard title="关于" color="success">
      206hub（或者有另一个不正式的名字，「评番社区」），是 @taoky 和 @iBug
      等对使用静态网站生成器来构造列表与评论服务的尝试.
    </SimpleCard>
  )
}
