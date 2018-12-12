html2canvas(document.querySelector('#capture')).then((canvas) => {
  document.querySelector('#markdown-result').append(canvas);
  // a.style.cssText += 'position: absolute;left: -100%;';
});

window.onload = function () {
  let canvas = document.querySelector('#canvas');
  let ctx = canvas.getContext('2d');

  let [Wi, Hi] = [parseInt(getStyle('#capture', 'width')), parseInt(getStyle('#capture', 'height'))];
  console.log([Wi, Hi]);

  let count_xsd;
  // x轴运动方式
  let Xrule = document.querySelector('#Xzhou').value;
  // y轴运动方式
  let Yrule = document.querySelector('#Yzhou').value;
  // 动画运行时间
  let Ts = document.querySelector('#Time_dul').value * 80;
  canvas.width = Wi + 200;
  canvas.height = Hi + 200;

  // ========================

  let points = [];

  // 注册点击事件
  document.querySelector('#canvas').addEventListener('click', function (e) {
    Xrule = document.querySelector('#Xzhou').value;
    Yrule = document.querySelector('#Yzhou').value;
    Ts = document.querySelector('#Time_dul').value * 80;
    points = [];
    let [xo, yo] = [e.clientX, e.clientY];
    init(xo, yo);
    console.log('点击的位置：', [xo, yo]);
  });

  // 动画开始
  function init(xo, yo) {
    console.log(`动画开始`);
    let imgdata = document
      .querySelector('#markdown-result canvas')
      .getContext('2d')
      .getImageData(0, 0, Wi, Hi);

    for (let x = 0; x < imgdata.width; x++) {
      for (let y = 0; y < imgdata.height; y++) {
        i = (y * imgdata.width + x) * 4;
        if (imgdata.data[i + 3] > 0) {
          let pots = new newpot(
            x,
            y,
            xo,
            yo,
            Ts,
            imgdata.data[i],
            imgdata.data[i + 1],
            imgdata.data[i + 2],
            imgdata.data[i + 3]
          );
          points.push(pots);
        }
      }
    }
    count_xsd = points.length;
    console.log(`共有${count_xsd}个像素点`);

    draw_img();
  }

  function draw_img() {
    rid = window.requestAnimationFrame(draw_img);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // ctx.font = '40px Georgia';
    // ctx.fillText('Hello World!', 10, 50);

    points.forEach((value, index) => {
      value.cul();
      value.draw();
    });
  }

  class newpot {
    constructor(x, y, Xn, Yn, Ts, r, g, b, a) {
      this.x = x;
      this.y = y;
      this.xd = 0;
      this.yd = 0;
      this.Ts = Ts;
      this.Ti = 0;
      this.Xn = Xn;
      this.Yn = Yn;
      this.over = false;
      this.beginT = -parseInt(Math.random() * Ts);
      this.rgba = 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
    }

    draw() {
      ctx.fillStyle = this.rgba;
      ctx.beginPath();
      ctx.fillRect(this.xd, this.yd, 1, 1);
    }

    cul() {
      if (this.beginT <= 0) {
        this.beginT++;
        return false;
      }
      if (this.Ti >= this.Ts) {
        if (!this.over) {
          count_xsd--;
          this.over = true;
          if (count_xsd <= 0) {
            window.cancelAnimationFrame(rid);
            console.log('此处完成一波动画');
          }
        }
        return false;
      }
      this.xd = ani[Xrule](1, this.Ti, this.Xn, this.x - this.Xn, this.Ts);
      this.yd = ani[Yrule](1, this.Ti, this.Yn, this.y - this.Yn, this.Ts);
      this.Ti++;
    }
  }
};

function getStyle(elm, name) {
  return window.getComputedStyle(document.querySelector(elm), null).getPropertyValue(name);
}
