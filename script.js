class ScrollHor {
    container = null;
    scrollhorContainer = null;
    scrollhorContainerOffsetTop = null;
    scrollhorContainerHeight = null;
    containerHeight = null;
    windowHeight = null;
    currentMode = null;

    init(el) {
        this.container = el;
        this.wrap(this.container, '<div class="scrollhor"></div>');
        this.wrap(this.container, '<div class="scrollhor__inner"></div>');
        this.scrollhorContainer = this.container.closest('.scrollhor');
        this.scrollhorInner = this.scrollhorContainer.querySelector('.scrollhor__inner');
        this.scrollhorContainer.insertAdjacentHTML(
            'beforeend',
            '<div class="scrollhor__placeholder"></div>'
        );
        window.addEventListener('resize', () => {
            this.update();
        });
        this.update();
        window.addEventListener('scroll', () => {
            let windowScrollTop = this.windowScrollTop();
            if (windowScrollTop < this.scrollhorContainerOffsetTop) {
                if (this.currentMode !== 1) {
                    this.scrollhorInner.style.position = 'absolute';
                    this.container.scrollLeft = 0;
                    this.currentMode = 1;
                }
            } else if (
                windowScrollTop + this.windowHeight >=
                this.scrollhorContainerOffsetTop + this.scrollhorContainerHeight
            ) {
                if (this.currentMode !== 2) {
                    this.scrollhorInner.style.position = 'absolute';
                    this.scrollhorInner.style.top =
                        this.scrollhorContainerHeight - this.containerHeight + 'px';
                    this.container.scrollLeft = this.container.children[0].offsetWidth;
                    this.currentMode = 2;
                }
            } else {
                if (this.currentMode !== 3) {
                    this.scrollhorInner.style.position = 'fixed';
                    this.scrollhorInner.style.width = '100%';
                    this.scrollhorInner.style.top = '0';
                    this.currentMode = 3;
                }
                this.container.scrollLeft = windowScrollTop - this.scrollhorContainerOffsetTop;
            }
        });
    }

    update() {
        this.scrollhorContainer.querySelector('.scrollhor__placeholder').style.height =
            this.container.children[0].offsetWidth -
            this.container.offsetWidth +
            this.container.offsetHeight +
            'px';
        this.scrollhorContainer.querySelector('.scrollhor__placeholder').style.width = '100%';
        this.scrollhorContainer.style.position = 'relative';
        this.scrollhorInner.style.position = 'absolute';
        this.scrollhorInner.style.width = '100%';
        this.scrollhorInner.style.willChange = 'transform';
        this.scrollhorInner.style.transform = 'translateZ(0)';
        this.scrollhorContainerOffsetTop = this.offsetTop(this.scrollhorContainer);
        this.scrollhorContainerHeight = this.scrollhorContainer.offsetHeight;
        this.containerHeight = this.container.children[0].offsetHeight;
        this.windowHeight = window.innerHeight;
    }

    wrap(el, html) {
        let wrapper = new DOMParser().parseFromString(html, 'text/html').body.childNodes[0];
        el.parentNode.insertBefore(wrapper, el.nextSibling);
        wrapper.appendChild(el);
    }

    windowScrollTop() {
        return (
            (document.documentElement && document.documentElement.scrollTop) ||
            document.body.scrollTop
        );
    }

    offsetTop(el) {
        return (
            el.getBoundingClientRect().top + window.pageYOffset - document.documentElement.clientTop
        );
    }
}

window.addEventListener('load', e => {
    document.querySelectorAll('.container').forEach(el => {
        let scrollhor = new ScrollHor();
        scrollhor.init(el);
    });
});
