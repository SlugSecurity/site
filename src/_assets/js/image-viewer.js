document.addEventListener("DOMContentLoaded", function() {
	function createOverlay(clickedImage) {
		document.documentElement.style.overflow = 'hidden';

		const overlay = document.createElement('div');
		overlay.className = 'image-overlay';
		overlay.style.display = 'flex';
		document.body.appendChild(overlay);

		const overlayImage = clickedImage.cloneNode(true);
		overlay.appendChild(overlayImage);

		overlay.addEventListener('click', function() {
			document.body.removeChild(overlay);
			document.documentElement.style.overflow = '';
		});
	}

	function initializeImageOverlay() {
		const images = document.querySelectorAll('.md-content__inner img');
		images.forEach(image => {
			if (image.closest('.md-author')) return;
			if (window.getComputedStyle(image).cursor !== 'zoom-in') return;

			image.addEventListener('click', function() {
				createOverlay(this);
			});
		});
	}

	document$.subscribe(function() {
		initializeImageOverlay();
	});
});