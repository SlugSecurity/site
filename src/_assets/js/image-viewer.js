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
			image.addEventListener('click', function(event) {
				if (!event.target.closest('.md-post__content')) {
					createOverlay(this);
				}
			});
		});
	}

	document$.subscribe(function() {
		initializeImageOverlay();
	});
});