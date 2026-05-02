window.onerror = function(message, source, lineno, colno, error) {
    fetch('http://localhost:8000/error', {
        method: 'POST',
        body: JSON.stringify({message, source, lineno, colno, error: error ? error.stack : null})
    });
};
window.addEventListener('unhandledrejection', function(event) {
    fetch('http://localhost:8000/error', {
        method: 'POST',
        body: JSON.stringify({message: 'Unhandled Rejection: ' + event.reason})
    });
});
