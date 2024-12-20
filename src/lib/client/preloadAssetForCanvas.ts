export function preloadAssetForCanvas(assetPath: string) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = assetPath;
    img.onload = () => {
      resolve(img);
    };
    img.onerror = (err) => {
      reject(err);
    };
  });
}
