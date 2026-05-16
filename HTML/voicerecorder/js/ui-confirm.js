// Custom replacement for window.confirm() in the cyber style.
export function uiConfirm(message) {
    return new Promise(resolve => {
        const dlg  = document.getElementById('confirm-dialog');
        const msg  = dlg.querySelector('.cdlg-msg');
        const okEl = dlg.querySelector('.cdlg-btn.ok');
        const cancelEl = dlg.querySelector('.cdlg-btn.cancel');
        msg.textContent = message;
        dlg.classList.add('visible');
        const cleanup = (result) => {
            dlg.classList.remove('visible');
            okEl.removeEventListener('click', onOk);
            cancelEl.removeEventListener('click', onCancel);
            document.removeEventListener('keydown', onKey);
            resolve(result);
        };
        const onOk     = () => cleanup(true);
        const onCancel = () => cleanup(false);
        const onKey    = e => {
            if (e.key === 'Enter')  onOk();
            if (e.key === 'Escape') onCancel();
        };
        okEl.addEventListener('click', onOk);
        cancelEl.addEventListener('click', onCancel);
        document.addEventListener('keydown', onKey);
    });
}
