
function ready(callback){
    if (doc.readyState!='loading') callback();
    else if (doc.addEventListener) doc.addEventListener('DOMContentLoaded', callback);
    // IE <= 8
    else doc.attachEvent('onreadystatechange', function(){
        if (doc.readyState=='complete') callback();
    });
}

class GenericSender {
    receivers = [];
    constructor (sender) {
        this.sender = sender;
    }
    update(eventName) {
        for (let i = 0; i < this.receivers.length; i++) {
            const receiver = this.receivers[i];
            receiver.update(eventName);
        }
    }
}
class GenericReceiver {
    constructor (sender, receiver) {
        this.sender = sender;
        this.receiver = receiver;
    }
}

function initScrl () {
    var senders = doc.getElementsByClassName(ScrollSender.cssClass);
    for (let i = 0; i < senders.length; i++) {
        const sender = senders[i];
        const senderInstance = new ScrollSender(sender);
        const cl = getClassStartingWith(sender, ScrollSender.cssPrefix)
        const id = cl.substring(ScrollSender.cssPrefix.length, cl.length);
        const receivers = doc.getElementsByClassName(ScrollReceiver.cssPrefix + id);
        for (let e = 0; e < receivers.length; e++) {
            senderInstance.addReceiver(receivers[e]);
        }
        sender.dispatchEvent(new CustomEvent('scroll'));
    }
}

class ScrollSender extends GenericSender {
    static cssClass = 'scrl';
    static cssPrefix = this.cssClass + '-';
    ticking = false;
    constructor (sender) {
        super(sender);
        sender.addEventListener('scroll', function () {
            if (!this.ticking) {
                window.requestAnimationFrame(function() {
                    this.update('scroll');
                    this.ticking = false;
                }.bind(this));
                this.ticking = true;
            }
        }.bind(this));
    }
    addReceiver(receiver) {
        const receiverThumb = ScrollReceiverBar.getThumb(receiver);
        var scrollReceiver = null;
        if (receiverThumb) {
            scrollReceiver = new ScrollReceiverBar(this.sender, receiver);
        } else {
            scrollReceiver = new ScrollReceiverClassToggler(this.sender, receiver);
        }
        this.receivers.push(scrollReceiver);
    }
}

class ScrollReceiver extends GenericReceiver {
    static cssClass = 'sbar';
    static cssPrefix = this.cssClass + '-';
    static cssThumbClass = this.cssClass + '-thumb';
    static cssUseFill = this.cssClass + '-fill';
    constructor (sender, receiver) {
        super(sender, receiver);
        const frameHeight = sender.clientHeight;
        const frameWidth = sender.clientWidth;
        const contentHeight = sender.scrollHeight;
        const contentWidth = sender.scrollWidth;
        this.scrollDistanceY = contentHeight - frameHeight;
        this.scrollDistanceX = contentWidth - frameWidth;
    }
}
class ScrollReceiverClassToggler extends ScrollReceiver {
    static cssScrolling = ScrollSender.cssClass + '-scrolling';
    static cssScrollStart = ScrollSender.cssClass + '-scroll-start';
    static cssScrollEnd = ScrollSender.cssClass + '-scroll-end';

    scrollingSet = false;
    scrollStartSet = false;
    scrollEndSet = false;

    constructor (sender, receiver) {
        super(sender, receiver);
    }
    update(eventName) {
        var progress = this.sender.scrollTop / this.scrollDistanceY;
        if (progress <= 0 && !this.scrollStartSet) {
            this.receiver.classList.add(ScrollReceiverClassToggler.cssScrollStart);
            this.scrollStartSet = true;
        } else if (progress >= 1 && !this.scrollEndSet) {
            this.receiver.classList.add(ScrollReceiverClassToggler.cssScrollEnd);
            this.scrollEndSet = true;
        } else {
            if (this.scrollStartSet) {
                this.receiver.classList.remove(ScrollReceiverClassToggler.cssScrollStart);
                this.scrollStartSet = false;
            }
            if (this.scrollEndSet) {
                this.receiver.classList.remove(ScrollReceiverClassToggler.cssScrollEnd);
                this.scrollEndSet = false;
            }
        }

        if (this.timeout) {
            clearTimeout(this.timeout);
        } else if (!this.scrollingSet) {
            this.receiver.classList.add(ScrollReceiverClassToggler.cssScrolling);
            this.scrollingSet = true;
        }
        this.timeout = setTimeout(() => {
            this.receiver.classList.remove(ScrollReceiverClassToggler.cssScrolling);
            this.scrollingSet = false;
            this.timeout = null;
        }, 100);
    }
}
class ScrollReceiverBar extends ScrollReceiver {
    constructor (sender, receiver) {
        super(sender, receiver);
        this.receiverThumb = ScrollReceiverBar.getThumb(receiver);
        if (!this.receiverThumb) return;
        this.barHeight = receiver.clientHeight;
        this.barWidth = receiver.clientWidth;
        this.thumbHeight = this.receiverThumb.clientHeight;
        this.thumbWidth = this.receiverThumb.clientWidth;
        this.barDistanceY = this.barHeight - this.thumbHeight;
        this.barDistanceX = this.barWidth - this.thumbWidth;
        this.useFill = hasClass(receiver, ScrollReceiver.cssUseFill);
        this.useVertical = this.barHeight > this.barWidth;
        this.useHorizontal =  !this.useVertical;
        if (this.useFill) {
            if (this.useVertical) this.receiverThumb.style.top = '0px';
            if (this.useHorizontal) this.receiverThumb.style.left = '0px';
        } else {
        }
    }
    update(eventName) {
        var progress = this.sender.scrollTop / this.scrollDistanceY;
        if (this.useFill) {
            if (this.useVertical) this.receiverThumb.style.height = (this.barHeight * progress) + 'px';
            if (this.useHorizontal) this.receiverThumb.style.width = (this.barWidth * progress) + 'px';
        } else {
            if (this.useVertical) this.receiverThumb.style.top = (this.barDistanceY * progress) + 'px';
            if (this.useHorizontal) this.receiverThumb.style.left = (this.barDistanceX * progress) + 'px';
        }
    }
    static getThumb (element) {
        for (let i = 0; i < element.children.length; i++) {
            var child = element.children[i];
            if (hasClass(child, ScrollReceiver.cssThumbClass)) return child;
        }
        return null;
    }
}


