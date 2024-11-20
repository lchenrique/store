export type HeaderLayoutType = 'classic' | 'minimal' | 'mega-menu' | 'promotional';
export type ProductCardLayoutType = 'classic' | 'minimal' | 'hover' | 'detailed';

export interface LayoutConfig {
  id: HeaderLayoutType | ProductCardLayoutType;
  name: string;
  description: string;
}

export const headerLayouts: LayoutConfig[] = [
  {
    id: 'classic',
    name: 'Clássico',
    description: 'Header tradicional com navegação principal e carrinho'
  },
  {
    id: 'minimal',
    name: 'Minimalista',
    description: 'Design limpo e minimalista com elementos essenciais'
  },
  {
    id: 'mega-menu',
    name: 'Mega Menu',
    description: 'Header com menu expansível e categorias detalhadas'
  },
  {
    id: 'promotional',
    name: 'Promocional',
    description: 'Header com banner promocional integrado'
  }
];

export const productCardLayouts: LayoutConfig[] = [
  {
    id: 'classic',
    name: 'Card Clássico',
    description: 'Visualização tradicional do produto com imagem e informações básicas'
  },
  {
    id: 'minimal',
    name: 'Card Minimalista',
    description: 'Design simplificado focado na imagem do produto'
  },
  {
    id: 'hover',
    name: 'Card com Efeito Hover',
    description: 'Card interativo com animações e informações adicionais ao passar o mouse'
  },
  {
    id: 'detailed',
    name: 'Card Detalhado',
    description: 'Card com informações detalhadas do produto sempre visíveis'
  }
];
