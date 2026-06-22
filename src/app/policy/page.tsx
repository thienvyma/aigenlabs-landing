import type { Metadata } from "next";
import { ShieldCheck, FileText, Trash2 } from "lucide-react";
import { tokensToCssVariables } from "@/design/tokens";
import { SiteFooter } from "@/components/landing/SiteFooter";
import { SiteNav } from "@/components/landing/SiteNav";
import { getCmsData } from "@/lib/cms";
import { getLocalizedSiteSettings } from "@/lib/i18n";
import { absoluteUrl } from "@/lib/metadata";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const policyUpdatedAt = "2026-06-22";
const contactEmail = "edu@aigenlabs.vn";

export async function generateMetadata(): Promise<Metadata> {
  const data = await getCmsData();
  const settings = getLocalizedSiteSettings(data.settings, data.settings.defaultLocale);
  const canonical = absoluteUrl(settings, "/policy");

  return {
    title: "Policy, Privacy & Data Deletion",
    description:
      "Chính sách quyền riêng tư, điều khoản sử dụng và hướng dẫn xóa dữ liệu cho AigenLabs Agent, bao gồm dữ liệu Meta/Facebook/Instagram khi người dùng kết nối.",
    alternates: { canonical },
    robots: { index: true, follow: true },
    openGraph: {
      type: "website",
      url: canonical,
      siteName: settings.siteName,
      title: "AigenLabs Policy, Privacy & Data Deletion",
      description:
        "Thông tin minh bạch về dữ liệu, quyền người dùng, điều khoản sử dụng và quy trình xóa dữ liệu AigenLabs.",
      images: settings.brand.faviconUrl ? [{ url: absoluteUrl(settings, settings.brand.faviconUrl) }] : []
    },
    twitter: {
      card: "summary",
      title: "AigenLabs Policy, Privacy & Data Deletion",
      description:
        "Chính sách quyền riêng tư, điều khoản sử dụng và hướng dẫn xóa dữ liệu AigenLabs."
    }
  };
}

function ExternalPolicyLinks({ siteUrl }: { siteUrl: string }) {
  const base = siteUrl.replace(/\/$/, "");
  const links = [
    {
      icon: <ShieldCheck size={20} aria-hidden="true" />,
      label: "Privacy Policy URL",
      value: `${base}/policy#privacy`
    },
    {
      icon: <FileText size={20} aria-hidden="true" />,
      label: "Terms URL",
      value: `${base}/policy#terms`
    },
    {
      icon: <Trash2 size={20} aria-hidden="true" />,
      label: "User Data Deletion URL",
      value: `${base}/policy#data-deletion`
    }
  ];

  return (
    <div className="policy-meta-grid" aria-label="Meta app policy URLs">
      {links.map((item) => (
        <a key={item.label} className="policy-meta-card" href={item.value}>
          <span className="policy-meta-icon">{item.icon}</span>
          <span>
            <strong>{item.label}</strong>
            <small>{item.value}</small>
          </span>
        </a>
      ))}
    </div>
  );
}

function PolicySection({
  id,
  kicker,
  title,
  children
}: {
  id: string;
  kicker: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="policy-section section-anchor">
      <p className="policy-kicker">{kicker}</p>
      <h2>{title}</h2>
      {children}
    </section>
  );
}

