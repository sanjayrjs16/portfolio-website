export interface WorkLinkItem {
    label: string;
    url: string;
}

export interface FeaturedProject {
    slug: string;
    title: string;
    role: string;
    /** One or two paragraphs — use `\n\n` to split */
    summary: string;
    metrics?: string[];
    stack: string[];
    links: WorkLinkItem[];
    image: string;
    tone?: 'default' | 'cinematic';
    caseStudyPath?: string;
    caseStudyCta?: string;
    /** sunroad-warm: light panel for dark PNG; logo-contain: full logo, no crop */
    mediaVariant?: 'default' | 'sunroad-warm' | 'logo-contain';
}

export interface StackProject {
    slug: string;
    title: string;
    summary: string;
    /** Omit or leave empty to hide stack pills */
    stack?: string[];
    links: WorkLinkItem[];
    badge?: string;
    image: string;
    caseStudyPath?: string;
}
