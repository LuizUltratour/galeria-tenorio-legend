(function (w, d) {
  'use strict';

  var GALLERY_URL        = 'https://skylineip.s3.sa-east-1.amazonaws.com/Tour+Virtual/tenorio/galeria-legend/index.html';
  var VIDEO_GALLERY_URL  = 'https://skylineip.s3.sa-east-1.amazonaws.com/Tour+Virtual/tenorio/galeria-legend/video-gallery.html';
  var DIFERENCIAIS_URL   = 'https://skylineip.s3.sa-east-1.amazonaws.com/Tour+Virtual/tenorio/galeria-legend/diferenciais.html';

  var overlay    = null;
  var msgHandler = null;

  function _injectStyles() {
    if (d.getElementById('_gc_styles')) return;
    var s = d.createElement('style');
    s.id = '_gc_styles';
    s.textContent =
      '@keyframes _gcIn{from{opacity:0}to{opacity:1}}' +
      '@keyframes _gcOut{to{opacity:0}}';
    d.head.appendChild(s);
  }

  function _open(mode) {
    if (overlay) _close();
    _injectStyles();

    overlay = d.createElement('div');
    overlay.id = '_gc_overlay';
    overlay.style.cssText =
      'position:fixed;inset:0;z-index:2147483646;' +
      'animation:_gcIn 0.3s ease both;';

    var iframe = d.createElement('iframe');
    iframe.src  = GALLERY_URL + '?mode=' + encodeURIComponent(mode || 'imagens');
    iframe.style.cssText = 'width:100%;height:100%;border:none;display:block;background:#332419;';
    iframe.setAttribute('allow', 'fullscreen');

    overlay.appendChild(iframe);
    d.body.appendChild(overlay);

    msgHandler = function (e) {
      if (e.data && e.data.action === 'closeGallery') _close();
    };
    w.addEventListener('message', msgHandler);
  }

  function _close() {
    if (!overlay) return;
    overlay.style.animation = '_gcOut 0.25s ease forwards';
    var ref = overlay;
    setTimeout(function () {
      if (ref.parentNode) ref.parentNode.removeChild(ref);
    }, 260);
    overlay = null;
    if (msgHandler) {
      w.removeEventListener('message', msgHandler);
      msgHandler = null;
    }
  }

  // ── API pública ──────────────────────────────────────────────
  // GaleriaImagens(1) → abre galeria de imagens
  // GaleriaImagens(0) → fecha
  w.GaleriaImagens = function (show) {
    if (show === 1) _open('imagens'); else _close();
  };

  // GaleriaPlantas(1) → abre galeria de plantas
  // GaleriaPlantas(0) → fecha
  w.GaleriaPlantas = function (show) {
    if (show === 1) _open('plantas'); else _close();
  };

  // AbrirGaleriaVideos(1) → abre galeria de vídeos
  // AbrirGaleriaVideos(0) → fecha
  w.AbrirGaleriaVideos = function (show) {
    if (show !== 1) { _close(); return; }
    if (overlay) _close();
    _injectStyles();

    overlay = d.createElement('div');
    overlay.id = '_gc_overlay';
    overlay.style.cssText =
      'position:fixed;inset:0;z-index:2147483646;' +
      'animation:_gcIn 0.3s ease both;';

    var iframe = d.createElement('iframe');
    iframe.src = VIDEO_GALLERY_URL + '?v=' + Date.now();
    iframe.style.cssText = 'width:100%;height:100%;border:none;display:block;background:#000;';
    iframe.setAttribute('allow', 'fullscreen; autoplay');

    overlay.appendChild(iframe);
    d.body.appendChild(overlay);

    msgHandler = function (e) {
      if (e.data && e.data.action === 'closeGallery') _close();
    };
    w.addEventListener('message', msgHandler);
  };

  // AbrirDiferenciais(1) → abre tela de diferenciais
  // AbrirDiferenciais(0) → fecha
  w.AbrirDiferenciais = function (show) {
    if (show !== 1) { _close(); return; }
    if (overlay) _close();
    _injectStyles();

    overlay = d.createElement('div');
    overlay.id = '_gc_overlay';
    overlay.style.cssText =
      'position:fixed;inset:0;z-index:2147483646;' +
      'animation:_gcIn 0.3s ease both;';

    var iframe = d.createElement('iframe');
    iframe.src = DIFERENCIAIS_URL + '?v=' + Date.now();
    iframe.style.cssText = 'width:100%;height:100%;border:none;display:block;background:#332419;';
    iframe.setAttribute('allow', 'fullscreen');

    overlay.appendChild(iframe);
    d.body.appendChild(overlay);

    msgHandler = function (e) {
      if (e.data && e.data.action === 'closeGallery') _close();
    };
    w.addEventListener('message', msgHandler);
  };

}(window, document));
