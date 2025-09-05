// Visual viewport centering helper for FaceGuessr modals
export function attachVisualViewportCentering(dialog) {
  const node = typeof dialog === 'string' ? document.querySelector(dialog) : dialog;
  if (!node) return () => {};

  const vv = window.visualViewport;
  if (!vv) return () => {}; // desktop fallback uses CSS translate

  const center = () => {
    const top = vv.offsetTop + (vv.height / 2);
    const left = vv.offsetLeft + (vv.width / 2);
    node.style.top = `${top}px`;
    node.style.left = `${left}px`;
    node.style.transform = 'translate(-50%, -50%)';
  };

  center();
  const onChange = () => center();
  vv.addEventListener('resize', onChange);
  vv.addEventListener('scroll', onChange);

  return () => {
    vv.removeEventListener('resize', onChange);
    vv.removeEventListener('scroll', onChange);
  };
}