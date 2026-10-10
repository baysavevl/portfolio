import type {Locale} from "@/i18n/locale";
import type {
  Post,
  Profile,
  Project,
  Resume,
  RichTextBlock,
  SiteSettings,
  Topic
} from "@/lib/content/types";

type BlockInput = {
  style: RichTextBlock["style"];
  text: string;
};

function createBody(prefix: string, blocks: BlockInput[]): RichTextBlock[] {
  return blocks.map((block, index) => ({
    _key: `${prefix}-block-${index + 1}`,
    _type: "block",
    style: block.style,
    children: [
      {
        _key: `${prefix}-span-${index + 1}`,
        _type: "span",
        text: block.text,
        marks: []
      }
    ],
    markDefs: []
  }));
}

export const demoTopics: Record<Locale, Topic[]> = {
  en: [
    {
      key: "business",
      label: "Business",
      description: "Systems, choices, and durable value creation.",
      accent: "field-blue"
    },
    {
      key: "leadership",
      label: "Leadership",
      description: "Clarity, trust, and the work of enabling others.",
      accent: "quiet-sage"
    },
    {
      key: "startup",
      label: "Startup",
      description: "Learning quickly while building what can endure.",
      accent: "graphite"
    },
    {
      key: "technology",
      label: "Technology",
      description: "Tools and systems considered through human outcomes.",
      accent: "field-blue"
    },
    {
      key: "product",
      label: "Product",
      description: "Making useful things through disciplined decisions.",
      accent: "quiet-sage"
    },
    {
      key: "sport",
      label: "Sport",
      description: "Practice, recovery, and sustainable performance.",
      accent: "graphite"
    },
    {
      key: "mindfulness",
      label: "Mindfulness",
      description: "Attention as a practical building skill.",
      accent: "quiet-sage"
    }
  ],
  vi: [
    {
      key: "business",
      label: "Kinh doanh",
      description: "Hệ thống, lựa chọn và cách tạo giá trị bền vững.",
      accent: "field-blue"
    },
    {
      key: "leadership",
      label: "Lãnh đạo",
      description: "Sự rõ ràng, niềm tin và khả năng giúp người khác phát triển.",
      accent: "quiet-sage"
    },
    {
      key: "startup",
      label: "Khởi nghiệp",
      description: "Học nhanh trong khi xây những điều có thể tồn tại lâu dài.",
      accent: "graphite"
    },
    {
      key: "technology",
      label: "Công nghệ",
      description: "Công cụ và hệ thống được nhìn qua giá trị dành cho con người.",
      accent: "field-blue"
    },
    {
      key: "product",
      label: "Sản phẩm",
      description: "Tạo ra điều hữu ích bằng những quyết định có kỷ luật.",
      accent: "quiet-sage"
    },
    {
      key: "sport",
      label: "Thể thao",
      description: "Luyện tập, hồi phục và hiệu suất bền vững.",
      accent: "graphite"
    },
    {
      key: "mindfulness",
      label: "Chánh niệm",
      description: "Sự chú tâm như một kỹ năng thực tế của người kiến tạo.",
      accent: "quiet-sage"
    }
  ]
};

export const demoProfiles: Record<Locale, Profile> = {
  en: {
    locale: "en",
    name: "Vincent Luu",
    descriptor: "The Mindful Builder",
    positioning: "I build products, teams, and ideas that compound.",
    introduction:
      "Demonstration profile copy: a calm place for practical notes on building, leading, learning, and paying attention.",
    heroInitialMode: "split",
    currentQuestions: [
      "How can a team move with urgency without manufacturing anxiety?",
      "What makes a product decision useful six months later?",
      "How can training and recovery improve the way we lead?"
    ],
    principles: [
      {
        title: "Make the problem legible",
        description:
          "Demonstration principle: shared language should come before accelerated execution."
      },
      {
        title: "Build for compounding",
        description:
          "Demonstration principle: prefer choices that make the next useful choice easier."
      },
      {
        title: "Protect attention",
        description:
          "Demonstration principle: focus and recovery are part of the operating system."
      }
    ]
  },
  vi: {
    locale: "vi",
    name: "Vincent Luu",
    descriptor: "The Mindful Builder",
    positioning:
      "Tôi xây sản phẩm, đội ngũ và những ý tưởng tạo giá trị lâu dài.",
    introduction:
      "Nội dung hồ sơ minh hoạ: một không gian điềm tĩnh cho những ghi chép thực tế về kiến tạo, lãnh đạo, học hỏi và sự chú tâm.",
    heroInitialMode: "split",
    currentQuestions: [
      "Làm sao để đội ngũ tiến nhanh mà không tạo ra lo âu không cần thiết?",
      "Điều gì giúp một quyết định sản phẩm vẫn hữu ích sau sáu tháng?",
      "Luyện tập và hồi phục có thể cải thiện cách chúng ta lãnh đạo ra sao?"
    ],
    principles: [
      {
        title: "Làm rõ vấn đề",
        description:
          "Nguyên tắc minh hoạ: ngôn ngữ chung nên có trước khi tăng tốc thực thi."
      },
      {
        title: "Kiến tạo giá trị tích luỹ",
        description:
          "Nguyên tắc minh hoạ: ưu tiên lựa chọn giúp quyết định hữu ích tiếp theo trở nên dễ dàng hơn."
      },
      {
        title: "Bảo vệ sự chú tâm",
        description:
          "Nguyên tắc minh hoạ: tập trung và hồi phục là một phần của hệ điều hành."
      }
    ]
  }
};

