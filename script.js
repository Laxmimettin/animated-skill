const skillsSection = document.querySelector("#skills");
const progressBars = document.querySelectorAll(".progress-bar");
const replayButton = document.querySelector("#replay-btn");

let hasAnimated = false;

function animateSkills() {
  if (hasAnimated) return;

  hasAnimated = true;

  progressBars.forEach((bar, index) => {
    const target = Number(bar.dataset.progress);
    const percentage = bar.closest(".skill").querySelector(".percentage");

    // Reset the bar before starting the animation
    bar.style.width = "0%";
    percentage.textContent = "0%";

    setTimeout(() => {
      bar.style.width = target + "%";

      // Animate the percentage number
      const duration = 1500;
      const startTime = performance.now();

      function updateNumber(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = 1 - Math.pow(1 - progress, 3);

        percentage.textContent = Math.round(target * easedProgress) + "%";

        if (progress < 1) {
          requestAnimationFrame(updateNumber);
        }
      }

      requestAnimationFrame(updateNumber);
    }, index * 150);
  });
}

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateSkills();
        observer.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.25,
  },
);

observer.observe(skillsSection);

// Replay the animation when the button is clicked
replayButton.addEventListener("click", () => {
  hasAnimated = false;

  progressBars.forEach((bar) => {
    bar.style.transition = "none";
    bar.style.width = "0%";

    const percentage = bar.closest(".skill").querySelector(".percentage");

    percentage.textContent = "0%";
  });

  // Allow the browser to apply the reset before replaying
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      progressBars.forEach((bar) => {
        bar.style.transition = "";
      });

      animateSkills();
    });
  });
});
