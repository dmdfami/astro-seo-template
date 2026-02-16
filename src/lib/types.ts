export interface SiteConfig {
  site: {
    name: string;
    url: string;
    description: string;
    language: string;
    defaultImage: string;
  };
  navigation: {
    main: NavLink[];
    footer: FooterSection[];
  };
  social: Record<string, string>;
  contact: {
    email: string;
    phone: string;
    address: string;
  };
  features: {
    darkMode: boolean;
    search: boolean;
    blog: boolean;
    products: boolean;
    newsletter: boolean;
  };
}

export interface NavLink {
  label: string;
  href: string;
}

export interface FooterSection {
  title: string;
  links: NavLink[];
}

export interface DesignTokens {
  colors: Record<string, Record<string, string>>;
  typography: {
    fonts: Record<string, string>;
    sizes: Record<string, string>;
  };
  spacing: Record<string, string>;
  radius: Record<string, string>;
  shadows: Record<string, string>;
  glass: Record<string, string>;
  gradients: Record<string, string>;
}
