// CDN Loader Script - 이 파일은 CDN에서 제공되며 업데이트 가능
(function() {
  var CDN = 'https://lasker-studio-cep.vercel.app';
  var urlParams = new URLSearchParams(window.location.search || document.currentScript.src.split('?')[1] || '');
  var PANEL = urlParams.get('panel') || 'main';
  var cacheBuster = Date.now();
  var MANIFEST_URL = CDN + '/manifest.json?t=' + cacheBuster;

  // 기존 CDN 로드된 스크립트/스타일 제거 (리로드 대응)
  document.querySelectorAll('script[data-cdn-loader]').forEach(function(el) { el.remove(); });
  document.querySelectorAll('link[data-cdn-loader]').forEach(function(el) { el.remove(); });

  // Fetch manifest and load assets from CDN
  fetch(MANIFEST_URL)
    .then(function(res) { return res.json(); })
    .then(function(manifest) {
      var files = manifest.files[PANEL];
      if (!files) {
        console.error('[CDN Loader] Panel not found:', PANEL);
        return;
      }

      // Load CSS
      var link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = CDN + '/' + files.css + '?t=' + cacheBuster;
      link.setAttribute('data-cdn-loader', 'true');
      document.head.appendChild(link);

      // Load JS (cache buster로 ES module 캐시 우회)
      var script = document.createElement('script');
      script.type = 'module';
      script.src = CDN + '/' + files.js + '?t=' + cacheBuster;
      script.setAttribute('data-cdn-loader', 'true');
      document.body.appendChild(script);

      console.log('[CDN Loader] Loaded from CDN:', files);
    })
    .catch(function(err) {
      console.error('[CDN Loader] Failed to load manifest:', err);
    });
})();
