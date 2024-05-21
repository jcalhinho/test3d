interface PlatformData {
    id: number;
    position: [number, number, number];
    size: [number, number, number];
    isMobile: boolean;
  }
  
  const generatePlatforms = (numPlatforms: number, minHeight: number, maxHeight: number, mobileRatio = 0.6): PlatformData[] => {
    const platforms: PlatformData[] = [];
    for (let i = 0; i < numPlatforms; i++) {
      const size: [number, number, number] = [Math.random() * 5 + 1, 0.5, Math.random() * 5 + 1];
      const position: [number, number, number] = [
        (Math.random() - 0.5) * 100,
        Math.random() * (maxHeight - minHeight) + minHeight,
        (Math.random() - 0.5) * 100
      ];
      const isMobile = Math.random() < mobileRatio;
      platforms.push({ id: i, position, size, isMobile });
    }
    return platforms;
  };
  
  export default generatePlatforms;
  