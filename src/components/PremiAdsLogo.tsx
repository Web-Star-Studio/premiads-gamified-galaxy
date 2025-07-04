interface PremiAdsLogoProps {
  className?: string
}

function PremiAdsLogo({ className = "h-8 w-auto" }: PremiAdsLogoProps) {
  return (
    <img 
      src="/premiads-logo.png" 
      alt="PremiAds" 
      className={className}
      onError={(e) => {
        // Fallback para texto se a imagem não carregar
        const target = e.target as HTMLImageElement;
        target.style.display = 'none';
        const fallback = document.createElement('div');
        fallback.innerHTML = '<span style="color: #4400b9; font-weight: bold; font-size: 18px;">premi</span><span style="color: #fe690d; font-weight: bold; font-size: 18px;">ads</span>';
        target.parentNode?.appendChild(fallback);
      }}
    />
  )
}

export default PremiAdsLogo 