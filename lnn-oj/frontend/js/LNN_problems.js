/**
 * 姓名：李南诺 | 学号：24002120324
 * 时间：2026-11-20 | 大模型：GLM-5.3-Flash
 * 说明：题库练习页脚本（原生 JS，变量/函数名均以 LNN_ 开头）
 *       服务器返回的数据与错误信息输出到浏览器控制台
 */

// 难度中文映射
const LNN_DIFFICULTY_TEXT = { easy: '简单', medium: '中等', hard: '困难' };

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
  LNN_bindFilterEvents();
  LNN_loadProblems();
});

// 绑定筛选控件事件
function LNN_bindFilterEvents() {
  const LNN_difficultyEl = document.getElementById('LNN_filter_difficulty');
  const LNN_tagEl = document.getElementById('LNN_filter_tag');
  const LNN_keywordEl = document.getElementById('LNN_filter_keyword');

  LNN_difficultyEl.addEventListener('change', LNN_loadProblems);
  LNN_tagEl.addEventListener('change', LNN_loadProblems);
  // 关键词输入防抖 300ms
  let LNN_timer = null;
  LNN_keywordEl.addEventListener('input', () => {
    clearTimeout(LNN_timer);
    LNN_timer = setTimeout(LNN_loadProblems, 300);
  });
}

// 请求题目列表并渲染
async function LNN_loadProblems() {
  const LNN_listEl = document.getElementById('LNN_problem_list');
  const LNN_countEl = document.getElementById('LNN_list_count');
  const LNN_tagEl = document.getElementById('LNN_filter_tag');

  // 组装查询参数
  const LNN_params = new URLSearchParams();
  const LNN_difficulty = document.getElementById('LNN_filter_difficulty').value;
  const LNN_tag = LNN_tagEl.value;
  const LNN_keyword = document.getElementById('LNN_filter_keyword').value.trim();
  if (LNN_difficulty) LNN_params.set('difficulty', LNN_difficulty);
  if (LNN_tag) LNN_params.set('tag', LNN_tag);
  if (LNN_keyword) LNN_params.set('keyword', LNN_keyword);

  LNN_listEl.innerHTML = '<p class="LNN_empty">加载中…</p>';

  try {
    const LNN_res = await fetch('/api/problems?' + LNN_params.toString());
    const LNN_data = await LNN_res.json();
    // 服务器返回的数据输出到控制台
    console.log('[LNN_problems] /api/problems 响应：', LNN_data);

    if (!LNN_data || LNN_data.code !== 0) {
      LNN_listEl.innerHTML = '<p class="LNN_empty">查询失败：' + (LNN_data ? LNN_data.msg : '未知错误') + '</p>';
      return;
    }

    // 首次加载时填充标签下拉框
    if (LNN_tagEl.options.length <= 1 && Array.isArray(LNN_data.data.tags)) {
      LNN_data.data.tags.forEach(LNN_tag => {
        const LNN_option = document.createElement('option');
        LNN_option.value = LNN_tag;
        LNN_option.textContent = LNN_tag;
        LNN_tagEl.appendChild(LNN_option);
      });
    }

    LNN_renderList(LNN_data.data.list);
    LNN_countEl.textContent = '共 ' + LNN_data.data.list.length + ' 道题目';
  } catch (LNN_err) {
    // 错误信息输出到控制台
    console.error('[LNN_problems] 加载题目列表失败：', LNN_err);
    LNN_listEl.innerHTML = '<p class="LNN_empty">网络错误，题目列表加载失败</p>';
  }
}

// 渲染题目列表
function LNN_renderList(LNN_list) {
  const LNN_listEl = document.getElementById('LNN_problem_list');

  if (!Array.isArray(LNN_list) || LNN_list.length === 0) {
    LNN_listEl.innerHTML = '<p class="LNN_empty">没有符合条件的题目</p>';
    return;
  }

  const LNN_html = LNN_list.map(LNN_item => {
    const LNN_diffClass = 'LNN_difficulty_' + LNN_item.LNN_difficulty;
    const LNN_diffText = LNN_DIFFICULTY_TEXT[LNN_item.LNN_difficulty] || LNN_item.LNN_difficulty;
    return (
      '<div class="LNN_problem_item">' +
        '<div class="LNN_problem_no">' + LNN_item.LNN_problem_id + '</div>' +
        '<div class="LNN_problem_info">' +
          '<div class="LNN_problem_title"><a href="problem_detail.html?id=' + LNN_item.LNN_problem_id + '">' + LNN_item.LNN_title + '</a></div>' +
          '<div class="LNN_problem_meta">' +
            '标签：' + (LNN_item.LNN_tag || '无') +
            ' ｜ 时间限制：' + LNN_item.LNN_time_limit + 'ms' +
            ' ｜ 内存限制：' + LNN_item.LNN_memory_limit + 'KB' +
          '</div>' +
        '</div>' +
        '<span class="LNN_difficulty ' + LNN_diffClass + '">' + LNN_diffText + '</span>' +
      '</div>'
    );
  }).join('');

  LNN_listEl.innerHTML = LNN_html;
}
