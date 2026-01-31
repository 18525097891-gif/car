// 封装获取URL参数的工具函数
function getUrlParams() {
  const params = new URLSearchParams(window.location.search);
  const result = {};
  for (const [key, value] of params.entries()) {
    result[key] = value;
  }
  return result;
}

// 封装跳转函数
function jumpTo(url, params = {}) {
  const paramStr = new URLSearchParams(params).toString();
  const fullUrl = paramStr ? `${url}?${paramStr}` : url;
  window.location.href = fullUrl;
}

// 车型数据配置（奥迪为例，可扩展其他品牌）
const modelConfig = {
  1: { // 奥迪
    ventilation: ["21款A3L", "A4", "A4L", "A6/C7", "A6L/C7", "老A4/Q5", "老A3/Q2", "C8", "Q7", "Q3", "Q5L"],
    heating: ["A4L", "A6L", "Q5L", "Q7", "A8L", "Q3", "A3L"]
  },
  2: { // 宝马
    ventilation: ["3系", "5系", "7系", "X3", "X5"],
    heating: ["3系", "5系", "7系", "X1", "X3", "X5"]
  }
  // 可继续添加其他品牌的车型数据
};

// 页面逻辑入口
document.addEventListener('DOMContentLoaded', function() {
  // 首页逻辑：品牌九宫格跳转
  if (window.location.pathname.includes('index.html')) {
    const brandItems = document.querySelectorAll('.brand-item');
    brandItems.forEach(item => {
      item.addEventListener('click', function() {
        const brandId = this.dataset.brandId;
        const brandName = this.dataset.brandName;
        jumpTo('function.html', { brandId, brandName });
      });
    });
  }

  // 功能页逻辑：通风/加热选择
  if (window.location.pathname.includes('function.html')) {
    const { brandId, brandName } = getUrlParams();
    if (!brandId || !brandName) {
      alert('参数错误，返回首页');
      jumpTo('index.html');
      return;
    }
    // 设置页面标题
    document.title = `${brandName} - 功能选择`;
    document.querySelector('.page-title').textContent = `${brandName}系列`;
    
    // 绑定功能点击事件
    const funcItems = document.querySelectorAll('.func-item');
    funcItems.forEach(item => {
      item.addEventListener('click', function() {
        const funcType = this.dataset.funcType;
        const funcName = this.dataset.funcName;
        jumpTo('model.html', { brandId, brandName, funcType, funcName });
      });
    });
  }

  // 车型列表页逻辑
  if (window.location.pathname.includes('model.html')) {
    const { brandId, brandName, funcType, funcName } = getUrlParams();
    if (!brandId || !funcType) {
      alert('参数错误，返回功能页');
      jumpTo('function.html', { brandId, brandName });
      return;
    }
    // 设置页面标题
    document.title = `${brandName}${funcName} - 车型列表`;
    document.querySelector('.page-title').textContent = `${brandName}${funcName}`;
    
    // 渲染车型列表
    const modelListEl = document.querySelector('.model-list');
    const models = modelConfig[brandId]?.[funcType] || [];
    if (models.length === 0) {
      modelListEl.innerHTML = '<div style="width:100%;text-align:center;padding:20px;">暂无该功能的车型</div>';
      return;
    }
    // 生成车型DOM
    let modelHtml = '';
    models.forEach((modelName, index) => {
      modelHtml += `
        <div class="model-item" data-model-name="${modelName}">
          <p class="model-name">${modelName}</p>
        </div>
      `;
    });
    modelListEl.innerHTML = modelHtml;
    
    // 绑定车型点击事件
    const modelItems = document.querySelectorAll('.model-item');
    modelItems.forEach(item => {
      item.addEventListener('click', function() {
        const modelName = this.dataset.modelName;
        jumpTo('detail.html', { brandName, funcName, modelName });
      });
    });
  }

  // 详情页逻辑
  if (window.location.pathname.includes('detail.html')) {
    const { brandName, funcName, modelName } = getUrlParams();
    if (!brandName || !funcName || !modelName) {
      alert('参数错误，返回车型页');
      jumpTo('model.html', { brandName, funcName });
      return;
    }
    // 设置页面标题和内容
    document.title = `${modelName}${funcName} - 详情`;
    document.querySelector('.page-title').textContent = `${modelName}${funcName}详情`;
    document.querySelector('.model-desc').textContent = `适配车型：${modelName}`;
    // 设置功能图片（路径可根据实际调整）
    const detailImg = document.querySelector('.detail-img');
    detailImg.src = `images/detail/${brandName}-${funcName}-${modelName}.png`;
    detailImg.alt = `${modelName}${funcName}`;
    // 图片加载失败时显示默认图
    detailImg.onerror = function() {
      this.src = 'images/detail/default.png';
    };
  }
});