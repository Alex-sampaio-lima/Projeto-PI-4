// src/styles/theme.js
// Design tokens do projeto Comanda+ — baseado no layout do Figma

const theme = {
  // ===== Cores ===== //
  cores: {
    primaria: '#1A3FA1',       // Azul escuro (botões, header)
    primariaDark: '#0F2970',   // Azul mais escuro (pressionar botão)
    destaque: '#F4A62A',       // Laranja (banner, promoção, estrelas)
    destaqueDark: '#D4861A',   // Laranja escuro
    sucesso: '#27AE60',        // Verde (pedido finalizado)
    erro: '#E74C3C',           // Vermelho (erros)
    branco: '#FFFFFF',
    cinzaClaro: '#F5F5F5',     // Fundo das telas
    cinzaMedio: '#E0E0E0',     // Bordas, divisores
    cinzaTexto: '#888888',     // Texto secundário
    textoEscuro: '#1A1A1A',    // Texto principal
    overlay: 'rgba(0,0,0,0.4)', // Overlay de modais
  },

  // ===== Espaçamentos ===== //
  espacamento: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },

  // ===== Tipografia ===== //
  fonte: {
    tamanho: {
      xs: 11,
      sm: 13,
      md: 15,
      lg: 17,
      xl: 20,
      xxl: 24,
      xxxl: 30,
    },
    peso: {
      normal: '400',
      medio: '500',
      semibold: '600',
      bold: '700',
    },
  },

  // ===== Bordas ===== //
  borda: {
    raio: {
      sm: 6,
      md: 12,
      lg: 20,
      full: 999,
    },
  },

  // ===== Sombras ===== //
  sombra: {
    leve: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 4,
      elevation: 3,
    },
    media: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.12,
      shadowRadius: 8,
      elevation: 6,
    },
  },
};

export default theme;