export const demoPosts: Post[] = [
  {
    id: "post-en-clarity-before-velocity",
    locale: "en",
    translationGroup: "clarity-before-velocity",
    slug: "clarity-before-velocity",
    title: "Clarity before velocity",
    summary:
      "A demonstration field note on making the problem legible before increasing delivery speed.",
    topics: ["leadership", "product"],
    publishedAt: "2026-09-18T08:00:00.000Z",
    readingMinutes: 4,
    featured: true,
    isDemo: true,
    body: createBody("en-clarity", [
      {
        style: "normal",
        text: "Demonstration article: this illustrative note explores why a team needs a shared picture of the problem before it needs more speed."
      },
      {
        style: "h2",
        text: "Name the decision"
      },
      {
        style: "normal",
        text: "Write down the choice, the evidence that matters, and what would make the team reconsider. A visible decision is easier to improve than an urgent but implicit one."
      },
      {
        style: "h2",
        text: "Create a calmer cadence"
      },
      {
        style: "blockquote",
        text: "Speed becomes useful when everyone can see what is moving and why."
      }
    ]),
    seo: {
      title: "Clarity before velocity — Demonstration field note",
      description:
        "An illustrative note about leadership, product decisions, and useful speed."
    }
  },
  {
    id: "post-vi-clarity-before-velocity",
    locale: "vi",
    translationGroup: "clarity-before-velocity",
    slug: "ro-rang-truoc-toc-do",
    title: "Rõ ràng trước tốc độ",
    summary:
      "Ghi chép minh hoạ về việc làm rõ vấn đề trước khi tăng tốc độ triển khai.",
    topics: ["leadership", "product"],
    publishedAt: "2026-09-18T08:00:00.000Z",
    readingMinutes: 4,
    featured: true,
    isDemo: true,
    body: createBody("vi-clarity", [
      {
        style: "normal",
        text: "Bài viết minh hoạ: ghi chép này khám phá vì sao một đội ngũ cần cùng nhìn thấy vấn đề trước khi cần thêm tốc độ."
      },
      {
        style: "h2",
        text: "Gọi tên quyết định"
      },
      {
        style: "normal",
        text: "Hãy viết xuống lựa chọn, bằng chứng quan trọng và điều kiện khiến đội ngũ cần xem xét lại. Một quyết định hữu hình dễ cải thiện hơn một sự khẩn trương ngầm định."
      },
      {
        style: "h2",
        text: "Tạo nhịp điệu bình tĩnh hơn"
      },
      {
        style: "blockquote",
        text: "Tốc độ trở nên hữu ích khi mọi người nhìn thấy điều gì đang chuyển động và vì sao."
      }
    ]),
    seo: {
      title: "Rõ ràng trước tốc độ — Ghi chép minh hoạ",
      description:
        "Ghi chép minh hoạ về lãnh đạo, quyết định sản phẩm và tốc độ hữu ích."
    }
  },
  {
    id: "post-en-training-product-system",
    locale: "en",
    translationGroup: "training-is-a-product-system",
    slug: "training-is-a-product-system",
    title: "Training is a product system",
    summary:
      "A demonstration essay about feedback loops shared by sport and product practice.",
    topics: ["sport", "product", "mindfulness"],
    publishedAt: "2026-08-26T08:00:00.000Z",
    readingMinutes: 5,
    featured: false,
    isDemo: true,
    body: createBody("en-training", [
      {
        style: "normal",
        text: "Demonstration article: this illustrative essay treats training as a system of intent, feedback, recovery, and adaptation."
      },
      {
        style: "h2",
        text: "Use a small feedback loop"
      },
      {
        style: "normal",
        text: "A useful loop is short enough to learn from and quiet enough to notice. The same discipline can shape a product experiment or a training session."
      },
      {
        style: "h2",
        text: "Recovery is system capacity"
      },
      {
        style: "normal",
        text: "A plan that ignores recovery eventually loses the ability to learn. Sustainable output depends on protected capacity."
      }
    ]),
    seo: {
      title: "Training is a product system — Demonstration essay",
      description:
        "An illustrative comparison of feedback, recovery, product work, and sport."
    }
  },
  {
    id: "post-vi-training-product-system",
    locale: "vi",
    translationGroup: "training-is-a-product-system",
    slug: "tap-luyen-la-mot-he-thong-san-pham",
    title: "Tập luyện là một hệ thống sản phẩm",
    summary:
      "Bài luận minh hoạ về vòng phản hồi chung giữa thể thao và thực hành sản phẩm.",
    topics: ["sport", "product", "mindfulness"],
    publishedAt: "2026-08-26T08:00:00.000Z",
    readingMinutes: 5,
    featured: false,
    isDemo: true,
    body: createBody("vi-training", [
      {
        style: "normal",
        text: "Bài viết minh hoạ: bài luận này nhìn việc tập luyện như một hệ thống gồm chủ đích, phản hồi, hồi phục và thích nghi."
      },
      {
        style: "h2",
        text: "Dùng một vòng phản hồi nhỏ"
      },
      {
        style: "normal",
        text: "Một vòng phản hồi hữu ích đủ ngắn để học hỏi và đủ yên để quan sát. Kỷ luật ấy có thể định hình cả thử nghiệm sản phẩm lẫn buổi tập."
      },
      {
        style: "h2",
        text: "Hồi phục là năng lực của hệ thống"
      },
      {
        style: "normal",
        text: "Một kế hoạch bỏ qua hồi phục cuối cùng sẽ mất khả năng học hỏi. Đầu ra bền vững phụ thuộc vào năng lực được bảo vệ."
      }
    ]),
    seo: {
      title: "Tập luyện là một hệ thống sản phẩm — Bài luận minh hoạ",
      description:
        "So sánh minh hoạ về phản hồi, hồi phục, công việc sản phẩm và thể thao."
    }
  },
  {
    id: "post-en-quiet-work-building",
    locale: "en",
    translationGroup: "the-quiet-work-of-building",
    slug: "the-quiet-work-of-building",
    title: "The quiet work of building",
    summary:
      "A demonstration reflection on the maintenance and attention behind visible progress.",
    topics: ["startup", "technology", "mindfulness"],
    publishedAt: "2026-07-30T08:00:00.000Z",
    readingMinutes: 4,
    featured: false,
    isDemo: true,
    body: createBody("en-quiet-work", [
      {
        style: "normal",
        text: "Demonstration article: visible launches rest on quiet work such as naming constraints, removing friction, and keeping promises small enough to keep."
      },
      {
        style: "h2",
        text: "Maintenance is part of invention"
      },
      {
        style: "normal",
        text: "A system becomes trustworthy when care continues after the first exciting moment. Maintenance is not the opposite of building; it is building over time."
      },
      {
        style: "h2",
        text: "Notice what compounds"
      },
      {
        style: "normal",
        text: "Small acts of clarity can accumulate into a calmer way of working, especially when a team makes them repeatable."
      }
    ]),
    seo: {
      title: "The quiet work of building — Demonstration reflection",
      description:
        "An illustrative reflection on maintenance, attention, and durable progress."
    }
  },
  {
    id: "post-vi-quiet-work-building",
    locale: "vi",
    translationGroup: "the-quiet-work-of-building",
    slug: "cong-viec-tham-lang-cua-nguoi-kien-tao",
    title: "Công việc thầm lặng của người kiến tạo",
    summary:
      "Suy ngẫm minh hoạ về sự chăm sóc và chú tâm phía sau những tiến triển hữu hình.",
    topics: ["startup", "technology", "mindfulness"],
    publishedAt: "2026-07-30T08:00:00.000Z",
    readingMinutes: 4,
    featured: false,
    isDemo: true,
    body: createBody("vi-quiet-work", [
      {
        style: "normal",
        text: "Bài viết minh hoạ: những lần ra mắt hữu hình được nâng đỡ bởi công việc thầm lặng như gọi tên ràng buộc, giảm ma sát và giữ lời hứa đủ nhỏ để thực hiện."
      },
      {
        style: "h2",
        text: "Bảo trì cũng là sáng tạo"
      },
      {
        style: "normal",
        text: "Một hệ thống trở nên đáng tin khi sự chăm sóc tiếp tục sau khoảnh khắc hào hứng đầu tiên. Bảo trì không đối lập với kiến tạo; đó là kiến tạo theo thời gian."
      },
      {
        style: "h2",
        text: "Nhận ra điều được tích luỹ"
      },
      {
        style: "normal",
        text: "Những hành động nhỏ tạo sự rõ ràng có thể tích luỹ thành một cách làm việc bình tĩnh hơn khi đội ngũ biến chúng thành thói quen."
      }
    ]),
    seo: {
      title: "Công việc thầm lặng của người kiến tạo — Suy ngẫm minh hoạ",
      description:
        "Suy ngẫm minh hoạ về bảo trì, sự chú tâm và tiến triển bền vững."
    }
  },
  {
    id: "post-en-quiet-leadership",
    locale: "en",
    translationGroup: "quiet-leadership",
    slug: "quiet-leadership",
    title: "Quiet leadership",
    summary:
      "A demonstration note about creating conditions for thoughtful work without occupying every conversation.",
    topics: ["leadership", "mindfulness"],
    publishedAt: "2026-06-20T08:00:00.000Z",
    readingMinutes: 3,
    featured: false,
    isDemo: true,
    body: createBody("en-quiet-leadership", [
      {
        style: "normal",
        text: "Demonstration article: this illustrative note asks what leadership looks like when attention is directed toward the room rather than the leader."
      },
      {
        style: "h2",
        text: "Leave useful space"
      },
      {
        style: "normal",
        text: "A clear question and a quiet pause can make room for evidence that would otherwise remain unheard."
      },
      {
        style: "h2",
        text: "Close the loop"
      },
      {
        style: "normal",
        text: "Listening matters most when the next decision shows that the signal was understood."
      }
    ]),
    seo: {
      title: "Quiet leadership — Demonstration note",
      description:
        "An illustrative note about attention, listening, and practical leadership."
    }
  }
];

