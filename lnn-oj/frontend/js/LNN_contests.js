/**
 * 姓名：李南诺 | 学号：24002120324
 * 时间：2026-11-20 | 大模型：GLM-5.3-Flash
 * 说明：比赛列表页脚本（原生 JS，变量/函数名均以 LNN_ 开头）
 *       服务器返回的数据与错误信息输出到浏览器控制台
 */

// 状态中文映射
const LNN_STATUS_TEXT = { upcoming: '未开始', ongoing: '进行中', finished: '已结束' };

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
  LNN_bindTabEvents();
  LNN_loadContests();
});

// 绑定状态筛选标签事件
function LNN_bindTabEvents() {
  const LNN_tabs = document.querySelectorAll('.LNN_tab');
  LNN_tabs.forEach(LNN_tab => {
    LNN_tab.addEventListener('click', () => {
      // 切换激活样式
      LNN_tabs.forEach(LNN_t => LNN_t.classList.remove('LNN_tab_active'));
      LNN_tab.classList.add('LNN_tab_active');
      LNN_loadContests();
    });
  });
}

// 请求比赛列表并渲染
async function LNN_loadContests() {
  const LNN_listEl = document.getElementById('LNN_contest_list');
  const LNN_countEl = document.getElementById('LNN_list_count');
  const LNN_status = document.querySelector('.LNN_tab_active').dataset.status;

  // 组装查询参数
  const LNN_params = new URLSearchParams();
  if (LNN_status) LNN_params.set('status', LNN_status);

  LNN_listEl.innerHTML = '<p class="LNN_empty">加载中…</p>';

  try {
    const LNN_res = await fetch('/api/contests?' + LNN_params.toString());
    const LNN_data = await LNN_res.json();
    // 服务器返回的数据输出到控制台
    console.log('[LNN_contests] /api/contests 响应：', LNN_data);

    if (!LNN_data || LNN_data.code !== 0) {
      LNN_listEl.innerHTML = '<p class="LNN_empty">查询失败：' + (LNN_data ? LNN_data.msg : '未知错误') + '</p>';
      return;
    }

    LNN_renderList(LNN_data.data.list);
    LNN_countEl.textContent = '共 ' + LNN_data.data.list.length + ' 场比赛';
  } catch (LNN_err) {
    // 错误信息输出到控制台
    console.error('[LNN_contests] 加载比赛列表失败：', LNN_err);
    LNN_listEl.innerHTML = '<p class="LNN_empty">网络错误，比赛列表加载失败</p>';
  }
}

// 渲染比赛列表
function LNN_renderList(LNN_list) {
  const LNN_listEl = document.getElementById('LNN_contest_list');

  if (!Array.isArray(LNN_list) || LNN_list.length === 0) {
    LNN_listEl.innerHTML = '<p class="LNN_empty">没有符合条件的比赛</p>';
    return;
  }

  const LNN_html = LNN_list.map(LNN_item => {
    const LNN_statusText = LNN_STATUS_TEXT[LNN_item.LNN_status] || LNN_item.LNN_status;
    const LNN_statusClass = 'LNN_status_badge LNN_status_' + LNN_item.LNN_status;
    // 时间格式化为 YYYY-MM-DD HH:mm
    const LNN_start = String(LNN_item.LNN_start_time).slice(0, 16).replace('T', ' ');
    const LNN_end = String(LNN_item.LNN_end_time).slice(0, 16).replace('T', ' ');
    return (
      '<div class="LNN_contest_item">' +
        '<div class="LNN_contest_top">' +
          '<div class="LNN_contest_title">' + LNN_item.LNN_title + '</div>' +
          '<span class="' + LNN_statusClass + '">' + LNN_statusText + '</span>' +
        '</div>' +
        '<div class="LNN_contest_desc">' + (LNN_item.LNN_description || '') + '</div>' +
        '<div class="LNN_contest_time">比赛时间：' + LNN_start + ' ~ ' + LNN_end + '</div>' +
      '</div>'
    );
  }).join('');

  LNN_listEl.innerHTML = LNN_html;
}
