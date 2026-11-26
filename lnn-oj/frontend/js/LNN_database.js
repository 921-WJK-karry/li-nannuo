/**
 * 姓名：李南诺 | 学号：24002120324
 * 时间：2026-11-20 | 大模型：GLM-5.3-Flash
 * 说明：数据库连接测试页脚本（原生 JS，变量/函数名均以 LNN_ 开头）
 *       服务器返回的数据与错误信息输出到浏览器控制台
 */

// 页面加载完成后绑定表单提交事件
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('LNN_connect_form').addEventListener('submit', LNN_handleConnect);
});

// 处理表单提交：请求连接测试接口并展示结果
async function LNN_handleConnect(LNN_event) {
  // 阻止表单默认提交刷新页面
  LNN_event.preventDefault();

  const LNN_btn = document.getElementById('LNN_connect_btn');
  const LNN_resultBox = document.getElementById('LNN_result_box');

  // 读取表单输入（页面默认 root / root）
  const LNN_username = document.getElementById('LNN_input_username').value.trim();
  const LNN_password = document.getElementById('LNN_input_password').value;

  // 按钮置为加载中
  LNN_btn.disabled = true;
  LNN_btn.textContent = '连接中…';

  try {
    const LNN_res = await fetch('/api/database/connect', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: LNN_username, password: LNN_password })
    });
    const LNN_data = await LNN_res.json();
    // 服务器返回的数据输出到控制台
    console.log('[LNN_database] /api/database/connect 响应：', LNN_data);

    if (LNN_data && LNN_data.code === 0) {
      LNN_showResult(true,
        '连接成功！数据库：' + LNN_data.data.database +
        '，MySQL 版本：' + LNN_data.data.serverVersion);
    } else {
      LNN_showResult(false, '连接失败：' + (LNN_data ? LNN_data.msg : '未知错误'));
    }
  } catch (LNN_err) {
    // 错误信息输出到控制台
    console.error('[LNN_database] 连接测试请求失败：', LNN_err);
    LNN_showResult(false, '网络错误：无法访问后端服务，请确认服务已启动');
  } finally {
    LNN_btn.disabled = false;
    LNN_btn.textContent = '连接数据库';
  }
}

// 展示连接结果（成功绿色 / 失败红色）
function LNN_showResult(LNN_isSuccess, LNN_msg) {
  const LNN_resultBox = document.getElementById('LNN_result_box');
  LNN_resultBox.classList.remove('LNN_result_hidden', 'LNN_result_success', 'LNN_result_error');
  LNN_resultBox.classList.add(LNN_isSuccess ? 'LNN_result_success' : 'LNN_result_error');
  LNN_resultBox.textContent = LNN_msg;
}
