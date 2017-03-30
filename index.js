(function () {
    // 获取操作元素
    var oUls = document.getElementById('oUls');
    // 获取到所有要加载的图片
    var oImgs = oUls.getElementsByTagName('img');
    // 获取浏览器窗口的高度
    var winH = utils.win('clientHeight');

    // 回到顶部
    var back = document.getElementById('back');
    var timer;
    back.onclick = function () {
        utils.win('scrollTop', 0);
    }

    // 获取初始数据
    var data = null;

    function getInitData() {
        // 发送ajax请求
        var xhr = new XMLHttpRequest();
        xhr.open('get', 'data.txt?_=' + Math.random(), false);
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && /^2\d{2}$/.test(xhr.status)) {
                data = utils.jsonParse(xhr.responseText);
                //console.log(data);
                data && data.length ? bindData(data) : null;
            }
        };
        xhr.send(null);
    }

    getInitData();
    // 绑定数据
    function bindData(data) {
        var str = '';
        for (var i = 0; i < 20; i++) {
            var ind = Math.round(Math.random() * 6);
            var cur = data[ind];
            str += '<li><a href=' + cur.link + '>';
            // 左边div 将当前img要加载的图片路径 先保存到data-real自定义属性上，只有符合加载标准在让其当前img的src加载这个路径 否则显示默认背景图片
            str += '<div><img data-real=' + cur.src + '></div>';
            // 右边div
            str += '<div>';
            str += '<h3>' + cur.title + '</h3>';
            str += '<p>' + cur.text + '</p>';
            str += '</div>';
            str += '</li></a>';
        }
        oUls.innerHTML += str;
        delayImages();
    }

    // 图片延迟加载
    function delayImages() {
        for (var i = 0; i < oImgs.length; i++) {
            // 如果当前img flag 为true 说明已经加载过了 就不在执行checkImg  为了避免重复加载
            if (!oImgs[i].flag) {
                checkImg(oImgs[i])
            }
        }
    }

    // 检测当前图片是否符合加载标准
    function checkImg(img) {
        // 滚动出去的距离
        var sTop = utils.win('scrollTop');
        // 获取图片 上边框外边 距离body的上偏移量
        var imgTop = utils.offset(img).top;
        // 获取图片的自身高度
        var imgH = img.offsetHeight * 0.5;
        // 如果浏览器窗口高度+滚动条滚出去的距离 >= 图片上偏移量+自身高度时 说明图片已经完全出现在窗口中， 这时在图片延迟加载
        if (winH + sTop >= imgTop + imgH) {
            // 获取到当前图片 自身保存的在data-real上的图片路径
            var imgSrc = img.getAttribute('data-real');
            img.src = imgSrc;
            // 检测图片资源有效性
            var tempImg = new Image;// 创建一个临时img 用来检测图片资源有效性(的到的图片路径是否正确)；
            // tempImg如果加载成功就会触发 自身的onload事件
            tempImg.src = imgSrc;
            tempImg.onload = function () {
                console.log('加载成功');
                // 让页面中 img 加载 这个图片地址
                img.src = imgSrc;
                img.flag = true; // 将加载过的img加一个flag属性为true 说明加载过

            }
        }
    }

    window.onscroll = function () {
        delayImages();
        // 当滚动条快触底时 继续发送加载请求 进行加载
        var sTop = utils.win('scrollTop');
        var wScrollH = utils.win('scrollHeight');
        if (winH + sTop >= wScrollH - 500) {
            getInitData();
            console.log(123);
        }
        // 控制回到顶部按钮 显示和隐藏
        if (sTop >= winH * 0.5) {
            utils.setCss(back, 'display', 'block');
        } else {
            utils.setCss(back, 'display', 'none');
        }
    }


})();
