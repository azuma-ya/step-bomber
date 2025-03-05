export const getConfig = async () => {
  const Phaser = await import("phaser");
  return {
    type: Phaser.AUTO,
    width: 630,
    height: 630,
  } as Phaser.Types.Core.GameConfig;
};
