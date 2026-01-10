import Image from "next/image";
import { ShaderAnimation } from "@/components/ui/ShaderAnimation";
import { RegistrationForm } from "@/components/ui/RegistrationForm";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <Image src="/logo.png" alt="aimay" width={32} height={32} />
              <span className="text-xl font-bold text-white">Plant Care</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-white/80 hover:text-green-400 transition-colors font-medium">기능</a>
              <a href="#how-it-works" className="text-white/80 hover:text-green-400 transition-colors font-medium">사용방법</a>
              <a href="#testimonials" className="text-white/80 hover:text-green-400 transition-colors font-medium">후기</a>
              <a href="#pricing" className="text-white/80 hover:text-green-400 transition-colors font-medium">가격</a>
            </div>
            <div className="flex items-center gap-4">
              <a href="#" className="hidden sm:block text-white/80 hover:text-green-400 transition-colors font-medium">로그인</a>
              <a href="#cta" className="bg-green-500 hover:bg-green-600 text-white px-5 py-2.5 rounded-lg font-semibold transition-colors shadow-md hover:shadow-lg">
                무료 시작
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section with Shader Animation */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <ShaderAnimation />
        <div className="absolute inset-0 bg-black/30 z-[1]"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md text-white px-4 py-2 rounded-full text-sm font-medium mb-6 border border-white/20">
              <span className="material-icons-outlined" style={{ fontSize: 18 }}>verified</span>
              10,000+ 사용자가 선택한 앱
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white leading-tight mb-6 tracking-tight">
              당신의 식물을<br />
              <span className="text-green-400">스마트하게</span> 관리하세요
            </h1>
            <p className="text-lg sm:text-xl text-white/80 mb-10 max-w-2xl mx-auto">
              물 주기, 햇빛, 비료 일정을 자동으로 관리하고 알림을 받으세요.
              초보자도 쉽게 건강한 식물을 키울 수 있습니다.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <a href="#cta" className="inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5">
                <span className="material-icons-outlined">download</span>
                무료로 시작하기
              </a>
              <a href="#how-it-works" className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all border border-white/30 hover:border-white/50">
                <span className="material-icons-outlined">play_circle</span>
                사용방법 보기
              </a>
            </div>
            <div className="flex items-center justify-center gap-6">
              <div className="flex -space-x-3">
                <Image src="https://randomuser.me/api/portraits/women/1.jpg" width={40} height={40} className="rounded-full border-2 border-white/50" alt="User" />
                <Image src="https://randomuser.me/api/portraits/men/2.jpg" width={40} height={40} className="rounded-full border-2 border-white/50" alt="User" />
                <Image src="https://randomuser.me/api/portraits/women/3.jpg" width={40} height={40} className="rounded-full border-2 border-white/50" alt="User" />
                <Image src="https://randomuser.me/api/portraits/men/4.jpg" width={40} height={40} className="rounded-full border-2 border-white/50" alt="User" />
              </div>
              <div className="text-left">
                <div className="flex items-center gap-1 text-yellow-400">
                  {[...Array(4)].map((_, i) => (
                    <span key={i} className="material-icons-outlined" style={{ fontSize: 20 }}>star</span>
                  ))}
                  <span className="material-icons-outlined" style={{ fontSize: 20 }}>star_half</span>
                </div>
                <p className="text-sm text-white/70">4.8/5 평점 (2,000+ 리뷰)</p>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
          <span className="material-icons-outlined text-white/70" style={{ fontSize: 32 }}>keyboard_arrow_down</span>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-stone-900 mb-4">강력한 기능들</h2>
            <p className="text-lg text-stone-600 max-w-2xl mx-auto">
              식물 관리에 필요한 모든 것을 한 곳에서. 스마트한 알림과 직관적인 인터페이스로 쉽게 관리하세요.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: "water_drop", title: "스마트 물 주기 알림", desc: "각 식물의 특성에 맞춰 최적의 물 주기를 계산하고, 알림으로 정확한 타이밍에 물을 줄 수 있도록 도와드립니다.", color: "blue" },
              { icon: "light_mode", title: "햇빛 관리 가이드", desc: "식물별 필요한 햇빛 양을 알려주고, 계절과 위치에 따른 최적의 배치 장소를 추천해 드립니다.", color: "yellow" },
              { icon: "science", title: "비료 일정 관리", desc: "성장 시기와 식물 종류에 맞는 비료 투여 일정을 자동으로 계획하고 관리해 드립니다.", color: "green" },
              { icon: "photo_camera", title: "식물 인식 AI", desc: "사진만 찍으면 AI가 식물 종류를 자동으로 인식하고 최적의 관리 방법을 알려드립니다.", color: "purple" },
              { icon: "healing", title: "건강 상태 진단", desc: "잎의 상태를 분석하여 병충해나 영양 결핍 등의 문제를 조기에 발견하고 해결책을 제시합니다.", color: "red" },
              { icon: "groups", title: "커뮤니티", desc: "식물 애호가들과 경험을 공유하고, 전문가의 조언을 받을 수 있는 활발한 커뮤니티를 운영합니다.", color: "teal" },
            ].map((feature, idx) => (
              <div key={idx} className={`bg-gradient-to-br from-${feature.color}-50 to-${feature.color}-100 rounded-2xl p-8 hover:shadow-lg transition-shadow`}>
                <div className={`w-14 h-14 bg-${feature.color}-500 rounded-xl flex items-center justify-center mb-6`}>
                  <span className="material-icons-outlined text-white" style={{ fontSize: 28 }}>{feature.icon}</span>
                </div>
                <h3 className="text-xl font-bold text-stone-900 mb-3">{feature.title}</h3>
                <p className="text-stone-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 lg:py-28 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-stone-900 mb-4">간단한 3단계로 시작하세요</h2>
            <p className="text-lg text-stone-600 max-w-2xl mx-auto">
              복잡한 설정 없이 바로 시작할 수 있습니다.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {[
              { step: 1, title: "앱 다운로드", desc: "iOS, Android 어디서나 무료로 앱을 다운로드하고 간편하게 가입하세요." },
              { step: 2, title: "식물 등록", desc: "사진을 찍거나 목록에서 선택하여 키우는 식물을 등록하세요. AI가 자동으로 인식합니다." },
              { step: 3, title: "알림 받기", desc: "물 주기, 비료, 분갈이 등 모든 케어 일정을 자동으로 알림 받으세요." },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="relative w-20 h-20 mx-auto mb-6">
                  <div className="absolute inset-0 bg-green-200 rounded-full"></div>
                  <div className="absolute inset-2 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-2xl font-bold">{item.step}</span>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-stone-900 mb-3">{item.title}</h3>
                <p className="text-stone-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 lg:py-28 bg-gradient-to-br from-green-50 to-teal-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-stone-900 mb-4">사용자 후기</h2>
            <p className="text-lg text-stone-600 max-w-2xl mx-auto">
              Plant Care와 함께 건강한 식물을 키우고 있는 분들의 이야기
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: "김지현", plants: 5, text: "식물 초보였는데 이 앱 덕분에 몬스테라를 1년 넘게 건강하게 키우고 있어요. 물 주기 알림이 정말 유용해요!", img: "women/32" },
              { name: "박성민", plants: 12, text: "AI 식물 진단 기능이 정말 놀라워요. 잎이 이상해져서 찍어봤더니 바로 문제점과 해결책을 알려줬어요.", img: "men/45" },
              { name: "이수진", plants: 8, text: "출장이 잦은 편인데, 가족에게 케어 일정을 공유할 수 있어서 식물이 시들 걱정이 없어요.", img: "women/68" },
            ].map((review, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-8 shadow-lg">
                <div className="flex items-center gap-1 text-yellow-500 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="material-icons-outlined" style={{ fontSize: 20 }}>star</span>
                  ))}
                </div>
                <p className="text-stone-600 mb-6">&ldquo;{review.text}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <Image src={`https://randomuser.me/api/portraits/${review.img}.jpg`} width={48} height={48} className="rounded-full" alt={review.name} />
                  <div>
                    <p className="font-semibold text-stone-900">{review.name}</p>
                    <p className="text-sm text-stone-500">식물 {review.plants}개 관리 중</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-stone-900 mb-4">심플한 가격</h2>
            <p className="text-lg text-stone-600 max-w-2xl mx-auto">
              기본 기능은 무료! 더 많은 기능이 필요하다면 프로로 업그레이드하세요.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Plan */}
            <div className="bg-white rounded-2xl p-8 border-2 border-stone-200 hover:border-stone-300 transition-colors">
              <h3 className="text-xl font-bold text-stone-900 mb-2">무료</h3>
              <p className="text-stone-600 mb-6">개인 사용자에게 적합</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-stone-900">₩0</span>
                <span className="text-stone-600">/월</span>
              </div>
              <ul className="space-y-3 mb-8">
                {["최대 5개 식물 등록", "물 주기 알림", "기본 케어 가이드"].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <span className="material-icons-outlined text-green-500" style={{ fontSize: 20 }}>check</span>
                    <span className="text-stone-700">{item}</span>
                  </li>
                ))}
                {["AI 식물 진단", "가족 공유"].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <span className="material-icons-outlined text-stone-300" style={{ fontSize: 20 }}>close</span>
                    <span className="text-stone-400">{item}</span>
                  </li>
                ))}
              </ul>
              <a href="#" className="block w-full text-center bg-stone-100 hover:bg-stone-200 text-stone-700 px-6 py-3 rounded-lg font-semibold transition-colors">
                무료로 시작
              </a>
            </div>

            {/* Pro Plan */}
            <div className="bg-gradient-to-br from-green-500 to-teal-500 rounded-2xl p-8 text-white relative overflow-hidden">
              <div className="absolute top-4 right-4 bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full">인기</div>
              <h3 className="text-xl font-bold mb-2">프로</h3>
              <p className="text-green-100 mb-6">진지한 식물 애호가를 위한</p>
              <div className="mb-6">
                <span className="text-4xl font-bold">₩4,900</span>
                <span className="text-green-100">/월</span>
              </div>
              <ul className="space-y-3 mb-8">
                {["무제한 식물 등록", "모든 알림 기능", "상세 케어 가이드", "AI 식물 진단 무제한", "가족 5명까지 공유"].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <span className="material-icons-outlined" style={{ fontSize: 20 }}>check</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <a href="#" className="block w-full text-center bg-white hover:bg-green-50 text-green-600 px-6 py-3 rounded-lg font-semibold transition-colors">
                프로 시작하기
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section with Registration Form */}
      <section id="cta" className="py-20 lg:py-28 bg-stone-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="material-icons-outlined text-green-400 mb-6" style={{ fontSize: 64 }}>local_florist</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              오늘부터 식물과 더 가까워지세요
            </h2>
            <p className="text-lg text-stone-400 max-w-2xl mx-auto">
              사전 등록하고 출시 알림을 받으세요. 얼리버드 혜택도 함께 드립니다!
            </p>
          </div>

          <div className="max-w-xl mx-auto">
            <RegistrationForm />

            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
              <a href="#" className="inline-flex items-center justify-center gap-3 bg-black hover:bg-stone-800 text-white px-8 py-4 rounded-xl font-semibold transition-colors border border-stone-700">
                <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                App Store
              </a>
              <a href="#" className="inline-flex items-center justify-center gap-3 bg-black hover:bg-stone-800 text-white px-8 py-4 rounded-xl font-semibold transition-colors border border-stone-700">
                <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
                </svg>
                Google Play
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-stone-900 border-t border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <Image src="/logo.png" alt="aimay" width={28} height={28} />
                <span className="text-xl font-bold text-white">Plant Care</span>
              </div>
              <p className="text-stone-400 text-sm">
                당신의 식물을 스마트하게 관리하는 가장 쉬운 방법
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">제품</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-stone-400 hover:text-green-400 transition-colors text-sm">기능</a></li>
                <li><a href="#" className="text-stone-400 hover:text-green-400 transition-colors text-sm">가격</a></li>
                <li><a href="#" className="text-stone-400 hover:text-green-400 transition-colors text-sm">다운로드</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">회사</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-stone-400 hover:text-green-400 transition-colors text-sm">소개</a></li>
                <li><a href="#" className="text-stone-400 hover:text-green-400 transition-colors text-sm">블로그</a></li>
                <li><a href="#" className="text-stone-400 hover:text-green-400 transition-colors text-sm">채용</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">지원</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-stone-400 hover:text-green-400 transition-colors text-sm">도움말</a></li>
                <li><a href="#" className="text-stone-400 hover:text-green-400 transition-colors text-sm">문의하기</a></li>
                <li><a href="#" className="text-stone-400 hover:text-green-400 transition-colors text-sm">개인정보처리방침</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-stone-800 mt-10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-stone-500 text-sm">© 2025 aimay. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <a href="#" className="text-stone-400 hover:text-green-400 transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
              </a>
              <a href="#" className="text-stone-400 hover:text-green-400 transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
              <a href="#" className="text-stone-400 hover:text-green-400 transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
