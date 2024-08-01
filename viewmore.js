document.addEventListener("DOMContentLoaded", function() {
    document.querySelectorAll('.view-btn').forEach(button => {
        // Variable to store scroll position
        let initialScrollPosition = 0;

        button.addEventListener('click', function() {
            const projectItem = this.parentElement;
            const description = this.nextElementSibling;

            if (!projectItem.classList.contains('expanded')) {
                // Store the current scroll position
                initialScrollPosition = window.pageYOffset || document.documentElement.scrollTop;

                // Expand the description
                description.style.display = 'block';
                setTimeout(() => {
                    description.style.opacity = 1;
                    projectItem.classList.add('expanded');
                    this.textContent = 'See Less'; // Change button text to 'See Less'
                }, 10); // Allow display to change

                // Scroll to the Projects section
                const projectsSection = document.getElementById('project');
                if (projectsSection) {
                    projectsSection.scrollIntoView({ behavior: 'smooth' });
                }
            } else {
                // Collapse the description
                description.style.opacity = 0;
                setTimeout(() => {
                    description.style.display = 'none';
                    projectItem.classList.remove('expanded');
                    this.textContent = 'See More'; // Change button text back to 'See More'

                    // Scroll back to the initial position
                    window.scrollTo({
                        top: initialScrollPosition,
                        behavior: 'smooth'
                    });
                }, 300); // Match the CSS transition time
            }
        });
    });
});
