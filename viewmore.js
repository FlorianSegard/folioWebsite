document.addEventListener("DOMContentLoaded", function() {
    document.querySelectorAll('.view-btn').forEach(button => {
        button.addEventListener('click', function() {
            const projectItem = this.parentElement;
            const description = this.nextElementSibling;

            if (!projectItem.classList.contains('expanded')) {
                // Show the description
                description.style.display = 'block';
                setTimeout(() => {
                    description.style.opacity = 1;
                    projectItem.classList.add('expanded');
                    this.textContent = 'See Less'; // Change button text to 'See Less'
                }, 10); // allow display to change
            } else {
                // Hide the description
                description.style.opacity = 0;
                setTimeout(() => {
                    description.style.display = 'none';
                    projectItem.classList.remove('expanded');
                    this.textContent = 'See More'; // Change button text back to 'See More'
                }, 300); // match the CSS transition time
            }
        });
    });
});
