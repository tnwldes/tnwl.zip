import { PortfolioContent } from './types';

export const DEFAULT_CONTENT: PortfolioContent = {
  hero: {
    title: "OWN YOUR FLOW",
    subtitle: "다양한 경험을 연결해 결과를 만드는 김수지입니다",
    backgroundImage: "https://picsum.photos/seed/portfolio/1920/1080"
  },
  profilePhoto: "https://picsum.photos/seed/suji/100/100",
  analytics: {
    totalTime: "34h 14m",
    categories: [
      { label: "디자인", percentage: 63, color: "#FF8A3D" },
      { label: "개발", percentage: 18, color: "#F4D97A" },
      { label: "마케팅", percentage: 12, color: "#2F3E63" },
      { label: "운영", percentage: 7, color: "#6F86A6" }
    ]
  },
  schedule: [
    { time: "09:00", task: "디자인 작업", description: "Figma를 활용한 UI 고도화", color: "#FF8A3D" },
    { time: "11:00", task: "미팅", description: "클라이언트 요구사항 분석", color: "#6F86A6" },
    { time: "13:00", task: "개발 작업", description: "React 컴포넌트 구현", color: "#F4D97A" },
    { time: "15:00", task: "마케팅 분석", description: "사용자 데이터 트래킹", color: "#2F3E63" }
  ],
  projects: [
    { 
      title: "상세페이지 제작", 
      description: "고전환율을 위한 구조적 디자인", 
      image: "https://picsum.photos/seed/p1/800/600", 
      images: ["https://picsum.photos/seed/p1/800/600", "https://picsum.photos/seed/p1-2/800/600", "https://picsum.photos/seed/p1-3/800/600"],
      link: "#",
      tags: ["Design", "Marketing"],
      tools: ["Framer", "Figma", "Photoshop"],
      learnings: "사용자 심리학을 기반으로 한 레이아웃 배치가 전환율에 미치는 영향을 깊이 있게 학습했습니다.",
      results: "기존 대비 클릭률(CTR) 15% 향상 및 이탈률 10% 감소"
    },
    { 
      title: "스마트스토어 구축", 
      description: "브랜딩부터 운영까지 올인원", 
      image: "https://picsum.photos/seed/p2/800/600", 
      images: ["https://picsum.photos/seed/p2/800/600", "https://picsum.photos/seed/p2-2/800/600"],
      link: "#",
      tags: ["E-commerce", "Ops"],
      tools: ["SmartStore", "Illustrator", "GA4"],
      learnings: "이커머스 운영의 전 과정을 직접 경험하며 데이터 기반의 상품 소싱과 마케팅의 중요성을 깨달았습니다.",
      results: "오픈 3개월 만에 월 매출 1,000만원 달성"
    },
    { 
      title: "웹사이트 제작", 
      description: "반응형 웹 포트폴리오", 
      image: "https://picsum.photos/seed/p3/800/600", 
      images: ["https://picsum.photos/seed/p3/800/600", "https://picsum.photos/seed/p3-2/800/600", "https://picsum.photos/seed/p3-3/800/600"],
      link: "#",
      tags: ["Dev", "Design"],
      tools: ["React", "Tailwind CSS", "Framer Motion"],
      learnings: "복잡한 애니메이션을 성능 저하 없이 구현하는 방법과 반응형 디자인의 최적화 기법을 익혔습니다.",
      results: "구글 라이트하우스 성능 점수 98점 기록"
    }
  ],
  skills: [
    { label: "디자인", status: "High" },
    { label: "개발", status: "Medium" },
    { label: "마케팅", status: "High" },
    { label: "운영", status: "Low" }
  ],
  growth: {
    sitesCount: 12,
    experienceYears: 3,
    projectsCount: 24
  },
  experience: [
    {
      company: "A 디자인 에이전시",
      role: "UI/UX 디자이너",
      period: "2023.01 - 현재",
      description: "다양한 이커머스 및 브랜드 웹사이트 디자인 총괄"
    },
    {
      company: "B 스타트업",
      role: "프론트엔드 개발자",
      period: "2021.06 - 2022.12",
      description: "React 기반 대시보드 및 서비스 랜딩 페이지 개발"
    }
  ],
  techSkills: [
    { label: "Figma", level: 95, category: "Design" },
    { label: "React", level: 85, category: "Dev" },
    { label: "Tailwind CSS", level: 90, category: "Dev" },
    { label: "Gemini API", level: 80, category: "AI" },
    { label: "Midjourney", level: 85, category: "AI" }
  ],
  about: {
    photo: "https://picsum.photos/seed/suji_profile/400/500",
    quote: "저는 역할보다 문제 해결에 집중합니다.",
    description: "소프트웨어 공학을 전공하여 디자인한 부분을 직접 코딩으로 구현할 수 있는 역량을 갖추고 있습니다. AI 툴을 적극적으로 활용하여 작업 효율을 극대화하고, 데이터 기반의 사고로 결과를 만들어냅니다."
  }
};
