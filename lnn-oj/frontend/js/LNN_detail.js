/**
 * 姓名：李南诺 | 学号：24002120324
 * 时间：2026-11-20 | 大模型：GLM-5.3-Flash
 * 说明：题目详情页脚本（原生 JS，变量/函数名均以 LNN_ 开头）
 *       从 URL 查询参数读取题目 ID，请求 /api/problems/:id 渲染详情
 *       服务器返回的数据与错误信息输出到浏览器控制台
 */

// 难度中文映射
const LNN_DIFFICULTY_TEXT = { easy: '简单', medium: '中等', hard: '困难' };

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', LNN_loadProblemDetail);

// 请求题目详情并渲染
async function LNN_loadProblemDetail() {
  // 从 URL 读取题目 ID：problem_detail.html?id=1
  const LNN_id = new URLSearchParams(window.location.search).get('id');

  if (!LNN_id || !Number.isInteger(Number(LNN_id)) || Number(LNN_id) <= 0) {
    LNN_renderError('无效的题目 ID，请从题库列表进入');
    return;
  }

  try {
    const LNN_res = await fetch('/api/problems/' + encodeURIComponent(LNN_id));
    const LNN_data = await LNN_res.json();
    // 服务器返回的数据输出到控制台
    console.log('[LNN_detail] /api/problems/' + LNN_id + ' 响应：', LNN_data);

    if (!LNN_data || LNN_data.code !== 0) {
      LNN_renderError('题目加载失败：' + (LNN_data ? LNN_data.msg : '未知错误'));
      return;
    }

    LNN_renderDetail(LNN_data.data);
  } catch (LNN_err) {
    // 错误信息输出到控制台
    console.error('[LNN_detail] 加载题目详情失败：', LNN_err);
    LNN_renderError('网络错误，题目详情加载失败');
  }
}

// 渲染题目详情
function LNN_renderDetail(LNN_p) {
  // 标题
  const LNN_titleEl = document.getElementById('LNN_detail_title');
  LNN_titleEl.textContent = LNN_p.LNN_problem_id + '. ' + LNN_p.LNN_title;
  document.title = LNN_p.LNN_title + ' - LNN OJ';

  // 难度与标签徽标
  const LNN_diffText = LNN_DIFFICULTY_TEXT[LNN_p.LNN_difficulty] || LNN_p.LNN_difficulty;
  const LNN_diffClass = 'LNN_badge LNN_badge_' + LNN_p.LNN_difficulty;
  document.getElementById('LNN_detail_badges').innerHTML =
    '<span class="' + LNN_diffClass + '">' + LNN_diffText + '</span>' +
    '<span class="LNN_badge">' + (LNN_p.LNN_tag || '无标签') + '</span>';

  // 信息栏
  document.getElementById('LNN_detail_meta').innerHTML =
    '<div class="LNN_meta_item"><span class="LNN_meta_label">时间限制</span><span class="LNN_meta_value">' + LNN_p.LNN_time_limit + 'ms</span></div>' +
    '<div class="LNN_meta_item"><span class="LNN_meta_label">内存限制</span><span class="LNN_meta_value">' + LNN_p.LNN_memory_limit + 'KB</span></div>' +
    '<div class="LNN_meta_item"><span class="LNN_meta_label">出题人</span><span class="LNN_meta_value">' + (LNN_p.LNN_creator_name || '未知') + '</span></div>' +
    '<div class="LNN_meta_item"><span class="LNN_meta_label">发布时间</span><span class="LNN_meta_value">' + String(LNN_p.LNN_created_at).slice(0, 10) + '</span></div>';

  // 题目描述
  document.getElementById('LNN_detail_desc').textContent = LNN_p.LNN_description || '暂无描述';
}

// 渲染错误状态
function LNN_renderError(LNN_msg) {
  document.getElementById('LNN_detail_title').textContent = '加载失败';
  document.getElementById('LNN_detail_badges').innerHTML = '';
  document.getElementById('LNN_detail_meta').innerHTML = '';
  document.getElementById('LNN_detail_desc').innerHTML =
    '<p class="LNN_empty">' + LNN_msg + '</p>';
}
