export type ProjectCategory =
  | "Workforce Management SaaS"
  | "AI Product / E-commerce"
  | "WordPress / Public Sector"
  | "Shopify / E-commerce"
  | "Automation / AI";

export type WorkCategory =
  | "Software"
  | "Websites"
  | "E-commerce"
  | "Mobile & IoT"
  | "Automation";

export type ProjectSection = {
  label: string;
  title: string;
  paragraphs?: string[];
  bullets?: string[];
};

export type ProjectImage = {
  src: string;
  alt: string;
  caption: string;
};

export type AwsArchitecture = {
  services: string[];
  summary: string;
  flow?: string[];
  considerations: string[];
};

export type Project = {
  id: string;
  name: string;
  slug: string;
  category: ProjectCategory;
  headline: string;
  shortDescription: string;
  myRole: string;
  leadership?: string;
  technologies: string[];
  cardTechnologies: string[];
  sections: ProjectSection[];
  screenshots: ProjectImage[];
  thumbnail: string;
  thumbnailAlt: string;
  liveUrl: string;
  liveLabel: string;
  caseStudyUrl: string;
  featured: boolean;
  clientType: string;
  projectType: string;
  kind: "screenshots" | "workflow";
  seoTitle: string;
  seoDescription: string;
  workCategories: WorkCategory[];
  status?: string;
  awsArchitecture?: AwsArchitecture;
};

export type SupportingWorkItem = {
  id: string;
  name: string;
  headline: string;
  type: string;
  categories: WorkCategory[];
  description: string;
  technologies: string[];
  liveUrl?: string;
  liveLabel?: string;
  status?: string;
  image?: string;
  featured: false;
  hasCaseStudy: false;
  awsArchitecture?: AwsArchitecture;
};

// This is the only file you need to edit for personal details, links, services, stack, and projects.
export const portfolio = {
  person: {
    name: "Shkelqim Hajrizi",
    title: "Senior Full-Stack & AI Engineer",
    tagline: "Senior technical partner for agencies: AI, automation, custom software and the hard problems in between.",
    location: "Europe",
    availability: "Taking on agency work · overlaps US hours",
    email: "shajrizi2@gmail.com",
    calendly: "https://calendly.com/shajrizi2/30min",
    phone: { href: "tel:+38349493327", display: "+383 49 493 327" },
    linkedin: "https://www.linkedin.com/in/shkelqim-hajrizi-794438131/",
    github: "https://github.com/shajrizi2",
    domain: "YOUR_DOMAIN",
    cvPath: "", // TODO: Set to "/cv.pdf" after adding public/cv.pdf.
    profileImage: "", // TODO: Set to "/profile.jpg" after adding a real photo.
  },
  navigation: [
    { label: "Work", href: "#work" },
    { label: "Capabilities", href: "#services" },
    { label: "For agencies", href: "#agency" },
    { label: "About", href: "#about" },
    { label: "Contact", href: "#contact" },
  ],
  values: [
    { number: "01", title: "AI & automation", text: "LLM integrations, AI workflows and connected systems." },
    { number: "02", title: "Custom software", text: "SaaS products, dashboards, internal tools and APIs." },
    { number: "03", title: "Integrations", text: "CRMs, payments, third-party APIs and data sync." },
    { number: "04", title: "Websites & stores", text: "WordPress, WooCommerce and Shopify delivery." },
  ],
  capabilities: [
    { icon: "ai", number: "01", title: "Deliver the AI work you've sold.", text: "OpenAI and Claude integrations, AI assistants and agents, document processing and AI features added to existing products.", tags: [] },
    { icon: "workflow", number: "02", title: "Automate the busywork.", text: "n8n and custom workflows, CRM and operations automation, webhooks, reporting and data synchronization, for your clients or your own agency.", tags: [] },
    { icon: "window", number: "03", title: "Build the custom product.", text: "React, Next.js and NestJS applications: SaaS products, client portals, dashboards, admin systems and internal tools.", tags: [] },
    { icon: "server", number: "04", title: "Connect the systems behind it.", text: "Node.js, Python and PHP backends, databases, authentication, payments, real-time features and third-party APIs.", tags: [] },
    { icon: "layout", number: "05", title: "Keep client sites and stores moving.", text: "Custom WordPress, WooCommerce and Shopify builds, plugins, integrations, migrations and ongoing maintenance.", tags: [] },
    { icon: "wrench", number: "06", title: "Take on the hard problems.", text: "Inherited codebases, legacy modernization, undocumented systems, production issues and anything that doesn't fit neatly into one box.", tags: [] },
  ],
  stack: [
    { name: "AI", items: ["OpenAI API", "Claude API", "LLM integrations", "Replicate", "AI agents & workflows"] },
    { name: "Automation", items: ["n8n", "Webhooks", "CRM & API automation"] },
    { name: "Frontend", items: ["React", "Next.js", "TypeScript", "Tailwind", "Angular"] },
    { name: "Backend", items: ["Node.js", "NestJS", "Express", "Python", "PHP", "REST", "GraphQL", "WebSockets"] },
    { name: "Data", items: ["PostgreSQL", "Prisma", "MySQL / MariaDB", "MongoDB", "Firebase", "Hasura"] },
    { name: "Websites & e-commerce", items: ["WordPress", "Gutenberg", "WooCommerce", "Shopify", "Stripe", "Elementor", "Divi"] },
    { name: "Real-time, desktop & mobile", items: ["Electron", "React Native", "Expo", "MQTT", "WebRTC", "LiveKit", "SIP"] },
    { name: "Production", items: ["Docker", "Linux", "Git", "Auth0 / OAuth2 / JWT"] },
    { name: "AWS", items: ["Lambda", "EKS", "S3", "SQS", "SNS", "DynamoDB"] },
  ],
  process: [
    { number: "01", title: "Understand", text: "Learn the product, client requirements, codebase and priorities." },
    { number: "02", title: "Build", text: "Take ownership of the work and implement a clear, maintainable solution." },
    { number: "03", title: "Ship", text: "Test, review and deliver work that is ready for production." },
    { number: "04", title: "Support", text: "Maintain, troubleshoot and improve the system after delivery." },
  ],
  engagements: [
    { number: "01", title: "Monthly capacity", text: "A set number of senior hours each month, part-time or full-time, across whatever your client projects need." },
    { number: "02", title: "White-label partner", text: "I work under your brand, in your tools and process. Your clients see your agency, not a subcontractor." },
    { number: "03", title: "Defined project", text: "Take ownership of one build, integration, AI feature or automation from scope to production." },
    { number: "04", title: "Paid trial task", text: "Start with one small, real task so you can judge the work before committing to anything larger." },
  ],
} as const;