export const demoProjects: Project[] = [
  {
    id: "project-en-decision-journal",
    locale: "en",
    translationGroup: "decision-journal",
    slug: "decision-journal",
    title: "Decision journal",
    summary:
      "A demonstration case study for making product decisions easier to revisit and learn from.",
    topics: ["product", "leadership", "technology"],
    featured: true,
    isDemo: true,
    context:
      "Demonstration context: a hypothetical product team needs a lightweight memory for consequential choices.",
    role:
      "Demonstration role: facilitate the framing of the decision and the learning cadence.",
    decisions: [
      "Capture the question, evidence, assumptions, and revisit date on one page.",
      "Keep the journal useful during active work instead of turning it into a reporting archive.",
      "Separate what was known at decision time from what became clear later."
    ],
    outcome:
      "Demonstration outcome: the concept shows how a team could discuss choices with more context; it is not a claim about Vincent's professional results.",
    reflection:
      "Demonstration reflection: a decision record earns trust when revisiting it changes future practice, not merely when it is complete.",
    seo: {
      title: "Decision journal — Demonstration case study",
      description:
        "An illustrative product case study about decision quality and organizational memory."
    }
  },
  {
    id: "project-vi-decision-journal",
    locale: "vi",
    translationGroup: "decision-journal",
    slug: "nhat-ky-quyet-dinh",
    title: "Nhật ký quyết định",
    summary:
      "Case study minh hoạ giúp các quyết định sản phẩm dễ được xem lại và học hỏi hơn.",
    topics: ["product", "leadership", "technology"],
    featured: true,
    isDemo: true,
    context:
      "Bối cảnh minh hoạ: một đội ngũ sản phẩm giả định cần một bộ nhớ gọn nhẹ cho những lựa chọn quan trọng.",
    role:
      "Vai trò minh hoạ: hỗ trợ định hình quyết định và nhịp điệu học hỏi.",
    decisions: [
      "Ghi câu hỏi, bằng chứng, giả định và thời điểm xem lại trên một trang.",
      "Giữ nhật ký hữu ích trong lúc làm việc thay vì biến nó thành kho báo cáo.",
      "Tách điều đã biết tại thời điểm quyết định khỏi điều chỉ sáng tỏ về sau."
    ],
    outcome:
      "Kết quả minh hoạ: ý tưởng cho thấy một đội ngũ có thể thảo luận lựa chọn với nhiều ngữ cảnh hơn; đây không phải tuyên bố về kết quả nghề nghiệp của Vincent.",
    reflection:
      "Suy ngẫm minh hoạ: một bản ghi quyết định chỉ tạo niềm tin khi việc xem lại nó thay đổi cách làm trong tương lai.",
    seo: {
      title: "Nhật ký quyết định — Case study minh hoạ",
      description:
        "Case study sản phẩm minh hoạ về chất lượng quyết định và bộ nhớ tổ chức."
    }
  },
  {
    id: "project-en-calm-launch",
    locale: "en",
    translationGroup: "calm-launch",
    slug: "calm-launch",
    title: "Calm launch",
    summary:
      "A demonstration case study for launching with explicit signals, ownership, and recovery space.",
    topics: ["startup", "business", "mindfulness"],
    featured: true,
    isDemo: true,
    context:
      "Demonstration context: a hypothetical launch has uncertainty across customer, operating, and technical signals.",
    role:
      "Demonstration role: shape a shared launch frame and a calm decision rhythm.",
    decisions: [
      "Define which signals change a decision before launch day.",
      "Assign one clear owner to each response path.",
      "Protect a short recovery window after the initial operating period."
    ],
    outcome:
      "Demonstration outcome: the framework illustrates a launch that can respond without constant alarm; it reports no real business result.",
    reflection:
      "Demonstration reflection: calm is not low ambition. It is enough shared context to act without avoidable noise.",
    seo: {
      title: "Calm launch — Demonstration case study",
      description:
        "An illustrative launch framework for startups, business, and mindful operations."
    }
  },
  {
    id: "project-vi-calm-launch",
    locale: "vi",
    translationGroup: "calm-launch",
    slug: "ra-mat-trong-binh-tinh",
    title: "Ra mắt trong bình tĩnh",
    summary:
      "Case study minh hoạ cho một đợt ra mắt có tín hiệu, trách nhiệm và khoảng hồi phục rõ ràng.",
    topics: ["startup", "business", "mindfulness"],
    featured: true,
    isDemo: true,
    context:
      "Bối cảnh minh hoạ: một đợt ra mắt giả định có nhiều bất định ở tín hiệu khách hàng, vận hành và kỹ thuật.",
    role:
      "Vai trò minh hoạ: tạo khung ra mắt chung và nhịp quyết định bình tĩnh.",
    decisions: [
      "Xác định tín hiệu nào sẽ thay đổi quyết định trước ngày ra mắt.",
      "Giao một người chịu trách nhiệm rõ ràng cho từng hướng phản hồi.",
      "Bảo vệ một khoảng hồi phục ngắn sau giai đoạn vận hành ban đầu."
    ],
    outcome:
      "Kết quả minh hoạ: khung này mô tả cách phản hồi mà không liên tục báo động; nó không đại diện cho kết quả kinh doanh thực tế.",
    reflection:
      "Suy ngẫm minh hoạ: bình tĩnh không phải là ít tham vọng. Đó là có đủ ngữ cảnh chung để hành động mà không tạo thêm nhiễu.",
    seo: {
      title: "Ra mắt trong bình tĩnh — Case study minh hoạ",
      description:
        "Khung ra mắt minh hoạ cho khởi nghiệp, kinh doanh và vận hành có chánh niệm."
    }
  }
];