function initTaps () {
    const senders = doc.getElementsByClassName(TapSender.cssClass);
    for (let i = 0; i < senders.length; i++) {
        const sender = senders[i];
        const senderInstance = new TapSender(sender);
        const cl = getClassStartingWith(sender, TapSender.cssPrefix);
        const id = cl.substring(TapSender.cssPrefix.length, cl.length);
        const receivers = doc.getElementsByClassName(TapReceiver.cssPrefix + id);
        for (let e = 0; e < receivers.length; e++) {
            senderInstance.addReceiver(receivers[e]);
        }
    }
}

class TapSender extends GenericSender {
    static cssClass = 'taps';
    static cssPrefix = this.cssClass + '-';
    static cssMediaPrefix = this.cssClass + '-m-';
    static cssMediaUpPrefix = this.cssClass + '-mu-';
    receivers = [];
    mediaOnDown = null;
    mediaOnUp = null;
    constructor (sender) {
        super(sender);
        const mediaOnDownClass = getClassEnding(sender, TapSender.cssMediaPrefix);
        const mediaOnUpClass = getClassEnding(sender, TapSender.cssMediaUpPrefix);
        if (mediaOnDownClass) this.mediaOnDown = doc.getElementsByClassName(mediaOnDownClass);
        if (mediaOnUpClass) this.mediaOnUp = doc.getElementsByClassName(mediaOnUpClass);
        this.sender.addEventListener('pointerdown', function () { this.update('pointerdown') }.bind(this));
        this.sender.addEventListener('pointerup', function () { this.update('pointerup') }.bind(this));
        this.sender.addEventListener('mouseout', function () { this.update('mouseout') }.bind(this));
        this.sender.addEventListener('pointerleave', function () { this.update('pointerleave') }.bind(this));
    }
    addReceiver(receiver) {
        const classToAdd = getClassEnding(receiver, TapReceiver.cssClassPrefix);
        var tapReceiver = null;
        if (classToAdd != '') {
            tapReceiver = new TapReceiverClassToggler(this.sender, receiver, classToAdd);
        } else {
            tapReceiver = new TapReceiverHider(this.sender, receiver);
        }
        this.receivers.push(tapReceiver);
    }
    update(eventName) {
        super.update(eventName);
        switch(eventName) {
            case 'pointerdown':
                if (this.mediaOnDown && this.mediaOnDown.length > 0) TapSender.playMedia(this.mediaOnDown[0]);
                break
            case 'pointerup':
                if (this.mediaOnUp && this.mediaOnUp.length > 0) TapSender.playMedia(this.mediaOnUp[0]);
                break;
        }
    }
    static playMedia(media) {
        media.pause();
        media.currentTime = 0;
        media.play();
    }
}
class TapReceiver extends GenericReceiver {
    static cssClass = 'tapr';
    static cssPrefix = this.cssClass + '-';
    static cssClassPrefix = this.cssClass + '-c-';
    constructor (sender, receiver) {
        super(sender, receiver);
    }
}
class TapReceiverHider extends TapReceiver {
    constructor (sender, receiver) {
        super(sender, receiver);
        const hasTapHide = hasClass(receiver, TapReceiver.cssPrefix + 'hide');
        this.onDown = hasTapHide ? 'none' : 'block';
        this.onUp = hasTapHide ? 'block' : 'none';
        receiver.style.display = this.onUp;
    }
    update(eventName) {
        switch (eventName) {
            case 'pointerdown':
                this.receiver.style.display = this.onDown;
                break;
            case 'pointerup':
            case 'mouseout':
                this.receiver.style.display = this.onUp;
                break;
        }
    }
}
class TapReceiverClassToggler extends TapReceiver {
    constructor (sender, receiver, classToAdd) {
        super(sender, receiver);
        this.classToAdd = classToAdd;
        receiver.classList.remove(this.classToAdd);
    }
    update(eventName) {
        switch (eventName) {
            case 'pointerdown':
                this.receiver.classList.add(this.classToAdd);
                break;
            case 'pointerup':
            case 'mouseout':
            case 'pointerleave':
                this.receiver.classList.remove(this.classToAdd);
                break;
        }
    }
}



function hasClass (element, className) {
    var classes = getClasses(element);
    for (let i = 0; i < classes.length; i++) {
        const cl = classes[i];
        if (cl == className) return true;
    }
    return false;
}
function getClasses (element) {
    var classes = element.className;
    return classes.split(' ');
}
function getClassStartingWith (element, prefix) {
    var classes = getClasses(element);
    for (let i = 0; i < classes.length; i++) {
        const cl = classes[i];
        if (cl.startsWith(prefix))
        {
            return cl;
        }
    }
    return '';
}
function getClassEnding (element, prefix) {
    var wholeClass = getClassStartingWith(element, prefix);
    if (wholeClass != '') return wholeClass.substring(prefix.length, wholeClass.length);
    return '';
}

/** init once ready */
ready(function(){
    console.log('doc ready');
    initTaps();
    initScrl();
});