export const projects: Project[] = [
  {
    id: "hyrjedalje",
    name: "HyrjeDalje",
    slug: "hyrjedalje",
    category: "Workforce Management SaaS",
    headline: "Multi-Tenant Workforce & Attendance Platform",
    shortDescription: "Architected and led a Next.js/NestJS workforce platform on EKS, combining PostgreSQL and Prisma with queued attendance processing, report exports and operational alerts.",
    myRole: "System Architect & Tech Lead",
    leadership: "Led a development team of three engineers.",
    technologies: ["Next.js", "React", "TypeScript", "shadcn/ui", "NestJS", "Node.js", "Prisma", "PostgreSQL", "Pino", "Claude", "APIs / integrations", "AWS EKS", "AWS Lambda", "Amazon S3", "Amazon SQS", "Amazon SNS", "Amazon DynamoDB"],
    cardTechnologies: ["Next.js", "NestJS", "PostgreSQL", "Prisma", "AWS EKS"],
    awsArchitecture: {
      services: ["EKS", "SQS", "S3", "Lambda", "SNS", "DynamoDB"],
      summary: "The NestJS API runs on EKS, with SQS for attendance-event processing and Lambda for scheduled report exports.",
      flow: ["Attendance device", "NestJS API on EKS", "SQS", "Worker", "PostgreSQL"],
      considerations: [
        "PostgreSQL remains the source of truth for shifts, attendance, leave and payroll, accessed through Prisma. DynamoDB stores device cursors and event-deduplication state.",
        "S3 stores generated reports, Lambda handles scheduled exports and SNS distributes operational alerts.",
      ],
    },
    sections: [
      {
        label: "01 / OVERVIEW",
        title: "Platform overview",
        paragraphs: [
          "HyrjeDalje is a multi-tenant workforce and attendance platform used by multiple organizations. It began around attendance and access-related requirements for elevators and buildings, then expanded into a broader workforce-management system for companies.",
          "The platform brings employee records, physical attendance devices, schedules, leave, corrections, reporting and payroll-related calculations into one connected product.",
        ],
      },
      {
        label: "02 / CHALLENGE",
        title: "Supporting growth across tenants and devices",
        paragraphs: [
          "The system needed to support multiple organizations, different workforce workflows and integrations with physical attendance devices while continuing to grow beyond its original attendance use case.",
          "That required an architecture that could keep tenant concerns, business modules and external device integrations organized as the product expanded.",
        ],
      },
      {
        label: "03 / MY ROLE",
        title: "Architecture and technical leadership",
        paragraphs: [
          "As System Architect & Tech Lead, I selected the technology stack, designed the overall architecture, made core technical decisions and led implementation across frontend, backend and integration concerns.",
          "I led a development team of three engineers and maintained technical oversight across the platform.",
        ],
      },
      {
        label: "04 / CAPABILITIES",
        title: "Platform capabilities",
        bullets: [
          "Multiple organizations and client workspaces",
          "Employee and attendance-device management",
          "Attendance records and correction workflows",
          "Work shifts, schedules, leave and vacation",
          "Reports and attendance analytics",
          "Pay-period and wage calculations based on attendance information",
        ],
      },
      {
        label: "05 / ENGINEERING",
        title: "Architecture and integration work",
        paragraphs: [
          "The product uses a Next.js frontend and a NestJS API on EKS, with Prisma and PostgreSQL for workforce, attendance and payroll records. SQS separates device-event intake from background processing; DynamoDB tracks device cursors and deduplication state. Pino provides structured application logging.",
          "Lambda handles scheduled exports, S3 stores generated reports and SNS distributes operational alerts. These services support the core application while PostgreSQL remains the source of truth for business records.",
          "I also integrated Claude into an adapter layer to assist with extending support and onboarding for additional attendance-device types. The AI-assisted workflow supports the engineering process; it does not autonomously control devices.",
        ],
      },
    ],
    screenshots: [
      { src: "/projects/attendace-system/overview.png", alt: "HyrjeDalje workforce attendance overview dashboard", caption: "Workforce and attendance overview" },
      { src: "/projects/attendace-system/reports-analytic.png", alt: "HyrjeDalje attendance reports and analytics screen", caption: "Attendance reporting and analytics" },
      { src: "/projects/attendace-system/attendace-record.png", alt: "HyrjeDalje attendance records table", caption: "Attendance records" },
      { src: "/projects/attendace-system/create-shift.png", alt: "HyrjeDalje shift creation workflow", caption: "Shift configuration" },
      { src: "/projects/attendace-system/generate-paidperiod.png", alt: "HyrjeDalje pay-period generation screen", caption: "Pay-period generation" },
      { src: "/projects/attendace-system/vacation-overview.png", alt: "HyrjeDalje vacation and leave overview", caption: "Vacation and leave overview" },
    ],
    thumbnail: "/projects/attendace-system/overview.png",
    thumbnailAlt: "HyrjeDalje workforce attendance overview dashboard",
    liveUrl: "https://www.hyrjedalje.com/en/",
    liveLabel: "Visit live site",
    caseStudyUrl: "/work/hyrjedalje",
    featured: true,
    clientType: "Multi-tenant software platform",
    projectType: "Custom software",
    kind: "screenshots",
    seoTitle: "HyrjeDalje — Workforce Management Platform",
    seoDescription: "Multi-tenant workforce platform using Next.js, NestJS, Prisma, PostgreSQL and AWS EKS, with SQS attendance processing, Lambda exports and S3 report storage.",
    workCategories: ["Software"],
  },
  {
    id: "wondertales",
    name: "WonderTales",
    slug: "wondertales",
    category: "AI Product / E-commerce",
    headline: "AI-Powered Personalized Children's Story Platform",
    shortDescription: "Built a Next.js story platform with personalized AI content, payments and administration, backed by Lambda, SQS, S3 and DynamoDB for generation jobs and downloadable assets.",
    myRole: "Full-stack development & AI integration",
    technologies: ["Next.js", "React", "TypeScript", "Replicate", "MiniMax", "Generative AI", "AWS Lambda", "Amazon SQS", "Amazon S3", "Amazon DynamoDB", "Amazon SNS"],
    cardTechnologies: ["Next.js", "TypeScript", "Replicate", "AWS Lambda", "Amazon S3"],
    awsArchitecture: {
      services: ["Lambda", "SQS", "S3", "DynamoDB", "SNS"],
      summary: "A serverless generation pipeline separates customer requests from AI processing, with SQS buffering generation jobs and S3 storing illustrations and generated books.",
      flow: ["Next.js", "Lambda validation", "SQS generation queue", "AI worker", "S3 images / PDFs"],
      considerations: [
        "Lambda validates requests and handles short processing tasks. SQS buffers generation work and supports retries and dead-letter handling.",
        "DynamoDB tracks generation status while relational order and payment records stay in their existing system. SNS distributes completion and failure events.",
      ],
    },
    sections: [
      {
        label: "01 / OVERVIEW",
        title: "A complete personalized-story product",
        paragraphs: [
          "WonderTales is a full-stack platform where customers can select a children's story, personalize it with a child's details and photo, generate personalized content and imagery, and purchase the resulting product.",
          "The platform also includes administration tools for creating and managing the stories available to customers.",
        ],
      },
      {
        label: "02 / PRODUCT EXPERIENCE",
        title: "From story selection to personalization",
        paragraphs: ["The customer journey connects story discovery with a guided personalization flow."],
        bullets: [
          "Browse and select an available story",
          "Provide the child's name, age and gender",
          "Upload a picture for personalization",
          "Generate personalized story content and imagery",
          "Continue to purchase the personalized product",
        ],
      },
      {
        label: "03 / AI INTEGRATION",
        title: "Generative AI inside a product workflow",
        paragraphs: [
          "Replicate and the MiniMax model support the platform's generative image functionality. The integration sits within a full customer and commerce experience rather than operating as a standalone AI demonstration.",
          "Lambda validates generation requests and SQS queues the work for AI processing. Generated illustrations and books are stored in S3, DynamoDB tracks job status and SNS distributes completion and failure events.",
        ],
      },
      {
        label: "04 / ADMINISTRATION",
        title: "Story management",
        paragraphs: [
          "The administration side supports adding stories and managing the catalog and story settings used by the customer-facing personalization experience.",
        ],
      },
      {
        label: "05 / COMMERCIAL USE",
        title: "Built for real commercial use",
        paragraphs: ["The platform became a successful commercial product for the client."],
      },
    ],
    screenshots: [
      { src: "/projects/Wonder-tales/hero-section.png", alt: "WonderTales personalized children's story homepage", caption: "Customer-facing story experience" },
      { src: "/projects/Wonder-tales/tales-list.png", alt: "WonderTales available personalized stories", caption: "Story selection" },
      { src: "/projects/Wonder-tales/generator-form.png", alt: "WonderTales child details personalization form", caption: "Child details form" },
      { src: "/projects/Wonder-tales/upload-picture.png", alt: "WonderTales child picture upload step", caption: "Picture upload and personalization" },
      { src: "/projects/Wonder-tales/managment-dashboard.png", alt: "WonderTales story management dashboard", caption: "Story management dashboard" },
      { src: "/projects/Wonder-tales/add-tales.png", alt: "WonderTales add story administration interface", caption: "Story creation interface" },
    ],
    thumbnail: "/projects/Wonder-tales/hero-section.png",
    thumbnailAlt: "WonderTales personalized children's story homepage",
    liveUrl: "https://wondertales.shop/dashboard",
    liveLabel: "Visit live site",
    caseStudyUrl: "/work/wondertales",
    featured: true,
    clientType: "Commercial product",
    projectType: "Full-stack AI product",
    kind: "screenshots",
    seoTitle: "WonderTales — AI-Powered Story Platform",
    seoDescription: "Next.js personalized story platform with Replicate and MiniMax AI generation, AWS Lambda, SQS job processing, S3 assets, DynamoDB status and SNS events.",
    workCategories: ["Software", "E-commerce"],
  },
  {
    id: "kosovo-police",
    name: "Kosovo Police",
    slug: "kosovo-police",
    category: "WordPress / Public Sector",
    headline: "Public Portal & Custom WordPress Engineering",
    shortDescription: "Developed a WordPress public portal with custom PHP statistics publishing, S3 media storage, Lambda data preparation and SQS background processing.",
    myRole: "WordPress development, data integration & infrastructure",
    technologies: ["WordPress", "PHP", "Custom Plugin", "Data Integration", "Load Balancing", "Amazon S3", "AWS Lambda", "Amazon SQS"],
    cardTechnologies: ["WordPress", "PHP", "Custom Plugin", "Amazon S3", "AWS Lambda"],
    awsArchitecture: {
      services: ["S3", "Lambda", "SQS"],
      summary: "S3 supports public assets and exports, while Lambda and SQS handle background statistics preparation and publishing around the WordPress portal.",
      considerations: [
        "Lambda handles scheduled data preparation, and SQS decouples background publishing work from public page requests.",
        "The architecture shown covers public assets and statistics publishing; private endpoints and internal infrastructure details remain confidential.",
      ],
    },
    sections: [
      {
        label: "01 / OVERVIEW",
        title: "Public website development",
        paragraphs: [
          "Developed the public website for Kosovo Police. The work covered WordPress development and customization, custom PHP functionality, data-driven public statistics and production deployment concerns.",
        ],
      },
      {
        label: "02 / WORDPRESS ENGINEERING",
        title: "More than a theme implementation",
        paragraphs: [
          "The portal combines public-sector content delivery with custom WordPress and PHP development. The implementation includes purpose-built functionality for public information and operational statistics.",
        ],
      },
      {
        label: "03 / STATISTICS SYSTEM",
        title: "Automated, data-driven publishing",
        paragraphs: [
          "I developed a custom WordPress plugin that retrieves information from the organization's data source and automatically updates public statistics on a daily basis.",
          "Lambda prepares data on a schedule, SQS queues background publishing tasks and S3 stores public media and exports, keeping that work separate from page requests.",
          "The public views present overview, accident and misdemeanor statistics without exposing private endpoints or implementation details.",
        ],
      },
      {
        label: "04 / INFRASTRUCTURE",
        title: "Production reliability",
        paragraphs: [
          "I supported production infrastructure with a load-balanced deployment designed for reliability and public traffic. Sensitive infrastructure details are intentionally omitted.",
        ],
      },
      {
        label: "05 / INTERNAL SYSTEMS",
        title: "Confidential internal work",
        paragraphs: ["I also developed an internal intranet solution that is not publicly accessible."],
      },
    ],
    screenshots: [
      { src: "/projects/Kosovo-police/hero.png", alt: "Kosovo Police public website homepage", caption: "Public portal homepage" },
      { src: "/projects/Kosovo-police/statistics-overview.png", alt: "Kosovo Police public statistics overview", caption: "Public statistics overview" },
      { src: "/projects/Kosovo-police/acccidents.png", alt: "Kosovo Police accident statistics dashboard", caption: "Accident statistics" },
      { src: "/projects/Kosovo-police/Misdemeanor.png", alt: "Kosovo Police misdemeanor statistics dashboard", caption: "Misdemeanor statistics" },
    ],
    thumbnail: "/projects/Kosovo-police/hero.png",
    thumbnailAlt: "Kosovo Police public website homepage",
    liveUrl: "https://www.kosovopolice.com/",
    liveLabel: "Visit website",
    caseStudyUrl: "/work/kosovo-police",
    featured: true,
    clientType: "Public-sector institution",
    projectType: "Public portal",
    kind: "screenshots",
    seoTitle: "Kosovo Police — Public Portal & WordPress Engineering",
    seoDescription: "Public WordPress portal with custom PHP statistics publishing, data integration, Amazon S3 assets, AWS Lambda preparation and SQS background processing.",
    workCategories: ["Websites"],
  },
  {
    id: "menmin-made",
    name: "Menmin Made",
    slug: "menmin-made",
    category: "Shopify / E-commerce",
    headline: "Shopify Store & AI-Assisted Management",
    shortDescription: "Built a Shopify store with Claude-assisted administration and AWS integrations: Lambda webhooks, SQS background tasks and S3 content assets.",
    myRole: "Shopify development & AI integration",
    technologies: ["Shopify", "E-commerce", "Claude", "AI Integration", "APIs / integrations", "AWS Lambda", "Amazon S3", "Amazon SQS"],
    cardTechnologies: ["Shopify", "Claude", "AWS Lambda", "Amazon S3", "Amazon SQS"],
    awsArchitecture: {
      services: ["Lambda", "S3", "SQS"],
      summary: "Lambda processes Shopify webhook events, SQS queues administration tasks and S3 stores generated content assets.",
      considerations: [
        "Queued processing separates background administration work from the customer-facing storefront.",
        "Shopify remains the commerce platform, with the client retaining control over AI-assisted administrative changes.",
      ],
    },
    sections: [
      {
        label: "01 / OVERVIEW",
        title: "Shopify e-commerce delivery",
        paragraphs: [
          "Menmin Made is a client Shopify store. My work covered e-commerce implementation, ongoing storefront support and an AI-assisted administration workflow for the client.",
        ],
      },
      {
        label: "02 / SHOPIFY DEVELOPMENT",
        title: "Storefront and commerce work",
        paragraphs: [
          "I built and supported the Shopify shopping experience across the store's customer-facing commerce workflows. The case study stays conservative about implementation details that are not publicly visible.",
        ],
      },
      {
        label: "03 / AI ADMINISTRATION",
        title: "Assistance for routine store management",
        paragraphs: [
          "I integrated a Claude-based workflow that assists the client with managing and updating products, generating or editing product content, inventory-related administration, store configuration and other routine store-management tasks.",
          "Lambda processes Shopify webhook events, SQS queues background administration work and S3 stores generated content assets. Shopify remains responsible for the commerce experience.",
          "The integration is an assistive administration layer; it is not presented as unrestricted autonomous control of the store.",
        ],
      },
    ],
    screenshots: [
      { src: "/projects/menminmade/hero.png", alt: "Menmin Made Shopify storefront", caption: "Menmin Made customer storefront" },
    ],
    thumbnail: "/projects/menminmade/hero.png",
    thumbnailAlt: "Menmin Made Shopify storefront",
    liveUrl: "https://menminmade.com/",
    liveLabel: "Visit store",
    caseStudyUrl: "/work/menmin-made",
    featured: true,
    clientType: "E-commerce client",
    projectType: "Shopify store",
    kind: "screenshots",
    seoTitle: "Menmin Made — Shopify & AI-Assisted Management",
    seoDescription: "Shopify e-commerce with Claude-assisted store management, AWS Lambda webhook integrations, Amazon SQS background tasks and S3 content storage.",
    workCategories: ["E-commerce", "Websites"],
  },
  {
    id: "order-extraction",
    name: "AI Order Extraction System",
    slug: "order-extraction",
    category: "Automation / AI",
    headline: "Social Commerce Order Automation",
    shortDescription: "Built an AWS-backed workflow using Chatwoot webhooks, Lambda and SQS to turn social-commerce messages into validated, structured order data.",
    myRole: "Automation development & AI integration",
    technologies: ["Chatwoot", "Webhooks", "AI", "Structured Data Extraction", "n8n", "API Integration", "AWS Lambda", "Amazon SQS", "Amazon S3", "Amazon SNS", "Amazon DynamoDB"],
    cardTechnologies: ["Chatwoot", "AI", "AWS Lambda", "Amazon SQS", "Amazon DynamoDB"],
    awsArchitecture: {
      services: ["Lambda", "SQS", "S3", "SNS", "DynamoDB"],
      summary: "Chatwoot webhooks enter a serverless pipeline: Lambda validates incoming events, SQS queues processing and a Lambda worker extracts structured order data for the operational API or CRM.",
      flow: ["Chatwoot webhook", "Lambda validation", "SQS", "Lambda AI extraction", "Operational API / CRM"],
      considerations: [
        "S3 stores raw payloads and attachments, DynamoDB tracks job state and deduplication, and SNS publishes result events.",
        "Queue-based processing separates webhook intake from AI extraction and downstream API delivery.",
      ],
    },
    sections: [
      {
        label: "01 / OVERVIEW",
        title: "A real internal automation system",
        paragraphs: [
          "This confidential internal system supports a social-commerce operation where customer orders arrive through messaging channels. It automates a previously time-consuming order-processing workflow without exposing the client's identity or private data.",
        ],
      },
      {
        label: "02 / BUSINESS PROBLEM",
        title: "Reducing repetitive order entry",
        paragraphs: [
          "Manually identifying order information inside customer conversations and entering that data into the client's order process required significant repetitive work.",
          "The automation significantly reduced manual order-entry and processing work without relying on unsupported savings or volume claims.",
        ],
      },
      {
        label: "03 / WORKFLOW",
        title: "From conversation to structured order",
        paragraphs: [
          "Social-media conversations arrive in Chatwoot. Webhooks invoke Lambda validation, then SQS queues messages for a Lambda AI extraction worker. Validated order data is passed into the client's operational API or CRM, with DynamoDB tracking job state and preventing duplicate processing.",
        ],
      },
      {
        label: "04 / CONFIDENTIALITY",
        title: "Architecture shown, client data protected",
        paragraphs: [
          "There are no public product screenshots because this is an internal client tool. The workflow diagram is an intentionally simplified architecture illustration—not a fabricated dashboard or customer conversation.",
        ],
      },
    ],
    screenshots: [],
    thumbnail: "",
    thumbnailAlt: "",
    liveUrl: "",
    liveLabel: "",
    caseStudyUrl: "/work/order-extraction",
    featured: false,
    clientType: "Confidential social-commerce client",
    projectType: "Internal automation",
    kind: "workflow",
    seoTitle: "AI Order Extraction System — Automation Case Study",
    seoDescription: "Social-commerce automation using Chatwoot webhooks, AWS Lambda, SQS, S3, SNS and DynamoDB for AI order extraction and operational API integration.",
    workCategories: ["Automation"],
    status: "Internal project",
  },
];

