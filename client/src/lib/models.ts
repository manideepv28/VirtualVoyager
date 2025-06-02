export interface ModelData {
  id: number;
  title: string;
  description: string;
  type: 'model' | 'tour';
  category: string;
  color: string;
  imageUrl: string;
}

export const createGeometry = (type: string) => {
  switch (type) {
    case 'camera':
      return 'box'; // Will be converted to BoxGeometry
    case 'spacecraft':
      return 'sphere'; // Will be converted to SphereGeometry
    case 'vr-headset':
      return 'cylinder'; // Will be converted to CylinderGeometry
    default:
      return 'box';
  }
};

export const getModelColor = (color: string): number => {
  const colorMap: Record<string, number> = {
    '#6366F1': 0x6366F1,
    '#8B5CF6': 0x8B5CF6,
    '#06B6D4': 0x06B6D4,
    '#F59E0B': 0xF59E0B,
  };
  return colorMap[color] || 0x6366F1;
};