export default async function PolicyPage() {
  const data = await getCmsData();
  const settings = getLocalizedSiteSettings(data.settings, data.settings.defaultLocale);

  return (
    <div className="site-shell policy-shell" style={tokensToCssVariables(settings.brand.tokens)}>
      <SiteNav settings={settings} currentLocale={settings.defaultLocale} currentPath="/policy" />
      <main className="policy-main">
        <section className="policy-hero">
          <div className="container-feature policy-hero-inner">
            <span className="eyebrow">Trust, privacy & compliance</span>
            <h1>Chính sách quyền riêng tư, điều khoản và xóa dữ liệu</h1>
            <p>
              Trang này áp dụng cho website AigenLabs, AigenLabs Agent, Business OS,
              các connector và các workflow người dùng kích hoạt, bao gồm dữ liệu
              Meta/Facebook/Instagram/Ads khi bạn chủ động kết nối tài khoản.
            </p>
            <div className="policy-hero-meta">
              <span>Cập nhật: 22/06/2026</span>
              <span>Liên hệ: {contactEmail}</span>
            </div>
            <ExternalPolicyLinks siteUrl={settings.siteUrl} />
          </div>
        </section>

        <div className="container-feature policy-layout">
          <aside className="policy-toc" aria-label="Policy table of contents">
            <a href="#summary">Cam kết chính</a>
            <a href="#privacy">Privacy Policy</a>
            <a href="#meta-data">Dữ liệu Meta</a>
            <a href="#terms">Terms of Service</a>
            <a href="#data-deletion">Data Deletion</a>
            <a href="#contact">Liên hệ</a>
          </aside>

          <div className="policy-content">
            <PolicySection id="summary" kicker="Short version" title="Cam kết chính của AigenLabs">
              <div className="policy-callout">
                <p>
                  AigenLabs được thiết kế để giúp doanh nghiệp vận hành AI Agent trong
                  workflow có phạm vi, quyền hạn, log và điểm duyệt rõ ràng. Chúng tôi
                  không bán dữ liệu cá nhân, không dùng dữ liệu connector của khách hàng
                  để huấn luyện mô hình công khai, và không thực hiện hành động nhạy cảm
                  như đăng bài, gửi tin nhắn, thay đổi quảng cáo hoặc tăng ngân sách nếu
                  chưa có phê duyệt phù hợp.
                </p>
              </div>
              <ul className="policy-check-list">
                <li>Chỉ yêu cầu quyền truy cập cần thiết cho tính năng người dùng bật.</li>
                <li>Token và secret được xử lý như dữ liệu nhạy cảm, không hiển thị công khai.</li>
                <li>Quyền đọc được ưu tiên trước; quyền ghi/spend cần approval và policy rõ ràng.</li>
                <li>Người dùng có thể yêu cầu xuất, sửa, ngắt kết nối hoặc xóa dữ liệu.</li>
              </ul>
            </PolicySection>

            <PolicySection id="privacy" kicker="Privacy Policy" title="1. Chính sách quyền riêng tư">
              <h3>1.1 Đơn vị vận hành và phạm vi áp dụng</h3>
              <p>
                AigenLabs vận hành website, landing page, CMS, AigenLabs Agent và các
                connector liên quan. Chính sách này áp dụng khi bạn truy cập website,
                đặt lịch tư vấn, đăng nhập CMS/admin, sử dụng agent, kết nối tài khoản
                bên thứ ba hoặc yêu cầu AigenLabs xử lý workflow cho doanh nghiệp.
              </p>

              <h3>1.2 Dữ liệu chúng tôi có thể xử lý</h3>
              <ul>
                <li>
                  <strong>Dữ liệu liên hệ:</strong> họ tên, email, số điện thoại, công ty,
                  vai trò, nội dung yêu cầu tư vấn/demo.
                </li>
                <li>
                  <strong>Dữ liệu workflow:</strong> mục tiêu kinh doanh, mô tả quy trình,
                  tài liệu hoặc đầu vào bạn cung cấp để AI Agent hỗ trợ.
                </li>
                <li>
                  <strong>Dữ liệu tài khoản và kỹ thuật:</strong> trạng thái đăng nhập,
                  log bảo mật, địa chỉ IP, user agent, lỗi hệ thống, timestamp, audit log.
                </li>
                <li>
                  <strong>Dữ liệu connector:</strong> dữ liệu từ tài khoản bạn chủ động
                  kết nối như workspace, file, calendar, email, CRM, Meta assets hoặc các
                  nguồn bên thứ ba khác, tùy quyền bạn cấp.
                </li>
                <li>
                  <strong>Dữ liệu thanh toán hoặc hợp đồng:</strong> chỉ khi bạn mua dịch vụ
                  hoặc ký thỏa thuận triển khai riêng với AigenLabs.
                </li>
              </ul>

              <h3>1.3 Mục đích sử dụng dữ liệu</h3>
              <p>
                Dữ liệu được dùng để phản hồi yêu cầu, vận hành demo, thiết lập agent,
                quản lý quyền truy cập, tạo báo cáo/đề xuất, cải thiện độ tin cậy sản phẩm,
                bảo vệ hệ thống, tuân thủ nghĩa vụ pháp lý và thực hiện hợp đồng/dịch vụ đã
                thỏa thuận với khách hàng.
              </p>

              <h3>1.4 AI, automation và dữ liệu huấn luyện</h3>
              <p>
                AigenLabs có thể dùng mô hình AI hoặc nhà cung cấp hạ tầng AI để xử lý yêu
                cầu của bạn. Dữ liệu connector, tài liệu nội bộ, nội dung quảng cáo, dữ liệu
                khách hàng hoặc output doanh nghiệp của bạn không được dùng để huấn luyện
                mô hình công khai hoặc chia sẻ cho bên thứ ba vì mục đích quảng cáo, trừ khi
                có thỏa thuận rõ ràng bằng văn bản.
              </p>

              <h3>1.5 Chia sẻ dữ liệu</h3>
              <p>
                Chúng tôi chỉ chia sẻ dữ liệu với nhà cung cấp dịch vụ cần thiết để vận hành
                hệ thống như hosting, database, storage, analytics, email, bảo mật, AI
                infrastructure hoặc công cụ hỗ trợ khách hàng. Các bên này chỉ được xử lý dữ
                liệu theo mục đích cung cấp dịch vụ cho AigenLabs hoặc theo yêu cầu pháp luật.
              </p>

              <h3>1.6 Lưu giữ và bảo mật</h3>
              <p>
                Dữ liệu được lưu trong thời gian cần thiết cho mục đích đã nêu, cho đến khi
                bạn yêu cầu xóa, hoặc khi chúng tôi còn nghĩa vụ pháp lý, kế toán, bảo mật
                hay giải quyết tranh chấp. Chúng tôi áp dụng kiểm soát truy cập, mã hóa phù
                hợp, logging, phân quyền theo phạm vi và quy trình phê duyệt cho hành động
                nhạy cảm.
              </p>

              <h3>1.7 Quyền của bạn</h3>
              <p>
                Bạn có thể yêu cầu truy cập, sửa, xuất, hạn chế xử lý, ngắt kết nối hoặc xóa
                dữ liệu bằng cách gửi email đến {contactEmail}. Chúng tôi có thể cần xác minh
                danh tính hoặc quyền đại diện công ty trước khi xử lý yêu cầu.
              </p>
            </PolicySection>

            <PolicySection id="meta-data" kicker="Meta Platform Data" title="2. Dữ liệu Meta/Facebook/Instagram">
              <p>
                Khi bạn kết nối tài khoản Meta, Facebook, Instagram, Page hoặc Ads account,
                AigenLabs chỉ truy cập dữ liệu trong phạm vi quyền bạn cấp qua OAuth và trong
                phạm vi tính năng bạn yêu cầu. AigenLabs không yêu cầu mật khẩu Facebook,
                mã 2FA, App Secret cá nhân hoặc tài liệu xác minh danh tính của bạn qua
                landing page.
              </p>
              <div className="policy-grid-two">
                <div>
                  <h3>Dữ liệu có thể được đọc</h3>
                  <ul>
                    <li>Danh sách ad account, campaign, ad set, ad, creative và insight.</li>
                    <li>Metric quảng cáo như spend, impression, click, CTR, CPC, CPM, conversion.</li>
                    <li>Danh sách Page/Instagram business asset và metadata liên quan.</li>
                    <li>Engagement hoặc metadata Page khi bạn cấp quyền tương ứng.</li>
                  </ul>
                </div>
                <div>
                  <h3>Cách dữ liệu được dùng</h3>
                  <ul>
                    <li>Tạo audit, báo cáo, cảnh báo pacing/fatigue và đề xuất tối ưu.</li>
                    <li>Hiển thị asset đã kết nối và xác nhận trạng thái connector.</li>
                    <li>Chuẩn bị kế hoạch thay đổi có approval trước khi thực thi.</li>
                    <li>Ghi log để người dùng kiểm tra lại phạm vi và hành động.</li>
                  </ul>
                </div>
              </div>
              <p>
                Các quyền ghi như quản lý quảng cáo, bài viết, message hoặc ngân sách chỉ
                được dùng nếu bạn cấp quyền hợp lệ, yêu cầu tính năng đó và hành động đã qua
                approval theo cấu hình workspace/company. AigenLabs không tự mở rộng phạm vi
                từ đọc sang ghi nếu chưa có yêu cầu và phê duyệt rõ ràng.
              </p>
            </PolicySection>

            <PolicySection id="terms" kicker="Terms of Service" title="3. Điều khoản sử dụng">
              <h3>3.1 Sử dụng hợp lệ</h3>
              <p>
                Bạn chỉ được dùng AigenLabs cho tài khoản, dữ liệu và workflow mà bạn có quyền
                truy cập hợp pháp. Bạn chịu trách nhiệm về nội dung, dữ liệu đầu vào, quyền
                truy cập của nhân sự, phê duyệt hành động và việc tuân thủ chính sách của các
                nền tảng bên thứ ba như Meta, Google, Slack, Telegram hoặc nhà cung cấp khác.
              </p>

              <h3>3.2 Kết quả AI và quyết định kinh doanh</h3>
              <p>
                Output của AI Agent là hỗ trợ vận hành và phân tích, không thay thế tư vấn
                pháp lý, tài chính, thuế, y tế hoặc quyết định điều hành cuối cùng. Với hành
                động có tác động bên ngoài như gửi khách hàng, xuất bản nội dung, chỉnh ngân
                sách, thay đổi quảng cáo hoặc xử lý dữ liệu nhạy cảm, bạn cần kiểm tra và
                phê duyệt trước khi thực thi.
              </p>

              <h3>3.3 Tài khoản, bảo mật và connector</h3>
              <p>
                Bạn phải giữ an toàn thông tin đăng nhập và chỉ cấp quyền connector phù hợp.
                Không gửi mật khẩu, token, App Secret, thông tin thanh toán hoặc giấy tờ định
                danh qua kênh không được yêu cầu. Nếu phát hiện truy cập trái phép, hãy liên
                hệ AigenLabs ngay để khóa connector hoặc thu hồi token.
              </p>

              <h3>3.4 Giới hạn trách nhiệm</h3>
              <p>
                Trong phạm vi pháp luật cho phép, AigenLabs không chịu trách nhiệm cho thiệt
                hại gián tiếp, mất lợi nhuận, mất dữ liệu hoặc quyết định kinh doanh phát sinh
                từ việc sử dụng output AI mà chưa được kiểm tra/phê duyệt. Các điều khoản
                thương mại cụ thể có thể được quy định trong hợp đồng riêng.
              </p>
            </PolicySection>

            <PolicySection id="data-deletion" kicker="User Data Deletion" title="4. Hướng dẫn xóa dữ liệu">
              <div className="policy-callout policy-delete-callout">
                <p>
                  Để yêu cầu xóa dữ liệu, gửi email tới <a href={`mailto:${contactEmail}`}>{contactEmail}</a> với
                  tiêu đề <strong>“Yêu cầu xóa dữ liệu AigenLabs”</strong>. Nếu yêu cầu liên quan đến
                  Meta/Facebook/Instagram, hãy ghi rõ email đăng nhập AigenLabs, công ty/workspace,
                  Meta Business hoặc ad account/Page liên quan nếu bạn biết.
                </p>
              </div>

              <h3>4.1 Quy trình xử lý yêu cầu</h3>
              <ol>
                <li>Chúng tôi xác minh danh tính hoặc quyền đại diện hợp lệ của người yêu cầu.</li>
                <li>Chúng tôi ngắt kết nối connector liên quan và thu hồi/xóa token khi có thể.</li>
                <li>Chúng tôi xóa hoặc ẩn dữ liệu cá nhân, metadata liên kết, nội dung workflow và log không còn cần thiết.</li>
                <li>Chúng tôi phản hồi trạng thái xử lý qua email, thông thường trong vòng 30 ngày.</li>
              </ol>

              <h3>4.2 Tự thu hồi quyền Meta</h3>
              <p>
                Bạn cũng có thể vào Facebook/Meta settings, mục Apps and Websites hoặc Business
                Integrations, chọn AigenLabs và Remove/Disconnect để thu hồi quyền truy cập.
                Sau khi thu hồi quyền, hãy gửi email xóa dữ liệu để chúng tôi xử lý phần dữ
                liệu đã lưu trong hệ thống AigenLabs.
              </p>

              <h3>4.3 Dữ liệu có thể được giữ lại giới hạn</h3>
              <p>
                Một số dữ liệu có thể được giữ lại tạm thời nếu cần cho nghĩa vụ pháp lý, hóa
                đơn, chống gian lận, bảo mật, điều tra sự cố hoặc bản sao lưu hệ thống. Dữ liệu
                tổng hợp hoặc đã ẩn danh không còn nhận diện bạn hoặc doanh nghiệp của bạn có
                thể được giữ để cải thiện độ tin cậy sản phẩm.
              </p>
            </PolicySection>

            <PolicySection id="contact" kicker="Contact" title="5. Liên hệ và cập nhật">
              <p>
                Mọi câu hỏi về privacy, terms, Meta app review, connector permissions, data
                deletion hoặc bảo mật vui lòng gửi về <a href={`mailto:${contactEmail}`}>{contactEmail}</a>.
                Khi chính sách thay đổi đáng kể, chúng tôi sẽ cập nhật ngày hiệu lực trên trang
                này và có thể thông báo qua email hoặc kênh phù hợp với khách hàng đang sử dụng.
              </p>
              <p className="policy-updated">Policy version: {policyUpdatedAt}</p>
            </PolicySection>
          </div>
        </div>
      </main>
      <SiteFooter settings={settings} />
    </div>
  );
}
