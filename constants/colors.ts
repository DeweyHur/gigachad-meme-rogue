export const COLORS = {
  background: '#121212',
  card: '#1E1E1E',
  primary: '#FF5252',
  secondary: '#4ECDC4',
  text: '#FFFFFF',
  textSecondary: '#BBBBBB',
  success: '#2ECC71',
  danger: '#E74C3C',
  warning: '#F39C12',
  info: '#3498DB',
  overlay: 'rgba(0, 0, 0, 0.7)',
  nodeDefault: '#555555',
  nodeBattle: '#E74C3C',
  nodeShop: '#3498DB',
  nodeEvent: '#F39C12',
  nodeCamp: '#2ECC71',
  nodeShrine: '#9B59B6',
  nodeBlacksmith: '#E67E22',
  nodeBoss: '#8E44AD',
  energy: '#F1C40F',
  health: '#E74C3C',
  cardBorder: '#333333',
  cardBackground: '#252525',
  // Grade colors for equipment and cards
  gradeCommon: '#9E9E9E',      // Gray
  gradeUncommon: '#4CAF50',    // Green
  gradeRare: '#2196F3',        // Blue
  gradeEpic: '#9C27B0',        // Purple
  gradeLegendary: '#FF9800',   // Orange
};

// Utility function to get grade color
export const getGradeColor = (grade?: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary') => {
  switch (grade) {
    case 'common':
      return COLORS.gradeCommon;
    case 'uncommon':
      return COLORS.gradeUncommon;
    case 'rare':
      return COLORS.gradeRare;
    case 'epic':
      return COLORS.gradeEpic;
    case 'legendary':
      return COLORS.gradeLegendary;
    default:
      return COLORS.cardBorder;
  }
};