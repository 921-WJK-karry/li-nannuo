/**
 * 姓名：李南诺 | 学号：24002120324
 * 时间：2026-11-20 | 大模型：GLM-5.3-Flash
 * 说明：科技新闻列表页脚本（原生 JS，变量/函数名均以 LNN_ 开头）
 *       从 GET /api/news 接口读取数据库中的新闻数据并渲染
 *       服务器返回的数据与错误信息输出到浏览器控制台
 */

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('LNN_search_keyword').addEventListener('input', LNN_debounceSearch);
  LNN_loadNews();
});

// 分类配图映射（AI 生图接口，按新闻分类取图）
const LNN_CATEGORY_IMAGES = {
  '芯片': 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=close-up%20of%20AI%20accelerator%20chip%20on%20circuit%20board%2C%20glowing%20traces%2C%20dark%20tech%20macro%20illustration%2C%20blue%20neon&image_size=landscape_16_9',
  '人工智能': 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=abstract%20neural%20network%20brain%20visualization%2C%20glowing%20nodes%20and%20connections%2C%20purple%20blue%20gradient%2C%20clean%20tech%20illustration&image_size=landscape_16_9',
  '量子计算': 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=quantum%20computer%20chandelier%20with%20golden%20qubit%20rings%2C%20dark%20futuristic%20illustration%2C%20blue%20glow&image_size=landscape_16_9',
  '新能源': 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=solid%20state%20battery%20cells%20and%20electric%20car%20chassis%2C%20green%20energy%20concept%2C%20flat%20vector%20illustration%2C%20green%20and%20blue&image_size=landscape_16_9',
  '航天': 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=reusable%20rocket%20landing%20with%20flames%2C%20starry%20sky%2C%20flat%20vector%20illustration%2C%20blue%20and%20orange&image_size=landscape_16_9',
  '通信': 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=6G%20network%20towers%20with%20radiating%20signal%20waves%20over%20city%20skyline%2C%20flat%20tech%20illustration%2C%20cyan%20and%20blue&image_size=landscape_16_9',
  '机器人': 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=humanoid%20robot%20working%20in%20modern%20factory%20assembly%20line%2C%20flat%20vector%20illustration%2C%20blue%20and%20teal&image_size=landscape_16_9',
  '开源': 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=open%20source%20code%20branches%20on%20screen%20with%20community%20icons%2C%20flat%20illustration%2C%20purple%20and%20blue&image_size=landscape_16_9'
};

// 兜底配图（未知分类）
const LNN_DEFAULT_IMAGE = 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=technology%20news%20concept%20with%20newspaper%20and%20gadgets%2C%20flat%20vector%20illustration%2C%20blue%20and%20cyan&image_size=landscape_16_9';

// 关键词输入防抖 300ms
let LNN_searchTimer = null;
function LNN_debounceSearch() {
  clearTimeout(LNN_searchTimer);
  LNN_searchTimer = setTimeout(LNN_loadNews, 300);
}

// 请求新闻列表并渲染
async function LNN_loadNews() {
  const LNN_listEl = document.getElementById('LNN_news_list');
  const LNN_countEl = document.getElementById('LNN_list_count');
  const LNN_keyword = document.getElementById('LNN_search_keyword').value.trim();

  // 组装查询参数
  const LNN_params = new URLSearchParams();
  if (LNN_keyword) LNN_params.set('keyword', LNN_keyword);

  LNN_listEl.innerHTML = '<p class="LNN_empty">加载中…</p>';

  try {
    const LNN_res = await fetch('/api/news?' + LNN_params.toString());
    const LNN_data = await LNN_res.json();
    // 服务器返回的数据输出到控制台
    console.log('[LNN_tech_news] /api/news 响应：', LNN_data);

    if (!LNN_data || LNN_data.code !== 0) {
      LNN_listEl.innerHTML = '<p class="LNN_empty">查询失败：' + (LNN_data ? LNN_data.msg : '未知错误') + '</p>';
      return;
    }

    LNN_renderList(LNN_data.data.list);
    LNN_countEl.textContent = '共 ' + LNN_data.data.list.length + ' 条新闻';
  } catch (LNN_err) {
    // 错误信息输出到控制台
    console.error('[LNN_tech_news] 加载新闻列表失败：', LNN_err);
    LNN_listEl.innerHTML = '<p class="LNN_empty">网络错误，新闻列表加载失败</p>';
  }
}

// 渲染新闻列表
function LNN_renderList(LNN_list) {
  const LNN_listEl = document.getElementById('LNN_news_list');

  if (!Array.isArray(LNN_list) || LNN_list.length === 0) {
    LNN_listEl.innerHTML = '<p class="LNN_empty">没有符合条件的新闻</p>';
    return;
  }

  const LNN_html = LNN_list.map(LNN_item => {
    // 发布时间格式化为 YYYY-MM-DD HH:mm
    const LNN_time = String(LNN_item.LNN_published_at).slice(0, 16).replace('T', ' ');
    // 按分类取配图，未知分类用兜底图
    const LNN_img = LNN_CATEGORY_IMAGES[LNN_item.LNN_category] || LNN_DEFAULT_IMAGE;
    return (
      '<article class="LNN_news_item">' +
        '<img class="LNN_news_thumb" src="' + LNN_img + '" alt="' + LNN_item.LNN_category + '新闻配图">' +
        '<div class="LNN_news_info">' +
          '<div class="LNN_news_item_top">' +
            '<h2 class="LNN_news_item_title">' + LNN_item.LNN_title + '</h2>' +
            '<span class="LNN_news_item_category">' + (LNN_item.LNN_category || '综合') + '</span>' +
          '</div>' +
          '<p class="LNN_news_item_summary">' + (LNN_item.LNN_summary || '') + '</p>' +
          '<div class="LNN_news_item_meta">来源：' + (LNN_item.LNN_source || '未知') + ' ｜ 发布时间：' + LNN_time + ' ｜ 新闻编号：' + LNN_item.LNN_news_id + '</div>' +
        '</div>' +
      '</article>'
    );
  }).join('');

  LNN_listEl.innerHTML = LNN_html;
}