export const demoResumes: Record<Locale, Resume> = {
  en: {
    locale: "en",
    summary:
      "Verified professional history has not yet been supplied. This résumé will be completed only with Vincent-approved facts.",
    experience: [],
    education: [],
    capabilities: [],
    pdfUrl: null,
    pdfLabel: null,
    effectiveDate: null
  },
  vi: {
    locale: "vi",
    summary:
      "Lịch sử nghề nghiệp đã xác minh chưa được cung cấp. Hồ sơ này chỉ được hoàn thiện bằng thông tin do Vincent phê duyệt.",
    experience: [],
    education: [],
    capabilities: [],
    pdfUrl: null,
    pdfLabel: null,
    effectiveDate: null
  }
};

export const demoSettings: Record<Locale, SiteSettings> = {
  en: {
    locale: "en",
    footerNote:
      "Demonstration portfolio content. Personal history and contact details await Vincent's approval.",
    socialLinks: [],
    contactLinks: [],
    seo: {
      title: "Vincent Luu — The Mindful Builder",
      description:
        "Writing and demonstration work on business, leadership, startups, technology, product, sport, and mindfulness."
    }
  },
  vi: {
    locale: "vi",
    footerNote:
      "Nội dung portfolio minh hoạ. Lịch sử cá nhân và thông tin liên hệ đang chờ Vincent phê duyệt.",
    socialLinks: [],
    contactLinks: [],
    seo: {
      title: "Vincent Luu — The Mindful Builder",
      description:
        "Bài viết và dự án minh hoạ về kinh doanh, lãnh đạo, khởi nghiệp, công nghệ, sản phẩm, thể thao và chánh niệm."
    }
  }
};
