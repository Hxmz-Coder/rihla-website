(function () {
  function initScrollReveal() {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach(function (el) {
      observer.observe(el);
    });
  }

  function initDonorStagger() {
    var donorList = document.getElementById('donorList');
    if (!donorList) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll('.donor-item').forEach(function (item, i) {
            setTimeout(function () { item.classList.add('visible'); }, i * 150);
          });
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    observer.observe(donorList);
  }

  function animateCounter(el) {
    var target = parseInt(el.dataset.target, 10);
    var prefix = el.dataset.prefix || '';
    var suffix = el.dataset.suffix || '';
    var duration = 1800;
    var start = performance.now();

    function tick(now) {
      var progress = Math.min((now - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var value = Math.floor(eased * target);
      el.textContent = prefix + value.toLocaleString() + suffix;
      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        el.textContent = prefix + target.toLocaleString() + suffix;
      }
    }
    requestAnimationFrame(tick);
  }

  function initCounters() {
    var counters = document.querySelectorAll('.counter');
    if (!counters.length) return;

    var started = false;
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !started) {
          started = true;
          counters.forEach(animateCounter);
          observer.disconnect();
        }
      });
    }, { threshold: 0.3 });

    observer.observe(counters[0].closest('section') || counters[0]);
  }

  function initProgressBar() {
    var bar = document.getElementById('progressBar');
    var raisedEl = document.getElementById('raisedAmount');
    var percentEl = document.getElementById('progressPercent');
    if (!bar || !raisedEl) return;

    var raised = parseInt(bar.dataset.raised || '2854', 10);
    var goal = parseInt(bar.dataset.goal || '16000', 10);
    var pct = Math.round((raised / goal) * 100);
    bar.style.setProperty('--progress', pct + '%');

    var started = false;
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !started) {
          started = true;
          bar.classList.add('animated');
          var start = performance.now();

          function tickRaised(now) {
            var progress = Math.min((now - start) / 1800, 1);
            var eased = 1 - Math.pow(1 - progress, 3);
            var value = Math.floor(eased * raised);
            raisedEl.textContent = '$' + value.toLocaleString();
            if (percentEl) {
              percentEl.textContent = Math.floor(eased * pct) + '% of goal reached';
            }
            if (progress < 1) {
              requestAnimationFrame(tickRaised);
            } else {
              raisedEl.textContent = '$' + raised.toLocaleString();
              if (percentEl) percentEl.textContent = pct + '% of goal reached';
            }
          }
          requestAnimationFrame(tickRaised);
          observer.disconnect();
        }
      });
    }, { threshold: 0.3 });

    observer.observe(bar.closest('section') || bar);
  }

  document.addEventListener('DOMContentLoaded', function () {
    initScrollReveal();
    initDonorStagger();
    initCounters();
    initProgressBar();
  });
})();
