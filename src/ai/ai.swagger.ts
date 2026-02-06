export const AI_ANALYSIS_RESPONSE_EXAMPLE = {
  success: true,
  reportId: '550e8400-e29b-41d4-a716-446655440000',
  analysis: {
    summary:
      'A campanha apresenta um CTR excepcional (2.5%), indicando que o criativo está altamente alinhado ao público. No entanto, o ROAS de 3.2 está sendo sufocado por um CPC elevado no Facebook Ads e uma taxa de abandono de 65% na página de checkout.',
    validation_status: 'attention',
    validation_explanation:
      'Embora o topo do funil esteja saudável, a eficiência financeira está em risco devido ao custo por clique e à fricção no momento da compra.',
    bottlenecks: [
      {
        factor: 'CPC Elevado',
        impact: 'Reduz o volume de tráfego qualificado para o mesmo orçamento.',
        details:
          'O custo por clique está 40% acima do benchmark para o nicho de ecommerce no Brasil.',
      },
      {
        factor: 'Fricção no Checkout',
        impact: 'Perda de leads quentes.',
        details:
          'A taxa de conversão da página de vendas para o checkout é de 15%, mas a conversão final é de apenas 4.5%.',
      },
    ],
    action_plan: [
      'Implementar checkout de uma página (One-Step Checkout) para reduzir o abandono.',
      "Realizar teste A/B de criativos focados em 'curiosidade' para tentar baixar o CPC mantendo o CTR.",
      'Configurar campanha de retargeting específica para quem visualizou o checkout mas não comprou nas últimas 24h.',
    ],
    next_test_recommendations: [
      "Testar oferta de 'Frete Grátis' acima de R$ 200,00 para elevar o AOV (Ticket Médio) de R$ 150,50 para R$ 185,00.",
      'Experimentar criativos em formato User Generated Content (UGC) para aumentar a prova social.',
    ],
    missing_data: [
      'Tempo médio de carregamento da Landing Page (LCP).',
      'Origem detalhada dos leads (dispositivo móvel vs desktop).',
    ],
  },
  usage: {
    tokensUsed: 1240,
    promptTokens: 800,
    completionTokens: 440,
    estimatedCost: '$0.001860',
  },
  createdAt: '2026-02-05T23:45:00.000Z',
}

export const LIST_REPORTS_EXAMPLE = {
  success: true,
  count: 1,
  reports: [
    {
      id: 'uuid-1',
      summary: 'Resumo da análise...',
      validationStatus: 'valid',
      aiModel: 'gpt-4o-mini',
      totalTokens: 850,
      estimatedCost: 0.00125,
      createdAt: '2026-02-05T23:00:00.000Z',
    },
  ],
}

export const SINGLE_REPORT_RESPONSE_EXAMPLE = {
  success: true,
  report: {
    id: 'uuid-1',
    offer: {
      id: 'offer-uuid',
      name: 'Oferta Black Friday',
      niche: 'ecommerce',
      country: 'BR',
    },
    summary: 'A análise indica...',
    validationStatus: 'attention',
    fullReport: {
      /* Objeto completo da análise */
    },
    aiModel: 'gpt-4o-mini',
    usage: {
      promptTokens: 500,
      completionTokens: 350,
      totalTokens: 850,
      estimatedCost: 0.00125,
    },
    createdAt: '2026-02-05T23:00:00.000Z',
  },
}