export const supportingWork: SupportingWorkItem[] = [
  {
    id: "pabau",
    name: "Pabau",
    headline: "Practice Management SaaS",
    type: "Software / SaaS",
    categories: ["Software"],
    description: "Contributed full-stack product functionality to a practice-management SaaS platform using React, Next.js, GraphQL, Node.js and Prisma, with AWS-backed services for container hosting, asynchronous work, assets and integrations.",
    technologies: ["React", "Next.js", "GraphQL", "Node.js", "Prisma", "AWS EKS", "Amazon SQS", "Amazon S3", "AWS Lambda"],
    awsArchitecture: {
      services: ["EKS", "SQS", "S3", "Lambda"],
      summary: "EKS supports containerized services, SQS handles asynchronous work, S3 stores assets and Lambda processes background integration tasks.",
      considerations: [],
    },
    liveUrl: "https://pabau.com/",
    liveLabel: "Visit website",
    featured: false,
    hasCaseStudy: false,
  },
  {
    id: "two-jobs",
    name: "TWO.jobs",
    headline: "Web & Mobile Recruitment Platform",
    type: "Software / Mobile",
    categories: ["Software", "Mobile & IoT"],
    description: "Developed web and mobile interfaces at Tetbit using React, React Native and TypeScript, integrating backend APIs with AWS services for media storage, event processing, notifications and application state.",
    technologies: ["React", "React Native", "TypeScript", "API Integration", "Amazon S3", "AWS Lambda", "Amazon SNS", "Amazon DynamoDB"],
    awsArchitecture: {
      services: ["S3", "Lambda", "SNS", "DynamoDB"],
      summary: "S3 stores media, Lambda processes backend events, SNS distributes notifications and DynamoDB maintains key-value application state.",
      considerations: [],
    },
    liveUrl: "https://www.two.jobs/en",
    liveLabel: "Visit website",
    featured: false,
    hasCaseStudy: false,
  },
  {
    id: "advantx-smart-home",
    name: "Advantx Smart Home",
    headline: "IoT & Real-Time Smart Home Ecosystem",
    type: "Mobile & IoT",
    categories: ["Mobile & IoT", "Software"],
    description: "Contributed desktop and mobile controls, real-time communication and an installer dashboard to a smart-home ecosystem using Electron, MQTT, KNX and LiveKit/WebRTC/SIP. AWS supports management APIs, telemetry, device state and alerts, while local controls retain offline operation.",
    technologies: ["Electron", "React / React Native", "MQTT", "KNX", "LiveKit", "WebRTC", "SIP", "REST APIs", "AI Integration", "AWS EKS", "AWS Lambda", "Amazon SQS", "Amazon SNS", "Amazon DynamoDB", "Amazon S3"],
    awsArchitecture: {
      services: ["EKS", "Lambda", "SQS", "SNS", "DynamoDB", "S3"],
      summary: "EKS hosts management APIs, Lambda processes telemetry and automation triggers, and SQS handles asynchronous device events. DynamoDB stores device state, SNS distributes incident alerts and S3 holds diagnostics and configuration artifacts.",
      considerations: ["Latency-critical building control stays local, keeping basic device functionality available without an external cloud connection."],
    },
    status: "Private / non-public product",
    featured: false,
    hasCaseStudy: false,
  },
  {
    id: "gossik",
    name: "Gossik",
    headline: "Mobile Application Modernization",
    type: "Mobile application",
    categories: ["Mobile & IoT"],
    description: "Modernized the Ionic and Angular mobile application through redesign and refactoring, alongside AWS-backed assets, event processing, notifications and key-value application state.",
    technologies: ["Ionic", "Angular 2+", "TypeScript", "Hybrid Mobile", "Amazon S3", "AWS Lambda", "Amazon SNS", "Amazon DynamoDB"],
    awsArchitecture: {
      services: ["S3", "Lambda", "SNS", "DynamoDB"],
      summary: "S3 stores application assets, Lambda processes backend events, SNS supports notifications and DynamoDB holds key-value application state.",
      considerations: [],
    },
    liveUrl: "https://www.gossik.ch/",
    liveLabel: "Visit website",
    featured: false,
    hasCaseStudy: false,
  },
  {
    id: "ctl",
    name: "CTL",
    headline: "Crypto Platform Backend & Wallet Authentication",
    type: "Backend / Web3",
    categories: ["Software"],
    description: "Built backend functionality for a crypto application using Node.js and Express, including MetaMask and Phantom wallet connectivity, wallet-based authentication and OAuth authentication.",
    technologies: ["Node.js", "Express", "MetaMask", "Phantom", "OAuth", "Web3"],
    status: "Previous product · No longer publicly available",
    featured: false,
    hasCaseStudy: false,
  },
  {
    id: "generation-success",
    name: "Generation Success",
    headline: "Design-to-Development WordPress Build",
    type: "Commercial website",
    categories: ["Websites"],
    description: "Built the complete website from provided designs, translating the visual concepts into a clean, responsive WordPress implementation with Elementor, custom styling and integrations.",
    technologies: ["WordPress", "Elementor", "CSS", "Responsive Development"],
    liveUrl: "https://www.generation-success.com/",
    liveLabel: "Visit website",
    featured: false,
    hasCaseStudy: false,
  },
  {
    id: "long-time-liner",
    name: "Long-Time-Liner",
    headline: "Responsive Commercial Website",
    type: "Commercial website",
    categories: ["Websites"],
    description: "Translated supplied visual designs into a responsive WordPress website using Elementor, custom styling and the required integrations.",
    technologies: ["WordPress", "Elementor", "CSS", "Responsive Development"],
    liveUrl: "https://www.long-time-liner.com/",
    liveLabel: "Visit website",
    featured: false,
    hasCaseStudy: false,
  },
  {
    id: "rexhi",
    name: "Rexhi",
    headline: "Production WordPress Implementation",
    type: "Commercial website",
    categories: ["Websites"],
    description: "Implemented the provided design as a production-ready WordPress experience with Elementor, responsive behavior and project-specific styling.",
    technologies: ["WordPress", "Elementor", "CSS", "Responsive Development"],
    liveUrl: "https://rexhi.com/",
    liveLabel: "Visit website",
    featured: false,
    hasCaseStudy: false,
  },
  {
    id: "patzina-lotz",
    name: "Patzina Lotz",
    headline: "Supplied-Design Website Delivery",
    type: "Commercial website",
    categories: ["Websites"],
    description: "Converted supplied designs into a responsive Elementor website, applying custom styling for a clean and consistent production result.",
    technologies: ["WordPress", "Elementor", "CSS", "Responsive Development"],
    liveUrl: "https://patzina-lotz.com/?lang=en",
    liveLabel: "Visit website",
    featured: false,
    hasCaseStudy: false,
  },
  {
    id: "home-niche-links",
    name: "Home Niche Links",
    headline: "Responsive WordPress Website",
    type: "Commercial website",
    categories: ["Websites"],
    description: "Built a clean, responsive WordPress implementation from the provided design, using Elementor, custom CSS and appropriate integrations.",
    technologies: ["WordPress", "Elementor", "CSS", "Responsive Development"],
    liveUrl: "https://homenichelinks.com/",
    liveLabel: "Visit website",
    featured: false,
    hasCaseStudy: false,
  },
  {
    id: "sote-coffee-roasters",
    name: "Sote Coffee Roasters",
    headline: "Responsive Brand Website",
    type: "Commercial website",
    categories: ["Websites"],
    description: "Delivered the supplied design as a responsive WordPress site with Elementor, polished UI styling and the integrations required for production.",
    technologies: ["WordPress", "Elementor", "CSS", "Responsive Development"],
    liveUrl: "https://sotecoffeeroasters.com/",
    liveLabel: "Visit website",
    featured: false,
    hasCaseStudy: false,
  },
  {
    id: "oek-kcc",
    name: "OEK / KCC",
    headline: "Maintainable Commercial Website",
    type: "Commercial website",
    categories: ["Websites"],
    description: "Translated the provided design into a responsive WordPress website with Elementor, focusing on clean implementation and maintainability.",
    technologies: ["WordPress", "Elementor", "CSS", "Responsive Development"],
    liveUrl: "https://www.oek-kcc.org/",
    liveLabel: "Visit website",
    featured: false,
    hasCaseStudy: false,
  },
  {
    id: "falcon-funded",
    name: "Falcon Funded",
    headline: "Responsive UI Development",
    type: "Commercial website",
    categories: ["Websites"],
    description: "Built the production website from provided visual designs using WordPress and Elementor, with responsive UI work, custom styling and integrations.",
    technologies: ["WordPress", "Elementor", "CSS", "Responsive Development"],
    liveUrl: "https://falconfunded.com/",
    liveLabel: "Visit website",
    featured: false,
    hasCaseStudy: false,
  },
];

export const workFilters = ["All", "Software", "Websites", "E-commerce", "Mobile & IoT", "Automation"] as const;

export const isConfigured = (value: string) =>
  Boolean(value && !value.startsWith("YOUR_") && !value.includes("YOUR_DOMAIN"));
